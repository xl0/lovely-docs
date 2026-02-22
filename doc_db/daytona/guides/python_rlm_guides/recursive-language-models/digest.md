## Recursive Language Models (RLM) with Daytona Sandboxes

Build agent systems where agents spawn sub-agents in isolated sandboxes, enabling unlimited recursion depth and parallel exploration.

### Architecture

Agents run in an iteration loop: LLM call → extract Python code → execute in REPL. Code can call `rlm_query()` to spawn sub-agents, each with their own sandbox and fresh repository clone. Results propagate back up the tree.

```
Root Agent (depth=0)
├── Sub-Agent A (depth=1)
│   ├── Sub-Agent A1 (depth=2)
│   └── Sub-Agent A2 (depth=2)
└── Sub-Agent B (depth=1)
```

### Setup

Clone the Daytona repository and navigate to `guides/python/recursive-language-models`:

```bash
git clone https://github.com/daytonaio/daytona.git
cd daytona/guides/python/recursive-language-models
python3.10 -m venv venv
source venv/bin/activate
pip install -e .
```

Create `.env` with:
```
DAYTONA_API_KEY=your_key
LLM_API_KEY=your_key
```

### Running an Agent

```bash
python run.py <repo_url> -p "<task_prompt>" [-b branch] [--commit sha] [-c config.yaml] [-o output.patch]
```

Example: `python run.py https://github.com/scikit-learn/scikit-learn -p "Investigate TODO comments..."`

### Agent Execution Loop

Each agent iteration:
1. Builds prompt with context from previous execution
2. Gets LLM completion
3. Extracts and executes Python code blocks in REPL
4. Checks if agent called `FINAL()` to submit results
5. Formats output for next iteration

```python
def _run_loop(self) -> None:
    system_prompt = build_system_prompt(depth=self.depth)
    messages = [{"role": "system", "content": system_prompt}]
    execution_result = None

    for iteration in range(self.config.rlm.max_iterations):
        if self._is_timeout():
            break
        user_prompt = build_user_prompt(iteration, execution_result)
        messages.append({"role": "user", "content": user_prompt})
        response = self.client.completion(messages)
        messages.append({"role": "assistant", "content": response})
        repl_result = self.repl.execute_response(response)
        if repl_result.final_answer is not None:
            self._result = repl_result.final_answer
            break
        execution_result = format_execution_result(...)
```

### Sub-Agent Spawning

Single sub-agent:
```python
def _handle_rlm_query(self, task: str) -> str:
    if not self.sandbox_manager.budget.can_acquire():
        return "Error: sandbox budget exhausted"
    sub_agent = RLMAgent(
        client=self.client,
        sandbox_manager=self.sandbox_manager,
        config=self.config,
        depth=self.depth + 1,
        task=task,
    )
    result = sub_agent.run()
    return result.result or "No result"
```

Parallel spawning with thread pool:
```python
def _handle_rlm_query_batched(self, tasks: list[str]) -> list[str]:
    results = [""] * len(tasks)
    with ThreadPoolExecutor(max_workers=10) as executor:
        future_to_idx = {
            executor.submit(self._handle_rlm_query, task): i
            for i, task in enumerate(tasks)
        }
        for future in as_completed(future_to_idx):
            idx = future_to_idx[future]
            results[idx] = future.result()
    return results
```

### Agent Code Interface

Available in REPL:

| Function | Description |
|----------|-------------|
| `rlm_query(task)` | Spawn single sub-agent, returns result string |
| `rlm_query_batched(tasks)` | Spawn multiple sub-agents in parallel |
| `FINAL(answer)` | Submit final result (root: triggers patch extraction) |
| `FINAL_VAR(var_name)` | Submit variable value as result |
| `edit_file(path, old, new)` | Edit file with syntax validation |

Example:
```python
results = rlm_query_batched([
    "Search for TODO comments in sklearn/linear_model/ and assess difficulty",
    "Search for TODO comments in sklearn/ensemble/ and assess difficulty",
    "Search for TODO comments in sklearn/tree/ and assess difficulty",
])
for i, result in enumerate(results):
    print(f"=== Sub-agent {i+1} findings ===")
    print(result)
```

### Example: scikit-learn TODO Investigation

Root agent spawns 25 depth-1 sub-agents to explore different sklearn modules in parallel. Some depth-1 agents spawn their own depth-2 sub-agents for large modules. Results propagate back up. Root agent synthesizes findings, identifies easiest TODO, and fixes it.

Generated patch example:
```diff
diff --git a/sklearn/utils/_array_api.py b/sklearn/utils/_array_api.py
-# TODO: complete __all__
-__all__ = ["xpx"]
+__all__ = ['device', 'get_namespace', ...]
```

Execution: 40 agents total (25 depth-1, 15 depth-2), completed in 316 seconds.

### Configuration

`config.yaml`:
```yaml
model:
  name: "openrouter/google/gemini-3-flash-preview"

rlm:
  max_sandboxes: 50
  max_iterations: 50
  global_timeout: 3600
  result_truncation_limit: 10000
```

| Parameter | Default | Description |
|-----------|---------|-------------|
| `model.name` | `openrouter/google/gemini-3-flash-preview` | LLM model in LiteLLM format |
| `rlm.max_sandboxes` | 50 | Maximum total sandboxes across entire rollout |
| `rlm.max_iterations` | 50 | Maximum iterations per agent |
| `rlm.global_timeout` | 3600 | Total timeout in seconds |
| `rlm.result_truncation_limit` | 10000 | Max chars in sub-agent results |

Sandbox budget tracks total sandboxes created over lifetime; sub-agent sandboxes deleted immediately after completion.

### Viewing Results

Results saved to `results/` as JSON. View with:
```bash
python -m http.server 8000
# Open http://localhost:8000/viewer/
```

Viewer shows: interactive agent hierarchy tree, iteration details with code/output, statistics (agent count, max depth, total iterations).

### Key Advantages

- **Recursive decomposition**: Complex tasks naturally break into sub-tasks
- **Isolated execution**: Each agent gets fresh sandbox, no interference
- **Parallel exploration**: `rlm_query_batched()` enables concurrent investigation
- **Per-agent sandboxes**: Each agent can freely modify files, run tests without affecting others