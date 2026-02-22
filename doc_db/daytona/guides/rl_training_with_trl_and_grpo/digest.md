## Reinforcement Learning Training with TRL and Daytona

Train code-generating LLMs using TRL's GRPOTrainer with parallel Daytona sandboxes for safe, concurrent code evaluation.

### Workflow Overview

Training loop with 500 parallel sandboxes:
1. **Generate**: Model produces many code completions per prompt (e.g., 250 per prompt per step)
2. **Evaluate**: Each completion runs in its own sandbox against test suite
3. **Reward**: Completions passing more tests get higher rewards; errors/banned patterns get -1.0
4. **Update**: GRPO reinforces completions scoring above group average

Sandboxes spawned once at start, reused throughout training, cleaned up after completion.

### Setup

**Requirements**: Python 3.10+, 80GB+ VRAM GPU (adjustable via `per_device_train_batch_size`)

```bash
git clone https://github.com/daytonaio/daytona.git
cd daytona/guides/python/reinforcement-learning/trl
python3 -m venv venv
source venv/bin/activate
pip install -e .
```

Create `.env` file with Daytona API key from dashboard:
```
DAYTONA_API_KEY=your_daytona_api_key
```

### Task Definition

Tasks define prompts with test cases and validation rules:

```python
TASKS = {
    "sorting": {
        "prompt": "def sort_numbers(xs: list[int]) -> list[int]:\n    \"\"\"Sort a list...\"\"\"\n",
        "func_name": "sort_numbers",
        "banned_patterns": ["sorted(", ".sort(", "heapq", "import ", "__import__"],
        "tests": ["[]", "[1, 3, 2]", "[random.randint(-1000, 1000) for _ in range(200)]"],
        "reference": "sorted",
    },
}
```

Each task includes:
- **prompt**: Code context model continues from (completion mode, not QA)
- **func_name**: Function name being implemented
- **banned_patterns**: Patterns disqualifying completion (prevents cheating with built-ins)
- **tests**: Test inputs for verification
- **reference**: Reference implementation for comparison

### Completion Processing

**Sanitization**: Extract only indented lines forming function body from model output:

```python
def sanitize_completion(text: str) -> str:
    lines = text.splitlines()
    kept = []
    for line in lines:
        if line and not line.startswith("    "):
            break
        kept.append(line)
    return "\n".join(kept).rstrip()
```

Model output with extra content (comments, examples) gets trimmed to just the function body.

**Banned Pattern Detection**: Check before sandbox execution:

```python
def has_banned_pattern(text: str, task: Dict[str, Any]) -> bool:
    banned = task.get("banned_patterns", [])
    lowered = text.lower()
    return any(p.lower() in lowered for p in banned)
```

Banned patterns trigger -1.0 reward without execution.

### Test Harness Assembly

`build_test_harness` combines prompt, completion, and test runner into executable Python:

```python
def build_test_harness(task: Dict[str, Any], function_body: str) -> str:
    prompt = task["prompt"]
    func_name = task["func_name"]
    reference_function = task["reference"]
    tests = task["tests"]
    
    tests_tuple = ",\n        ".join(tests)
    
    return f"""{prompt}
{function_body}

import json
import random
random.seed(0)

def _run_tests():
    tests = ({tests_tuple})
    results = []
    for xs in tests:
        try:
            out = {func_name}(xs.copy())
            expected = {reference_function}(xs.copy())
            results.append(out == expected)
        except Exception:
            results.append(False)
    print(json.dumps({{"results": results}}))

if __name__ == "__main__":
    _run_tests()
"""
```

Assembled code executes in sandbox and prints JSON results: `{"results": [true, true, false, true, true]}`

### Sandbox Pool Management

Create and reuse pool throughout training:

```python
EFFECTIVE_BATCH_SIZE = 500

async def _create_sandbox_pool_async(daytona: AsyncDaytona, n: int = 500) -> List[AsyncSandbox]:
    tasks = [daytona.create() for _ in range(n)]
    sandboxes = await asyncio.gather(*tasks)
    return list(sandboxes)

async def _cleanup_sandbox_pool_async(sandbox_pool: List[AsyncSandbox]) -> None:
    if not sandbox_pool:
        return
    tasks = [sandbox.delete() for sandbox in sandbox_pool]
    await asyncio.gather(*tasks, return_exceptions=True)
```

Pool size (500) matches effective batch size to ensure all completions evaluate in parallel.

### Code Evaluation

Main evaluation function ties everything together:

```python
async def evaluate_single_completion_async(
    sandbox: AsyncSandbox,
    raw_completion: str,
    prompt: str,
) -> EvalResult:
    task = PROMPT_TO_TASK[prompt]
    num_task_tests = len(task["tests"])
    body = sanitize_completion(raw_completion)

    if not body.strip():
        return _fail_result(num_task_tests)
    if has_banned_pattern(body, task):
        return _fail_result(num_task_tests)

    code = build_test_harness(task, body)

    try:
        response = await sandbox.code_interpreter.run_code(code, timeout=1)
    except DaytonaTimeoutError:
        return _fail_result(num_task_tests)
    except Exception as e:
        return _fail_result(num_task_tests)

    if response.error is not None:
        return _fail_result(num_task_tests)
    
    raw_output = response.stdout.strip()
    if not raw_output:
        return _fail_result(num_task_tests)
    
    last_line = raw_output.splitlines()[-1]
    try:
        results = json.loads(last_line)
    except Exception:
        return _fail_result(num_task_tests)
    
    correct = results.get("results", [])
    return {
        "no_error": True,
        "num_passed": sum(bool(x) for x in correct),
        "num_tests": len(correct),
    }
```

### Parallel Batch Evaluation

Distribute completions across sandbox pool with round-robin:

```python
async def _evaluate_batch_async(
    sandbox_pool: List[AsyncSandbox], completions: List[str], prompts: List[str]
) -> List[EvalResult]:
    async def run_one(i: int, sandbox: AsyncSandbox, completion: str, prompt: str) -> EvalResult:
        try:
            return await evaluate_single_completion_async(sandbox, completion, prompt)
        except Exception as e:
            task = PROMPT_TO_TASK[prompt]
            return _fail_result(len(task["tests"]))

    tasks = [
        run_one(i, sandbox_pool[i % len(sandbox_pool)], completion, prompt)
        for i, (completion, prompt) in enumerate(zip(completions, prompts))
    ]
    
    return await asyncio.gather(*tasks)
```

### Reward Function

Compute scalar rewards from sandbox evaluation results:

```python
def reward_func(prompts, completions, **kwargs):
    stats_list = run_async(_evaluate_batch_async(sandbox_pool, completions, prompts))
    rewards = []
    for s in stats_list:
        if not s["no_error"]:
            rewards.append(-1.0)
        elif s["num_tests"] == 0:
            rewards.append(0.0)
        else:
            rewards.append(s["num_passed"] / s["num_tests"])
    return rewards
```

Reward scheme:
- **-1.0**: Error, timeout, or banned pattern
- **0.0**: No tests present
- **0.0 to 1.0**: Fraction of tests passed

### Sync/Async Bridging

TRL's GRPOTrainer expects synchronous reward function; Daytona SDK uses async. Bridge with event loop:

```python
def main():
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)

    def run_async(coro: Awaitable[Any]) -> Any:
        return loop.run_until_complete(coro)

    # ... training code ...
    
    def reward_func(prompts, completions, **kwargs):
        stats_list = run_async(_evaluate_batch_async(sandbox_pool, completions, prompts))
        # ... compute rewards ...
        return rewards
```

### Training Configuration

```python
training_args = GRPOConfig(
    output_dir="training_results",
    per_device_train_batch_size=20,
    gradient_accumulation_steps=25,  # 20 * 25 = 500 (EFFECTIVE_BATCH_SIZE)
    num_generations=EFFECTIVE_BATCH_SIZE // len(TASKS),  # 250 per prompt
    max_prompt_length=256,
    max_completion_length=512,
    learning_rate=8e-6,
    num_train_epochs=1,
    logging_steps=1,
    max_steps=8,
    bf16=True,
    use_vllm=True,
    vllm_mode="colocate",
    vllm_gpu_memory_utilization=0.15,
    gradient_checkpointing=True,
    loss_type="dapo",
    beta=0.01,
)
```

**Key alignment**: `per_device_train_batch_size (20) × gradient_accumulation_steps (25) = 500` equals `EFFECTIVE_BATCH_SIZE` for perfect parallelism.

**vLLM colocate mode**: Runs inference on same GPU as training, using 15% GPU memory for generation, rest for training.

### Running Training

```bash
python train.py
```

Output shows sandbox creation and parallel evaluation progress. After completion, metrics saved to `training_results/metrics.jsonl` and model to `training_results/checkpoint-8`.

### Example Evaluation Walkthrough

1. Model generates completion with function body
2. `sanitize_completion` extracts indented lines only
3. `has_banned_pattern` checks for disqualifying patterns
4. `build_test_harness` assembles full executable script
5. `sandbox.code_interpreter.run_code` executes in sandbox with timeout
6. Parse JSON results from stdout: `{"results": [true, true, true, true, true]}`
7. Compute reward: `5 / 5 = 1.0` (all tests passed)

### Adding Custom Tasks

Extend `TASKS` dictionary with new task definition:

```python
TASKS = {
    "your_task": {
        "prompt": "Your prompt here...",
        "func_name": "function_name",
        "banned_patterns": ["patterns", "to", "ban"],
        "tests": ["test_input_1", "test_input_2"],
        "reference": "reference_function",
    },
}
```

Reference function must be defined in test harness.

### Configuration Parameters

| Parameter | Default | Description |
|-----------|---------|-------------|
| `EFFECTIVE_BATCH_SIZE` | 500 | Parallel sandboxes count |
| `MAX_TIMEOUT_SECONDS` | 1 | Timeout per code execution |
| `MODEL_NAME` | `Qwen/Qwen3-1.7B-Base` | Base model to train |

**Scaling tips**:
- Keep `per_device_train_batch_size * gradient_accumulation_steps = EFFECTIVE_BATCH_SIZE` for optimal parallelism
- Increase `MAX_TIMEOUT_SECONDS` for complex algorithmic tasks
- Reduce `per_device_train_batch_size` for GPUs with less VRAM, increase `gradient_accumulation_steps` proportionally

### Results

Training achieves near-perfect performance after 8 steps with 500-completion batch size, showing rapid improvement from initial random completions to correct implementations.