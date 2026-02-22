## DSPy RLMs with DaytonaInterpreter

Run DSPy's recursive language models (RLMs) with code execution in isolated Daytona cloud sandboxes. RLM execution is an iterative REPL loop: LLM sends task inputs → LLM responds with Python code → code runs in Daytona sandbox with `llm_query()` calls bridged back to host → repeat until `SUBMIT()` called.

**Setup:**
```bash
git clone https://github.com/daytonaio/daytona.git
cd daytona/guides/python/dspy-rlms
python3.10 -m venv venv && source venv/bin/activate
pip install -e .
# .env: DAYTONA_API_KEY, OPENROUTER_API_KEY
```

**Basic usage:**
```python
import dspy
from daytona_interpreter import DaytonaInterpreter

lm = dspy.LM("openrouter/google/gemini-3-flash-preview")
dspy.configure(lm=lm)
interpreter = DaytonaInterpreter()

rlm = dspy.RLM(
    signature="documents: list[str], question: str -> answer: str",
    interpreter=interpreter,
    verbose=True,
)
result = rlm(documents=[...], question="Summarize key findings.")
print(result.answer)
interpreter.shutdown()
```

**Bridging mechanism:** DaytonaInterpreter launches Flask broker server inside sandbox, injects wrapper functions. Wrappers POST requests to broker and block until results arrive. Host polling loop picks up pending requests, executes them (calls LLM API or runs tool functions), posts results back.

**Built-in functions in sandbox:**
- `llm_query(prompt)` — Send single prompt to LLM, get string back
- `llm_query_batched(prompts)` — Send multiple prompts concurrently, get list of strings back

State persists across iterations: variables, imports, function definitions carry over.

**Example:** `demo.py` analyzes _The Count of Monte Cristo_ (117 chapters) tracking wealth trajectories of five characters. RLM batches chapters, fans out with `llm_query_batched()` sending prompts like "Extract wealth events from these chapters as JSON", parses JSON, accumulates results, iterates for next batch, calls `SUBMIT()` when done. Plots results as smoothed time series.

---

## Recursive Language Models (RLM) with Daytona Sandboxes

Build agent systems where agents spawn sub-agents in isolated sandboxes, enabling unlimited recursion depth and parallel exploration. Agents run in iteration loop: LLM call → extract Python code → execute in REPL. Code can call `rlm_query()` to spawn sub-agents, each with own sandbox and fresh repository clone. Results propagate back up tree.

**Setup:**
```bash
git clone https://github.com/daytonaio/daytona.git
cd daytona/guides/python/recursive-language-models
python3.10 -m venv venv && source venv/bin/activate
pip install -e .
# .env: DAYTONA_API_KEY, LLM_API_KEY
```

**Running:**
```bash
python run.py <repo_url> -p "<task_prompt>" [-b branch] [--commit sha] [-c config.yaml] [-o output.patch]
# Example: python run.py https://github.com/scikit-learn/scikit-learn -p "Investigate TODO comments..."
```

**Agent execution loop:** Each iteration builds prompt with context from previous execution, gets LLM completion, extracts and executes Python code blocks in REPL, checks if agent called `FINAL()` to submit results, formats output for next iteration.

**Sub-agent spawning:**
```python
# Single sub-agent
result = rlm_query(task)

# Parallel spawning
results = rlm_query_batched([
    "Search for TODO comments in sklearn/linear_model/ and assess difficulty",
    "Search for TODO comments in sklearn/ensemble/ and assess difficulty",
    "Search for TODO comments in sklearn/tree/ and assess difficulty",
])
```

**Agent code interface (available in REPL):**
- `rlm_query(task)` — Spawn single sub-agent, returns result string
- `rlm_query_batched(tasks)` — Spawn multiple sub-agents in parallel
- `FINAL(answer)` — Submit final result (root: triggers patch extraction)
- `FINAL_VAR(var_name)` — Submit variable value as result
- `edit_file(path, old, new)` — Edit file with syntax validation

**Example:** scikit-learn TODO investigation. Root agent spawns 25 depth-1 sub-agents to explore different sklearn modules in parallel. Some depth-1 agents spawn depth-2 sub-agents for large modules. Results propagate back up. Root agent synthesizes findings, identifies easiest TODO, fixes it. Generated patch example shows completion of `__all__` list. Execution: 40 agents total (25 depth-1, 15 depth-2), completed in 316 seconds.

**Configuration** (`config.yaml`):
```yaml
model:
  name: "openrouter/google/gemini-3-flash-preview"
rlm:
  max_sandboxes: 50
  max_iterations: 50
  global_timeout: 3600
  result_truncation_limit: 10000
```

Sandbox budget tracks total sandboxes created over lifetime; sub-agent sandboxes deleted immediately after completion.

**Viewing results:** Results saved to `results/` as JSON. View with `python -m http.server 8000` and open `http://localhost:8000/viewer/`. Viewer shows interactive agent hierarchy tree, iteration details with code/output, statistics (agent count, max depth, total iterations).