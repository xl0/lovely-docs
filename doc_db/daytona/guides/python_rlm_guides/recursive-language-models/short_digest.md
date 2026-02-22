## Recursive Language Models with Daytona

Build agent systems where agents spawn sub-agents in isolated sandboxes for unlimited recursion depth and parallel exploration.

### Setup & Running

```bash
git clone https://github.com/daytonaio/daytona.git
cd daytona/guides/python/recursive-language-models
python3.10 -m venv venv && source venv/bin/activate
pip install -e .
# Create .env with DAYTONA_API_KEY and LLM_API_KEY
python run.py <repo_url> -p "<task_prompt>"
```

### Agent Loop & Sub-Agent Spawning

Each agent: LLM call → extract code → execute in REPL → check for `FINAL()` submission.

```python
# Single sub-agent
result = self._handle_rlm_query(task)

# Parallel sub-agents
results = self._handle_rlm_query_batched([task1, task2, task3])
```

### Agent REPL Interface

```python
rlm_query(task)              # Spawn single sub-agent
rlm_query_batched(tasks)     # Spawn multiple in parallel
FINAL(answer)                # Submit result
FINAL_VAR(var_name)          # Submit variable as result
edit_file(path, old, new)    # Edit with validation
```

### Configuration

```yaml
model:
  name: "openrouter/google/gemini-3-flash-preview"
rlm:
  max_sandboxes: 50
  max_iterations: 50
  global_timeout: 3600
  result_truncation_limit: 10000
```

### Example: scikit-learn TODO Fix

Root spawns 25 depth-1 agents exploring sklearn modules in parallel; some spawn depth-2 agents. Results propagate back; root synthesizes and fixes easiest TODO. 40 agents total, 316 seconds execution.