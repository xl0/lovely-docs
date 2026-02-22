
## Directories

### claude_agent_sdk_integration
Build autonomous coding agents in Daytona sandboxes using Claude Agent SDK: two-agent system with local Project Manager delegating to sandbox Developer Agent, single-agent system for direct execution, or run Claude Code via CLI or programmatic PTY sessions with real-time output streaming.

## Two-Agent Coding System with Claude Agent SDK

Build a two-agent autonomous coding system where a **Project Manager Agent** (local, Claude Sonnet 4) plans and delegates tasks via `<developer_task>` tags to a **Developer Agent** (in Daytona sandbox, Claude Agent SDK). The Developer Agent executes coding tasks and streams results back.

**Setup:** Clone repo, set `DAYTONA_API_KEY` and `ANTHROPIC_API_KEY` env vars, requires Node.js 18+, run `npm install && npm run start`.

**Architecture:**
- Project Manager runs locally using Anthropic SDK with `claude-sonnet-4-20250514`
- Developer Agent provisioned in Daytona sandbox using Claude Agent SDK
- Communication via `<developer_task>` XML tags for delegation
- Developer Agent can host web apps and provide preview links via Daytona Preview Links

**Workflow:** User prompt → Project Manager plans → delegates via tags → Developer executes in sandbox → streams output → Project Manager reviews → outputs `TASK_COMPLETE`.

**Developer Agent Execution:** Claude Agent SDK installed via pip, code interpreter context created, coding agent script uploaded, task executed via `sandbox.codeInterpreter.runCode()` with PROMPT env var.

**Example:** User requests "make a lunar lander web app" → Project Manager delegates → Developer creates HTML/CSS/JavaScript game with physics, gravity, thrust, keyboard controls, landing detection, fuel management → game hosted on port 80 with preview URL.

---

## Single Agent Coding System with Claude Agent SDK

Autonomous coding agent using Claude Agent SDK inside Daytona sandbox. Agent develops full-stack web apps, writes code in any language, installs dependencies, runs scripts, starts dev servers, generates preview links.

**Setup:** Clone repo, set `DAYTONA_API_KEY` and `SANDBOX_ANTHROPIC_API_KEY` env vars, Node.js 18+, run `npm install && npm run start`.

**Architecture:**
- Main Node.js program creates sandbox and initializes Python agent
- Sandbox agent uses Claude Agent SDK with allowed tools: Read, Edit, Glob, Grep, Bash
- System prompt includes workspace directory (`/home/daytona`) and preview URL format
- User interaction: CLI prompt → passed to agent via `coding_agent.run_query_sync()` → agent executes → output streamed back

**Example:** User requests "Build a Zelda-like game where I can move around and talk to famous programmers" → Agent creates top-down 2D game with grid-based movement, 5 NPC programmers, arrow keys/WASD controls, SPACE to talk → hosted with preview link.

---

## Running Claude Code in Sandboxes via CLI

Execute Claude Code in isolated Daytona sandboxes from terminal.

**CLI Workflow:**
1. Install Daytona CLI: `brew install daytonaio/cli/daytona` (Mac/Linux) or PowerShell script (Windows)
2. Authenticate: `daytona login --api-key=YOUR_API_KEY`
3. Create sandbox: `daytona sandbox create --name claude-sandbox` (optional: `--snapshot daytona-large`)
4. SSH in: `daytona ssh claude-sandbox`
5. Run Claude Code: `claude` → browser authentication → paste code back to terminal

---

## Running Claude Code in Sandboxes Programmatically

Execute Claude Code tasks in Daytona sandboxes with real-time PTY-based output streaming.

**Python (AsyncDaytona recommended):**
```python
import os, asyncio
from daytona import AsyncDaytona

async def run_claude_code():
    async with AsyncDaytona() as daytona:
        sandbox = await daytona.create()
        await sandbox.process.exec("npm install -g @anthropic-ai/claude-code")
        
        pty_handle = await sandbox.process.create_pty_session(
            id="claude", on_data=lambda data: print(data.decode(), end="")
        )
        await pty_handle.wait_for_connection()
        
        claude_command = "claude --dangerously-skip-permissions -p 'write a dad joke' --output-format stream-json --verbose"
        await pty_handle.send_input(
            f"ANTHROPIC_API_KEY={os.environ['ANTHROPIC_API_KEY']} {claude_command}\n"
        )
        await pty_handle.wait()

asyncio.run(run_claude_code())
```

**TypeScript:** Similar pattern using `Daytona` SDK, `createPty()`, `sendInput()`, `onData` callback.

**Key:** PTY sessions enable real-time streaming via `on_data` callbacks; pass API key via environment variable in command; call `sandbox.delete()` for cleanup.

### python_rlm_guides
DSPy RLMs and recursive agent systems running in isolated Daytona sandboxes with sub-LLM calls and unlimited agent recursion depth.

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



## Pages

### build_coding_agent_using_agentkit
Autonomous coding agent using AgentKit that executes software development tasks in Daytona sandboxes via LLM-driven tool orchestration (shell commands, file uploads, dev server management).

## Build Coding Agent Using AgentKit

Autonomous coding agent that performs software development tasks in Daytona sandbox environments using AgentKit framework. The agent can create web apps, run tests, execute scripts, and automate multi-step workflows based on natural language prompts.

### Workflow Overview

User provides natural language prompt describing a software task. Agent reasons about the request, plans steps, and executes them securely in Daytona sandbox, handling everything from project setup to live previews.

### Project Setup

Clone repository:
```bash
git clone https://github.com/daytonaio/inngest-agentkit-coding-agent.git
cd inngest-agentkit-coding-agent
```

Get API keys from Daytona Dashboard and Anthropic Console. Copy `.env.example` to `.env`:
```bash
DAYTONA_API_KEY=your_daytona_key
ANTHROPIC_API_KEY=your_anthropic_key
```

**Local Usage (Node.js 18+ required):**
```bash
npm install
npm run start
```

**Docker:**
```bash
docker buildx build . -t coding-agent
docker run --rm -it coding-agent
```

### Configuration

- **Prompt Setting:** Edit main prompt in `network.run(...)` in `src/index.ts` to change agent's task
- **Debug Logs:** Set `enableDebugLogs=true` for detailed agent flow tracking

### Example Usage

Default prompt creates a React Notes app:
```typescript
const result = await network.run(
  `Create a minimal React app called "Notes" that lets users add, view, and delete notes. Each note should have a title and content. Use Create React App or Vite for setup. Include a simple UI with a form to add notes and a list to display them.`
)
```

Terminal output:
```
✔️ App is ready!
Preview: https://5173-3a828150-1573-42e3-bf9f-9793a2c2c0c2.proxy.daytona.works
```

### Agent Execution Flow

Agent uses LLM with access to specialized tools for Daytona sandbox operations:

1. **Project Initialization:** `shellTool` runs `npm create vite@latest notes -- --template react`
2. **Install Dependencies:** `shellTool` runs `cd notes && npm install`
3. **Create Components:** `uploadFilesTool` uploads App.jsx and App.css
4. **Start Dev Server:** `startDevServerTool` runs `cd notes && npm run dev`
5. **Health Check:** `checkDevServerHealthTool` verifies dev server is running
6. **Summary:** Agent outputs `DEV_SERVER_PORT=5173` and `TASK_COMPLETED` signal

The `DEV_SERVER_PORT` is auto-detected and used to generate preview link. `TASK_COMPLETED` signals task completion for agent routing logic.

### Key Advantages

- Secure, isolated execution in Daytona sandboxes
- Multi-language support
- Auto-detects dev server, starts it, generates preview link
- Detailed debug logs for agent actions

### build_a_coding_agent_using_codex_sdk
Autonomous coding agent using OpenAI Codex in Daytona sandbox with CLI interface, automatic preview links, and thread persistence across requests.

## Overview

Build an autonomous coding agent using OpenAI Codex inside a Daytona sandbox. The agent can develop full-stack web apps, write code in any language, install dependencies, run scripts, start dev servers, and generate preview links.

## Workflow

User interacts via CLI → main program sends prompts to agent in sandbox → agent executes and returns results. Agent automatically detects when to host web apps and generates preview links using Daytona Preview Links feature.

Example workflow:
```
$ npm run start
Creating sandbox...
Installing Codex agent in sandbox...
User: create a 3d animated web-based, lunar lander game
Thinking...
🔨 ✓ Run: /bin/sh -lc ls
📝 Add /home/daytona/index.html
📝 Add /home/daytona/style.css
📝 Add /home/daytona/main.js
- Built a self-contained 3D lunar lander experience...
User: start the server
🔨 ✓ Run: /bin/sh -lc 'cd /home/daytona && nohup python3 -m http.server 8080 --bind 0.0.0.0 >/home/daytona/server.log 2>&1 & echo $!'
Server started on port 8080 (pid 274). Open the game at:
https://8080-e7c5deb5-7723-4bb8-93c6-25258d9b7c53.proxy.daytona.works
```

Sandbox is automatically deleted on exit.

## Setup

Clone repository:
```bash
git clone https://github.com/daytonaio/daytona.git
cd daytona/guides/typescript/openai/codex-sdk
```

Get API keys from Daytona Dashboard and OpenAI Developer Platform. Copy `.env.example` to `.env`:
```bash
DAYTONA_API_KEY=your_daytona_key
SANDBOX_OPENAI_API_KEY=your_openai_key
```

⚠️ `SANDBOX_OPENAI_API_KEY` is passed into sandbox and accessible to all code executed inside.

Requires Node.js 18+. Install and run:
```bash
npm install
npm run start
```

## Architecture

Two components:
- **Main Program** (`src/index.ts`): Node.js script on local machine using Daytona SDK to create/manage sandbox and provide CLI
- **Sandbox Agent** (`agent/index.ts`): Node.js script inside sandbox using Codex SDK

### Initialization

Main program:
1. Creates Daytona sandbox with OpenAI API key in environment
2. Configures Codex system prompt via `.codex/config.toml` in sandbox
3. Uploads agent package to sandbox
4. Runs `npm install` in agent directory
5. Waits for user input and runs agent asynchronously per prompt

### Main Program Code

System prompt configuration:
```typescript
const systemPrompt = [
  'You are running in a Daytona sandbox.',
  'Use the /home/daytona directory instead of /workspace for file operations.',
  `When running services on localhost, they will be accessible as: ${previewUrlPattern}`,
].join(' ')
const config = `developer_instructions = "${systemPrompt}"`
await sandbox.fs.createFolder('.codex', '755')
await sandbox.fs.uploadFile(Buffer.from(config, 'utf8'), '.codex/config.toml')
```

User input loop with async agent execution:
```typescript
const sessionId = `codex-session-${Date.now()}`
await sandbox.process.createSession(sessionId)

const command = await sandbox.process.executeSessionCommand(sessionId, {
  command: `${environmentPrefix({ PROMPT: prompt })} npm exec --prefix /tmp/agent tsx -- /tmp/agent/index.ts`,
  runAsync: true,
})

if (!command.cmdId) throw new Error('Failed to start agent command in sandbox')
await sandbox.process.getSessionCommandLogs(
  sessionId,
  command.cmdId,
  onStdout,
  onStderr,
)

await sandbox.process.deleteSession(sessionId)
```

### Sandbox Agent Code

Initialize Codex with custom options:
```typescript
const options: ThreadOptions = {
  workingDirectory: '/home/daytona',
  skipGitRepoCheck: true,
  sandboxMode: 'danger-full-access',
}
```

Maintain thread state across requests:
```typescript
const threadIdPath = '/tmp/codex-thread-id'
const threadId = (await readFileIfExisting(threadIdPath))?.trim()
const thread: Thread = threadId 
  ? codex.resumeThread(threadId, options) 
  : codex.startThread(options)
```

## Key Advantages

- Secure isolated execution in Daytona sandboxes
- Direct terminal communication with agent
- Automatic dev server detection and live preview links
- Multi-language and full-stack support
- Thread persistence across multiple requests
- Simple setup with automatic cleanup

### ai_data_analysis_with_agentic_loop
Build AI data analyst using Claude + Daytona sandbox with agentic loop: upload dataset, define analysis prompt, Claude generates/refines Python code iteratively based on execution feedback, sandbox captures charts and outputs.

## AI Data Analysis Workflow

Run AI-generated code in Daytona Sandbox to analyze data:
1. User provides dataset (CSV or other formats)
2. LLM generates code (usually Python) based on user's data
3. Sandbox executes the code and returns results
4. LLM receives feedback and iterates to refine code if needed
5. Display final results to user

## Building an AI Data Analyst

Example: Analyze vehicle valuation dataset, identify price relation to manufacturing year, generate visualizations using Claude and Daytona's secure sandbox with agentic loop for iterative refinement.

### Setup

Install dependencies:
```bash
# Python
pip install daytona anthropic python-dotenv

# TypeScript
npm install @daytonaio/sdk @anthropic-ai/sdk dotenv
```

Configure `.env`:
```
DAYTONA_API_KEY=dtn_***
ANTHROPIC_API_KEY=sk-ant-***
```

### Dataset Preparation

Download vehicle valuation dataset from `https://download.daytona.io/dataset.csv` and save as `dataset.csv`.

Create sandbox and upload dataset:
```python
from daytona import Daytona
daytona = Daytona()
sandbox = daytona.create()
sandbox.fs.upload_file("dataset.csv", "/home/daytona/dataset.csv")
```

```typescript
import { Daytona } from '@daytonaio/sdk'
const daytona = new Daytona()
const sandbox = await daytona.create()
await sandbox.fs.uploadFile('dataset.csv', '/home/daytona/dataset.csv')
```

### Code Execution Handler

Function to execute code and extract charts:

```python
import base64
from typing import TypedDict

class ExecutionResult(TypedDict):
    stdout: str
    exit_code: int
    charts: list

def run_ai_generated_code(sandbox, ai_generated_code: str) -> ExecutionResult:
    execution = sandbox.process.code_run(ai_generated_code)
    result = ExecutionResult(
        stdout=execution.result or "",
        exit_code=execution.exit_code,
        charts=execution.artifacts.charts if execution.artifacts else []
    )
    if execution.artifacts and execution.artifacts.charts:
        for idx, chart in enumerate(execution.artifacts.charts):
            if chart.png:
                with open(f'chart-{idx}.png', 'wb') as f:
                    f.write(base64.b64decode(chart.png))
    return result
```

```typescript
import fs from 'fs'
import { Sandbox } from '@daytonaio/sdk'

interface ExecutionResult {
  stdout: string
  exitCode: number
  charts?: Array<{ png?: string }>
}

async function runAIGeneratedCode(
  sandbox: Sandbox,
  aiGeneratedCode: string
): Promise<ExecutionResult> {
  const execution = await sandbox.process.codeRun(aiGeneratedCode)
  const result: ExecutionResult = {
    stdout: execution.result || "",
    exitCode: execution.exitCode,
    charts: execution.artifacts?.charts
  }
  if (execution.artifacts?.charts) {
    for (let idx = 0; idx < execution.artifacts.charts.length; idx++) {
      const chart = execution.artifacts.charts[idx]
      if (chart.png) {
        fs.writeFileSync(`chart-${idx}.png`, chart.png, { encoding: 'base64' })
      }
    }
  }
  return result
}
```

### Analysis Prompt

Define what Claude should analyze:
```python
from anthropic import Anthropic

prompt = """
I have a CSV file with vehicle valuations at /home/daytona/dataset.csv.
Columns: 'year' (int), 'price_in_euro' (float)
Analyze how price varies by manufacturing year.
Drop rows with missing/non-numeric/'outlier' values.
Create a line chart showing average price per year.
Write Python code and finish with plt.show()."""

anthropic = Anthropic()
```

### Tool Definition

Define tool for Claude to execute Python code:
```python
tools = [
    {
        'name': 'run_python_code',
        'description': 'Run Python code in sandbox and get results',
        'input_schema': {
            'type': 'object',
            'properties': {
                'code': {
                    'type': 'string',
                    'description': 'Python code to run',
                },
            },
            'required': ['code'],
        },
    },
]
```

```typescript
import type { Tool } from '@anthropic-ai/sdk/resources/messages.mjs'

const tools: Tool[] = [
  {
    name: 'run_python_code',
    description: 'Run Python code in sandbox and get results',
    input_schema: {
      type: 'object',
      properties: {
        code: {
          type: 'string',
          description: 'Python code to run',
        },
      },
      required: ['code'],
    },
  },
]
```

### Agentic Loop

Iterative loop allowing Claude to refine code based on execution feedback:

```python
from anthropic import Anthropic

messages = [{'role': 'user', 'content': prompt}]
continue_loop = True
iteration_count = 0
max_iterations = 10

while continue_loop and iteration_count < max_iterations:
    iteration_count += 1
    print(f"\n=== Iteration {iteration_count} ===")
    
    msg = anthropic.messages.create(
        model='claude-sonnet-4-5',
        max_tokens=64000,
        messages=messages,
        tools=tools
    )
    
    for content_block in msg.content:
        if content_block.type == 'text':
            print("\nClaude's response:")
            print(content_block.text)
    
    tool_uses = [block for block in msg.content if block.type == 'tool_use']
    
    if len(tool_uses) == 0:
        print("\nTask completed - no more actions needed.")
        continue_loop = False
        break
    
    messages.append({'role': 'assistant', 'content': msg.content})
    tool_results = []
    
    for tool_use in tool_uses:
        if tool_use.name == 'run_python_code':
            code = tool_use.input['code']
            print("\n--- Executing Python code ---")
            print(code)
            
            execution_result = run_ai_generated_code(sandbox, code)
            
            result_content = ""
            if execution_result['exit_code'] == 0:
                result_content += "Execution successful!\n\n"
                if execution_result['stdout']:
                    result_content += f"Output:\n{execution_result['stdout']}\n"
                if execution_result['charts']:
                    result_content += f"\nGenerated {len(execution_result['charts'])} chart(s)."
                else:
                    result_content += "\nNote: No charts generated. Use plt.show()."
            else:
                result_content += f"Execution failed with exit code {execution_result['exit_code']}\n\n"
                if execution_result['stdout']:
                    result_content += f"Output:\n{execution_result['stdout']}\n"
            
            tool_results.append({
                'type': 'tool_result',
                'tool_use_id': tool_use.id,
                'content': result_content
            })
    
    messages.append({'role': 'user', 'content': tool_results})

if iteration_count >= max_iterations:
    print("\n⚠️  Reached maximum iteration limit.")
```

```typescript
import type { MessageParam, ToolUseBlock } from '@anthropic-ai/sdk/resources/messages.mjs'

const messages: MessageParam[] = [
  { role: 'user', content: initialPrompt }
]

let continueLoop = true
let iterationCount = 0
const maxIterations = 10

while (continueLoop && iterationCount < maxIterations) {
  iterationCount++
  console.log(`\n=== Iteration ${iterationCount} ===`)
  
  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-5',
    max_tokens: 64000,
    messages: messages,
    tools: tools
  })
  
  for (const contentBlock of message.content) {
    if (contentBlock.type === 'text') {
      console.log("\nClaude's response:")
      console.log(contentBlock.text)
    }
  }
  
  const toolUses = message.content.filter(
    (block): block is ToolUseBlock => block.type === 'tool_use'
  )
  
  if (toolUses.length === 0) {
    console.log("\nTask completed - no more actions needed.")
    continueLoop = false
    break
  }
  
  messages.push({
    role: 'assistant',
    content: message.content
  })
  
  const toolResults = []
  
  for (const toolUse of toolUses) {
    if (toolUse.name === 'run_python_code') {
      const code = (toolUse.input as { code: string }).code
      console.log("\n--- Executing Python code ---")
      console.log(code)
      
      const executionResult = await runAIGeneratedCode(sandbox, code)
      
      let resultContent = ""
      if (executionResult.exitCode === 0) {
        resultContent += `Execution successful!\n\n`
        if (executionResult.stdout) {
          resultContent += `Output:\n${executionResult.stdout}\n`
        }
        if (executionResult.charts && executionResult.charts.length > 0) {
          resultContent += `\nGenerated ${executionResult.charts.length} chart(s).`
        } else {
          resultContent += `\nNote: No charts generated. Use plt.show().`
        }
      } else {
        resultContent += `Execution failed with exit code ${executionResult.exitCode}\n\n`
        if (executionResult.stdout) {
          resultContent += `Output:\n${executionResult.stdout}\n`
        }
      }
      
      toolResults.push({
        type: 'tool_result' as const,
        tool_use_id: toolUse.id,
        content: resultContent
      })
    }
  }
  
  messages.push({
    role: 'user',
    content: toolResults
  })
}
```

**Loop workflow:**
1. Send initial prompt to Claude with tool definition
2. For each iteration (max 10):
   - Claude generates response with optional tool calls
   - If tool calls exist, execute Python code in sandbox
   - Send execution results back to Claude (errors or success)
   - Claude refines code based on feedback
3. Loop ends when Claude signals no more tool calls or max iterations reached

**Advantages:**
- Secure execution in isolated sandboxes
- Automatic artifact capture (charts, tables, outputs)
- Built-in error detection and logging
- Language agnostic (Python used here, but Daytona supports multiple languages)

### Running the Analysis

```bash
# Python
python data-analysis.py

# TypeScript
npx tsx data-analysis.ts
```

Generates chart saved to `chart-0.png` showing vehicle valuation by manufacturing year.

### google_adk_code_generator_agent
Google ADK agent that generates, tests, and verifies code in Daytona sandboxes using test-driven workflow with automatic iteration until tests pass.

## Overview

Build a code generator agent using Google ADK that generates, tests, and verifies code in Daytona sandboxes. The agent takes natural language descriptions, generates implementations in Python/JavaScript/TypeScript, creates and executes tests, iterates on failures, and returns verified working code.

## Setup

Clone the repository:
```bash
git clone https://github.com/daytonaio/daytona
cd daytona/guides/python/google-adk/code-generator-agent/gemini
```

Install dependencies (Python 3.10+):
```bash
pip install -U google-adk daytona-adk python-dotenv
```

Configure `.env`:
```
DAYTONA_API_KEY=dtn_***
GOOGLE_API_KEY=***
```

## Core Components

**Google ADK:**
- `Agent`: AI model wrapper that processes requests and uses tools
- `App`: Container bundling agents with plugins for centralized management
- `InMemoryRunner`: Execution engine that orchestrates event-driven loops and manages state

**DaytonaPlugin:** Provides tools to execute code (Python/JavaScript/TypeScript), run shell commands, upload/read files, and start background processes in isolated sandboxes.

## Implementation

Initialize and load environment:
```python
import asyncio
import logging
from dotenv import load_dotenv
from google.adk.agents import Agent
from google.adk.apps import App
from google.adk.runners import InMemoryRunner
from daytona_adk import DaytonaPlugin

load_dotenv()
logging.basicConfig(level=logging.DEBUG)
```

Extract final response from ADK events:
```python
def extract_final_response(response: list) -> str:
    """Extract the final text response from a list of ADK events."""
    for event in reversed(response):
        if hasattr(event, "text") and event.text:
            return event.text
        if hasattr(event, "content") and event.content:
            content = event.content
            if hasattr(content, "parts") and content.parts:
                for part in content.parts:
                    if hasattr(part, "text") and part.text:
                        return part.text
            if hasattr(content, "text") and content.text:
                return content.text
        if isinstance(event, dict):
            text = event.get("text") or event.get("content", {}).get("text")
            if text:
                return text
    return ""
```

Define agent instruction enforcing test-driven workflow:
```python
AGENT_INSTRUCTION = """You are a code generator agent that writes verified, working code.
You support Python, JavaScript, and TypeScript.

Your workflow for every code request:
1. Write the function
2. Write tests for it
3. EXECUTE the code in the sandbox to verify it works - do not skip this step
4. If execution fails, fix and re-execute until tests pass
5. Once verified, respond with ONLY the function (no tests)

You must always execute code before responding. Never return untested code.
Only include tests in your response if the user explicitly asks for them.
"""
```

Configure plugin:
```python
plugin = DaytonaPlugin(
    labels={"example": "code-generator"},
    # Optional: api_key, sandbox_name, plugin_name, env_vars, auto_stop_interval, auto_delete_interval
)
```

Create agent with Gemini model:
```python
agent = Agent(
    model="gemini-2.5-pro",
    name="code_generator_agent",
    instruction=AGENT_INSTRUCTION,
    tools=plugin.get_tools(),
)
```

Bundle and run with InMemoryRunner:
```python
app = App(
    name="code_generator_app",
    root_agent=agent,
    plugins=[plugin],
)

async with InMemoryRunner(app=app) as runner:
    prompt = "Write a TypeScript function called 'groupBy' that takes an array and a key function, and groups array elements by the key. Use proper type annotations."
    response = await runner.run_debug(prompt)
    final_response = extract_final_response(response)
    print(final_response)
```

The context manager automatically cleans up the sandbox on exit.

## Execution Flow

With `logging.DEBUG` enabled, you see:
1. **Sandbox creation**: `Daytona sandbox created: <id>`
2. **Plugin registration**: `Plugin 'daytona_plugin' registered`
3. **Code generation**: Agent writes implementation and tests
4. **Execution**: `execute_code_in_daytona` tool invoked with code and language
5. **Iteration**: If tests fail (exit_code != 0), agent fixes and re-executes
6. **Response**: Once tests pass, agent returns verified code
7. **Cleanup**: Sandbox automatically deleted when context exits

## Output Control

By default, agent returns only the working function. To include tests in response:
```python
prompt = "Write a TypeScript function called 'groupBy'... Return the tests also in a separate code block"
```

## Complete Example

```python
"""Code Generator & Tester Agent Example."""
import asyncio
import logging
from dotenv import load_dotenv
from google.adk.agents import Agent
from google.adk.apps import App
from google.adk.runners import InMemoryRunner
from daytona_adk import DaytonaPlugin

load_dotenv()
logging.basicConfig(level=logging.DEBUG)

def extract_final_response(response: list) -> str:
    for event in reversed(response):
        if hasattr(event, "text") and event.text:
            return event.text
        if hasattr(event, "content") and event.content:
            content = event.content
            if hasattr(content, "parts") and content.parts:
                for part in content.parts:
                    if hasattr(part, "text") and part.text:
                        return part.text
            if hasattr(content, "text") and content.text:
                return content.text
        if isinstance(event, dict):
            text = event.get("text") or event.get("content", {}).get("text")
            if text:
                return text
    return ""

AGENT_INSTRUCTION = """You are a code generator agent that writes verified, working code.
You support Python, JavaScript, and TypeScript.

Your workflow for every code request:
1. Write the function
2. Write tests for it
3. EXECUTE the code in the sandbox to verify it works - do not skip this step
4. If execution fails, fix and re-execute until tests pass
5. Once verified, respond with ONLY the function (no tests)

You must always execute code before responding. Never return untested code.
Only include tests in your response if the user explicitly asks for them.
"""

async def main() -> None:
    plugin = DaytonaPlugin(labels={"example": "code-generator"})
    agent = Agent(
        model="gemini-2.5-pro",
        name="code_generator_agent",
        instruction=AGENT_INSTRUCTION,
        tools=plugin.get_tools(),
    )
    app = App(name="code_generator_app", root_agent=agent, plugins=[plugin])

    async with InMemoryRunner(app=app) as runner:
        prompt = "Write a TypeScript function called 'groupBy' that takes an array and a key function, and groups array elements by the key. Use proper type annotations."
        response = await runner.run_debug(prompt)
        final_response = extract_final_response(response)
        print(final_response)

if __name__ == "__main__":
    asyncio.run(main())
```

Run with `python main.py`.

## API Reference

See daytona-adk documentation for complete API reference of available tools and configuration options.

### langchain_data_analysis_integration
LangChain integration for secure Python data analysis in Daytona sandbox; agents generate and execute analysis code from natural language prompts with automatic artifact capture and result handling.

## Overview

`DaytonaDataAnalysisTool` is a LangChain tool integration enabling agents to perform secure Python data analysis in sandboxed environments. Agents receive natural language prompts, reason about the task, generate Python code, execute it securely in Daytona sandbox, and process results.

## Setup

### Dependencies
```bash
pip install -U langchain langchain-anthropic langchain-daytona-data-analysis python-dotenv
```

Requires Python 3.10+.

### Environment Configuration
```bash
DAYTONA_API_KEY=dtn_***
ANTHROPIC_API_KEY=sk-ant-***
```

Get keys from Daytona Dashboard and Anthropic Console.

## Basic Usage

### Initialize Model
```python
from langchain_anthropic import ChatAnthropic

model = ChatAnthropic(
    model_name="claude-sonnet-4-5-20250929",
    temperature=0,
    timeout=None,
    max_retries=2,
)
```

### Define Result Handler
```python
import base64
from daytona import ExecutionArtifacts

def process_data_analysis_result(result: ExecutionArtifacts):
    print("Result stdout", result.stdout)
    result_idx = 0
    for chart in result.charts:
        if chart.png:
            with open(f'chart-{result_idx}.png', 'wb') as f:
                f.write(base64.b64decode(chart.png))
            print(f'Chart saved to chart-{result_idx}.png')
            result_idx += 1
```

### Initialize Tool and Upload Data
```python
from langchain_daytona_data_analysis import DaytonaDataAnalysisTool

DataAnalysisTool = DaytonaDataAnalysisTool(
    on_result=process_data_analysis_result
)

with open("./dataset.csv", "rb") as f:
    DataAnalysisTool.upload_file(
        f,
        description=(
            "CSV file containing vehicle valuations. "
            "Columns:\n"
            "- 'year': integer, manufacturing year\n"
            "- 'price_in_euro': float, price in Euros\n"
            "Drop rows with missing/non-numeric values or outliers."
        )
    )
```

### Create and Run Agent
```python
from langchain.agents import create_agent

agent = create_agent(model, tools=[DataAnalysisTool], debug=True)

agent_response = agent.invoke({
    "messages": [{
        "role": "user",
        "content": "Analyze how vehicle prices vary by manufacturing year. Create a line chart showing average price per year."
    }]
})

DataAnalysisTool.close()
```

## Execution Flow

1. Agent receives natural language request
2. Agent determines need for `DaytonaDataAnalysisTool`
3. Agent generates Python code for analysis
4. Code executes securely in Daytona sandbox
5. Results processed by handler function
6. Charts saved to local directory
7. Sandbox resources cleaned up

The agent typically explores the dataset first (shape, columns, data types), then generates detailed analysis code with data cleaning, outlier removal, calculations, and visualizations.

## API Reference

### upload_file
```python
def upload_file(file: IO, description: str) -> SandboxUploadedFile
```
Uploads file to sandbox at `/home/daytona/`. Description explains file purpose and data structure.

### download_file
```python
def download_file(remote_path: str) -> bytes
```
Downloads file from sandbox by remote path.

### remove_uploaded_file
```python
def remove_uploaded_file(uploaded_file: SandboxUploadedFile) -> None
```
Removes previously uploaded file from sandbox.

### get_sandbox
```python
def get_sandbox() -> Sandbox
```
Returns current sandbox instance for inspecting properties and metadata.

### install_python_packages
```python
def install_python_packages(package_names: str | list[str]) -> None
```
Installs Python packages in sandbox using pip. Preinstalled packages available in Daytona's Default Snapshot documentation.

### close
```python
def close() -> None
```
Closes and deletes sandbox environment. Call when finished with all analysis tasks.

## Data Structures

### SandboxUploadedFile
- `name`: str - Name of uploaded file in sandbox
- `remote_path`: str - Full path to file in sandbox
- `description`: str - Description provided during upload

### Sandbox
Represents Daytona sandbox instance. See full structure in Daytona Python SDK Sandbox documentation.

## Example: Vehicle Price Analysis

Complete working example analyzing vehicle valuations dataset:

```python
import base64
from dotenv import load_dotenv
from langchain.agents import create_agent
from langchain_anthropic import ChatAnthropic
from daytona import ExecutionArtifacts
from langchain_daytona_data_analysis import DaytonaDataAnalysisTool

load_dotenv()

model = ChatAnthropic(
    model_name="claude-sonnet-4-5-20250929",
    temperature=0,
    timeout=None,
    max_retries=2,
)

def process_data_analysis_result(result: ExecutionArtifacts):
    print("Result stdout", result.stdout)
    result_idx = 0
    for chart in result.charts:
        if chart.png:
            with open(f'chart-{result_idx}.png', 'wb') as f:
                f.write(base64.b64decode(chart.png))
            print(f'Chart saved to chart-{result_idx}.png')
            result_idx += 1

def main():
    DataAnalysisTool = DaytonaDataAnalysisTool(
        on_result=process_data_analysis_result
    )

    try:
        with open("./dataset.csv", "rb") as f:
            DataAnalysisTool.upload_file(
                f,
                description=(
                    "CSV file containing vehicle valuations. "
                    "Columns:\n"
                    "- 'year': integer, manufacturing year\n"
                    "- 'price_in_euro': float, price in Euros\n"
                    "Drop rows with missing/non-numeric values or outliers."
                )
            )

        agent = create_agent(model, tools=[DataAnalysisTool], debug=True)

        agent_response = agent.invoke(
            {"messages": [{"role": "user", "content": "Analyze how vehicle prices vary by manufacturing year. Create a line chart showing average price per year."}]}
        )
    finally:
        DataAnalysisTool.close()

if __name__ == "__main__":
    main()
```

Agent generates code that:
- Loads CSV and explores structure
- Converts columns to numeric, removes missing values
- Removes outliers using IQR method
- Calculates average price per year
- Creates line chart with proper formatting and labels
- Outputs statistics (total vehicles, year range, price range, overall average)

Example output shows vehicle prices increasing from €5,968 (2005) to €33,862 (2022) with slight decrease in 2023.

### build_a_coding_agent_using_letta_code
Run Letta Code autonomous agent in Daytona sandbox with PTY bidirectional communication, stream-json message format, custom system prompt, and automatic preview link generation for hosted apps.

## Overview

Run an autonomous coding agent based on Letta Code inside a Daytona sandbox. The agent develops web apps, writes code in any language, installs dependencies, and runs scripts. Letta Code uses stateful agents with persistent memory across sessions.

## Workflow

1. Launch main script to create Daytona sandbox and install Letta Code
2. Agent configured with custom Daytona-aware system prompt
3. Interactive CLI interface for chatting with agent and issuing commands
4. Agent hosts web apps and provides preview links via Daytona Preview Links feature
5. Sandbox automatically deleted on exit

Example interaction:
```
User: create a beautiful, professional themed app that lets me write markdown documents and render them live
Agent creates markdown editor with live preview, hosts on port 8080, provides preview link
```

## Project Setup

Clone repository:
```bash
git clone https://github.com/daytonaio/daytona.git
cd daytona/guides/typescript/letta-code
```

Get API keys from Daytona Dashboard and Letta Platform. Create `.env`:
```bash
DAYTONA_API_KEY=your_daytona_key
SANDBOX_LETTA_API_KEY=your_letta_api_key
```

Install and run (requires Node.js 18+):
```bash
npm install
npm run start
```

**Security note**: Letta API key is passed into sandbox environment and may be accessible to code executed within it.

## Architecture

Two main TypeScript files:
- **index.ts**: Creates sandbox, installs Letta Code, configures system prompt, provides interactive CLI
- **letta-session.ts**: Manages PTY-based bidirectional communication with Letta Code, handles JSON message streaming and response parsing

## Initialization Process

1. Create Daytona sandbox with Letta API key in environment variables:
```typescript
sandbox = await daytona.create({
  envVars: { LETTA_API_KEY: process.env.SANDBOX_LETTA_API_KEY },
})
```

2. Install Letta Code globally via process execution

3. Create PTY session for bidirectional communication:
```typescript
this.ptyHandle = await this.sandbox.process.createPty({
  id: `letta-pty-${Date.now()}`,
  onData: (data: Uint8Array) => this.handleData(data),
})
```

4. Launch Letta Code in bidirectional headless mode with stream-json format:
```typescript
await this.ptyHandle.sendInput(
  `letta --new --system-custom "${systemPrompt.replace(/"/g, '\\"')}" --input-format stream-json --output-format stream-json --yolo -p\n`,
)
```

Flags:
- `--system-custom`: Pass custom system prompt with Daytona-specific instructions and URL pattern for preview links
- `--input-format stream-json --output-format stream-json`: Enable JSON message streaming for real-time communication
- `--yolo`: Allow agent to run shell commands without explicit approval

## Message Handling

Send prompts via `processPrompt()` method, which formats user input as JSON and sends through PTY:

User message format:
```json
{"type": "user", "message": {"role": "user", "content": "create a simple web server"}}
```

Agent responds with streaming JSON messages. Tool calls arrive as fragments:
```json
{"type": "message", "message_type": "approval_request_message", "tool_call": {"tool_call_id": "call_123", "name": "Bash", "arguments": "{\"command\": \"python3 -m http.server 8080\"}"}}
```

`handleParsedMessage()` method parses JSON fragments, combines consecutive fragments for same tool call, formats and displays results.

## Key Advantages

- Secure, isolated execution in Daytona sandboxes
- Stateful agents with persistent memory across sessions
- Full Letta Code capabilities (file operations, shell commands)
- Agents viewable in Letta's Agent Development Environment
- Automatic preview link generation for hosted services
- Multi-language and full-stack support
- Automatic cleanup on exit

### mastra_coding_agent_integration
Configure Mastra coding agent with Daytona sandboxes for AI-powered isolated code execution; uses createSandbox, writeFiles, runCommand tools; accessible via Mastra Studio web interface with conversation history and visual debugging.

## Overview

Integrate the Mastra coding agent with Daytona sandboxes to execute AI-powered coding tasks in secure, isolated environments. Use Mastra Studio for a ChatGPT-like interface with human-in-the-loop workflows.

## Requirements

- Node.js 20+
- OpenAI API key (or other LLM provider)
- Daytona API key from the Daytona Dashboard

## Setup

Clone the template repository:
```bash
git clone https://github.com/mastra-ai/template-coding-agent.git
cd template-coding-agent
```

Create `.env` file with LLM and Daytona configuration:
```env
OPENAI_API_KEY=your_openai_key
MODEL=openai/gpt-4o-mini
DAYTONA_API_KEY=your-daytona-api-key-here
```

Install dependencies:
```bash
pnpm install
```

## Running the Agent

Start the dev server:
```bash
pnpm run dev
```

Access Mastra Studio at `http://localhost:4111`. The interface provides:
- Conversation history organized in threads
- Visual debugging of agent execution steps and tool calls
- Model switching between different AI providers
- Real-time tool inspection

## Tool Calls and Execution

The agent uses several tools to interact with Daytona sandboxes:

**createSandbox**: Provisions a new sandbox
```json
{
  "name": "reverse_string_project",
  "language": "python",
  "labels": null,
  "envVars": null
}
```
Returns: `{"sandboxId": "bdfa9456-4945-43a7-97df-b9bfbcbdc62e"}`

**writeFiles**: Create multiple files in a sandbox
```json
{
  "sandboxId": "bdfa9456-4945-43a7-97df-b9bfbcbdc62e",
  "files": [
    {"path": "reverse_string.py", "data": "def reverse_string(s):\n    return s[::-1]\n"},
    {"path": "test_reverse_string.py", "data": "import unittest\nfrom reverse_string import reverse_string\n\nclass TestReverseString(unittest.TestCase):\n    def test_regular(self):\n        self.assertEqual(reverse_string(\"hello\"), \"olleh\")\n    def test_empty(self):\n        self.assertEqual(reverse_string(\"\"), \"\")\n    def test_single_char(self):\n        self.assertEqual(reverse_string(\"a\"), \"a\")\n    def test_numbers(self):\n        self.assertEqual(reverse_string(\"12345\"), \"54321\")\n\nif __name__ == \"__main__\":\n    unittest.main()\n"}
  ]
}
```
Returns: `{"success": true, "filesWritten": ["/home/daytona/reverse_string.py", "/home/daytona/test_reverse_string.py"]}`

**runCommand**: Execute commands in the sandbox
```json
{
  "sandboxId": "bdfa9456-4945-43a7-97df-b9bfbcbdc62e",
  "command": "python3 test_reverse_string.py",
  "envs": null,
  "workingDirectory": null,
  "timeoutSeconds": 20,
  "captureOutput": true
}
```
Returns: `{"success": true, "exitCode": 0, "stdout": "....\n----------------------------------------------------------------------\nRan 4 tests in 0.000s\n\nOK\n", "command": "python3 test_reverse_string.py", "executionTime": 218}`

## Terminal Logging

Tool calls and results are logged with full visibility including arguments, results, token usage with caching metrics, and unique identifiers for debugging:
```json
{
  "text": "",
  "toolCalls": [{
    "type": "tool-call",
    "runId": "ab2a1d08-91c6-4028-9046-3446a721527f",
    "from": "AGENT",
    "payload": {
      "toolCallId": "call_NiLLgBmgrYLSL0MsrG54E4A5",
      "toolName": "writeFile",
      "args": {
        "sandboxId": "2152d23b-5742-47c2-9992-4414d4144869",
        "path": "hello.js",
        "content": "console.log('Hello, world!');"
      }
    }
  }],
  "toolResults": [{
    "type": "tool-result",
    "runId": "ab2a1d08-91c6-4028-9046-3446a721527f",
    "from": "AGENT",
    "payload": {
      "toolCallId": "call_NiLLgBmgrYLSL0MsrG54E4A5",
      "toolName": "writeFile",
      "result": {"success": true, "path": "/home/daytona/hello.js"}
    }
  }],
  "finishReason": "tool-calls",
  "usage": {
    "inputTokens": 4243,
    "outputTokens": 53,
    "totalTokens": 4296,
    "reasoningTokens": 0,
    "cachedInputTokens": 4096
  }
}
```

## Sandbox Management

Active sandboxes appear in the Daytona Dashboard. Clean up resources when finished unless the sandbox needs to remain active for preview URLs or ongoing development.

## Key Advantages

- Secure isolation: all operations run in isolated Daytona sandboxes
- Multi-language support: execute code across different programming languages
- Enhanced debugging: visualize and debug agent workflows in Mastra Studio
- Scalable execution: leverage Daytona's cloud infrastructure

### openclaw-run-secure-sandbox
Set up OpenClaw in Daytona sandbox with CLI (daytona-medium snapshot, --auto-stop 0), onboard with Anthropic API key, start gateway, access dashboard via preview URL with gateway token, approve device; configure Telegram via @BotFather token and pairing code, WhatsApp via QR code scan and phone number.

## Setup and Run OpenClaw in Daytona Sandbox

Running OpenClaw in a Daytona sandbox provides isolation, security, and 24/7 uptime without consuming local machine resources.

### Prerequisites
- Daytona account and API key from Daytona Dashboard
- Local terminal (macOS, Linux, or Windows)

### Install CLI and Authenticate

Install Daytona CLI:
```bash
# Mac/Linux
brew install daytonaio/cli/daytona

# Windows
powershell -Command "irm https://get.daytona.io/windows | iex"
```

Verify version is 0.135.0 or higher:
```bash
daytona --version
```

Authenticate:
```bash
daytona login --api-key=YOUR_API_KEY
```

### Create and Connect to Sandbox

Create sandbox with OpenClaw preinstalled:
```bash
daytona sandbox create --name openclaw --snapshot daytona-medium --auto-stop 0
```

The `daytona-medium` snapshot is required (minimum 2GB memory for OpenClaw gateway). The `--auto-stop 0` flag keeps the sandbox running indefinitely.

SSH into sandbox:
```bash
daytona ssh openclaw
```

### Onboard OpenClaw

Start onboarding:
```bash
openclaw onboard
```

Follow prompts:
1. Accept security acknowledgment
2. Select **Quickstart** mode
3. Select **Anthropic** as model provider
4. Select **Anthropic API key** auth method
5. Paste your Anthropic API key
6. Keep default model (`anthropic/claude-opus-4-5`)
7. Skip channel configuration (configure later)
8. Skip skills configuration
9. Skip hooks configuration
10. Skip gateway service installation (already installed)

The onboarding output displays a dashboard link with a gateway token in the URL (after `?token=`). Save this token for dashboard authentication.

### Start Gateway and Access Dashboard

Start gateway in background:
```bash
nohup openclaw gateway run > /tmp/gateway.log 2>&1 &
```

Generate preview URL from local terminal (not SSH session):
```bash
daytona preview-url openclaw --port 18789
```

This creates a signed preview URL that expires after 1 hour (customizable with `--expires` flag). Open the URL in browser, go to **Overview**, paste your gateway token in the **Gateway Token** field, and click **Connect**.

### Device Pairing

OpenClaw requires device approval for security. List pending requests:
```bash
openclaw devices list
```

Approve your device:
```bash
openclaw devices approve REQUEST_ID
```

Click **Connect** again in dashboard. Green status indicator confirms OpenClaw is ready.

### Security Layers
1. **Preview URL:** Time-limited access to dashboard port
2. **Gateway token:** Required for dashboard authentication
3. **Device approval:** Only approved devices can control assistant

Keep gateway token and preview URL secret.

## Configure Telegram

Create bot via @BotFather in Telegram:
1. Send `/start`, then `/newbot`
2. Enter bot name and username
3. Copy the bot token

Configure OpenClaw:
```bash
openclaw config set channels.telegram.enabled true
openclaw config set channels.telegram.botToken YOUR_BOT_TOKEN
openclaw config get channels.telegram
```

Restart gateway:
```bash
openclaw gateway stop
nohup openclaw gateway run > /tmp/gateway.log 2>&1 &
```

Complete verification in Telegram:
1. Open bot chat and click **Start**
2. Copy pairing code and approve:
```bash
openclaw pairing approve telegram PAIRING_CODE
```

## Configure WhatsApp

Run configuration:
```bash
openclaw config --section channels
```

When prompted:
1. Select **Local (this machine)** for gateway location
2. Choose **Configure/link**
3. Select **WhatsApp (QR link)**
4. Select **Yes** for "Link WhatsApp now (QR)?"

Scan QR code in WhatsApp: **Settings → Linked Devices → Link a Device**

Select **This is my personal phone number** and enter phone number when prompted.

When prompted for another channel, choose **Finished**.

Start chatting: Send message to yourself in WhatsApp and OpenClaw responds. To allow other users, add their phone numbers to **Allow From** list in **Channels → WhatsApp** in dashboard.

### opencode_web_agent_integration
Run OpenCode coding agent in Daytona sandbox with web interface, 75+ LLM providers, automatic preview links; configure with custom system prompt and persist API keys via environment variables.

## Overview

Run the OpenCode coding agent inside a Daytona sandbox using its web interface. The agent can develop web apps, write code in any language, install dependencies, run scripts, and supports 75+ LLM providers with live preview links.

## Workflow

1. Launch the main script to create a Daytona sandbox with OpenCode installed
2. Access the web interface via a preview link
3. Create and interact with agent sessions
4. Agent automatically generates preview links for hosted web apps
5. Press Ctrl+C to delete the sandbox automatically

## Setup

Clone the repository and navigate to the example:
```bash
git clone https://github.com/daytonaio/daytona.git
cd daytona/guides/typescript/opencode
```

Get your API key from the Daytona Dashboard and create `.env`:
```bash
DAYTONA_API_KEY=your_daytona_key
```

Requires Node.js 18+. Install and run:
```bash
npm install
npm run start
```

## Models and API Providers

OpenCode supports 75+ LLM providers with a free default. Change providers in the web interface menu. To persist API keys between runs, add them to the sandbox environment:

```typescript
sandbox = await daytona.create({
  envVars: {
    ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY || '',
  },
})
```

## Script Implementation

### Initialization Steps

1. Create a new Daytona sandbox
2. Install OpenCode globally via npm using process execution
3. Upload custom agent configuration with Daytona-specific system prompt
4. Start OpenCode web server on port 3000
5. Replace localhost URL with Daytona preview link

### Main Script Code

Execute OpenCode as an async command:
```typescript
const command = await sandbox.process.executeSessionCommand(sessionId, {
  command: `${envVar} opencode web --port ${OPENCODE_PORT}`,
  runAsync: true,
})
```

Parse OpenCode's output and replace localhost with preview link:
```typescript
const opencodePreviewLink = await sandbox.getPreviewLink(OPENCODE_PORT)
const replaceUrl = (text: string) =>
  text.replace(
    new RegExp(`http:\\/\\/127\\.0\\.0\\.1:${OPENCODE_PORT}`, 'g'),
    opencodePreviewLink.url
  )
```

### Agent Configuration

Custom system prompt passed as JSON via `OPENCODE_CONFIG_CONTENT` environment variable:

```json
{
  "$schema": "https://opencode.ai/config.json",
  "default_agent": "daytona",
  "agent": {
    "daytona": {
      "description": "Daytona sandbox-aware coding agent",
      "mode": "primary",
      "prompt": "You are running in a Daytona sandbox. Use the /home/daytona directory instead of /workspace for file operations. When running services on localhost, they will be accessible as: <PREVIEW_URL_PATTERN>. When starting a server, always give the user the preview URL to access it. When starting a server, start it in the background with & so the command does not block further instructions."
    }
  }
}
```

The `<PREVIEW_URL_PATTERN>` is a template URL with `{PORT}` placeholder, generated by creating a preview link and replacing the port number.

### Cleanup

Automatic sandbox deletion on Ctrl+C:
```typescript
process.once('SIGINT', async () => {
  console.log('\nCleaning up...')
  if (sandbox) await sandbox.delete()
  process.exit(0)
})
```

## Key Advantages

- Secure, isolated execution in Daytona sandboxes
- OpenCode Web interface accessible via browser
- Support for 75+ LLM providers
- All agent code execution happens inside the sandbox
- Automatic preview link generation for deployed services
- Custom agent configuration for Daytona-specific workflows
- Clean resource management with automatic sandbox cleanup

### rl_training_with_trl_and_grpo
Train code-generating LLMs with TRL's GRPOTrainer using 500 parallel Daytona sandboxes for safe concurrent evaluation: sanitize completions, check banned patterns, build test harness, execute in sandbox, parse JSON results, compute rewards (0-1 for test pass rate, -1 for errors), bridge sync/async with event loop, align batch size to sandbox pool for perfect parallelism.

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

