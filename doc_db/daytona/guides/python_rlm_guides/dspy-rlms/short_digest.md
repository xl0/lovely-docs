## DSPy RLMs with DaytonaInterpreter

Run DSPy recursive language models with code execution in isolated Daytona sandboxes.

### Setup

```bash
git clone https://github.com/daytonaio/daytona.git
cd daytona/guides/python/dspy-rlms
python3.10 -m venv venv && source venv/bin/activate
pip install -e .
```

Create `.env` with `DAYTONA_API_KEY` and `OPENROUTER_API_KEY`.

### Basic Usage

```python
import dspy
from daytona_interpreter import DaytonaInterpreter

lm = dspy.LM("openrouter/google/gemini-3-flash-preview")
dspy.configure(lm=lm)

interpreter = DaytonaInterpreter()
rlm = dspy.RLM(
    signature="documents: list[str], question: str -> answer: str",
    interpreter=interpreter,
)

result = rlm(documents=[...], question="Summarize the key findings.")
print(result.answer)
interpreter.shutdown()
```

### How It Works

Iterative REPL loop: LLM writes Python code → code executes in Daytona sandbox → output fed back to LLM. Generated code calls `llm_query(prompt)` or `llm_query_batched(prompts)` for semantic work; these are bridged to host LLM via Flask broker inside sandbox. State persists across iterations.

### Example: Literary Analysis

Analyze _The Count of Monte Cristo_ (117 chapters) to track character wealth:

```python
rlm = dspy.RLM(
    signature="chapters: list[str], task: str -> wealth_data: list[dict]",
    interpreter=interpreter,
    max_iterations=40,
    max_llm_calls=500,
)

result = rlm(
    chapters=fetch_chapters(),
    task="Extract wealth events for Dantès, Danglars, Fernand/Morcerf, Villefort, Mercédès "
         "as dicts with chapter, character, wealth (1-10), event keys."
)
```

RLM batches chapters, fans out with `llm_query_batched()` for parallel extraction, parses JSON, accumulates results across iterations, submits final data. Run `python demo.py` to plot wealth trajectories.