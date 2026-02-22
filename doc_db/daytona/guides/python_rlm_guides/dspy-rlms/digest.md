## DSPy RLMs with DaytonaInterpreter

Run DSPy's recursive language models (RLMs) with code execution in isolated Daytona cloud sandboxes instead of locally.

### Setup

Clone the Daytona repository and navigate to `guides/python/dspy-rlms`:
```bash
git clone https://github.com/daytonaio/daytona.git
cd daytona/guides/python/dspy-rlms
python3.10 -m venv venv
source venv/bin/activate
pip install -e .  # or pip install -e ".[demo]" for matplotlib
```

Create `.env` with:
```
DAYTONA_API_KEY=your_daytona_api_key
OPENROUTER_API_KEY=your_openrouter_api_key
```

Get Daytona API key from the Daytona Dashboard.

### Basic Usage

```python
import dspy
from dotenv import load_dotenv
from daytona_interpreter import DaytonaInterpreter

load_dotenv()

lm = dspy.LM("openrouter/google/gemini-3-flash-preview")
dspy.configure(lm=lm)

interpreter = DaytonaInterpreter()

rlm = dspy.RLM(
    signature="documents: list[str], question: str -> answer: str",
    interpreter=interpreter,
    verbose=True,
)

documents = [...]
result = rlm(documents=documents, question="Summarize the key findings across these documents.")
print(result.answer)

interpreter.shutdown()
```

### How It Works

RLM execution is an iterative REPL loop:

1. **Prompt** — RLM sends task inputs and previous turns to the LLM
2. **Code** — LLM responds with Python code
3. **Execute** — Code runs in Daytona sandbox; `llm_query()` calls are bridged back to host
4. **Repeat** — Steps 1–3 repeat until `SUBMIT()` is called or iteration limit reached

#### Bridging Mechanism

The `DaytonaInterpreter` launches a Flask broker server inside the sandbox and injects wrapper functions. These wrappers POST requests to the broker and block until results arrive. On the host, a polling loop picks up pending requests, executes them (calls LLM API or runs tool functions), and posts results back.

```
Host Process                                    Daytona Sandbox
┌──────────────────────────────┐                ┌──────────────────────────────┐
│      DaytonaInterpreter      │                │    Broker Server (Flask)     │
│  • polls broker for requests │   tool call    │  • accepts requests          │
│  • calls LLM API or tools    │◄───────────────│  • queues for host           │
│  • posts results back        │    result      │  • returns results           │
│                              │───────────────►│                              │
└──────────────────────────────┘                │      Generated Code          │
               │                                │  • llm_query()               │
               ▼                                │  • llm_query_batched()       │
           LLM API                              │  • custom tool wrappers      │
                                                └──────────────────────────────┘
```

State persists across iterations: variables, imports, and function definitions carry over.

#### Built-in Functions

Inside the sandbox:

- **`llm_query(prompt)`** — Send single prompt to LLM, get string back
- **`llm_query_batched(prompts)`** — Send multiple prompts concurrently, get list of strings back

Custom tools passed via `tools` dict use the same bridging mechanism.

### Example: Literary Analysis

The included `demo.py` analyzes _The Count of Monte Cristo_ (117 chapters) to track wealth trajectories of five major characters:

```python
interpreter = DaytonaInterpreter()

rlm = dspy.RLM(
    signature="chapters: list[str], task: str -> wealth_data: list[dict]",
    interpreter=interpreter,
    max_iterations=40,
    max_llm_calls=500,
    verbose=True,
)

chapters = fetch_chapters()  # 117 chapters from Project Gutenberg

TASK = (
    "Analyze the economic trajectory of each major character across the novel. "
    "For each chapter where a character's wealth status is mentioned or implied, "
    "produce a dict with keys: chapter (int), character (str), wealth (int 1-10 "
    "where 1=destitute and 10=richest in Paris), and event (str, brief description). "
    "Track: Dantès, Danglars, Fernand/Morcerf, Villefort, and Mercédès. "
    "Cover each chapter in the book."
)

result = rlm(chapters=chapters, task=TASK)
wealth_data = result.wealth_data
```

The RLM's generated code:
1. Batches the 117 chapters into manageable groups
2. Fans out with `llm_query_batched()` — sends prompts like "Extract wealth events from these chapters as JSON"
3. Parses JSON and accumulates results
4. Iterates for next batch; state persists across REPL iterations
5. Calls `SUBMIT(wealth_data=accumulated_results)` when done

Run with `python demo.py`. The script plots results as smoothed time series showing character wealth arcs.

### Key Benefits

- **Sub-LLM recursion** — Generated code calls LLM for semantic tasks (extraction, classification, summarization) via `llm_query()` and `llm_query_batched()`
- **Isolation** — All generated code runs in Daytona cloud sandbox, not locally
- **Persistent state** — Variables, imports, and definitions survive across REPL iterations, enabling accumulation across batches