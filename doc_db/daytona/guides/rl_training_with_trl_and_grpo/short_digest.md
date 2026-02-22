## RL Training with TRL and Daytona

Train code-generating LLMs using TRL's GRPOTrainer with 500 parallel Daytona sandboxes for safe concurrent evaluation.

### Workflow

1. **Generate**: Model produces completions (250 per prompt per step)
2. **Evaluate**: Each completion runs in sandbox against test suite
3. **Reward**: Passing tests → higher reward; errors/banned patterns → -1.0
4. **Update**: GRPO reinforces above-average completions

### Setup

```bash
git clone https://github.com/daytonaio/daytona.git
cd daytona/guides/python/reinforcement-learning/trl
python3 -m venv venv && source venv/bin/activate
pip install -e .
# Create .env with DAYTONA_API_KEY
```

### Task Definition

```python
TASKS = {
    "sorting": {
        "prompt": "def sort_numbers(xs: list[int]) -> list[int]:\n    \"\"\"Sort...\"\"\"\n",
        "func_name": "sort_numbers",
        "banned_patterns": ["sorted(", ".sort(", "heapq", "import"],
        "tests": ["[]", "[1, 3, 2]", "[random.randint(-1000, 1000) for _ in range(200)]"],
        "reference": "sorted",
    },
}
```

### Processing Pipeline

**Sanitize**: Extract indented function body from model output
```python
def sanitize_completion(text: str) -> str:
    lines = text.splitlines()
    kept = [line for line in lines if not line or line.startswith("    ")]
    return "\n".join(kept).rstrip()
```

**Check patterns**: Reject completions with banned patterns (prevents cheating)
```python
def has_banned_pattern(text: str, task: Dict) -> bool:
    return any(p.lower() in text.lower() for p in task.get("banned_patterns", []))
```

**Build harness**: Combine prompt + completion + test runner
```python
def build_test_harness(task: Dict, function_body: str) -> str:
    tests_tuple = ",\n        ".join(task["tests"])
    return f"""{task["prompt"]}
{function_body}

import json, random
random.seed(0)

def _run_tests():
    tests = ({tests_tuple})
    results = []
    for xs in tests:
        try:
            out = {task["func_name"]}(xs.copy())
            expected = {task["reference"]}(xs.copy())
            results.append(out == expected)
        except Exception:
            results.append(False)
    print(json.dumps({{"results": results}}))

if __name__ == "__main__":
    _run_tests()
"""
```

**Execute**: Run in sandbox, parse JSON results
```python
async def evaluate_single_completion_async(sandbox: AsyncSandbox, raw_completion: str, prompt: str) -> EvalResult:
    task = PROMPT_TO_TASK[prompt]
    body = sanitize_completion(raw_completion)
    
    if not body.strip() or has_banned_pattern(body, task):
        return _fail_result(len(task["tests"]))
    
    code = build_test_harness(task, body)
    response = await sandbox.code_interpreter.run_code(code, timeout=1)
    
    if response.error:
        return _fail_result(len(task["tests"]))
    
    results = json.loads(response.stdout.strip().splitlines()[-1])
    correct = results.get("results", [])
    return {
        "no_error": True,
        "num_passed": sum(bool(x) for x in correct),
        "num_tests": len(correct),
    }
```

### Sandbox Pool & Parallel Evaluation

```python
EFFECTIVE_BATCH_SIZE = 500

async def _evaluate_batch_async(sandbox_pool: List[AsyncSandbox], completions: List[str], prompts: List[str]) -> List[EvalResult]:
    tasks = [
        evaluate_single_completion_async(sandbox_pool[i % len(sandbox_pool)], completion, prompt)
        for i, (completion, prompt) in enumerate(zip(completions, prompts))
    ]
    return await asyncio.gather(*tasks)
```

### Reward Function

```python
def reward_func(prompts, completions, **kwargs):
    stats_list = run_async(_evaluate_batch_async(sandbox_pool, completions, prompts))
    return [-1.0 if not s["no_error"] else s["num_passed"] / s["num_tests"] for s in stats_list]
```

Rewards: -1.0 (error/timeout/banned), 0.0-1.0 (fraction tests passed)

### Sync/Async Bridge

```python
loop = asyncio.new_event_loop()
asyncio.set_event_loop(loop)

def run_async(coro):
    return loop.run_until_complete(coro)

def reward_func(prompts, completions, **kwargs):
    stats_list = run_async(_evaluate_batch_async(sandbox_pool, completions, prompts))
    return [...]
```

### Training Config

```python
training_args = GRPOConfig(
    per_device_train_batch_size=20,
    gradient_accumulation_steps=25,  # 20 * 25 = 500
    num_generations=250,  # per prompt
    max_completion_length=512,
    learning_rate=8e-6,
    max_steps=8,
    bf16=True,
    use_vllm=True,
    vllm_mode="colocate",
    vllm_gpu_memory_utilization=0.15,
    loss_type="dapo",
    beta=0.01,
)
```

Keep `batch_size × accumulation_steps = EFFECTIVE_BATCH_SIZE` for perfect parallelism.

### Run & Results

```bash
python train.py
```

Achieves near-perfect performance after 8 steps with 500-completion batches.