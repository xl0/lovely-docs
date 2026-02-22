
## Directories

### go_sdk
Complete Go SDK for programmatically creating and managing Daytona sandboxes with process execution, file operations, git, code execution, desktop automation, and LSP support.

# Go SDK for Daytona

Complete Go client library for creating and managing Daytona sandboxes with full lifecycle control, process execution, file operations, and desktop automation.

## Installation & Setup

```bash
go get github.com/daytonaio/daytona/libs/sdk-go
```

Initialize with API key or JWT token from environment variables (`DAYTONA_API_KEY`, `DAYTONA_JWT_TOKEN`, `DAYTONA_ORGANIZATION_ID`, `DAYTONA_API_URL`) or explicit config:

```go
client, err := daytona.NewClient()
// or
client, err := daytona.NewClientWithConfig(&types.DaytonaConfig{
    APIKey: "key", APIUrl: "https://...", Target: "us",
})
```

## Sandbox Lifecycle

Create from snapshot or Docker image with optional resources:
```go
sandbox, err := client.Create(ctx, types.SnapshotParams{
    Snapshot: "my-snapshot",
    SandboxBaseParams: types.SandboxBaseParams{Name: "my-sandbox"},
})
// or
sandbox, err := client.Create(ctx, types.ImageParams{
    Image: "python:3.11",
    Resources: &types.Resources{CPU: 2, Memory: 4096},
})
```

Manage state: `Start()`, `Stop()`, `Archive()`, `Delete()` with optional timeouts and wait methods. Retrieve by ID/name/labels: `Get()`, `FindOne()`, `List()`. Configure: `SetLabels()`, `SetAutoArchiveInterval()`, `SetAutoDeleteInterval()`, `Resize()`, `RefreshData()`. Get info: `GetUserHomeDir()`, `GetWorkingDir()`, `GetPreviewLink(port)`.

## Process Execution

Execute commands with optional working directory, environment variables, and timeout:
```go
result, err := sandbox.Process.ExecuteCommand(ctx, "echo 'Hello'",
    options.WithCwd("/home/user/project"),
    options.WithCommandEnv(map[string]string{"NODE_ENV": "prod"}),
    options.WithExecuteTimeout(5*time.Minute),
)
fmt.Println(result.Result, result.ExitCode)
```

Sessions maintain state across commands:
```go
sandbox.Process.CreateSession(ctx, "my-session")
sandbox.Process.ExecuteSessionCommand(ctx, "my-session", "cd /app", false, false)
result, err := sandbox.Process.ExecuteSessionCommand(ctx, "my-session", "npm start", false, false)
// Async: result, err := sandbox.Process.ExecuteSessionCommand(ctx, "my-session", "long-cmd", true, false)
// cmdID := result["id"].(string); status, err := sandbox.Process.GetSessionCommand(ctx, "my-session", cmdID)
// logs, err := sandbox.Process.GetSessionCommandLogs(ctx, "my-session", cmdID)
// Stream: sandbox.Process.GetSessionCommandLogsStream(ctx, "session", "cmd", stdout, stderr)
sandbox.Process.DeleteSession(ctx, "my-session")
```

PTY (interactive terminal) with optional size and environment:
```go
handle, err := sandbox.Process.CreatePty(ctx, "my-terminal",
    options.WithCreatePtySize(types.PtySize{Rows: 24, Cols: 80}),
    options.WithCreatePtyEnv(map[string]string{"TERM": "xterm-256color"}),
)
handle.WaitForConnection(ctx)
handle.SendInput([]byte("ls -la\n"))
for data := range handle.DataChan() { fmt.Print(string(data)) }
// Or: io.Copy(os.Stdout, handle); handle.Write([]byte("cmd\n"))
handle.Resize(ctx, 120, 40)
result, err := handle.Wait(ctx)
handle.Kill(ctx)
defer handle.Disconnect()
// Connect to existing: handle, err := sandbox.Process.ConnectPty(ctx, "my-terminal")
```

## File System

List/info: `ListFiles()`, `GetFileInfo()`. Create/delete: `CreateFolder()`, `DeleteFile()` (recursive option). Upload/download: `UploadFile()` (from path or bytes), `DownloadFile()` (to memory or file). Move: `MoveFiles()`. Permissions: `SetFilePermissions()` with mode, owner, group. Search: `SearchFiles()` (glob), `FindFiles()` (content), `ReplaceInFiles()`.

## Git Operations

Clone with optional branch, commit, and auth:
```go
sandbox.Git.Clone(ctx, "https://github.com/user/repo.git", "/home/user/repo",
    options.WithBranch("develop"),
    options.WithUsername("user"),
    options.WithPassword("token"),
)
```

Branches: `Branches()`, `CreateBranch()`, `Checkout()`, `DeleteBranch()` (with force option). Staging/commits: `Add()`, `Commit()` (with author, email, allow-empty option). Sync: `Pull()`, `Push()` (with auth options). Status: `Status()` returns current branch, ahead/behind counts, file statuses.

## Code Execution (Python)

Simple execution with streaming output:
```go
channels, err := sandbox.CodeInterpreter.RunCode(ctx, "print('Hello')")
result := <-channels.Done
fmt.Println(result.Stdout)
// Stream: for msg := range channels.Stdout { fmt.Print(msg.Text) }
```

With environment and timeout:
```go
channels, err := sandbox.CodeInterpreter.RunCode(ctx, "import os; print(os.environ['API_KEY'])",
    options.WithEnv(map[string]string{"API_KEY": "secret"}),
    options.WithInterpreterTimeout(30*time.Second),
)
```

Persistent contexts for state across executions:
```go
ctxInfo, err := sandbox.CodeInterpreter.CreateContext(ctx, nil)
contextID := ctxInfo["id"].(string)
sandbox.CodeInterpreter.RunCode(ctx, "x = 42", options.WithCustomContext(contextID))
sandbox.CodeInterpreter.RunCode(ctx, "print(x)", options.WithCustomContext(contextID)) // prints 42
sandbox.CodeInterpreter.DeleteContext(ctx, contextID)
contexts, err := sandbox.CodeInterpreter.ListContexts(ctx)
```

## Desktop Automation

Start/stop desktop and get status:
```go
cu := sandbox.ComputerUse
cu.Start(ctx)
status, err := cu.GetStatus(ctx)
defer cu.Stop(ctx)
```

Screenshots (full screen or region with optional cursor):
```go
screenshot, err := cu.Screenshot().TakeFullScreen(ctx, nil)
screenshot, err := cu.Screenshot().TakeFullScreen(ctx, &showCursor)
screenshot, err := cu.Screenshot().TakeRegion(ctx, types.ScreenshotRegion{X: 50, Y: 50, Width: 200, Height: 100}, nil)
```

Mouse: `Move()`, `Click()` (left/right/double), `Drag()`, `Scroll()`, `GetPosition()`.

Keyboard: `Type()` (with optional delay), `Press()` (key with modifiers), `Hotkey()` (e.g., "ctrl+c", "alt+tab").

Recording: `Start()`, `Stop()`, `List()`, `Get()`, `Download()`, `Delete()`.

Display: `GetInfo()`, `GetWindows()`.

## Language Server Protocol (LSP)

```go
lsp := sandbox.Lsp(types.LspLanguageIDPython, "/home/user/project")
lsp.Start(ctx)
lsp.DidOpen(ctx, "/home/user/project/main.py")
completions, err := lsp.Completions(ctx, "/home/user/project/main.py", types.Position{Line: 10, Character: 5})
symbols, err := lsp.DocumentSymbols(ctx, "/home/user/project/main.py")
symbols, err := lsp.SandboxSymbols(ctx, "MyClass")
lsp.DidClose(ctx, "/home/user/project/main.py")
defer lsp.Stop(ctx)
```

## Snapshots (Image Templates)

Create from Docker image with optional logs:
```go
snapshot, logChan, err := client.Snapshot.Create(ctx, &types.CreateSnapshotParams{
    Name: "my-python-env",
    Image: "python:3.11-slim",
})
for log := range logChan { fmt.Println(log) }
```

Create with fluent DockerImage builder:
```go
image := daytona.Base("python:3.11-slim").
    AptGet([]string{"git", "curl"}).
    PipInstall([]string{"numpy", "pandas"},
        options.WithIndexURL("https://download.pytorch.org/whl/cpu"),
        options.WithExtraOptions("--no-cache-dir"),
    ).
    AddLocalFile("./requirements.txt", "/app/requirements.txt").
    AddLocalDir("./src", "/app/src").
    Workdir("/app").
    Env("PYTHONUNBUFFERED", "1").
    Run("pip install -r /app/requirements.txt").
    Expose([]int{8080, 8443}).
    Label("maintainer", "team@example.com").
    User("appuser").
    Volume([]string{"/data", "/logs"}).
    Entrypoint([]string{"python", "-m", "myapp"}).
    Cmd([]string{"--help"})
```

Convenience builders: `daytona.DebianSlim(nil)` (Python 3.12), `daytona.DebianSlim(&"3.10")`, `daytona.FromDockerfile(dockerfile)`. Generate Dockerfile: `image.Dockerfile()`. Manage: `Get()`, `List()`, `Delete()`.

## Persistent Volumes

```go
volume, err := client.Volume.Create(ctx, "my-data-volume")
volume, err = client.Volume.WaitForReady(ctx, volume, 60*time.Second)
volume, err := client.Volume.Get(ctx, "my-data-volume")
volumes, err := client.Volume.List(ctx)
client.Volume.Delete(ctx, volume)
```

## Error Handling

Specialized error types: `DaytonaError` (base with message, status code, headers), `DaytonaNotFoundError` (404), `DaytonaRateLimitError` (429), `DaytonaTimeoutError`. Conversion functions: `ConvertAPIError()`, `ConvertToolboxError()`.

## Functional Options Pattern

Options passed as variadic arguments configure operations. Generic `Apply()` creates options struct with all provided functions applied. Examples: `WithBranch()`, `WithCommitId()`, `WithUsername()`, `WithPassword()`, `WithCwd()`, `WithCommandEnv()`, `WithExecuteTimeout()`, `WithCustomContext()`, `WithEnv()`, `WithCreatePtySize()`, `WithCreatePtyEnv()`, `WithMode()`, `WithPermissionMode()`, `WithOwner()`, `WithGroup()`, `WithTimeout()`, `WithWaitForStart()`, `WithLogChannel()`, `WithIndexURL()`, `WithExtraIndexURLs()`, `WithFindLinks()`, `WithPre()`, `WithExtraOptions()`, `WithAllowEmpty()`, `WithForce()`.

## Types

Configuration: `DaytonaConfig`. Sandbox creation: `SandboxBaseParams`, `ImageParams`, `SnapshotParams`. Snapshots: `CreateSnapshotParams`, `Snapshot`, `PaginatedSnapshots`. Code execution: `CodeRunParams`, `ExecuteResponse`, `ExecutionResult`, `ExecutionError`, `ExecutionArtifacts`, `Chart`, `ChartType`. Files: `FileUpload`, `FileDownloadRequest`, `FileDownloadResponse`, `FileInfo`. PTY: `PtySessionInfo`, `PtySize`, `PtyResult`. Git: `GitStatus`, `GitCommitResponse`, `FileStatus`. Volumes: `Volume`, `VolumeMount`. Resources: `Resources`. Screenshots: `ScreenshotOptions`, `ScreenshotRegion`, `ScreenshotResponse`. Languages: `CodeLanguage`, `LspLanguageID`. Utilities: `Position`, `OutputMessage`.

SDK version: `daytona.Version`.

### guides
Complete implementations for building autonomous AI agents and coding systems in Daytona sandboxes using various frameworks (Claude SDK, DSPy RLMs, AgentKit, Codex, Google ADK, LangChain, Letta, Mastra, OpenClaw, OpenCode, TRL/GRPO) with real-time execution, preview links, and iterative refinement.

## Comprehensive Guide to Building AI Agents in Daytona Sandboxes

This directory contains complete implementations and tutorials for building autonomous coding agents and AI-powered applications using Daytona's isolated sandbox environments.

### Claude Agent SDK Integration

**Two-Agent System**: Project Manager Agent (local, Claude Sonnet 4) plans tasks and delegates via `<developer_task>` XML tags to Developer Agent (in Daytona sandbox, Claude Agent SDK). Developer executes and streams results back. Setup: clone repo, set `DAYTONA_API_KEY` and `ANTHROPIC_API_KEY`, Node.js 18+, `npm install && npm run start`. Architecture uses Anthropic SDK locally with `claude-sonnet-4-20250514`, Claude Agent SDK in sandbox, communication via XML tags. Developer can host web apps with preview links. Example: "make a lunar lander web app" → Project Manager delegates → Developer creates HTML/CSS/JavaScript game with physics, gravity, thrust, keyboard controls, landing detection, fuel management → hosted on port 80 with preview URL.

**Single Agent System**: Autonomous agent using Claude Agent SDK inside Daytona sandbox. Main Node.js program creates sandbox and initializes Python agent. Sandbox agent uses Claude Agent SDK with tools: Read, Edit, Glob, Grep, Bash. System prompt includes workspace directory (`/home/daytona`) and preview URL format. User interaction: CLI prompt → passed to agent via `coding_agent.run_query_sync()` → agent executes → output streamed back. Example: "Build a Zelda-like game where I can move around and talk to famous programmers" → Agent creates top-down 2D game with grid-based movement, 5 NPC programmers, arrow keys/WASD controls, SPACE to talk → hosted with preview link.

**Running Claude Code via CLI**: Install Daytona CLI (`brew install daytonaio/cli/daytona`), authenticate (`daytona login --api-key=YOUR_API_KEY`), create sandbox (`daytona sandbox create --name claude-sandbox`), SSH in (`daytona ssh claude-sandbox`), run Claude (`claude` → browser auth → paste code back).

**Running Claude Code Programmatically**: Execute Claude Code tasks with real-time PTY-based output streaming. Python (AsyncDaytona recommended): create sandbox, install Claude Code globally, create PTY session with `on_data` callback, send command with `ANTHROPIC_API_KEY` env var, wait for completion. TypeScript: similar pattern using `Daytona` SDK, `createPty()`, `sendInput()`, `onData` callback. PTY sessions enable real-time streaming; pass API key via environment variable in command; call `sandbox.delete()` for cleanup.

### Python RLM Guides

**DSPy RLMs with DaytonaInterpreter**: Run DSPy's recursive language models (RLMs) with code execution in isolated Daytona sandboxes. RLM execution is iterative REPL loop: LLM sends task inputs → LLM responds with Python code → code runs in Daytona sandbox with `llm_query()` calls bridged back to host → repeat until `SUBMIT()` called. Setup: clone repo, create venv, `pip install -e .`, set `DAYTONA_API_KEY` and `OPENROUTER_API_KEY` in `.env`. Basic usage: configure LM with DSPy, create DaytonaInterpreter, define RLM with signature, call with inputs, shutdown interpreter. Bridging mechanism: DaytonaInterpreter launches Flask broker server inside sandbox, injects wrapper functions. Wrappers POST requests to broker and block until results arrive. Host polling loop picks up pending requests, executes them (calls LLM API or runs tool functions), posts results back. Built-in functions in sandbox: `llm_query(prompt)` — send single prompt to LLM, get string back; `llm_query_batched(prompts)` — send multiple prompts concurrently, get list of strings back. State persists across iterations: variables, imports, function definitions carry over. Example: `demo.py` analyzes _The Count of Monte Cristo_ (117 chapters) tracking wealth trajectories of five characters. RLM batches chapters, fans out with `llm_query_batched()` sending prompts like "Extract wealth events from these chapters as JSON", parses JSON, accumulates results, iterates for next batch, calls `SUBMIT()` when done. Plots results as smoothed time series.

**Recursive Language Models (RLM) with Daytona Sandboxes**: Build agent systems where agents spawn sub-agents in isolated sandboxes, enabling unlimited recursion depth and parallel exploration. Agents run in iteration loop: LLM call → extract Python code → execute in REPL. Code can call `rlm_query()` to spawn sub-agents, each with own sandbox and fresh repository clone. Results propagate back up tree. Setup: clone repo, create venv, `pip install -e .`, set `DAYTONA_API_KEY` and `LLM_API_KEY` in `.env`. Running: `python run.py <repo_url> -p "<task_prompt>" [-b branch] [--commit sha] [-c config.yaml] [-o output.patch]`. Example: `python run.py https://github.com/scikit-learn/scikit-learn -p "Investigate TODO comments..."`. Agent execution loop: each iteration builds prompt with context from previous execution, gets LLM completion, extracts and executes Python code blocks in REPL, checks if agent called `FINAL()` to submit results, formats output for next iteration. Sub-agent spawning: single sub-agent with `rlm_query(task)`, parallel spawning with `rlm_query_batched([tasks])`. Agent code interface (available in REPL): `rlm_query(task)` — spawn single sub-agent, returns result string; `rlm_query_batched(tasks)` — spawn multiple sub-agents in parallel; `FINAL(answer)` — submit final result (root: triggers patch extraction); `FINAL_VAR(var_name)` — submit variable value as result; `edit_file(path, old, new)` — edit file with syntax validation. Example: scikit-learn TODO investigation. Root agent spawns 25 depth-1 sub-agents to explore different sklearn modules in parallel. Some depth-1 agents spawn depth-2 sub-agents for large modules. Results propagate back up. Root agent synthesizes findings, identifies easiest TODO, fixes it. Generated patch example shows completion of `__all__` list. Execution: 40 agents total (25 depth-1, 15 depth-2), completed in 316 seconds. Configuration (`config.yaml`): model name, max_sandboxes, max_iterations, global_timeout, result_truncation_limit. Sandbox budget tracks total sandboxes created over lifetime; sub-agent sandboxes deleted immediately after completion. Viewing results: results saved to `results/` as JSON. View with `python -m http.server 8000` and open `http://localhost:8000/viewer/`. Viewer shows interactive agent hierarchy tree, iteration details with code/output, statistics (agent count, max depth, total iterations).

### AgentKit Integration

Build autonomous coding agent using AgentKit framework that performs software development tasks in Daytona sandbox. Agent can create web apps, run tests, execute scripts, automate multi-step workflows based on natural language prompts. Workflow: user provides natural language prompt → agent reasons about request, plans steps, executes them securely in Daytona sandbox. Setup: clone repo, get API keys from Daytona Dashboard and Anthropic Console, copy `.env.example` to `.env` with `DAYTONA_API_KEY` and `ANTHROPIC_API_KEY`. Local usage (Node.js 18+): `npm install && npm run start`. Docker: `docker buildx build . -t coding-agent && docker run --rm -it coding-agent`. Configuration: edit main prompt in `network.run(...)` in `src/index.ts` to change agent's task; set `enableDebugLogs=true` for detailed agent flow tracking. Example usage: default prompt creates React Notes app. Terminal output shows app ready with preview URL. Agent execution flow: uses LLM with access to specialized tools for Daytona sandbox operations. Project initialization with `shellTool` runs `npm create vite@latest notes -- --template react`. Install dependencies with `shellTool` runs `cd notes && npm install`. Create components with `uploadFilesTool` uploads App.jsx and App.css. Start dev server with `startDevServerTool` runs `cd notes && npm run dev`. Health check with `checkDevServerHealthTool` verifies dev server is running. Summary: agent outputs `DEV_SERVER_PORT=5173` and `TASK_COMPLETED` signal. `DEV_SERVER_PORT` is auto-detected and used to generate preview link. `TASK_COMPLETED` signals task completion for agent routing logic. Key advantages: secure isolated execution in Daytona sandboxes, multi-language support, auto-detects dev server, starts it, generates preview link, detailed debug logs for agent actions.

### OpenAI Codex SDK Integration

Build autonomous coding agent using OpenAI Codex inside Daytona sandbox. Agent can develop full-stack web apps, write code in any language, install dependencies, run scripts, start dev servers, generate preview links. Workflow: user interacts via CLI → main program sends prompts to agent in sandbox → agent executes and returns results. Agent automatically detects when to host web apps and generates preview links using Daytona Preview Links feature. Example workflow: create 3D animated lunar lander game → agent creates HTML/CSS/JavaScript with physics → hosted on port 8080 with preview link. Setup: clone repo, get API keys from Daytona Dashboard and OpenAI Developer Platform, copy `.env.example` to `.env` with `DAYTONA_API_KEY` and `SANDBOX_OPENAI_API_KEY`. ⚠️ `SANDBOX_OPENAI_API_KEY` is passed into sandbox and accessible to all code executed inside. Requires Node.js 18+. Install and run: `npm install && npm run start`. Architecture: two components. Main program (`src/index.ts`): Node.js script on local machine using Daytona SDK to create/manage sandbox and provide CLI. Sandbox agent (`agent/index.ts`): Node.js script inside sandbox using Codex SDK. Initialization: main program creates Daytona sandbox with OpenAI API key in environment, configures Codex system prompt via `.codex/config.toml` in sandbox, uploads agent package to sandbox, runs `npm install` in agent directory, waits for user input and runs agent asynchronously per prompt. System prompt configuration: set developer instructions with `/home/daytona` directory and preview URL pattern. User input loop with async agent execution: create session, execute OpenCode command with `PROMPT` env var, get session command logs with callbacks, delete session. Sandbox agent code: initialize Codex with custom options (workingDirectory: `/home/daytona`, skipGitRepoCheck: true, sandboxMode: `danger-full-access`). Maintain thread state across requests: read thread ID from file, resume existing thread or start new one. Key advantages: secure isolated execution in Daytona sandboxes, direct terminal communication with agent, automatic dev server detection and live preview links, multi-language and full-stack support, thread persistence across multiple requests, simple setup with automatic cleanup.

### AI Data Analysis with Agentic Loop

Run AI-generated code in Daytona Sandbox to analyze data: user provides dataset (CSV or other formats) → LLM generates code (usually Python) based on user's data → sandbox executes the code and returns results → LLM receives feedback and iterates to refine code if needed → display final results to user. Example: analyze vehicle valuation dataset, identify price relation to manufacturing year, generate visualizations using Claude and Daytona's secure sandbox with agentic loop for iterative refinement. Setup: `pip install daytona anthropic python-dotenv` (Python) or `npm install @daytonaio/sdk @anthropic-ai/sdk dotenv` (TypeScript). Configure `.env` with `DAYTONA_API_KEY` and `ANTHROPIC_API_KEY`. Dataset preparation: download vehicle valuation dataset from `https://download.daytona.io/dataset.csv` and save as `dataset.csv`. Create sandbox and upload dataset: `daytona = Daytona(); sandbox = daytona.create(); sandbox.fs.upload_file("dataset.csv", "/home/daytona/dataset.csv")`. Code execution handler: function to execute code and extract charts. Returns ExecutionResult with stdout, exit_code, charts. If execution has artifacts with charts, save PNG files. Analysis prompt: define what Claude should analyze (CSV file location, columns, analysis task, visualization requirements). Tool definition: define tool for Claude to execute Python code with input schema (code: string). Agentic loop: iterative loop allowing Claude to refine code based on execution feedback. Send initial prompt to Claude with tool definition. For each iteration (max 10): Claude generates response with optional tool calls. If tool calls exist, execute Python code in sandbox. Send execution results back to Claude (errors or success). Claude refines code based on feedback. Loop ends when Claude signals no more tool calls or max iterations reached. Loop workflow: send initial prompt to Claude with tool definition. For each iteration (max 10): Claude generates response with optional tool calls. If tool calls exist, execute Python code in sandbox. Send execution results back to Claude (errors or success). Claude refines code based on feedback. Loop ends when Claude signals no more tool calls or max iterations reached. Advantages: secure execution in isolated sandboxes, automatic artifact capture (charts, tables, outputs), built-in error detection and logging, language agnostic (Python used here, but Daytona supports multiple languages). Running the analysis: `python data-analysis.py` (Python) or `npx tsx data-analysis.ts` (TypeScript). Generates chart saved to `chart-0.png` showing vehicle valuation by manufacturing year.

### Google ADK Code Generator Agent

Build code generator agent using Google ADK that generates, tests, and verifies code in Daytona sandboxes. Agent takes natural language descriptions, generates implementations in Python/JavaScript/TypeScript, creates and executes tests, iterates on failures, returns verified working code. Setup: clone repo, `pip install -U google-adk daytona-adk python-dotenv`, configure `.env` with `DAYTONA_API_KEY` and `GOOGLE_API_KEY`. Core components: Google ADK provides Agent (AI model wrapper), App (container bundling agents with plugins), InMemoryRunner (execution engine). DaytonaPlugin provides tools to execute code (Python/JavaScript/TypeScript), run shell commands, upload/read files, start background processes in isolated sandboxes. Implementation: load environment, extract final response from ADK events, define agent instruction enforcing test-driven workflow (write function → write tests → execute code in sandbox to verify → if execution fails, fix and re-execute until tests pass → once verified, respond with only the function), configure plugin with labels, create agent with Gemini model and instruction, bundle and run with InMemoryRunner. Execution flow: with logging.DEBUG enabled, see sandbox creation, plugin registration, code generation, execution, iteration (if tests fail, agent fixes and re-executes), response (once tests pass, agent returns verified code), cleanup (sandbox automatically deleted when context exits). Output control: by default, agent returns only the working function. To include tests in response, add to prompt. Complete example provided with all setup and execution code. Run with `python main.py`. API reference: see daytona-adk documentation for complete API reference of available tools and configuration options.

### LangChain Data Analysis Integration

`DaytonaDataAnalysisTool` is a LangChain tool integration enabling agents to perform secure Python data analysis in sandboxed environments. Agents receive natural language prompts, reason about the task, generate Python code, execute it securely in Daytona sandbox, process results. Setup: `pip install -U langchain langchain-anthropic langchain-daytona-data-analysis python-dotenv`. Requires Python 3.10+. Environment configuration: `DAYTONA_API_KEY` and `ANTHROPIC_API_KEY`. Initialize model: `ChatAnthropic(model_name="claude-sonnet-4-5-20250929", temperature=0, timeout=None, max_retries=2)`. Define result handler: function to process ExecutionArtifacts, print stdout, save PNG charts to files. Initialize tool and upload data: `DaytonaDataAnalysisTool(on_result=process_data_analysis_result)`, upload file with description explaining CSV structure and analysis requirements. Create and run agent: `create_agent(model, tools=[DataAnalysisTool], debug=True)`, invoke with natural language request, close tool when finished. Execution flow: agent receives natural language request → agent determines need for DaytonaDataAnalysisTool → agent generates Python code for analysis → code executes securely in Daytona sandbox → results processed by handler function → charts saved to local directory → sandbox resources cleaned up. Agent typically explores dataset first (shape, columns, data types), then generates detailed analysis code with data cleaning, outlier removal, calculations, visualizations. API reference: `upload_file(file: IO, description: str)` uploads file to sandbox at `/home/daytona/`, description explains file purpose and data structure; `download_file(remote_path: str)` downloads file from sandbox by remote path; `remove_uploaded_file(uploaded_file: SandboxUploadedFile)` removes previously uploaded file from sandbox; `get_sandbox()` returns current sandbox instance for inspecting properties and metadata; `install_python_packages(package_names: str | list[str])` installs Python packages in sandbox using pip; `close()` closes and deletes sandbox environment. Data structures: SandboxUploadedFile (name, remote_path, description), Sandbox (represents Daytona sandbox instance). Example: vehicle price analysis analyzing vehicle valuations dataset with complete working example code.

### Letta Code Integration

Run autonomous coding agent based on Letta Code inside Daytona sandbox. Agent develops web apps, writes code in any language, installs dependencies, runs scripts. Letta Code uses stateful agents with persistent memory across sessions. Workflow: launch main script to create Daytona sandbox and install Letta Code → agent configured with custom Daytona-aware system prompt → interactive CLI interface for chatting with agent and issuing commands → agent hosts web apps and provides preview links via Daytona Preview Links feature → sandbox automatically deleted on exit. Example interaction: create markdown editor with live preview → agent creates app, hosts on port 8080, provides preview link. Setup: clone repo, get API keys from Daytona Dashboard and Letta Platform, create `.env` with `DAYTONA_API_KEY` and `SANDBOX_LETTA_API_KEY`. Install and run (Node.js 18+): `npm install && npm run start`. Security note: Letta API key is passed into sandbox environment and may be accessible to code executed within it. Architecture: two main TypeScript files. index.ts: creates sandbox, installs Letta Code, configures system prompt, provides interactive CLI. letta-session.ts: manages PTY-based bidirectional communication with Letta Code, handles JSON message streaming and response parsing. Initialization process: create Daytona sandbox with Letta API key in environment variables, install Letta Code globally via process execution, create PTY session for bidirectional communication, launch Letta Code in bidirectional headless mode with stream-json format. Flags: `--system-custom` pass custom system prompt with Daytona-specific instructions and URL pattern for preview links; `--input-format stream-json --output-format stream-json` enable JSON message streaming for real-time communication; `--yolo` allow agent to run shell commands without explicit approval. Message handling: send prompts via `processPrompt()` method, which formats user input as JSON and sends through PTY. User message format: `{"type": "user", "message": {"role": "user", "content": "create a simple web server"}}`. Agent responds with streaming JSON messages. Tool calls arrive as fragments. `handleParsedMessage()` method parses JSON fragments, combines consecutive fragments for same tool call, formats and displays results. Key advantages: secure isolated execution in Daytona sandboxes, stateful agents with persistent memory across sessions, full Letta Code capabilities (file operations, shell commands), agents viewable in Letta's Agent Development Environment, automatic preview link generation for hosted services, multi-language and full-stack support, automatic cleanup on exit.

### Mastra Coding Agent Integration

Integrate Mastra coding agent with Daytona sandboxes to execute AI-powered coding tasks in secure, isolated environments. Use Mastra Studio for ChatGPT-like interface with human-in-the-loop workflows. Requirements: Node.js 20+, OpenAI API key (or other LLM provider), Daytona API key from Daytona Dashboard. Setup: clone template repo, create `.env` file with `OPENAI_API_KEY`, `MODEL=openai/gpt-4o-mini`, `DAYTONA_API_KEY`. Install dependencies: `pnpm install`. Running the agent: `pnpm run dev`, access Mastra Studio at `http://localhost:4111`. Interface provides: conversation history organized in threads, visual debugging of agent execution steps and tool calls, model switching between different AI providers, real-time tool inspection. Tool calls and execution: agent uses several tools to interact with Daytona sandboxes. `createSandbox`: provisions new sandbox with name, language, labels, envVars. Returns sandboxId. `writeFiles`: create multiple files in sandbox with path and data. Returns success and list of file paths. `runCommand`: execute commands in sandbox with command, envs, workingDirectory, timeoutSeconds, captureOutput. Returns success, exitCode, stdout, command, executionTime. Terminal logging: tool calls and results logged with full visibility including arguments, results, token usage with caching metrics, unique identifiers for debugging. Sandbox management: active sandboxes appear in Daytona Dashboard. Clean up resources when finished unless sandbox needs to remain active for preview URLs or ongoing development. Key advantages: secure isolation (all operations run in isolated Daytona sandboxes), multi-language support (execute code across different programming languages), enhanced debugging (visualize and debug agent workflows in Mastra Studio), scalable execution (leverage Daytona's cloud infrastructure).

### OpenClaw in Daytona Sandbox

Running OpenClaw in Daytona sandbox provides isolation, security, 24/7 uptime without consuming local machine resources. Prerequisites: Daytona account and API key from Daytona Dashboard, local terminal (macOS, Linux, or Windows). Install CLI and authenticate: install Daytona CLI (`brew install daytonaio/cli/daytona` for Mac/Linux, PowerShell script for Windows), verify version is 0.135.0 or higher (`daytona --version`), authenticate (`daytona login --api-key=YOUR_API_KEY`). Create and connect to sandbox: create sandbox with OpenClaw preinstalled (`daytona sandbox create --name openclaw --snapshot daytona-medium --auto-stop 0`). `daytona-medium` snapshot is required (minimum 2GB memory for OpenClaw gateway). `--auto-stop 0` flag keeps sandbox running indefinitely. SSH into sandbox (`daytona ssh openclaw`). Onboard OpenClaw: start onboarding (`openclaw onboard`), follow prompts: accept security acknowledgment, select Quickstart mode, select Anthropic as model provider, select Anthropic API key auth method, paste Anthropic API key, keep default model (`anthropic/claude-opus-4-5`), skip channel configuration (configure later), skip skills configuration, skip hooks configuration, skip gateway service installation (already installed). Onboarding output displays dashboard link with gateway token in URL (after `?token=`). Save this token for dashboard authentication. Start gateway and access dashboard: start gateway in background (`nohup openclaw gateway run > /tmp/gateway.log 2>&1 &`), generate preview URL from local terminal (not SSH session) (`daytona preview-url openclaw --port 18789`). Creates signed preview URL that expires after 1 hour (customizable with `--expires` flag). Open URL in browser, go to Overview, paste gateway token in Gateway Token field, click Connect. Device pairing: OpenClaw requires device approval for security. List pending requests (`openclaw devices list`), approve device (`openclaw devices approve REQUEST_ID`). Click Connect again in dashboard. Green status indicator confirms OpenClaw is ready. Security layers: preview URL (time-limited access to dashboard port), gateway token (required for dashboard authentication), device approval (only approved devices can control assistant). Keep gateway token and preview URL secret. Configure Telegram: create bot via @BotFather in Telegram (send `/start`, then `/newbot`, enter bot name and username, copy bot token). Configure OpenClaw: `openclaw config set channels.telegram.enabled true`, `openclaw config set channels.telegram.botToken YOUR_BOT_TOKEN`, `openclaw config get channels.telegram`. Restart gateway: `openclaw gateway stop`, `nohup openclaw gateway run > /tmp/gateway.log 2>&1 &`. Complete verification in Telegram: open bot chat and click Start, copy pairing code and approve (`openclaw pairing approve telegram PAIRING_CODE`). Configure WhatsApp: run configuration (`openclaw config --section channels`). When prompted: select Local (this machine) for gateway location, choose Configure/link, select WhatsApp (QR link), select Yes for "Link WhatsApp now (QR)?". Scan QR code in WhatsApp: Settings → Linked Devices → Link a Device. Select This is my personal phone number and enter phone number when prompted. When prompted for another channel, choose Finished. Start chatting: send message to yourself in WhatsApp and OpenClaw responds. To allow other users, add their phone numbers to Allow From list in Channels → WhatsApp in dashboard.

### OpenCode Web Agent Integration

Run OpenCode coding agent inside Daytona sandbox using web interface. Agent can develop web apps, write code in any language, install dependencies, run scripts, supports 75+ LLM providers with live preview links. Workflow: launch main script to create Daytona sandbox with OpenCode installed → access web interface via preview link → create and interact with agent sessions → agent automatically generates preview links for hosted web apps → press Ctrl+C to delete sandbox automatically. Setup: clone repo, get API key from Daytona Dashboard, create `.env` with `DAYTONA_API_KEY`. Requires Node.js 18+. Install and run: `npm install && npm run start`. Models and API providers: OpenCode supports 75+ LLM providers with free default. Change providers in web interface menu. To persist API keys between runs, add them to sandbox environment: `sandbox = await daytona.create({ envVars: { ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY || '', } })`. Script implementation: initialization steps: create new Daytona sandbox, install OpenCode globally via npm using process execution, upload custom agent configuration with Daytona-specific system prompt, start OpenCode web server on port 3000, replace localhost URL with Daytona preview link. Main script code: execute OpenCode as async command (`sandbox.process.executeSessionCommand(sessionId, { command: `${envVar} opencode web --port ${OPENCODE_PORT}`, runAsync: true })`). Parse OpenCode's output and replace localhost with preview link. Agent configuration: custom system prompt passed as JSON via `OPENCODE_CONFIG_CONTENT` environment variable. Prompt includes Daytona sandbox awareness, `/home/daytona` directory usage, preview URL pattern, instructions to start servers in background with `&`. Cleanup: automatic sandbox deletion on Ctrl+C. Key advantages: secure isolated execution in Daytona sandboxes, OpenCode Web interface accessible via browser, support for 75+ LLM providers, all agent code execution happens inside sandbox, automatic preview link generation for deployed services, custom agent configuration for Daytona-specific workflows, clean resource management with automatic sandbox cleanup.

### Reinforcement Learning Training with TRL and GRPO

Train code-generating LLMs using TRL's GRPOTrainer with parallel Daytona sandboxes for safe, concurrent code evaluation. Workflow with 500 parallel sandboxes: generate many code completions per prompt (e.g., 250 per prompt per step) → evaluate each completion in its own sandbox against test suite → compute rewards (0-1 for test pass rate, -1 for errors/banned patterns) → GRPO reinforces completions scoring above group average. Sandboxes spawned once at start, reused throughout training, cleaned up after completion. Setup: Python 3.10+, 80GB+ VRAM GPU (adjustable via `per_device_train_batch_size`). Clone repo, create venv, `pip install -e .`. Create `.env` file with Daytona API key from dashboard. Task definition: tasks define prompts with test cases and validation rules. Each task includes: prompt (code context model continues from, completion mode not QA), func_name (function name being implemented), banned_patterns (patterns disqualifying completion, prevents cheating with built-ins), tests (test inputs for verification), reference (reference implementation for comparison). Completion processing: sanitization extracts only indented lines forming function body from model output. Model output with extra content (comments, examples) gets trimmed to just function body. Banned pattern detection checks before sandbox execution. Banned patterns trigger -1.0 reward without execution. Test harness assembly: `build_test_harness` combines prompt, completion, and test runner into executable Python. Assembled code executes in sandbox and prints JSON results: `{"results": [true, true, false, true, true]}`. Sandbox pool management: create and reuse pool throughout training. Pool size (500) matches effective batch size to ensure all completions evaluate in parallel. Code evaluation: main evaluation function ties everything together. Sanitize completion, check for banned patterns, build test harness, execute in sandbox with timeout, parse JSON results from stdout, compute reward (0-1 for test pass rate, -1 for errors). Parallel batch evaluation: distribute completions across sandbox pool with round-robin. Reward function: compute scalar rewards from sandbox evaluation results. Reward scheme: -1.0 (error, timeout, or banned pattern), 0.0 (no tests present), 0.0 to 1.0 (fraction of tests passed). Sync/async bridging: TRL's GRPOTrainer expects synchronous reward function; Daytona SDK uses async. Bridge with event loop. Training configuration: GRPOConfig with per_device_train_batch_size, gradient_accumulation_steps, num_generations, max_prompt_length, max_completion_length, learning_rate, num_train_epochs, logging_steps, max_steps, bf16, use_vllm, vllm_mode, vllm_gpu_memory_utilization, gradient_checkpointing, loss_type, beta. Key alignment: `per_device_train_batch_size (20) × gradient_accumulation_steps (25) = 500` equals `EFFECTIVE_BATCH_SIZE` for perfect parallelism. vLLM colocate mode: runs inference on same GPU as training, using 15% GPU memory for generation, rest for training. Running training: `python train.py`. Output shows sandbox creation and parallel evaluation progress. After completion, metrics saved to `training_results/metrics.jsonl` and model to `training_results/checkpoint-8`. Example evaluation walkthrough: model generates completion with function body → sanitize_completion extracts indented lines only → has_banned_pattern checks for disqualifying patterns → build_test_harness assembles full executable script → sandbox.code_interpreter.run_code executes in sandbox with timeout → parse JSON results from stdout: `{"results": [true, true, true, true, true]}` → compute reward: `5 / 5 = 1.0` (all tests passed). Adding custom tasks: extend TASKS dictionary with new task definition (prompt, func_name, banned_patterns, tests, reference). Reference function must be defined in test harness. Configuration parameters: EFFECTIVE_BATCH_SIZE (500, parallel sandboxes count), MAX_TIMEOUT_SECONDS (1, timeout per code execution), MODEL_NAME (Qwen/Qwen3-1.7B-Base, base model to train). Scaling tips: keep `per_device_train_batch_size * gradient_accumulation_steps = EFFECTIVE_BATCH_SIZE` for optimal parallelism, increase MAX_TIMEOUT_SECONDS for complex algorithmic tasks, reduce per_device_train_batch_size for GPUs with less VRAM, increase gradient_accumulation_steps proportionally. Results: training achieves near-perfect performance after 8 steps with 500-completion batch size, showing rapid improvement from initial random completions to correct implementations.

### python_sdk
Complete Python SDK (sync & async) for Daytona sandbox management: lifecycle, file/git/process/code ops, desktop automation, LSP, snapshots, volumes, image builder, chart models.

## Overview
Complete Python SDK for Daytona sandbox management with both sync and async APIs. Covers sandbox lifecycle, file operations, git, process execution, code interpretation, desktop automation, LSP, snapshots, and volumes.

## Installation & Setup
```bash
pip install daytona
```

Configure via env vars (`DAYTONA_API_KEY`, `DAYTONA_API_URL`, `DAYTONA_TARGET`) or `DaytonaConfig` object.

```python
from daytona import Daytona, AsyncDaytona, DaytonaConfig

# Sync
daytona = Daytona()
config = DaytonaConfig(api_key="key", api_url="https://app.daytona.io/api", target="us")
daytona = Daytona(config)

# Async
async with AsyncDaytona(config) as daytona:
    pass
```

## Sandbox Lifecycle
Create from snapshot (default) or Docker image with resources, env vars, auto-stop/archive/delete intervals, labels, volumes.

```python
sandbox = daytona.create(CreateSandboxFromImageParams(
    image="debian:12.9",
    env_vars={"DEBUG": "true"},
    resources=Resources(cpu=2, memory=4),
    auto_stop_interval=15
))
await daytona.start(sandbox)
await sandbox.set_autostop_interval(60)
await sandbox.resize(Resources(cpu=4, memory=8))
await daytona.stop(sandbox)
await daytona.delete(sandbox)
```

Get/list/find sandboxes, recover deleted ones. Sandbox provides interfaces: `fs`, `git`, `process`, `computer_use`, `code_interpreter`.

## File System
Create/delete folders, upload/download files (streaming for large files), list/search files, move/rename, set permissions, replace text across files.

```python
await sandbox.fs.create_folder("workspace/data", "755")
await sandbox.fs.upload_file(b"content", "tmp/file.txt")
await sandbox.fs.upload_file("local.txt", "tmp/large.txt")  # streaming
content = await sandbox.fs.download_file("tmp/file.txt")
await sandbox.fs.download_file("tmp/large.txt", "local.txt")  # streaming
files = await sandbox.fs.list_files("workspace")
matches = await sandbox.fs.find_files("workspace/src", "TODO:")  # grep
results = await sandbox.fs.search_files("workspace", "*.py")  # glob
await sandbox.fs.replace_in_files(["file1.py", "file2.py"], "old", "new")
await sandbox.fs.move_files("old_name.txt", "new_name.txt")
await sandbox.fs.set_file_permissions("script.sh", mode="755", owner="user")
```

## Git
Clone (with branch/commit/auth), add, commit, push, pull, status, branch management.

```python
await sandbox.git.clone("https://github.com/user/repo.git", "workspace/repo", branch="develop")
await sandbox.git.clone("https://github.com/user/private.git", "workspace/private", username="user", password="token")
await sandbox.git.add("workspace/repo", ["file.txt"])
await sandbox.git.commit("workspace/repo", "Update docs", author="John", email="john@example.com")
await sandbox.git.push("workspace/repo", username="user", password="token")
await sandbox.git.pull("workspace/repo")
status = await sandbox.git.status("workspace/repo")  # current_branch, ahead, behind, branch_published
branches = await sandbox.git.branches("workspace/repo")
await sandbox.git.create_branch("workspace/repo", "feature")
await sandbox.git.checkout_branch("workspace/repo", "feature")
await sandbox.git.delete_branch("workspace/repo", "old-feature")
```

## Process Execution
Execute shell commands and language-specific code with automatic matplotlib chart detection.

```python
# Shell commands
response = await sandbox.process.exec("ls", cwd="workspace/src", timeout=10)
print(response.artifacts.stdout)

# Code execution with chart detection
response = await sandbox.process.code_run("print(sum([1,2,3]))")
for chart in response.artifacts.charts:
    print(f"{chart.type}: {chart.title}")

# Background sessions (maintain state)
await sandbox.process.create_session("my-session")
await sandbox.process.execute_session_command("my-session", SessionExecuteRequest(command="cd /workspace"))
result = await sandbox.process.execute_session_command("my-session", SessionExecuteRequest(command="cat file.txt"))
print(result.stdout, result.stderr, result.exit_code)
logs = await sandbox.process.get_session_command_logs("my-session", "cmd-id")
await sandbox.process.get_session_command_logs_async("my-session", "cmd-id", 
    lambda log: print(f"[OUT]: {log}"), lambda log: print(f"[ERR]: {log}"))
await sandbox.process.delete_session("my-session")

# Interactive PTY sessions
pty = await sandbox.process.create_pty_session("term", on_data=lambda data: print(data.decode()), cwd="/workspace")
await pty.write(b"ls\n")
await pty.resize(PtySize(rows=40, cols=150))
await pty.close()
info = await sandbox.process.get_pty_session_info("term")
await sandbox.process.kill_pty_session("term")
```

## Code Interpreter
Stateful Python execution with isolated contexts, output streaming, configurable timeout (default 10min, 0=no timeout).

```python
result = await sandbox.code_interpreter.run_code(
    "x = 100",
    on_stdout=lambda msg: print(f"OUT: {msg.output}"),
    on_stderr=lambda msg: print(f"ERR: {msg.output}"),
    on_error=lambda err: print(f"ERROR: {err.name}: {err.value}"),
    timeout=10
)

# Isolated contexts
ctx = await sandbox.code_interpreter.create_context()
await sandbox.code_interpreter.run_code("x = 100", context=ctx)
result = await sandbox.code_interpreter.run_code("print(x)", context=ctx)  # OK
await sandbox.code_interpreter.delete_context(ctx)
contexts = await sandbox.code_interpreter.list_contexts()
```

## Desktop Automation
Mouse (position, click, drag, scroll), keyboard (type, press, hotkey), screenshots (full/region/compressed), display info, window management, screen recording.

```python
await sandbox.computer_use.start()
await sandbox.computer_use.mouse.move(100, 200)
await sandbox.computer_use.mouse.click(100, 200, "left", double=True)
await sandbox.computer_use.mouse.drag(50, 50, 150, 150)
await sandbox.computer_use.mouse.scroll(100, 200, "down", 5)
await sandbox.computer_use.keyboard.type("Hello", delay=100)
await sandbox.computer_use.keyboard.press("Return")
await sandbox.computer_use.keyboard.hotkey("ctrl+c")
screenshot = await sandbox.computer_use.screenshot.take_full_screen(show_cursor=True)
region = ScreenshotRegion(x=100, y=100, width=300, height=200)
screenshot = await sandbox.computer_use.screenshot.take_region(region)
compressed = await sandbox.computer_use.screenshot.take_compressed(ScreenshotOptions(format="jpeg", quality=95))
info = await sandbox.computer_use.display.get_info()
windows = await sandbox.computer_use.display.get_windows()
recording = await sandbox.computer_use.recording.start("test-recording")
await sandbox.computer_use.recording.stop(recording.id)
recordings = await sandbox.computer_use.recording.list()
await sandbox.computer_use.recording.download(recording_id, "local.mp4")
await sandbox.computer_use.stop()
```

## Language Server Protocol
IDE features: code completion, symbol search, diagnostics. Supports Python/TypeScript/JavaScript.

```python
lsp = sandbox.create_lsp_server("python", "workspace/project")
await lsp.start()
await lsp.did_open("src/main.py")
symbols = await lsp.document_symbols("src/main.py")
symbols = await lsp.sandbox_symbols("MyClass")
completions = await lsp.completions("src/main.py", LspCompletionPosition(line=10, character=15))
await lsp.stop()
```

## Snapshots
Pre-configured sandbox templates. List/get/create/delete/activate.

```python
result = await daytona.snapshot.list(page=1, limit=10)
snapshot = await daytona.snapshot.get("snapshot-name")
image = Image.debian_slim('3.12').pip_install('numpy')
snapshot = await daytona.snapshot.create(
    CreateSnapshotParams(name='my-snapshot', image=image, resources=Resources(cpu=2, memory=4)),
    on_logs=lambda chunk: print(chunk, end="")
)
await daytona.snapshot.delete(snapshot)
await daytona.snapshot.activate(snapshot)
```

## Volumes
Shared storage volume management. Mount in sandboxes via `VolumeMount` with optional S3 subpath filtering.

```python
volumes = await daytona.volume.list()
volume = await daytona.volume.get("volume-name", create=True)
volume = await daytona.volume.create("new-volume")
await daytona.volume.delete(volume)
params = CreateSandboxFromSnapshotParams(volumes=[VolumeMount(volume_id="vol-id", mount_path="/data", subpath="prefix")])
```

## Object Storage
Upload files to S3-compatible storage, returns file hash.

```python
hash = await storage.upload("local_file.tar", "org-id", archive_base_path="path")
```

## Image Builder
Chainable builder for sandbox Docker images.

```python
image = Image.base("python:3.12-slim-bookworm")
image = Image.debian_slim("3.12")
image = Image.from_dockerfile("Dockerfile")

image.pip_install("requests", "pandas")
image.pip_install_from_requirements("requirements.txt")
image.pip_install_from_pyproject("pyproject.toml", optional_dependencies=["dev"])
image.add_local_file("package.json", "/home/daytona/package.json")
image.add_local_dir("src", "/home/daytona/src")
image.workdir("/home/daytona")
image.env({"PROJECT_ROOT": "/home/daytona"})
image.run_commands('echo "Hello"', ['bash', '-c', 'echo Hello'])
image.entrypoint(["/bin/bash"])
image.cmd(["/bin/bash"])
image.dockerfile_commands(["RUN echo 'Hello'"], context_dir=None)
dockerfile_str = image.dockerfile()
```

All builder methods return `Image` for chaining. Package installation methods support `find_links`, `index_url`, `extra_index_urls`, `pre`, `extra_options`.

## Chart Classes
Matplotlib chart hierarchy: `Chart` (base with type, title, elements, optional png), `Chart2D` (adds x_label, y_label), `PointChart` (x/y ticks, scales, PointData with label and points), `LineChart`, `ScatterChart`, `BarChart` (BarData with label, group, value), `PieChart` (PieData with label, angle, radius, autopct), `BoxAndWhiskerChart` (BoxAndWhiskerData with quartiles, outliers), `CompositeChart` (nested charts).

`ChartType` enum: `LINE`, `SCATTER`, `BAR`, `PIE`, `BOX_AND_WHISKER`, `COMPOSITE_CHART`, `UNKNOWN`.

## Error Handling
Raises `DaytonaError` (base with message, status_code, headers), `DaytonaNotFoundError`, `DaytonaRateLimitError`, `DaytonaTimeoutError`. Batch file operations don't raise on individual failures—check error field in response.

## Data Models
`Resources` (cpu, memory, disk, gpu - all optional int), `FileInfo` (name, is_dir, size, mode, mod_time, permissions, owner, group), `GitStatus` (current_branch, file_status list, ahead/behind, branch_published), `ExecutionResult` (stdout, stderr, error), `CreateSandboxFromSnapshotParams`, `CreateSandboxFromImageParams`, `Context` (source_path, archive_path).

## Async/Sync
All operations available in both sync and async variants. Async uses `AsyncDaytona`, `AsyncSandbox`, etc. with `await` and context managers.

### ruby_sdk_reference
Complete Ruby SDK API reference for Daytona sandbox creation, lifecycle management, process execution, file operations, git integration, desktop control, LSP, snapshots, volumes, and network access.

## Ruby SDK Reference

Complete API documentation for the Daytona Ruby SDK for creating and managing sandboxes.

### Installation & Setup
```ruby
gem 'daytona'
require 'daytona'

config = Daytona::Config.new(
  api_key: 'your-api-key',
  api_url: 'https://app.daytona.io/api',
  target: 'us'
)
daytona = Daytona::Daytona.new(config)
```

Configure via environment variables: `DAYTONA_API_KEY`, `DAYTONA_API_URL`, `DAYTONA_TARGET`, `DAYTONA_JWT_TOKEN`, `DAYTONA_ORGANIZATION_ID`.

### Core Sandbox Lifecycle
```ruby
# Create, execute, delete
sandbox = daytona.create(params)
sandbox.start(timeout: 60)
response = sandbox.process.exec(command: "echo 'Hello'")
sandbox.stop(timeout: 60)
sandbox.archive()  # Move to storage
daytona.delete(sandbox)

# Retrieve sandboxes
sandbox = daytona.get(id)
sandbox = daytona.find_one(id: id, labels: {})
sandboxes = daytona.list(labels, page: 1, limit: 10)
```

### Sandbox Properties & Configuration
Getters: `id()`, `organization_id()`, `user()`, `state()`, `desired_state()`, `error_reason()`, `snapshot()`, `env()`, `labels()`, `target()`, `public()`, `network_block_all()`, `network_allow_list()`, `cpu()`, `gpu()`, `memory()`, `disk()`, `backup_state()`, `backup_created_at()`, `auto_stop_interval()`, `auto_archive_interval()`, `auto_delete_interval()`, `volumes()`, `build_info()`, `created_at()`, `updated_at()`, `daemon_version()`.

Setters: `auto_stop_interval=`, `auto_archive_interval=`, `auto_delete_interval=`, `labels=`.

Resize resources: `sandbox.resize(Daytona::Resources.new(cpu: 4, memory: 8))` (can increase while running; stop first to resize disk or decrease).

### Process Execution
```ruby
# Shell commands
response = sandbox.process.exec("ls -la", cwd: "workspace", timeout: 30)
puts response.artifacts.stdout

# Code execution
response = sandbox.process.code_run(<<~CODE)
  x = 10
  print(f"Sum: {x + 20}")
CODE

# Sessions (stateful background processes)
sandbox.process.create_session("my-session")
sandbox.process.execute_session_command(
  session_id: "my-session",
  req: Daytona::SessionExecuteRequest.new(command: "cd /workspace")
)
result = sandbox.process.execute_session_command(
  session_id: "my-session",
  req: Daytona::SessionExecuteRequest.new(command: "cat test.txt")
)
puts "#{result.stdout}, #{result.stderr}, exit: #{result.exit_code}"
sandbox.process.get_session_command_logs(session_id: "my-session", command_id: "cmd-123")
sandbox.process.delete_session("my-session")

# PTY sessions (interactive terminals)
pty_size = Daytona::PtySize.new(rows: 30, cols: 120)
pty = sandbox.process.create_pty_session(id: "my-pty", cwd: "/workspace", pty_size: pty_size)
pty.wait_for_connection
pty.send_input("ls -la\n")
result = pty.wait
pty.disconnect
```

### File System Operations
```ruby
sandbox.fs.create_folder("workspace/data", "755")
sandbox.fs.delete_file("workspace/old_file.txt", recursive: true)

info = sandbox.fs.get_file_info("workspace/data/file.txt")
puts "Size: #{info.size}, Mode: #{info.mode}, IsDir: #{info.is_dir}"

files = sandbox.fs.list_files("workspace/data")
files.each { |f| puts "#{f.name}: #{f.size} bytes" unless f.is_dir }

# Upload/download
sandbox.fs.upload_file("Hello, World!", "tmp/hello.txt")
sandbox.fs.upload_file("local_file.txt", "tmp/file.txt")
sandbox.fs.upload_files([
  FileUpload.new("Content", "/tmp/file1.txt"),
  FileUpload.new("workspace/data/file2.txt", "/tmp/file2.txt")
])
content = sandbox.fs.download_file("workspace/data/file.txt")
sandbox.fs.download_file("workspace/data/file.txt", "local_copy.txt")

# Search and replace
matches = sandbox.fs.find_files("workspace/src", "TODO:")
matches.each { |m| puts "#{m.file}:#{m.line}: #{m.content}" }
result = sandbox.fs.search_files("workspace", "*.rb")
result.files.each { |f| puts f }
results = sandbox.fs.replace_in_files(
  files: ["workspace/src/file1.rb", "workspace/src/file2.rb"],
  pattern: "old_function",
  new_value: "new_function"
)

sandbox.fs.move_files("workspace/data/old_name.txt", "workspace/data/new_name.txt")
sandbox.fs.set_file_permissions(path: "workspace/scripts/run.sh", mode: "755", owner: "daytona")
```

### Git Operations
```ruby
sandbox.git.clone(
  url: "https://github.com/user/repo.git",
  path: "workspace/repo",
  branch: "develop",
  username: "user",
  password: "token"
)
sandbox.git.clone(url: "https://github.com/user/repo.git", path: "workspace/repo-old", commit_id: "abc123")

sandbox.git.add("workspace/repo", ["file.txt", "src/main.rb"])
response = sandbox.git.commit(
  path: "workspace/repo",
  message: "Update docs",
  author: "John Doe",
  email: "john@example.com",
  allow_empty: true
)
puts response.sha

sandbox.git.push(path: "workspace/repo", username: "user", password: "token")
sandbox.git.pull(path: "workspace/repo", username: "user", password: "token")

status = sandbox.git.status("workspace/repo")
puts "Branch: #{status.current_branch}, Ahead: #{status.ahead}, Behind: #{status.behind}"

response = sandbox.git.branches("workspace/repo")
sandbox.git.checkout_branch("workspace/repo", "feature-branch")
sandbox.git.create_branch("workspace/repo", "new-feature")
sandbox.git.delete_branch("workspace/repo", "old-feature")
```

### Desktop/VNC Control (ComputerUse)
```ruby
sandbox.computer_use.start()
sandbox.computer_use.stop()
response = sandbox.computer_use.status()
puts "Status: #{response.status}"

xvfb_status = sandbox.computer_use.get_process_status("xvfb")
sandbox.computer_use.restart_process("xfce4")
logs = sandbox.computer_use.get_process_logs("novnc")
errors = sandbox.computer_use.get_process_errors("x11vnc")

# Interaction interfaces
sandbox.computer_use.mouse()
sandbox.computer_use.keyboard()
sandbox.computer_use.screenshot()
sandbox.computer_use.display()
sandbox.computer_use.recording()
```

### Language Server Protocol (LSP)
```ruby
lsp = sandbox.create_lsp_server(
  language_id: Daytona::LspServer::Language::PYTHON,
  path_to_project: "/path/to/project"
)
lsp.start()
lsp.did_open("file.py")

completions = lsp.completions(path: "file.py", position: {line: 10, character: 5})
symbols = lsp.document_symbols("file.py")
search_results = lsp.sandbox_symbols("MyClass")

lsp.did_close("file.py")
lsp.stop()
```

### Images & Snapshots
```ruby
# Define custom image
image = Image.debian_slim('3.12')
  .pip_install("requests", "pandas", index_url: "https://...")
  .pip_install_from_requirements("requirements.txt", find_links: [...])
  .pip_install_from_pyproject("pyproject.toml", optional_dependencies: ["dev"])
  .add_local_file("package.json", "/home/daytona/package.json")
  .add_local_dir("src", "/home/daytona/src")
  .run_commands('echo "Hello"', 'echo "Hello again!"')
  .env({"PROJECT_ROOT" => "/home/daytona"})
  .workdir("/home/daytona")
  .entrypoint(["/bin/bash"])
  .cmd(["/bin/bash"])

# Create sandbox from image
params = Daytona::CreateSandboxFromImageParams.new(image: image)
sandbox = daytona.create(params)

# Snapshots
response = daytona.snapshot.list(page: 1, limit: 10)
snapshot = daytona.snapshot.get("demo")
params = Daytona::CreateSnapshotParams.new(name: 'my-snapshot', image: image)
snapshot = daytona.snapshot.create(params) { |chunk| print chunk }
daytona.snapshot.delete(snapshot)
daytona.snapshot.activate(snapshot)
```

### Volumes
```ruby
volume = daytona.volume.create("my-volume")
volume = daytona.volume.get("my-volume", create: true)
volumes = daytona.volume.list()
daytona.volume.delete(volume)

# Volume properties
puts "#{volume.id}, #{volume.name}, #{volume.state}, #{volume.created_at}"
```

### Network & Access
```ruby
# Preview URLs
preview = sandbox.preview_url(3000)
signed = sandbox.create_signed_preview_url(3000, expires_in_seconds: 120)
puts signed.url
sandbox.expire_signed_preview_url(3000, "token-value")

# SSH access
ssh = sandbox.create_ssh_access(expires_in_minutes: 60)
validation = sandbox.validate_ssh_access(token)
sandbox.revoke_ssh_access(token)

# Directory access
user_home = sandbox.get_user_home_dir()
work_dir = sandbox.get_work_dir()
```

### Lifecycle Management
```ruby
sandbox.refresh()  # Refresh data from API
sandbox.refresh_activity()  # Reset activity timer
sandbox.recover(timeout: 40)  # Recover from error
sandbox.wait_for_sandbox_start(timeout: 60)
sandbox.wait_for_sandbox_stop(timeout: 60)
sandbox.wait_for_resize_complete(timeout: 60)

daytona.close()  # Shutdown OTel providers
```

### Object Storage
```ruby
storage = ObjectStorage.new(
  endpoint_url: "...",
  aws_access_key_id: "...",
  aws_secret_access_key: "...",
  aws_session_token: "...",
  bucket_name: "daytona-volume-builds",
  region: "us-east-1"
)
file_hash = storage.upload("path/to/file", "org-id", "archive/base/path")
```

All methods raise `Daytona::Sdk::Error` on failure unless otherwise noted.

### api_&_cli_reference
Complete API and CLI reference for sandbox, snapshot, volume, and organization management with resource allocation, authentication, and MCP server integration.

## API Reference
Complete reference of all Daytona API operations and endpoints via interactive API reference component.

## CLI Reference
Comprehensive command-line interface for managing Daytona resources:

**Sandbox Lifecycle**: `create` (with cpu/memory/disk/gpu allocation, auto-archive/delete/stop intervals, environment variables, labels, volumes, network settings, snapshot selection, region targeting), `start`, `stop`, `archive`, `delete` (single or `--all`)

**Sandbox Operations**: `exec` (with `--cwd` and `--timeout`), `ssh` (with `--expires` token expiration, defaults 24h), `info` (yaml/json output), `list` (pagination: `--limit`, `--page`), `preview-url` (requires `--port`, `--expires` in seconds)

**Snapshots**: `create` (from Dockerfile with resource defaults: cpu 1, memory 1GB, disk 3GB; supports context, entrypoint, image name, region), `push` (local snapshot with resource allocation and optional name override), `list` (pagination), `delete` (single or `--all`)

**Volumes**: `create [NAME]` (with `--size` in GB), `delete`, `get` (yaml/json), `list`

**Organizations**: `create [NAME]` (sets as active), `use`, `list`, `delete`

**Authentication**: `login` (optional `--api-key`), `logout`

**MCP Server**: `init [AGENT_NAME]` (claude/windsurf/cursor), `start`, `config [AGENT_NAME]` (JSON output)

**Utilities**: `autocomplete` (bash/zsh/fish/powershell), `docs` (open in browser), `version`, `--version`/`-v`

All commands support `--help` flag.

### typescript_sdk_api_reference
Complete TypeScript SDK API reference for Daytona sandbox management, code execution, file operations, and desktop automation.

## Complete TypeScript SDK API Reference

### Installation & Setup
```bash
npm install @daytonaio/sdk
```

Configure via environment variables (`DAYTONA_API_KEY`, `DAYTONA_API_URL`, `DAYTONA_TARGET`) or constructor:
```ts
const daytona = new Daytona({ apiKey: 'key', apiUrl: 'https://...', target: 'us' })
```

Supports Node.js, browsers, and serverless (Cloudflare Workers, AWS Lambda, Azure Functions) with polyfill setup for Vite/Next.js.

### Core Client: Daytona

Main entry point for sandbox lifecycle and resource management.

**Sandbox CRUD:**
- `create(params, options)` - From snapshot or image with resource allocation, environment variables, auto-lifecycle settings
- `get(idOrName)` - Retrieve by ID or name
- `findOne(filter)` - Find by ID, name, or labels
- `list(labels, page, limit)` - Paginated list with label filtering
- `start(sandbox, timeout)` - Start and wait for ready
- `stop(sandbox)` - Stop sandbox
- `delete(sandbox, timeout)` - Delete sandbox

**Services:**
- `snapshot` - SnapshotService for managing pre-configured sandboxes
- `volume` - VolumeService for managing shared storage volumes

### Sandbox: Isolated Execution Environment

Represents a running or stopped sandbox with full lifecycle and operation interfaces.

**Properties:** `id`, `name`, `state`, `cpu`, `memory`, `disk`, `gpu`, `env`, `labels`, `autoStopInterval`, `autoArchiveInterval`, `autoDeleteInterval`, `public`, `networkBlockAll`, `networkAllowList`

**Lifecycle:**
```ts
await sandbox.start(timeout)
await sandbox.stop(timeout)
await sandbox.archive()
await sandbox.delete(timeout)
await sandbox.recover(timeout)
await sandbox.waitUntilStarted(timeout)
await sandbox.waitUntilStopped(timeout)
```

**Resources:**
```ts
await sandbox.resize({ cpu, memory, disk }, timeout)  // Hot resize: CPU/memory only when running
```

**Activity & Configuration:**
```ts
await sandbox.refreshActivity()  // Reset auto-stop timer
await sandbox.refreshData()      // Refresh from API
await sandbox.setLabels({ key, value })
await sandbox.setAutostopInterval(minutes)
await sandbox.setAutoArchiveInterval(minutes)
await sandbox.setAutoDeleteInterval(minutes)
```

**Access:**
```ts
const preview = await sandbox.getPreviewLink(port)  // Returns { url, token }
const signed = await sandbox.getSignedPreviewUrl(port, expiresInSeconds)
await sandbox.expireSignedPreviewUrl(port, token)
const ssh = await sandbox.createSshAccess(expiresInMinutes)  // Returns token
await sandbox.validateSshAccess(token)
await sandbox.revokeSshAccess(token)
```

**Interfaces:**
- `codeInterpreter` - Stateful Python code execution with isolated contexts
- `computerUse` - Desktop automation (keyboard, mouse, screenshots, recording)
- `fs` - File system operations
- `git` - Git operations
- `process` - Process execution and PTY sessions
- `createLspServer(languageId, pathToProject)` - Language Server Protocol for code intelligence

### Process: Code & Command Execution

Execute code and shell commands with streaming output and session support.

**Immediate Execution:**
```ts
const response = await process.codeRun(`console.log('Hello')`, params, timeout)
const response = await process.executeCommand('echo "Hello"', cwd, env, timeout)
// Returns: { exitCode, result (stdout), artifacts { stdout, charts[] } }
```

**Sessions (Stateful):**
```ts
await process.createSession(sessionId)
await process.executeSessionCommand(sessionId, { command, runAsync, suppressInputEcho }, timeout)
// Returns: { cmdId, output, stdout, stderr, exitCode? }
const cmd = await process.getSessionCommand(sessionId, commandId)
const logs = await process.getSessionCommandLogs(sessionId, commandId)
await process.getSessionCommandLogs(sessionId, commandId, onStdout, onStderr)  // Streaming
await process.sendSessionCommandInput(sessionId, commandId, data)
await process.deleteSession(sessionId)
const sessions = await process.listSessions()
```

**PTY (Interactive Terminal):**
```ts
const ptyHandle = await process.createPty({
  id, cols, rows, cwd, envs,
  onData: (data: Uint8Array) => {}
})
await ptyHandle.waitForConnection()
await ptyHandle.sendInput('command\n')
await ptyHandle.resize(cols, rows)
const result = await ptyHandle.wait()  // { exitCode, error? }
await ptyHandle.kill()
await ptyHandle.disconnect()

// Connect to existing PTY
const handle = await process.connectPty(sessionId, { onData })
const session = await process.getPtySessionInfo(sessionId)
const sessions = await process.listPtySessions()
await process.killPtySession(sessionId)
await process.resizePtySession(sessionId, cols, rows)
```

### CodeInterpreter: Stateful Python Execution

Isolated Python contexts with streaming callbacks.

```ts
const ctx = await codeInterpreter.createContext(cwd)
const contexts = await codeInterpreter.listContexts()
await codeInterpreter.deleteContext(ctx)

const result = await codeInterpreter.runCode(code, {
  context,
  envs: { VAR: 'value' },
  timeout: 10,  // seconds, 0 = no timeout, default 10 minutes
  onStdout: (msg) => {},
  onStderr: (msg) => {},
  onError: (err) => {}
})
// Returns: { stdout, stderr, error? { name, value, traceback? } }
```

### FileSystem: File Operations

CRUD, streaming upload/download, search, permissions.

```ts
await fs.createFolder('path', '755')
const files = await fs.listFiles('path')  // FileInfo[]
await fs.deleteFile('path', recursive)
await fs.moveFiles('source', 'destination')
const info = await fs.getFileDetails('path')  // { size, permissions, modTime }
await fs.setFilePermissions('path', { owner, group, mode })

// Upload
await fs.uploadFile(Buffer.from('...') | 'local_path', 'remote_path', timeout)
await fs.uploadFiles([{ source: Buffer | string, destination }, ...], timeout)

// Download
const buffer = await fs.downloadFile('remote_path', timeout)
await fs.downloadFile('remote_path', 'local_path', timeout)  // Streaming
const results = await fs.downloadFiles([{ source, destination? }, ...], timeout)

// Search
const result = await fs.searchFiles('path', '*.ts')  // Glob pattern
const matches = await fs.findFiles('path', 'TODO:')  // Text search
const results = await fs.replaceInFiles(['file1', 'file2'], pattern, newValue)
```

### Git: Repository Operations

Clone, branch management, commit, push/pull with optional authentication.

```ts
await git.clone(url, path, branch, commitId, username, password)
await git.add('repo_path', ['file.txt'] | ['.'])
await git.commit('repo_path', message, author, email, allowEmpty)
// Returns: { sha }
await git.push('repo_path', username, password)
await git.pull('repo_path', username, password)

await git.createBranch('repo_path', name)
await git.checkoutBranch('repo_path', branch)
await git.deleteBranch('repo_path', name)
const response = await git.branches('repo_path')  // { branches }

const status = await git.status('repo_path')
// Returns: { currentBranch, ahead, behind, branchPublished, fileStatus[] }
```

### ComputerUse: Desktop Automation

Keyboard, mouse, screenshots, display info, window management, screen recording.

**Lifecycle:**
```ts
await sandbox.computerUse.start()
await sandbox.computerUse.stop()
const status = await sandbox.computerUse.getStatus()
await sandbox.computerUse.restartProcess('xfce4')
const logs = await sandbox.computerUse.getProcessLogs('novnc')
```

**Keyboard:**
```ts
await computerUse.keyboard.type('text', delayMs)
await computerUse.keyboard.press('Return')
await computerUse.keyboard.press('c', ['ctrl'])
await computerUse.keyboard.hotkey('ctrl+c')
```

**Mouse:**
```ts
await computerUse.mouse.click(x, y, button, doubleClick)
const pos = await computerUse.mouse.getPosition()
await computerUse.mouse.move(x, y)
await computerUse.mouse.drag(x1, y1, x2, y2)
await computerUse.mouse.scroll(x, y, direction, amount)
```

**Screenshots:**
```ts
const screenshot = await computerUse.screenshot.takeFullScreen(showCursor)
const region = await computerUse.screenshot.takeRegion({ x, y, width, height })
const compressed = await computerUse.screenshot.takeCompressed({ format, quality, showCursor })
const regionCompressed = await computerUse.screenshot.takeCompressedRegion(region, { format, quality, scale })
// Returns: { width, height, size_bytes, base64 image data }
```

**Display & Windows:**
```ts
const info = await computerUse.display.getInfo()  // { primary_display, total_displays, displays[] }
const windows = await computerUse.display.getWindows()  // { count, windows[] }
```

**Recording:**
```ts
const recording = await computerUse.recording.start('name')
const stopped = await computerUse.recording.stop(recordingId)  // { id, fileName, filePath, status, durationSeconds }
const recordings = await computerUse.recording.list()
const details = await computerUse.recording.get(recordingId)
await computerUse.recording.download(recordingId, 'local_path')
await computerUse.recording.delete(recordingId)
```

### Image: Dynamic Sandbox Image Building

Define custom sandbox images with factory methods and chainable configuration.

```ts
const image = Image.base('python:3.12-slim-bookworm')
  .workdir('/home/daytona')
  .env({ FOO: 'bar' })
  .runCommands('echo "Hello"', ['bash', '-c', 'echo again'])
  .pipInstall('numpy', { indexUrl: 'https://...', findLinks: [...], pre: true })
  .pipInstallFromRequirements('requirements.txt', options)
  .pipInstallFromPyproject('pyproject.toml', { optionalDependencies: ['dev'] })
  .addLocalDir('src', '/home/daytona/src')
  .addLocalFile('config.json', '/home/daytona/config.json')
  .cmd(['/bin/bash'])
  .entrypoint(['/bin/bash'])
  .dockerfileCommands(['RUN echo "..."'], contextDir)

// Alternatives
const image = Image.debianSlim('3.12')
const image = Image.fromDockerfile('Dockerfile')

// Access
image.dockerfile  // Generated Dockerfile content
image.contextList  // Context files to add
```

### SnapshotService: Pre-configured Sandboxes

Create, retrieve, list, delete, and activate snapshots.

```ts
const snapshot = await daytona.snapshot.create(
  { name, image: Image | string, entrypoint?, resources?, regionId? },
  { onLogs: (chunk) => {}, timeout }
)
const snapshot = await daytona.snapshot.get(name)
const result = await daytona.snapshot.list(page, limit)  // { items, page, total, totalPages }
await daytona.snapshot.delete(snapshot)
await daytona.snapshot.activate(snapshot)
```

### VolumeService: Shared Storage

Create, retrieve, list, delete volumes. Mount to sandboxes with optional S3 subpath.

```ts
const volume = await daytona.volume.create(name)
const volume = await daytona.volume.get(name, create)
const volumes = await daytona.volume.list()
await daytona.volume.delete(volume)

// Mount in sandbox creation
await daytona.create({
  volumes: [{ volumeId, mountPath, subpath? }]
})
```

### LspServer: Language Server Protocol

Code completion, symbol search, file lifecycle for IDE-like features.

```ts
const lsp = await sandbox.createLspServer('typescript', 'workspace/project')
await lsp.start()
await lsp.didOpen('src/index.ts')

const completions = await lsp.completions('src/index.ts', { line, character })
// Returns: { isIncomplete, items[] { label, kind, detail, documentation, sortText, filterText, insertText } }

const symbols = await lsp.documentSymbols('src/index.ts')  // LspSymbol[]
const symbols = await lsp.sandboxSymbols('MyClass')  // Search entire sandbox

await lsp.didClose('src/index.ts')
await lsp.stop()
```

### Charts: Matplotlib Parsing

Parse matplotlib charts into typed objects with metadata.

```ts
type Chart = { elements, png?, title, type: ChartType }
type Chart2D = Chart & { x_label?, y_label? }
type BarChart = Chart2D & { elements: BarData[], type: BAR }
type PieChart = Chart & { elements: PieData[], type: PIE }
type LineChart = PointChart & { type: LINE }
type ScatterChart = PointChart & { type: SCATTER }
type BoxAndWhiskerChart = Chart2D & { elements: BoxAndWhiskerData[], type: BOX_AND_WHISKER }
type CompositeChart = Chart & { elements: Chart[], type: COMPOSITE_CHART }

const chart = parseChart(data)
```

### Error Handling

Four error classes with optional HTTP context:

```ts
class DaytonaError extends Error { statusCode?, headers? }
class DaytonaNotFoundError extends DaytonaError
class DaytonaRateLimitError extends DaytonaError
class DaytonaTimeoutError extends DaytonaError
```

### ObjectStorage

Upload files/directories to object storage.

```ts
const storage = new ObjectStorage({
  accessKeyId, secretAccessKey, endpointUrl,
  bucketName?, sessionToken?
})
const hash = await storage.upload(path, organizationId, archiveBasePath)
```



## Pages

### api-keys
Create and configure API keys with granular permission scopes for Daytona resources via dashboard or DAYTONA_API_KEY environment variable.

## Creating API Keys

1. Navigate to Daytona Dashboard at https://app.daytona.io/dashboard/keys
2. Click **Create Key** button
3. Enter key name, set expiration date, and select permissions
4. Click **Create** button
5. Copy the generated API key

Set the `DAYTONA_API_KEY` environment variable to use the key in your application.

Configuration options: in code, environment variables, .env file, or default values.

## Permissions & Scopes

| Resource   | Scope                   | Description              |
| ---------- | ----------------------- | ------------------------ |
| Sandboxes  | `write:sandboxes`       | Create/modify sandboxes  |
|            | `delete:sandboxes`      | Delete sandboxes         |
| Snapshots  | `write:snapshots`       | Create/modify snapshots  |
|            | `delete:snapshots`      | Delete snapshots         |
| Registries | `write:registries`      | Create/modify registries |
|            | `delete:registries`     | Delete registries        |
| Volumes    | `read:volumes`          | View volumes             |
|            | `write:volumes`         | Create/modify volumes    |
|            | `delete:volumes`        | Delete volumes           |
| Audit      | `read:audit_logs`       | View audit logs          |
| Regions    | `write:regions`         | Create/modify regions    |
|            | `delete:regions`        | Delete regions           |
| Runners    | `read:runners`          | View runners             |
|            | `write:runners`         | Create/modify runners    |
|            | `delete:runners`        | Delete runners           |

### audit-logs
Audit logs track organization activity via dashboard or API with fields for actor, action, target, outcome, and metadata; supports real-time refresh and filters by time.

## Overview

Daytona audit logs provide detailed records of user and system activity across your organization. Use cases include security audits (unauthorized access/sandbox misuse), debugging (sandbox lifecycle issues), and compliance exports.

Access requires admin role with full access or member role with audit log permissions.

## Dashboard Access

Access audit logs at `https://app.daytona.io/dashboard/audit-logs`. The page displays:
- **Time**: timestamp of the action
- **User**: user who performed the action
- **Actions**: operation performed
- **Targets**: resource affected
- **Outcomes**: result of the action

Filter by time using the date range picker in the top-left corner.

## Real-time Updates

Enable the **Auto Refresh** toggle in the top-right corner to automatically refresh logs as new events occur.

## API Access

Get all audit logs:
```bash
curl https://app.daytona.io/api/audit \
  --header 'Authorization: Bearer YOUR_API_KEY'
```

Get audit logs for a specific organization:
```bash
curl https://app.daytona.io/api/audit/organizations/{organizationId} \
  --header 'Authorization: Bearer YOUR_API_KEY'
```

## Log Structure

Each audit log entry contains:

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Unique log entry identifier |
| `actorId` | string | ID of the user who performed the action |
| `actorEmail` | string | Email of the user who performed the action |
| `organizationId` | string | Organization ID |
| `action` | string | Operation executed (e.g., `create`, `start`, `stop`) |
| `targetType` | string | Resource type affected (e.g., `sandbox`, `snapshot`) |
| `targetId` | string | ID of the affected resource |
| `statusCode` | number | HTTP status code of the result |
| `errorMessage` | string | Error message if the action failed |
| `ipAddress` | string | IP address of the request origin |
| `userAgent` | string | User agent of the request origin |
| `source` | string | Source of the action |
| `metadata` | object | Additional context about the action |
| `createdAt` | string | ISO 8601 timestamp of when the action occurred |

## Actions

Complete list of logged actions:

`create`, `read`, `update`, `delete`, `login`, `set_default`, `update_access`, `update_quota`, `update_region_quota`, `suspend`, `unsuspend`, `accept`, `decline`, `link_account`, `unlink_account`, `leave_organization`, `regenerate_key_pair`, `update_scheduling`, `start`, `stop`, `replace_labels`, `create_backup`, `update_public_status`, `set_auto_stop_interval`, `set_auto_archive_interval`, `set_auto_delete_interval`, `archive`, `get_port_preview_url`, `set_general_status`, `activate`, `deactivate`, `update_network_settings`, `get_webhook_app_portal_access`, `send_webhook_message`, `initialize_webhooks`, `update_sandbox_default_limited_network_egress`, `create_ssh_access`, `revoke_ssh_access`, `regenerate_proxy_api_key`, `regenerate_ssh_gateway_api_key`, `regenerate_snapshot_manager_credentials`, `toolbox_delete_file`, `toolbox_download_file`, `toolbox_create_folder`, `toolbox_move_file`, `toolbox_set_file_permissions`, `toolbox_replace_in_files`, `toolbox_upload_file`, `toolbox_bulk_upload_files`, `toolbox_git_add_files`, `toolbox_git_create_branch`, `toolbox_git_delete_branch`, `toolbox_git_clone_repository`, `toolbox_git_commit_changes`, `toolbox_git_pull_changes`, `toolbox_git_push_changes`, `toolbox_git_checkout_branch`, `toolbox_execute_command`, `toolbox_create_session`, `toolbox_session_execute_command`, `toolbox_delete_session`, `toolbox_computer_use_start`, `toolbox_computer_use_stop`, `toolbox_computer_use_restart_process`

## Targets

Resource types that can be affected by actions:

`api_key`, `organization`, `organization_invitation`, `organization_role`, `organization_user`, `docker_registry`, `runner`, `sandbox`, `snapshot`, `user`, `volume`

## Outcomes

Result of actions follow standard HTTP semantics:

| Outcome | Description |
|---------|-------------|
| Info | Informational (1xx codes) |
| Success | Action succeeded (2xx codes) |
| Redirect | Redirects (3xx codes) |
| Error | Client/server error (4xx/5xx) |

### billing
Billing dashboard with cost breakdown by resource, wallet management with automatic top-up rules (threshold/target), coupon redemption, and billing email notifications.

## Billing Overview

Daytona Billing provides organization billing, wallet, and usage details. Displays cost breakdown chart showing costs per resource (RAM, CPU, storage) with area/bar chart options and date range filtering (last 3, 6, or 12 months).

## Wallet

Shows current organization wallet balance and credits spent this month.

### Payment Method

Connect credit card to wallet for top-ups:
1. Navigate to Daytona Wallet
2. Click **Connect** button in **Payment method** section
3. Follow prompts to connect credit card

**Automatic top-up rules:**
- **Threshold** — Wallet balance level that triggers top-up
- **Target** — Balance amount after top-up
- Set both to `0` to disable automatic top-up

### Coupon Redemption

Redeem coupon codes for wallet credits:
1. Navigate to Daytona Wallet
2. Enter coupon code in **Redeem coupon** input field
3. Click **Redeem** button

### Billing Emails

Add email addresses to receive billing notifications (invoices, credit depletion notices):
1. Navigate to Daytona Wallet
2. Click **Add Email** button
3. Enter email address and click **Add Email**

Verification email sent to confirm address before adding to billing email list.

### computer-use
Desktop automation API: mouse/keyboard/screenshot/recording/display operations for GUI testing and automation on Linux/Windows/macOS sandboxes.

## Computer Use

Programmatic control of desktop environments within Daytona sandboxes. Provides mouse, keyboard, screenshot, and display operations for automating GUI interactions and testing desktop applications on Linux, Windows, or macOS.

macOS and Windows support is in private alpha; request access via form.

### Common use cases
- GUI Application Testing - automate interactions with native applications, click buttons, fill forms, validate UI behavior
- Visual Testing & Screenshots - capture screenshots, compare UI states, perform visual regression testing
- Desktop Automation - automate repetitive desktop tasks, file management through GUI, complex workflows

### Lifecycle

Start all computer use processes (Xvfb, xfce4, x11vnc, novnc):
```python
result = sandbox.computer_use.start()
```

Stop all processes:
```python
result = sandbox.computer_use.stop()
```

Get status of all processes:
```python
response = sandbox.computer_use.get_status()
```

Get status of specific process (xvfb, novnc, x11vnc, xfce4):
```python
xvfb_status = sandbox.computer_use.get_process_status("xvfb")
```

Restart specific process:
```python
result = sandbox.computer_use.restart_process("xfce4")
```

Get process logs and errors:
```python
logs = sandbox.computer_use.get_process_logs("novnc")
errors = sandbox.computer_use.get_process_errors("x11vnc")
```

### Mouse operations

Click at coordinates with optional button (left/right) and double-click:
```python
sandbox.computer_use.mouse.click(100, 200)  # single left click
sandbox.computer_use.mouse.click(100, 200, "left", True)  # double click
sandbox.computer_use.mouse.click(100, 200, "right")  # right click
```

Move cursor:
```python
result = sandbox.computer_use.mouse.move(100, 200)
```

Drag from start to end coordinates with optional button:
```python
result = sandbox.computer_use.mouse.drag(50, 50, 150, 150)
```

Scroll at coordinates with direction (up/down) and amount:
```python
sandbox.computer_use.mouse.scroll(100, 200, "up", 3)
sandbox.computer_use.mouse.scroll(100, 200, "down", 5)
```

Get current mouse position:
```python
position = sandbox.computer_use.mouse.get_position()
```

### Keyboard operations

Type text with optional delay (ms) between characters:
```python
sandbox.computer_use.keyboard.type("Hello, World!")
sandbox.computer_use.keyboard.type("Slow typing", 100)
```

Press key with optional modifiers (ctrl, shift, alt):
```python
sandbox.computer_use.keyboard.press("Return")
sandbox.computer_use.keyboard.press("c", ["ctrl"])
sandbox.computer_use.keyboard.press("t", ["ctrl", "shift"])
```

Press hotkey combination:
```python
sandbox.computer_use.keyboard.hotkey("ctrl+c")
sandbox.computer_use.keyboard.hotkey("ctrl+v")
sandbox.computer_use.keyboard.hotkey("alt+tab")
```

### Screenshot operations

Take full screen screenshot with optional cursor visibility:
```python
screenshot = sandbox.computer_use.screenshot.take_full_screen()
with_cursor = sandbox.computer_use.screenshot.take_full_screen(True)
```

Take screenshot of region (x, y, width, height):
```python
from daytona import ScreenshotRegion
region = ScreenshotRegion(x=100, y=100, width=300, height=200)
screenshot = sandbox.computer_use.screenshot.take_region(region)
```

Take compressed screenshot with format (jpeg/png/webp), quality (0-100), scale (0-1), and cursor options:
```python
screenshot = sandbox.computer_use.screenshot.take_compressed()
jpeg = sandbox.computer_use.screenshot.take_compressed(
    ScreenshotOptions(format="jpeg", quality=95, show_cursor=True)
)
scaled = sandbox.computer_use.screenshot.take_compressed(
    ScreenshotOptions(format="png", scale=0.5)
)
```

Take compressed screenshot of region:
```python
screenshot = sandbox.computer_use.screenshot.take_compressed_region(
    region,
    ScreenshotOptions(format="webp", quality=80, show_cursor=True)
)
```

### Screen Recording

Configure recording directory via environment variable when creating sandbox:
```python
sandbox = daytona.create(
    CreateSandboxFromSnapshotParams(
        snapshot="daytonaio/sandbox:0.6.0",
        env_vars={"DAYTONA_RECORDINGS_DIR": "/home/daytona/my-recordings"}
    )
)
```

Start recording with optional name:
```python
recording = sandbox.computer_use.recording.start("test-1")
```

Stop recording by ID:
```python
stopped_recording = sandbox.computer_use.recording.stop(recording.id)
```

List all recordings:
```python
recordings_list = sandbox.computer_use.recording.list()
for rec in recordings_list.recordings:
    print(f"- {rec.name}: {rec.duration_seconds}s ({rec.file_size_bytes} bytes)")
```

Get recording details:
```python
recording_detail = sandbox.computer_use.recording.get("recording-id")
```

Delete recording:
```python
sandbox.computer_use.recording.delete("recording-id")
```

Download recording to local file (streams efficiently without loading entire content into memory):
```python
sandbox.computer_use.recording.download(recording.id, "local_recording.mp4")
```

Recording dashboard available in Daytona Dashboard - click action menu for sandbox, select "Screen Recordings" to view, download, and delete recordings through web interface.

### Display operations

Get display information (primary display, total displays, all displays with dimensions and positions):
```python
info = sandbox.computer_use.display.get_info()
print(f"Primary display: {info.primary_display.width}x{info.primary_display.height}")
for i, display in enumerate(info.displays):
    print(f"Display {i}: {display.width}x{display.height} at {display.x},{display.y}")
```

Get list of open windows with title and ID:
```python
windows = sandbox.computer_use.display.get_windows()
for window in windows.windows:
    print(f"- {window.title} (ID: {window.id})")
```

### API and SDK References

All operations available via Python, TypeScript, Ruby, Go SDKs and REST API. API endpoints follow pattern: `https://proxy.app.daytona.io/toolbox/{sandboxId}/computeruse/{operation}`

### configuration
Configure Daytona via code (DaytonaConfig), environment variables (DAYTONA_*), .env file, or defaults; precedence order: code > env vars > .env > defaults; requires api_key, optional api_url and target region (us/eu).

## Configuration Methods

Daytona supports configuration in order of precedence:
1. Configuration in code
2. Environment variables
3. .env file
4. Default values

## Configuration in Code

Use the `DaytonaConfig` class with parameters:
- `api_key`: Your Daytona API Key
- `api_url`: URL of your Daytona API
- `target`: Target region (`us` / `eu`)

**Python:**
```python
from daytona import DaytonaConfig

config = DaytonaConfig(
    api_key="your-api-key",
    api_url="your-api-url",
    target="us"
)
```

**TypeScript:**
```typescript
import { DaytonaConfig } from '@daytonaio/sdk'

const config: DaytonaConfig = {
  apiKey: 'your-api-key',
  apiUrl: 'your-api-url',
  target: 'us',
}
```

**Ruby:**
```ruby
require 'daytona'

config = Daytona::Config.new(
  api_key: 'your-api-key',
  api_url: 'your-api-url',
  target: 'us'
)
```

**Go:**
```go
package main

import "github.com/daytonaio/daytona/libs/sdk-go/pkg/daytona"

func main() {
    config := daytona.Config{
        APIKey: "your-api-key",
        APIURL: "your-api-url",
        Target: "us",
    }
    client := daytona.NewClient(&config)
}
```

## Environment Variables

The SDK automatically reads these environment variables:

| Variable | Description | Required |
|----------|-------------|----------|
| `DAYTONA_API_KEY` | Your Daytona API key | Yes |
| `DAYTONA_API_URL` | URL of your Daytona API | No |
| `DAYTONA_TARGET` | Target region for sandboxes | No |

**Bash/Zsh:**
```bash
export DAYTONA_API_KEY=your-api-key
export DAYTONA_API_URL=https://your-api-url
export DAYTONA_TARGET=us
```

**Windows PowerShell:**
```powershell
$env:DAYTONA_API_KEY="your-api-key"
$env:DAYTONA_API_URL="https://your-api-url"
$env:DAYTONA_TARGET="us"
```

## .env File

Create a `.env` file:
```bash
DAYTONA_API_KEY=YOUR_API_KEY
DAYTONA_API_URL=https://your_api_url
DAYTONA_TARGET=us
```

## Default Values

If no configuration is provided:

| Option | Value |
|--------|-------|
| API URL | https://app.daytona.io/api |
| Target | Default region for the organization |

### custom-domain-authentication
Custom preview proxy for sandboxes with custom domains, authentication, auto-start, and control headers (skip-warning, disable-CORS, skip-activity-update, preview-token).

## Custom Preview Proxy

Deploy your own preview proxy to handle sandbox preview URLs with complete control over domains, authentication, error handling, and styling.

### Capabilities

- Custom domain hosting (e.g., `preview.yourcompany.com`)
- Custom user authentication for private previews
- Automatic sandbox startup before forwarding requests
- Custom error pages and styling
- Disable Daytona's preview warning
- Override CORS settings

### Request Flow

1. User visits preview URL
2. Custom proxy authenticates user
3. Proxy checks sandbox status and starts if needed
4. Request forwarded to sandbox
5. Response handled with custom styling/error pages
6. Custom headers sent to control Daytona behavior

### Daytona Control Headers

**Disable preview warning:**
```
X-Daytona-Skip-Preview-Warning: true
```

**Override CORS:**
```
X-Daytona-Disable-CORS: true
```

**Skip last activity updates** (prevents auto-stop from keeping sandbox running):
```
X-Daytona-Skip-Last-Activity-Update: true
```

Example:
```bash
curl -H "X-Daytona-Skip-Last-Activity-Update: true" \
https://3000-sandbox-123456.proxy.daytona.work
```

**Authentication for private previews:**
```
X-Daytona-Preview-Token: {sandboxToken}
```

Fetch `sandboxToken` via Daytona SDK or API.

### Examples

Reference implementations available on Github (daytona-proxy-samples):
- Typescript example
- Golang example

### declarative-builder
SDK-based declarative image building for sandboxes with on-demand or pre-built snapshot workflows; supports base images, package managers, file operations, environment config, and Dockerfile integration across Python/TypeScript/Ruby.

## Declarative Builder

Code-first approach to defining dependencies for Daytona Sandboxes using the SDK instead of importing pre-built container images.

### Two Primary Workflows

1. **Declarative images**: Build images with varying dependencies on-demand when creating sandboxes. Cached for 24 hours and automatically reused on subsequent runs.
2. **Pre-built Snapshots**: Create and register ready-to-use snapshots that can be shared across multiple sandboxes and permanently cached.

### Building Declarative Images

```python
declarative_image = (
  Image.debian_slim("3.12")
  .pip_install(["requests", "pytest"])
  .workdir("/home/daytona")
)

sandbox = daytona.create(
  CreateSandboxFromImageParams(image=declarative_image),
  timeout=0,
  on_snapshot_create_logs=print,
)
```

```typescript
const declarativeImage = Image.debianSlim('3.12')
  .pipInstall(['requests', 'pytest'])
  .workdir('/home/daytona')

const sandbox = await daytona.create(
  { image: declarativeImage },
  { timeout: 0, onSnapshotCreateLogs: console.log }
)
```

```ruby
declarative_image = Daytona::Image
  .debian_slim('3.12')
  .pip_install(['requests', 'pytest'])
  .workdir('/home/daytona')

sandbox = daytona.create(
  Daytona::CreateSandboxFromImageParams.new(image: declarative_image),
  timeout: 0,
  on_snapshot_create_logs: proc { |chunk| puts chunk }
)
```

### Creating Pre-built Snapshots

```python
snapshot_name = "data-science-snapshot"
image = (
  Image.debian_slim("3.12")
  .pip_install(["pandas", "numpy"])
  .workdir("/home/daytona")
)

daytona.snapshot.create(
  CreateSnapshotParams(name=snapshot_name, image=image),
  on_logs=print,
)

sandbox = daytona.create(
  CreateSandboxFromSnapshotParams(snapshot=snapshot_name)
)
```

```typescript
const snapshotName = 'data-science-snapshot'
const image = Image.debianSlim('3.12')
  .pipInstall(['pandas', 'numpy'])
  .workdir('/home/daytona')

await daytona.snapshot.create(
  { name: snapshotName, image },
  { onLogs: console.log }
)

const sandbox = await daytona.create({ snapshot: snapshotName })
```

```ruby
snapshot_name = 'data-science-snapshot'
image = Daytona::Image
  .debian_slim('3.12')
  .pip_install(['pandas', 'numpy'])
  .workdir('/home/daytona')

daytona.snapshot.create(
  Daytona::CreateSnapshotParams.new(name: snapshot_name, image: image),
  on_logs: proc { |chunk| puts chunk }
)

sandbox = daytona.create(
  Daytona::CreateSandboxFromSnapshotParams.new(snapshot: snapshot_name)
)
```

### Best Practices

- Layer Optimization: Group related operations to minimize Docker layers
- Cache Utilization: Identical build commands are cached; subsequent builds are instant
- Security: Create non-root users for application workloads
- Resource Efficiency: Use slim base images when appropriate
- Context Minimization: Only include necessary files in the build context

### Image Configuration

#### Base Image Selection

```python
image = Image.base("python:3.12-slim-bookworm")
image = Image.debian_slim("3.12")
```

```typescript
const image = Image.base('python:3.12-slim-bookworm')
const image = Image.debianSlim('3.12')
```

```ruby
image = Daytona::Image.base('python:3.12-slim-bookworm')
image = Daytona::Image.debian_slim('3.12')
```

#### Package Management

```python
image = Image.debian_slim("3.12").pip_install("requests", "pandas")
image = Image.debian_slim("3.12").pip_install_from_requirements("requirements.txt")
image = Image.debian_slim("3.12").pip_install_from_pyproject("pyproject.toml", optional_dependencies=["dev"])
```

```typescript
const image = Image.debianSlim('3.12').pipInstall(['requests', 'pandas'])
const image = Image.debianSlim('3.12').pipInstallFromRequirements('requirements.txt')
const image = Image.debianSlim('3.12').pipInstallFromPyproject('pyproject.toml', {
  optionalDependencies: ['dev']
})
```

```ruby
image = Daytona::Image.debian_slim('3.12').pip_install(['requests', 'pandas'])
image = Daytona::Image.debian_slim('3.12').pip_install_from_requirements('requirements.txt')
image = Daytona::Image.debian_slim('3.12').pip_install_from_pyproject('pyproject.toml', 
  optional_dependencies: ['dev']
)
```

#### File System Operations

```python
image = Image.debian_slim("3.12").add_local_file("package.json", "/home/daytona/package.json")
image = Image.debian_slim("3.12").add_local_dir("src", "/home/daytona/src")
```

```typescript
const image = Image.debianSlim('3.12').addLocalFile('package.json', '/home/daytona/package.json')
const image = Image.debianSlim('3.12').addLocalDir('src', '/home/daytona/src')
```

```ruby
image = Daytona::Image.debian_slim('3.12').add_local_file('package.json', '/home/daytona/package.json')
image = Daytona::Image.debian_slim('3.12').add_local_dir('src', '/home/daytona/src')
```

#### Environment Configuration

```python
image = Image.debian_slim("3.12").env({"PROJECT_ROOT": "/home/daytona"})
image = Image.debian_slim("3.12").workdir("/home/daytona")
```

```typescript
const image = Image.debianSlim('3.12').env({ PROJECT_ROOT: '/home/daytona' })
const image = Image.debianSlim('3.12').workdir('/home/daytona')
```

```ruby
image = Daytona::Image.debian_slim('3.12').env('PROJECT_ROOT': '/home/daytona')
image = Daytona::Image.debian_slim('3.12').workdir('/home/daytona')
```

#### Commands and Entrypoints

```python
image = Image.debian_slim("3.12").run_commands(
    'apt-get update && apt-get install -y git',
    'groupadd -r daytona && useradd -r -g daytona -m daytona',
    'mkdir -p /home/daytona/workspace'
)
image = Image.debian_slim("3.12").entrypoint(["/bin/bash"])
image = Image.debian_slim("3.12").cmd(["/bin/bash"])
```

```typescript
const image = Image.debianSlim('3.12').runCommands(
    'apt-get update && apt-get install -y git',
    'groupadd -r daytona && useradd -r -g daytona -m daytona',
    'mkdir -p /home/daytona/workspace'
)
const image = Image.debianSlim('3.12').entrypoint(['/bin/bash'])
const image = Image.debianSlim('3.12').cmd(['/bin/bash'])
```

```ruby
image = Daytona::Image.debian_slim('3.12').run_commands(
  'apt-get update && apt-get install -y git',
  'groupadd -r daytona && useradd -r -g daytona -m daytona',
  'mkdir -p /home/daytona/workspace'
)
image = Daytona::Image.debian_slim('3.12').entrypoint(['/bin/bash'])
image = Daytona::Image.debian_slim('3.12').cmd(['/bin/bash'])
```

#### Dockerfile Integration

```python
image = Image.debian_slim("3.12").dockerfile_commands(["RUN echo 'Hello, world!'"])
image = Image.from_dockerfile("Dockerfile")
image = Image.from_dockerfile("app/Dockerfile").pip_install(["numpy"])
```

```typescript
const image = Image.debianSlim('3.12').dockerfileCommands(['RUN echo "Hello, world!"'])
const image = Image.fromDockerfile('Dockerfile')
const image = Image.fromDockerfile("app/Dockerfile").pipInstall(['numpy'])
```

### otel-collection
Experimental OpenTelemetry distributed tracing for Daytona SDK operations and sandbox telemetry; enable with config flag or env var, configure OTLP endpoint/headers, traces all SDK calls and sandbox metrics/logs/HTTP requests.

## OpenTelemetry Collection

Experimental feature for distributed tracing of Daytona SDK operations. Currently requires access request to support@daytona.io.

### Sandbox Telemetry Collection

Configure in Dashboard → Settings → Experimental:
- **OTLP Endpoint**: e.g., `https://otlp.nr-data.net`
- **OTLP Headers**: `key=value` format, e.g., `api-key=YOUR_API_KEY`

**Collected metrics:**
- `daytona.sandbox.cpu.utilization`, `daytona.sandbox.cpu.limit`
- `daytona.sandbox.memory.utilization`, `daytona.sandbox.memory.usage`, `daytona.sandbox.memory.limit`
- `daytona.sandbox.filesystem.utilization`, `daytona.sandbox.filesystem.usage`, `daytona.sandbox.filesystem.available`, `daytona.sandbox.filesystem.total`

**Collected data:**
- HTTP requests/responses
- Custom spans from application code
- Application logs (stdout/stderr), system logs, runtime errors

View in Dashboard → Sandbox Details → Logs/Traces/Metrics tabs. Data retained for 3 days; use external OTLP collector for longer retention.

### SDK Tracing Configuration

Enable with `otelEnabled: true` in config or `DAYTONA_EXPERIMENTAL_OTEL_ENABLED=true` environment variable.

**Python:**
```python
from daytona import Daytona, DaytonaConfig

async with Daytona(DaytonaConfig(_experimental={"otelEnabled": True})) as daytona:
    sandbox = await daytona.create()
    await sandbox.process.code_run("import numpy as np\nprint(np.__version__)")
    await sandbox.fs.upload_file("local.txt", "/home/daytona/remote.txt")
    await daytona.delete(sandbox)
```

**TypeScript:**
```typescript
import { Daytona } from '@daytonaio/sdk'

await using daytona = new Daytona({ _experimental: { otelEnabled: true } })
const sandbox = await daytona.create()
await sandbox.process.codeRun("import numpy as np\nprint(np.__version__)")
await sandbox.fs.uploadFile('local.txt', '/home/daytona/remote.txt')
await daytona.delete(sandbox)
```

**Go:**
```go
client, err := daytona.NewClientWithConfig(&types.DaytonaConfig{
    Experimental: &types.ExperimentalConfig{OtelEnabled: true},
})
defer client.Close(context.Background())
sandbox, err := client.Create(ctx, nil)
sandbox.Process.CodeRun(ctx, &types.CodeRunParams{Code: "import numpy as np\nprint(np.__version__)"})
sandbox.Fs.UploadFile(ctx, "local.txt", "/home/daytona/remote.txt")
client.Delete(ctx, sandbox, nil)
```

**Ruby:**
```ruby
config = Daytona::Config.new(_experimental: { 'otel_enabled' => true })
daytona = Daytona::Daytona.new(config)
begin
  sandbox = daytona.create
  sandbox.process.code_run("import numpy as np\nprint(np.__version__)")
  sandbox.fs.upload_file("local.txt", "/home/daytona/remote.txt")
  daytona.delete(sandbox)
ensure
  daytona.close
end
```

**OTLP Configuration (environment variables):**
```bash
OTEL_EXPORTER_OTLP_ENDPOINT=https://otlp.nr-data.net:4317
OTEL_EXPORTER_OTLP_HEADERS="api-key=your-api-key-here"
```

### Provider-Specific Configuration

**New Relic:**
```bash
OTEL_EXPORTER_OTLP_ENDPOINT=https://otlp.nr-data.net:4317
OTEL_EXPORTER_OTLP_HEADERS="api-key=YOUR_NEW_RELIC_LICENSE_KEY"
```

**Jaeger (Local):**
```bash
OTEL_EXPORTER_OTLP_ENDPOINT=http://localhost:4318
```

**Grafana Cloud:**
```bash
OTEL_EXPORTER_OTLP_ENDPOINT=https://otlp-gateway-prod-<region>.grafana.net/otlp
OTEL_EXPORTER_OTLP_HEADERS="Authorization=Basic <BASE64_ENCODED_CREDENTIALS>"
```

### What Gets Traced

**SDK Operations:**
- `create()`, `get()`, `findOne()`, `list()`, `start()`, `stop()`, `delete()`
- All sandbox, snapshot, volume operations (file system, code execution, process management)

**HTTP Requests:**
- All API calls to Daytona backend with duration and status codes
- Error information for failed requests

**Trace Attributes:**
- Service name and version
- HTTP method, URL, status code
- Request/response duration
- Error details
- Custom SDK operation metadata

### Troubleshooting

**Traces not appearing:**
- Verify `otelEnabled: true` in config
- Check OTLP endpoint and headers are correct
- Ensure Daytona instance is properly closed/disposed to flush traces

**Connection refused:**
- Verify OTLP endpoint URL is correct and accessible
- Check firewall rules

**Authentication errors:**
- Verify API key format matches provider requirements
- Check `OTEL_EXPORTER_OTLP_HEADERS` format (key=value pairs)

### Best Practices

1. Always close the client to ensure traces are flushed (use context managers/defer/ensure blocks)
2. Monitor trace volume; tracing increases network traffic and storage
3. Test OTEL configuration in development first
4. Configure trace sampling for high-volume applications to reduce costs

### Dashboard Examples

Examples available for New Relic and Grafana in the Daytona repository.

### file-system-operations
Sandbox file system operations: list, get info, create directories, upload/download (single/batch), delete, set permissions, find/replace text, move/rename files.

# File System Operations

Daytona's `fs` module provides comprehensive file system operations in sandboxes. File operations default to the sandbox user's home directory; use leading `/` for absolute paths.

## Basic Operations

### List Files and Directories

```python
files = sandbox.fs.list_files("workspace")
for file in files:
    print(f"{file.name}: dir={file.is_dir}, size={file.size}, modified={file.mod_time}")
```

```typescript
const files = await sandbox.fs.listFiles('workspace')
files.forEach(file => console.log(`${file.name}: ${file.isDir}, ${file.size}`))
```

### Get File Information

```python
info = sandbox.fs.get_file_info("workspace/data/file.txt")
print(f"Size: {info.size}, Modified: {info.mod_time}, Mode: {info.mode}")
if info.is_dir:
    print("Is directory")
```

### Create Directories

```python
sandbox.fs.create_folder("workspace/new-dir", "755")
```

```typescript
await sandbox.fs.createFolder('workspace/new-dir', '755')
```

### Upload Files

Single file:
```python
with open("local_file.txt", "rb") as f:
    sandbox.fs.upload_file(f.read(), "remote_file.txt")
```

```typescript
const fileContent = Buffer.from('Hello, World!')
await sandbox.fs.uploadFile(fileContent, 'data.txt')
```

Multiple files:
```python
files_to_upload = [
    FileUpload(source=b"Content 1", destination="data/file1.txt"),
    FileUpload(source=b"Content 2", destination="data/file2.txt"),
]
sandbox.fs.upload_files(files_to_upload)
```

```typescript
const files = [
  { source: Buffer.from('Content 1'), destination: 'data/file1.txt' },
  { source: Buffer.from('Content 2'), destination: 'data/file2.txt' },
]
await sandbox.fs.uploadFiles(files)
```

### Download Files

Single file:
```python
content = sandbox.fs.download_file("file1.txt")
with open("local_file.txt", "wb") as f:
    f.write(content)
```

```typescript
const downloadedFile = await sandbox.fs.downloadFile('file1.txt')
console.log(downloadedFile.toString())
```

Multiple files:
```python
files_to_download = [
    FileDownloadRequest(source="data/file1.txt"),  # to memory
    FileDownloadRequest(source="data/file2.txt", destination="local_file2.txt"),  # to disk
]
results = sandbox.fs.download_files(files_to_download)
for result in results:
    if result.error:
        print(f"Error: {result.error}")
    else:
        print(f"Downloaded to {result.result}")
```

```typescript
const files = [
  { source: 'data/file1.txt' },  // to memory
  { source: 'data/file2.txt', destination: 'local_file2.txt' },  // to disk
]
const results = await sandbox.fs.downloadFiles(files)
results.forEach(result => {
  if (result.error) console.error(`Error: ${result.error}`)
  else console.log(`Downloaded to ${result.result}`)
})
```

### Delete Files

```python
sandbox.fs.delete_file("workspace/file.txt")
sandbox.fs.delete_file("workspace/old_dir", recursive=True)
```

```typescript
await sandbox.fs.deleteFile('workspace/file.txt')
```

## Advanced Operations

### File Permissions

```python
sandbox.fs.set_file_permissions("workspace/file.txt", "644")
file_info = sandbox.fs.get_file_info("workspace/file.txt")
print(f"Permissions: {file_info.permissions}")
```

```typescript
await sandbox.fs.setFilePermissions('workspace/file.txt', { mode: '644' })
const fileInfo = await sandbox.fs.getFileDetails('workspace/file.txt')
console.log(`Permissions: ${fileInfo.permissions}`)
```

Set owner and group:
```python
sandbox.fs.set_file_permissions("workspace/file.txt", owner="daytona", group="daytona")
```

### Find and Replace Text

```python
results = sandbox.fs.find_files(path="workspace/src", pattern="text-of-interest")
for match in results:
    print(f"{match.file}:{match.line}: {match.content}")

sandbox.fs.replace_in_files(
    files=["workspace/file1.txt", "workspace/file2.txt"],
    pattern="old_text",
    new_value="new_text"
)
```

```typescript
const results = await sandbox.fs.findFiles({
    path: "workspace/src",
    pattern: "text-of-interest"
})
results.forEach(match => console.log(`${match.file}:${match.line}: ${match.content}`))

await sandbox.fs.replaceInFiles(
    ["workspace/file1.txt", "workspace/file2.txt"],
    "old_text",
    "new_text"
)
```

### Move or Rename Files

```python
sandbox.fs.move_files("workspace/data/old_name.txt", "workspace/data/new_name.txt")
sandbox.fs.move_files("workspace/data/file.txt", "workspace/archive/file.txt")
sandbox.fs.move_files("workspace/old_dir", "workspace/new_dir")
```

```typescript
await sandbox.fs.moveFiles('app/temp/data.json', 'app/data/data.json')
```

## API Endpoints

- List files: `GET /toolbox/{sandboxId}/files`
- Get file info: `GET /toolbox/{sandboxId}/files/info?path=`
- Create folder: `POST /toolbox/{sandboxId}/files/folder?path=&mode=`
- Upload file: `POST /toolbox/{sandboxId}/files/upload?path=`
- Upload multiple: `POST /toolbox/{sandboxId}/files/bulk-upload`
- Download file: `GET /toolbox/{sandboxId}/files/download?path=`
- Download multiple: `POST /toolbox/{sandboxId}/files/bulk-download`
- Delete: `DELETE /toolbox/{sandboxId}/files?path=`
- Set permissions: `POST /toolbox/{sandboxId}/files/permissions?path=`
- Find text: `GET /toolbox/{sandboxId}/files/find?path=&pattern=`
- Replace text: `POST /toolbox/{sandboxId}/files/replace`
- Move/rename: `POST /toolbox/{sandboxId}/files/move?source=&destination=`

### getting-started
Dashboard, SDKs (Python/TypeScript/Ruby/Go), CLI, REST API, and MCP server for sandbox management; examples for creating sandboxes with custom resources, ephemeral mode, snapshots, declarative images, volumes, Git repos, and labels.

## Dashboard

Daytona Dashboard at https://app.daytona.io/ is the visual UI for managing sandboxes, API keys, and usage.

## SDKs

Daytona provides SDKs for Python, TypeScript, Ruby, and Go for programmatic sandbox interaction including lifecycle management, code execution, and resource access.

## CLI

Install with:
- Mac/Linux: `brew install daytonaio/cli/daytona`
- Windows: `powershell -Command "irm https://get.daytona.io/windows | iex"`

Upgrade with `brew upgrade daytonaio/cli/daytona` (Mac/Linux) or the same Windows command.

Use `daytona` command for CLI operations. See CLI reference for all commands.

## API

RESTful API for sandbox lifecycle, snapshots, and more. See API reference.

## MCP Server

Model Context Protocol server for AI agents (Claude, Cursor, Windsurf):
```bash
daytona mcp init [claude/cursor/windsurf]
```

## Multiple Runtime Support

TypeScript SDK works across Node.js, browsers, and serverless (Cloudflare Workers, AWS Lambda, Azure Functions).

### Vite Configuration

Add to `vite.config.ts`:
```typescript
import { nodePolyfills } from 'vite-plugin-node-polyfills'

export default defineConfig({
  plugins: [
    nodePolyfills({
      globals: { global: true, process: true, Buffer: true },
      overrides: { path: 'path-browserify-win32' },
    }),
  ],
})
```

### Next.js Configuration

Add to `next.config.ts`:
```typescript
import type { NextConfig } from 'next'
import NodePolyfillPlugin from 'node-polyfill-webpack-plugin'
import { env, nodeless } from 'unenv'

const { alias: turbopackAlias } = env(nodeless, {})

const nextConfig: NextConfig = {
  experimental: {
    turbo: { resolveAlias: { ...turbopackAlias } },
  },
  webpack: (config, { isServer }) => {
    if (!isServer) config.plugins.push(new NodePolyfillPlugin())
    return config
  },
}

export default nextConfig
```

## Examples

### Create a sandbox

Python:
```python
from daytona import Daytona
daytona = Daytona()
sandbox = daytona.create()
print(f"Sandbox ID: {sandbox.id}")
```

TypeScript:
```typescript
import { Daytona } from '@daytonaio/sdk'
const daytona = new Daytona()
const sandbox = await daytona.create()
console.log(`Sandbox ID: ${sandbox.id}`)
```

Go:
```go
client, _ := daytona.NewClient()
sandbox, _ := client.Create(context.Background(), nil)
fmt.Printf("Sandbox ID: %s\n", sandbox.ID)
```

Ruby:
```ruby
daytona = Daytona::Daytona.new
sandbox = daytona.create
puts "Sandbox ID: #{sandbox.id}"
```

CLI: `daytona create`

API: `curl 'https://app.daytona.io/api/sandbox' --request POST --header 'Authorization: Bearer <API_KEY>' --header 'Content-Type: application/json' --data '{}'`

### Create and run code in a sandbox

Python:
```python
daytona = Daytona()
sandbox = daytona.create()
response = sandbox.process.exec("echo 'Hello, World!'")
print(response.result)
sandbox.delete()
```

TypeScript:
```typescript
const daytona = new Daytona()
const sandbox = await daytona.create()
const response = await sandbox.process.executeCommand('echo "Hello, World!"')
console.log(response.result)
await sandbox.delete()
```

Go:
```go
sandbox, _ := client.Create(context.Background(), nil)
response, _ := sandbox.Process.ExecuteCommand(context.Background(), "echo 'Hello, World!'")
fmt.Println(response.Result)
sandbox.Delete(context.Background())
```

Ruby:
```ruby
sandbox = daytona.create
response = sandbox.process.exec(command: "echo 'Hello, World!'")
puts response.result
daytona.delete(sandbox)
```

CLI:
```shell
daytona create --name my-sandbox
daytona exec my-sandbox -- echo 'Hello, World!'
daytona delete my-sandbox
```

API:
```bash
curl 'https://app.daytona.io/api/sandbox' --request POST --header 'Authorization: Bearer <API_KEY>' --header 'Content-Type: application/json' --data '{}'
curl 'https://proxy.app.daytona.io/toolbox/{sandboxId}/process/execute' --request POST --header 'Authorization: Bearer <API_KEY>' --header 'Content-Type: application/json' --data '{"command": "echo '\''Hello, World!'\''"}'
curl 'https://app.daytona.io/api/sandbox/{sandboxId}' --request DELETE --header 'Authorization: Bearer <API_KEY>'
```

### Create a sandbox with custom resources

Python:
```python
sandbox = daytona.create(
    CreateSandboxFromImageParams(
        image=Image.debian_slim("3.12"),
        resources=Resources(cpu=2, memory=4, disk=8)
    )
)
```

TypeScript:
```typescript
const sandbox = await daytona.create({
    image: Image.debianSlim('3.12'),
    resources: { cpu: 2, memory: 4, disk: 8 }
})
```

Go:
```go
sandbox, _ := client.Create(context.Background(), types.ImageParams{
    Image: daytona.DebianSlim(nil),
    Resources: &types.Resources{ CPU: 2, Memory: 4, Disk: 8 },
})
```

Ruby:
```ruby
sandbox = daytona.create(
    Daytona::CreateSandboxFromImageParams.new(
        image: Daytona::Image.debian_slim('3.12'),
        resources: Daytona::Resources.new(cpu: 2, memory: 4, disk: 8)
    )
)
```

CLI: `daytona create --class small`

API: `curl 'https://app.daytona.io/api/sandbox' --request POST --header 'Authorization: Bearer <API_KEY>' --header 'Content-Type: application/json' --data '{"cpu": 2, "memory": 4, "disk": 8}'`

### Create an ephemeral sandbox

Python:
```python
sandbox = daytona.create(
    CreateSandboxFromSnapshotParams(ephemeral=True, auto_stop_interval=5)
)
```

TypeScript:
```typescript
const sandbox = await daytona.create({
    ephemeral: true,
    autoStopInterval: 5
})
```

Go:
```go
autoStop := 5
sandbox, _ := client.Create(context.Background(), types.SnapshotParams{
    SandboxBaseParams: types.SandboxBaseParams{
        Ephemeral: true,
        AutoStopInterval: &autoStop,
    },
})
```

Ruby:
```ruby
sandbox = daytona.create(
    Daytona::CreateSandboxFromSnapshotParams.new(ephemeral: true, auto_stop_interval: 5)
)
```

CLI: `daytona create --auto-stop 5 --auto-delete 0`

API: `curl 'https://app.daytona.io/api/sandbox' --request POST --header 'Authorization: Bearer <API_KEY>' --header 'Content-Type: application/json' --data '{"autoStopInterval": 5, "autoDeleteInterval": 0}'`

### Create a sandbox from a snapshot

Python:
```python
sandbox = daytona.create(
    CreateSandboxFromSnapshotParams(
        snapshot="my-snapshot-name",
        language="python"
    )
)
```

TypeScript:
```typescript
const sandbox = await daytona.create({
    snapshot: 'my-snapshot-name',
    language: 'typescript'
})
```

Go:
```go
sandbox, _ := client.Create(context.Background(), types.SnapshotParams{
    Snapshot: "my-snapshot-name",
    SandboxBaseParams: types.SandboxBaseParams{
        Language: types.CodeLanguagePython,
    },
})
```

Ruby:
```ruby
sandbox = daytona.create(
    Daytona::CreateSandboxFromSnapshotParams.new(
        snapshot: 'my-snapshot-name',
        language: Daytona::CodeLanguage::PYTHON
    )
)
```

CLI: `daytona create --snapshot my-snapshot-name`

API: `curl 'https://app.daytona.io/api/sandbox' --request POST --header 'Authorization: Bearer <API_KEY>' --header 'Content-Type: application/json' --data '{"snapshot": "my-snapshot-name"}'`

### Create a sandbox with a declarative image

Python:
```python
image = (
    Image.debian_slim("3.12")
    .pip_install(["requests", "pandas", "numpy"])
    .workdir("/home/daytona")
)
sandbox = daytona.create(
    CreateSandboxFromImageParams(image=image),
    on_snapshot_create_logs=print
)
```

TypeScript:
```typescript
const image = Image.debianSlim('3.12')
    .pipInstall(['requests', 'pandas', 'numpy'])
    .workdir('/home/daytona')
const sandbox = await daytona.create(
    { image },
    { onSnapshotCreateLogs: console.log }
)
```

Go:
```go
image := daytona.DebianSlim(nil).
    PipInstall([]string{"requests", "pandas", "numpy"}).
    Workdir("/home/daytona")
sandbox, _ := client.Create(context.Background(), types.ImageParams{ Image: image })
```

Ruby:
```ruby
image = Daytona::Image
    .debian_slim('3.12')
    .pip_install(['requests', 'pandas', 'numpy'])
    .workdir('/home/daytona')
sandbox = daytona.create(
    Daytona::CreateSandboxFromImageParams.new(image: image),
    on_snapshot_create_logs: proc { |chunk| puts chunk }
)
```

CLI: `daytona create --dockerfile ./Dockerfile`

API: `curl 'https://app.daytona.io/api/sandbox' --request POST --header 'Authorization: Bearer <API_KEY>' --header 'Content-Type: application/json' --data '{"buildInfo": {"dockerfileContent": "FROM python:3.12-slim\nRUN pip install requests pandas numpy\nWORKDIR /home/daytona"}}'`

### Create a sandbox with volumes

Python:
```python
volume = daytona.volume.get("my-volume", create=True)
sandbox = daytona.create(
    CreateSandboxFromSnapshotParams(
        volumes=[VolumeMount(volume_id=volume.id, mount_path="/home/daytona/data")]
    )
)
```

TypeScript:
```typescript
const volume = await daytona.volume.get('my-volume', true)
const sandbox = await daytona.create({
    volumes: [{ volumeId: volume.id, mountPath: '/home/daytona/data' }]
})
```

Go:
```go
volume, _ := client.Volume.Get(context.Background(), "my-volume")
sandbox, _ := client.Create(context.Background(), types.SnapshotParams{
    SandboxBaseParams: types.SandboxBaseParams{
        Volumes: []types.VolumeMount{{
            VolumeID: volume.ID,
            MountPath: "/home/daytona/data",
        }},
    },
})
```

Ruby:
```ruby
volume = daytona.volume.get('my-volume', create: true)
sandbox = daytona.create(
    Daytona::CreateSandboxFromSnapshotParams.new(
        volumes: [DaytonaApiClient::SandboxVolume.new(
            volume_id: volume.id,
            mount_path: '/home/daytona/data'
        )]
    )
)
```

CLI:
```shell
daytona volume create my-volume
daytona create --volume my-volume:/home/daytona/data
```

API: `curl 'https://app.daytona.io/api/sandbox' --request POST --header 'Authorization: Bearer <API_KEY>' --header 'Content-Type: application/json' --data '{"volumes": [{"volumeId": "<VOLUME_ID>", "mountPath": "/home/daytona/data"}]}'`

### Create a sandbox with a Git repository cloned

Python:
```python
sandbox = daytona.create()
sandbox.git.clone("https://github.com/daytonaio/daytona.git", "/home/daytona/daytona")
status = sandbox.git.status("/home/daytona/daytona")
print(f"Branch: {status.current_branch}")
```

TypeScript:
```typescript
const sandbox = await daytona.create()
await sandbox.git.clone('https://github.com/daytonaio/daytona.git', '/home/daytona/daytona')
const status = await sandbox.git.status('/home/daytona/daytona')
console.log(`Branch: ${status.currentBranch}`)
```

Go:
```go
sandbox, _ := client.Create(context.Background(), nil)
sandbox.Git.Clone(context.Background(), "https://github.com/daytonaio/daytona.git", "/home/daytona/daytona")
status, _ := sandbox.Git.Status(context.Background(), "/home/daytona/daytona")
fmt.Printf("Branch: %s\n", status.CurrentBranch)
```

Ruby:
```ruby
sandbox = daytona.create
sandbox.git.clone(url: "https://github.com/daytonaio/daytona.git", path: "/home/daytona/daytona")
status = sandbox.git.status("/home/daytona/daytona")
puts "Branch: #{status.current_branch}"
```

API:
```bash
curl 'https://app.daytona.io/api/sandbox' --request POST --header 'Authorization: Bearer <API_KEY>' --header 'Content-Type: application/json' --data '{}'
curl 'https://proxy.app.daytona.io/toolbox/{sandboxId}/git/clone' --request POST --header 'Authorization: Bearer <API_KEY>' --header 'Content-Type: application/json' --data '{"url": "https://github.com/daytonaio/daytona.git", "path": "/home/daytona/daytona"}'
curl 'https://proxy.app.daytona.io/toolbox/{sandboxId}/git/status?path=/home/daytona/daytona' --header 'Authorization: Bearer <API_KEY>'
```

### Create a sandbox with labels

Python:
```python
sandbox = daytona.create(
    CreateSandboxFromSnapshotParams(labels={"project": "my-app", "env": "dev"})
)
found = daytona.find_one(labels={"project": "my-app"})
print(f"Found sandbox: {found.id}")
```

TypeScript:
```typescript
const sandbox = await daytona.create({
    labels: { project: 'my-app', env: 'dev' }
})
const found = await daytona.findOne({ labels: { project: 'my-app' } })
console.log(`Found sandbox: ${found.id}`)
```

Go:
```go
labels := map[string]string{"project": "my-app", "env": "dev"}
sandbox, _ := client.Create(context.Background(), types.SnapshotParams{
    SandboxBaseParams: types.SandboxBaseParams{Labels: labels},
})
found, _ := client.FindOne(context.Background(), nil, map[string]string{"project": "my-app"})
fmt.Printf("Found sandbox: %s\n", found.ID)
```

Ruby:
```ruby
sandbox = daytona.create(
    Daytona::CreateSandboxFromSnapshotParams.new(labels: { 'project' => 'my-app', 'env' => 'dev' })
)
found = daytona.find_one(labels: { 'project' => 'my-app' })
puts "Found sandbox: #{found.id}"
```

CLI: `daytona create --label project=my-app --label env=dev`

API: `curl 'https://app.daytona.io/api/sandbox' --request POST --header 'Authorization: Bearer <API_KEY>' --header 'Content-Type: application/json' --data '{"labels": {"project": "my-app", "env": "dev"}}'`


### git-operations.mdx
Clone, branch, stage, commit, push/pull Git repositories in sandboxes with optional authentication across Python/TypeScript/Ruby/Go SDKs and REST API.

## Git Operations

Daytona provides built-in Git support through the `git` module in sandboxes. Paths are relative to the sandbox working directory (WORKDIR from Dockerfile, or home directory if not specified), but absolute paths starting with `/` are also supported.

### Clone Repositories

Clone public or private repositories with optional authentication and branch selection:

```python
# Python
sandbox.git.clone("https://github.com/user/repo.git", "workspace/repo")
sandbox.git.clone("https://github.com/user/repo.git", "workspace/repo", 
                  username="git", password="token", branch="develop")
```

```typescript
// TypeScript
await sandbox.git.clone("https://github.com/user/repo.git", "workspace/repo");
await sandbox.git.clone("https://github.com/user/repo.git", "workspace/repo",
                        "develop", undefined, "git", "token");
```

```ruby
# Ruby
sandbox.git.clone(url: 'https://github.com/user/repo.git', path: 'workspace/repo',
                  username: 'git', password: 'token', branch: 'develop')
```

```go
// Go
sandbox.Git.Clone(ctx, "https://github.com/user/repo.git", "workspace/repo")
sandbox.Git.Clone(ctx, "https://github.com/user/repo.git", "workspace/repo",
                  options.WithUsername("git"), options.WithPassword("token"), 
                  options.WithBranch("develop"))
```

API: `POST /git/clone` with `url`, `path`, `branch`, `username`, `password`, `commit_id`

### Repository Status

Get current branch, commits ahead/behind, and file status; list branches:

```python
status = sandbox.git.status("workspace/repo")
print(f"Branch: {status.current_branch}, Ahead: {status.ahead}, Behind: {status.behind}")
for file in status.file_status:
    print(f"File: {file.name}")
branches = sandbox.git.branches("workspace/repo")
```

```typescript
const status = await sandbox.git.status("workspace/repo");
console.log(`Branch: ${status.currentBranch}, Ahead: ${status.ahead}, Behind: ${status.behind}`);
const response = await sandbox.git.branches("workspace/repo");
```

```ruby
status = sandbox.git.status('workspace/repo')
puts "Branch: #{status.current_branch}, Ahead: #{status.ahead}, Behind: #{status.behind}"
response = sandbox.git.branches('workspace/repo')
```

```go
status, _ := sandbox.Git.Status(ctx, "workspace/repo")
fmt.Printf("Branch: %s, Ahead: %d, Behind: %d\n", status.CurrentBranch, status.Ahead, status.Behind)
branches, _ := sandbox.Git.Branches(ctx, "workspace/repo")
```

API: `GET /git/status?path=`

### Branch Operations

Create, checkout, and delete branches:

```python
sandbox.git.create_branch("workspace/repo", "new-feature")
sandbox.git.checkout_branch("workspace/repo", "feature-branch")
sandbox.git.delete_branch("workspace/repo", "old-feature")
```

```typescript
await git.createBranch('workspace/repo', 'new-feature');
await git.checkoutBranch('workspace/repo', 'feature-branch');
await git.deleteBranch('workspace/repo', 'old-feature');
```

```ruby
sandbox.git.create_branch('workspace/repo', 'new-feature')
sandbox.git.checkout_branch('workspace/repo', 'feature-branch')
sandbox.git.delete_branch('workspace/repo', 'old-feature')
```

```go
sandbox.Git.CreateBranch(ctx, "workspace/repo", "new-feature")
sandbox.Git.Checkout(ctx, "workspace/repo", "feature-branch")
sandbox.Git.DeleteBranch(ctx, "workspace/repo", "old-feature")
```

API: `POST /git/branches` (create), `POST /git/checkout` (checkout), `DELETE /git/branches` (delete)

### Stage and Commit Changes

Stage files and commit with author information:

```python
sandbox.git.add("workspace/repo", ["file.txt", "src/main.py", "README.md"])
sandbox.git.commit(path="workspace/repo", message="Update docs", 
                   author="John Doe", email="john@example.com", allow_empty=True)
```

```typescript
await git.add('workspace/repo', ['file.txt', '.']);
await git.commit('workspace/repo', 'Update docs', 'John Doe', 'john@example.com', true);
```

```ruby
sandbox.git.add('workspace/repo', ['file.txt'])
sandbox.git.commit('workspace/repo', 'Update docs', 'John Doe', 'john@example.com', true)
```

```go
sandbox.Git.Add(ctx, "workspace/repo", []string{"file.txt", "."})
response, _ := sandbox.Git.Commit(ctx, "workspace/repo", "Update docs", 
                                  "John Doe", "john@example.com", 
                                  options.WithAllowEmpty(true))
fmt.Printf("Commit SHA: %s\n", response.SHA)
```

API: `POST /git/add` with `files` array and `path`; `POST /git/commit` with `message`, `author`, `email`, `allow_empty`, `path`

### Push and Pull Changes

Push to and pull from remote repositories with optional authentication:

```python
sandbox.git.push("workspace/repo")
sandbox.git.push(path="workspace/repo", username="user", password="token")
sandbox.git.pull("workspace/repo")
sandbox.git.pull(path="workspace/repo", username="user", password="token")
```

```typescript
await git.push('workspace/repo');
await git.push('workspace/repo', 'user', 'token');
await git.pull('workspace/repo');
await git.pull('workspace/repo', 'user', 'token');
```

```ruby
sandbox.git.push('workspace/repo')
sandbox.git.pull('workspace/repo')
```

```go
sandbox.Git.Push(ctx, "workspace/repo")
sandbox.Git.Push(ctx, "workspace/repo", options.WithPushUsername("user"), 
                 options.WithPushPassword("token"))
sandbox.Git.Pull(ctx, "workspace/repo")
sandbox.Git.Pull(ctx, "workspace/repo", options.WithPullUsername("user"), 
                 options.WithPullPassword("token"))
```

API: `POST /git/push` and `POST /git/pull` with `path`, `username`, `password`

### getting_started
Account creation, API key generation, SDK installation (Python/TypeScript/Ruby), and sandbox creation/code execution workflow.

## Overview

Daytona is an open-source, secure and elastic infrastructure for running AI-generated code. It provides isolated sandbox environments managed programmatically via SDK (Python, TypeScript, Ruby).

## Account Setup

1. Create account at Daytona Dashboard with email/password or Google/GitHub
2. Generate API key from dashboard (save securely, won't be shown again)

## Installation

```bash
# Python
pip install daytona

# TypeScript
npm install @daytonaio/sdk

# Ruby
gem install daytona
```

## Configuration

Daytona supports configuration via: in-code, environment variables, .env file, or default values.

## Create and Run Code in Sandbox

**Python:**
```python
from daytona import Daytona, DaytonaConfig

config = DaytonaConfig(api_key="YOUR_API_KEY")
daytona = Daytona(config)
sandbox = daytona.create()

response = sandbox.process.code_run('print("Hello World")')
if response.exit_code != 0:
    print(f"Error: {response.exit_code} {response.result}")
else:
    print(response.result)

sandbox.delete()
```

**TypeScript:**
```typescript
import { Daytona } from '@daytonaio/sdk'

const daytona = new Daytona({ apiKey: 'YOUR_API_KEY' })
const sandbox = await daytona.create({ language: 'typescript' })

const response = await sandbox.process.codeRun('console.log("Hello World")')
if (response.exitCode !== 0) {
    console.error(`Error: ${response.exitCode} ${response.result}`)
} else {
    console.log(response.result)
}

await sandbox.delete()
```

**Ruby:**
```ruby
require 'daytona'

config = Daytona::Config.new(api_key: 'your-api-key')
daytona = Daytona::Daytona.new(config)
sandbox = daytona.create

response = sandbox.process.code_run(code: 'print("Hello World")')
if response.exit_code != 0
    puts "Error: #{response.exit_code} #{response.result}"
else
    puts response.result
end

daytona.delete(sandbox)
```

## Running Code

Execute with: `python main.py`, `npx tsx index.mts`, or `ruby main.rb`

## Additional Resources

LLM context files available: llms-full.txt and llms.txt for faster AI agent development.

### language_server_protocol
LSP support for Python/TypeScript in sandboxes with code completions, diagnostics, file tracking, and symbol search across SDKs and API.

## Language Server Protocol (LSP) Support

Daytona provides LSP support through sandbox instances, enabling code completion, diagnostics, and other advanced language features.

### Creating LSP Servers

Create LSP servers with `create_lsp_server()`. The `path_to_project` argument is relative to the sandbox working directory (specified by WORKDIR in Dockerfile, or user home directory by default). Leading `/` makes it absolute.

```python
from daytona import Daytona, LspLanguageId
daytona = Daytona()
sandbox = daytona.create()
lsp_server = sandbox.create_lsp_server(
    language_id=LspLanguageId.PYTHON,
    path_to_project="workspace/project"
)
```

```typescript
import { Daytona, LspLanguageId } from '@daytonaio/sdk'
const daytona = new Daytona()
const sandbox = await daytona.create({ language: 'typescript' })
const lspServer = await sandbox.createLspServer(
  LspLanguageId.TYPESCRIPT,
  'workspace/project'
)
```

```ruby
require 'daytona'
daytona = Daytona::Daytona.new
sandbox = daytona.create
lsp_server = sandbox.create_lsp_server(
  language_id: Daytona::LspServer::Language::PYTHON,
  path_to_project: 'workspace/project'
)
```

```go
client, err := daytona.NewClient()
sandbox, err := client.Create(context.Background(), nil)
lsp := sandbox.Lsp(types.LspLanguagePython, "workspace/project")
```

**Supported languages:** `LspLanguageId.PYTHON`, `LspLanguageId.TYPESCRIPT`

### Starting and Stopping LSP Servers

```python
lsp = sandbox.create_lsp_server("typescript", "workspace/project")
lsp.start()  # Initialize
# ... use LSP features ...
lsp.stop()   # Clean up
```

```typescript
const lsp = await sandbox.createLspServer('typescript', 'workspace/project')
await lsp.start()
// ... use LSP features ...
await lsp.stop()
```

```ruby
lsp = sandbox.create_lsp_server(language_id: Daytona::LspServer::Language::PYTHON, path_to_project: 'workspace/project')
lsp.start
lsp.stop
```

```go
lsp := sandbox.Lsp(types.LspLanguagePython, "workspace/project")
err := lsp.Start(ctx)
// ... use LSP features ...
err := lsp.Stop(ctx)
```

```bash
# API
curl 'https://proxy.app.daytona.io/toolbox/{sandboxId}/lsp/start' \
  --request POST \
  --header 'Content-Type: application/json' \
  --data '{"languageId": "", "pathToProject": ""}'

curl 'https://proxy.app.daytona.io/toolbox/{sandboxId}/lsp/stop' \
  --request POST \
  --header 'Content-Type: application/json' \
  --data '{"languageId": "", "pathToProject": ""}'
```

### Code Completions

Get code completions at a specific position in a file:

```python
completions = lsp_server.completions(
    path="workspace/project/main.py",
    position={"line": 10, "character": 15}
)
```

```typescript
const completions = await lspServer.completions('workspace/project/main.ts', {
  line: 10,
  character: 15,
})
```

```ruby
completions = lsp_server.completions(
  path: 'workspace/project/main.py',
  position: { line: 10, character: 15 }
)
```

```go
completions, err := lsp.Completions(ctx, "workspace/project/main.py",
  types.Position{Line: 10, Character: 15},
)
```

```bash
curl 'https://proxy.app.daytona.io/toolbox/{sandboxId}/lsp/completions' \
  --request POST \
  --header 'Content-Type: application/json' \
  --data '{
  "context": {"triggerCharacter": "", "triggerKind": 1},
  "languageId": "",
  "pathToProject": "",
  "position": {"character": 1, "line": 1},
  "uri": ""
}'
```

### File Notifications

Notify the LSP server when files are opened or closed to enable diagnostics and completion tracking:

```python
lsp_server.did_open("workspace/project/main.py")
lsp_server.did_close("workspace/project/main.py")
```

```typescript
await lspServer.didOpen('workspace/project/main.ts')
await lspServer.didClose('workspace/project/main.ts')
```

```ruby
lsp_server.did_open('workspace/project/main.py')
lsp_server.did_close('workspace/project/main.py')
```

```go
err := lsp.DidOpen(ctx, "workspace/project/main.py")
err := lsp.DidClose(ctx, "workspace/project/main.py")
```

```bash
curl 'https://proxy.app.daytona.io/toolbox/{sandboxId}/lsp/did-open' \
  --request POST \
  --header 'Content-Type: application/json' \
  --data '{"languageId": "", "pathToProject": "", "uri": ""}'

curl 'https://proxy.app.daytona.io/toolbox/{sandboxId}/lsp/did-close' \
  --request POST \
  --header 'Content-Type: application/json' \
  --data '{"languageId": "", "pathToProject": "", "uri": ""}'
```

### Document Symbols

Retrieve symbols (functions, classes, variables, etc.) from a document:

```python
symbols = lsp_server.document_symbols("workspace/project/main.py")
for symbol in symbols:
    print(f"Symbol: {symbol.name}, Kind: {symbol.kind}")
```

```typescript
const symbols = await lspServer.documentSymbols('workspace/project/main.ts')
symbols.forEach((symbol) => {
  console.log(`Symbol: ${symbol.name}, Kind: ${symbol.kind}`)
})
```

```ruby
symbols = lsp_server.document_symbols('workspace/project/main.py')
symbols.each { |symbol| puts "Symbol: #{symbol.name}, Kind: #{symbol.kind}" }
```

```go
symbols, err := lsp.DocumentSymbols(ctx, "workspace/project/main.py")
for _, symbol := range symbols {
  fmt.Printf("Symbol: %v\n", symbol)
}
```

```bash
curl 'https://proxy.app.daytona.io/toolbox/{sandboxId}/lsp/document-symbols?languageId=&pathToProject=&uri='
```

### Sandbox Symbols

Search for symbols across all files in the sandbox:

```python
symbols = lsp_server.sandbox_symbols("MyClass")
for symbol in symbols:
    print(f"Found: {symbol.name} at {symbol.location}")
```

```typescript
const symbols = await lspServer.sandboxSymbols('MyClass')
symbols.forEach((symbol) => {
  console.log(`Found: ${symbol.name} at ${symbol.location}`)
})
```

```ruby
symbols = lsp_server.sandbox_symbols('MyClass')
symbols.each { |symbol| puts "Found: #{symbol.name} at #{symbol.location}" }
```

```go
symbols, err := lsp.SandboxSymbols(ctx, "MyClass")
for _, symbol := range symbols {
  fmt.Printf("Found: %v\n", symbol)
}
```

```bash
curl 'https://proxy.app.daytona.io/toolbox/{sandboxId}/lsp/workspacesymbols?query=&languageId=&pathToProject='
```

### limits
Resource and API rate limits by tier with retry strategies and monitoring headers.

## Resources

Resources are shared across all running sandboxes. Organizations are placed into tiers based on verification status with access to a compute pool of CPU cores, RAM, and disk space. Limits apply to the organization's default region.

| Tier | vCPU / RAM / Storage | Requirements |
|------|----------------------|--------------|
| Tier 1 | 10 / 10GiB / 30GiB | Email verified |
| Tier 2 | 100 / 200GiB / 300GiB | Credit card + $25 top-up + GitHub connected |
| Tier 3 | 250 / 500GiB / 2000GiB | Business email + $500 top-up |
| Tier 4 | 500 / 1000GiB / 5000GiB | $2000 top-up every 30 days |
| Custom | Custom | Contact support@daytona.io |

Upgrade tiers in the Daytona Dashboard.

### Resource usage by sandbox state

| State | vCPU | Memory | Storage | Notes |
|-------|------|--------|---------|-------|
| Running | ✅ | ✅ | ✅ | Counts against all limits |
| Stopped | ❌ | ❌ | ✅ | Frees CPU & memory, storage still used |
| Archived | ❌ | ❌ | ❌ | Data in cold storage, no quota impact |
| Deleted | ❌ | ❌ | ❌ | All resources freed |

## Rate limits

Rate limits control API requests per time window, applied per tier and authentication status. Tracked per organization for authenticated requests.

| Tier | General Requests/min | Sandbox Creation/min | Sandbox Lifecycle/min |
|------|---------------------|----------------------|----------------------|
| Tier 1 | 10,000 | 300 | 10,000 |
| Tier 2 | 20,000 | 400 | 20,000 |
| Tier 3 | 40,000 | 500 | 40,000 |
| Tier 4 | 50,000 | 600 | 50,000 |
| Custom | Custom | Custom | Custom |

**General requests** include: listing sandboxes, getting sandbox details, retrieving regions, listing snapshots, managing volumes, viewing audit logs, and other read/management operations.

**Sandbox creation** applies to all creation methods: from snapshots, declarative builds, `daytona.create()` SDK calls, and POST `/api/sandbox` requests.

**Sandbox lifecycle operations** apply to: starting, stopping, deleting, archiving sandboxes, and corresponding SDK methods.

### Rate limit responses

Exceeding limits returns:
- HTTP Status: `429 Too Many Requests`
- JSON body with rate limit details
- `Retry-After` header with seconds to wait

### Rate limit headers

All responses include rate limit headers with suffix based on throttler type (`-anonymous`, `-authenticated`, `-sandbox-create`, `-sandbox-lifecycle`):

| Header | Description |
|--------|-------------|
| `X-RateLimit-Limit-{throttler}` | Max requests in time window |
| `X-RateLimit-Remaining-{throttler}` | Requests remaining in current window |
| `X-RateLimit-Reset-{throttler}` | Seconds until window resets |
| `Retry-After-{throttler}` | Seconds to wait before retry (when exceeded) |

### Error handling

Python and TypeScript SDKs raise `DaytonaRateLimitError` with `headers` and `statusCode` properties. Headers support case-insensitive access.

```typescript
try {
  await daytona.create({ snapshot: 'my-snapshot' })
} catch (error) {
  if (error instanceof DaytonaRateLimitError) {
    console.log(error.headers?.get('x-ratelimit-remaining-sandbox-create'))
    console.log(error.headers?.get('X-RateLimit-Remaining-Sandbox-Create')) // case-insensitive
  }
}
```

```python
try:
  daytona.create(snapshot="my-snapshot")
except DaytonaRateLimitError as e:
  print(e.headers['x-ratelimit-remaining-sandbox-create'])
  print(e.headers['X-RateLimit-Remaining-Sandbox-Create'])  # case-insensitive
```

Error response format:
```json
{
  "statusCode": 429,
  "message": "Rate limit exceeded",
  "error": "Too Many Requests"
}
```

## Best practices

**Handle 429 errors gracefully** with exponential backoff retry logic:

```typescript
async function createSandboxWithRetry() {
  let retries = 0
  const maxRetries = 5

  while (retries < maxRetries) {
    try {
      return await daytona.create({ snapshot: 'my-snapshot' })
    } catch (error) {
      if (error instanceof DaytonaRateLimitError && retries < maxRetries - 1) {
        const retryAfter = error.headers?.get('retry-after-sandbox-create')
        const delay = retryAfter
          ? parseInt(retryAfter) * 1000
          : Math.pow(2, retries) * 1000
        await new Promise(resolve => setTimeout(resolve, delay))
        retries++
      } else {
        throw error
      }
    }
  }
}
```

**Monitor rate limit headers** to track consumption and implement proactive throttling before hitting limits.

**Cache API responses** that don't frequently change: sandbox lists, available regions, snapshot information.

**Batch and optimize operations** by creating multiple sandboxes in parallel (within limits) rather than sequentially. Reuse existing sandboxes when possible.

**Manage sandbox lifecycle efficiently**: archive instead of delete/recreate, stop when not in use, use auto-stop intervals for automatic management.

**Implement request queuing** to prevent bursts exceeding limits. Use webhooks instead of polling for state changes. Monitor and alert on 429 errors.

### linked-accounts
Link/unlink Google or GitHub accounts in Daytona Dashboard; GitHub linking enables Tier 2 upgrade.

## Supported Providers

Daytona supports linking accounts from:
- Google
- GitHub

Linking a GitHub account is required to automatically upgrade your organization to Tier 2.

## Link Account

1. Navigate to Daytona Dashboard account settings
2. Click the **Link Account** button next to the desired provider
3. Follow the prompts to complete linking

## Unlink Account

1. Navigate to Daytona Dashboard account settings
2. Click the **Unlink** button next to the provider
3. Follow the prompts to complete unlinking

### log-streaming
Real-time log streaming from sandbox processes with separate stdout/stderr callbacks (async) or snapshot retrieval; available in Python, TypeScript, Ruby, Go SDKs and API.

## Log Streaming

Access and process logs in real-time while processes are running in sandboxes. Useful for debugging, monitoring, and observability tool integration.

### Stream logs with callbacks

Process logs asynchronously in the background while execution continues. Ideal for continuous monitoring, debugging long-running jobs, and live log forwarding.

Starting with version 0.27.0, session command logs are available in two separate streams: stdout and stderr.

**Python:**
```python
import asyncio
from daytona import Daytona, SessionExecuteRequest

async def main():
  daytona = Daytona()
  sandbox = daytona.create()
  session_id = "streaming-session"
  sandbox.process.create_session(session_id)

  command = sandbox.process.execute_session_command(
    session_id,
    SessionExecuteRequest(
      command='for i in {1..5}; do echo "Step $i"; echo "Error $i" >&2; sleep 1; done',
      var_async=True,
    ),
  )

  logs_task = asyncio.create_task(
    sandbox.process.get_session_command_logs_async(
      session_id,
      command.cmd_id,
      lambda stdout: print(f"[STDOUT]: {stdout}"),
      lambda stderr: print(f"[STDERR]: {stderr}"),
    )
  )

  print("Continuing execution while logs are streaming...")
  await asyncio.sleep(3)
  await logs_task
  sandbox.delete()

asyncio.run(main())
```

**TypeScript:**
```typescript
import { Daytona, SessionExecuteRequest } from '@daytonaio/sdk'

async function main() {
  const daytona = new Daytona()
  const sandbox = await daytona.create()
  const sessionId = "exec-session-1"
  await sandbox.process.createSession(sessionId)

  const command = await sandbox.process.executeSessionCommand(
    sessionId,
    {
      command: 'for i in {1..5}; do echo "Step $i"; echo "Error $i" >&2; sleep 1; done',
      runAsync: true,
    },
  )

  const logsTask = sandbox.process.getSessionCommandLogs(
    sessionId,
    command.cmdId!,
    (stdout) => console.log('[STDOUT]:', stdout),
    (stderr) => console.log('[STDERR]:', stderr),
  )

  console.log('Continuing execution while logs are streaming...')
  await new Promise((resolve) => setTimeout(resolve, 3000))
  await logsTask
  await sandbox.delete()
}

main()
```

**Ruby:**
```ruby
require 'daytona'

daytona = Daytona::Daytona.new
sandbox = daytona.create
session_id = 'streaming-session'
sandbox.process.create_session(session_id)

command = sandbox.process.execute_session_command(
  session_id,
  Daytona::SessionExecuteRequest.new(
    command: 'for i in {1..5}; do echo "Step $i"; echo "Error $i" >&2; sleep 1; done',
    var_async: true
  )
)

log_thread = Thread.new do
  sandbox.process.get_session_command_logs_stream(
    session_id,
    command.cmd_id,
    on_stdout: ->(stdout) { puts "[STDOUT]: #{stdout}" },
    on_stderr: ->(stderr) { puts "[STDERR]: #{stderr}" }
  )
end

puts 'Continuing execution while logs are streaming...'
sleep(3)
log_thread.join
daytona.delete(sandbox)
```

**Go:**
```go
package main

import (
	"context"
	"fmt"
	"github.com/daytonaio/daytona/libs/sdk-go/pkg/daytona"
)

func main() {
	client, _ := daytona.NewClient()
	ctx := context.Background()
	sandbox, _ := client.Create(ctx, nil)

	sessionID := "streaming-session"
	sandbox.Process.CreateSession(ctx, sessionID)

	cmd := `for i in 1 2 3 4 5; do echo "Step $i"; echo "Error $i" >&2; sleep 1; done`
	cmdResult, _ := sandbox.Process.ExecuteSessionCommand(ctx, sessionID, cmd, true)
	cmdID, _ := cmdResult["id"].(string)

	stdout := make(chan string, 100)
	stderr := make(chan string, 100)

	go func() {
		sandbox.Process.GetSessionCommandLogsStream(ctx, sessionID, cmdID, stdout, stderr)
	}()

	fmt.Println("Continuing execution while logs are streaming...")
	stdoutOpen, stderrOpen := true, true
	for stdoutOpen || stderrOpen {
		select {
		case chunk, ok := <-stdout:
			if !ok {
				stdoutOpen = false
			} else {
				fmt.Printf("[STDOUT]: %s", chunk)
			}
		case chunk, ok := <-stderr:
			if !ok {
				stderrOpen = false
			} else {
				fmt.Printf("[STDERR]: %s", chunk)
			}
		}
	}

	sandbox.Delete(ctx)
}
```

**API:**
```bash
curl 'https://proxy.app.daytona.io/toolbox/{sandboxId}/process/session/{sessionId}/command/{commandId}/logs'
```

### Retrieve all existing logs

Get logs up to the current point in time for commands with predictable duration or periodic log checking.

**Python:**
```python
import time
from daytona import Daytona, SessionExecuteRequest

daytona = Daytona()
sandbox = daytona.create()
session_id = "exec-session-1"
sandbox.process.create_session(session_id)

# Blocking command
command = sandbox.process.execute_session_command(
  session_id, SessionExecuteRequest(command="echo 'Hello from stdout' && echo 'Hello from stderr' >&2")
)
print(f"[STDOUT]: {command.stdout}")
print(f"[STDERR]: {command.stderr}")

# Async command with later log retrieval
command = sandbox.process.execute_session_command(
  session_id, 
  SessionExecuteRequest(
    command='while true; do if (( RANDOM % 2 )); then echo "All good at $(date)"; else echo "Oops, an error at $(date)" >&2; fi; sleep 1; done',
    run_async=True
  )
)
time.sleep(5)
logs = sandbox.process.get_session_command_logs(session_id, command.cmd_id)
print(f"[STDOUT]: {logs.stdout}")
print(f"[STDERR]: {logs.stderr}")

sandbox.delete()
```

**TypeScript:**
```typescript
import { Daytona, SessionExecuteRequest } from '@daytonaio/sdk'

async function main() {
  const daytona = new Daytona()
  const sandbox = await daytona.create()
  const sessionId = "exec-session-1"
  await sandbox.process.createSession(sessionId)

  const command = await sandbox.process.executeSessionCommand(
    sessionId,
    { command: 'echo "Hello from stdout" && echo "Hello from stderr" >&2' },
  )
  console.log(`[STDOUT]: ${command.stdout}`)
  console.log(`[STDERR]: ${command.stderr}`)

  const command2 = await sandbox.process.executeSessionCommand(
    sessionId,
    {
      command: 'while true; do if (( RANDOM % 2 )); then echo "All good at $(date)"; else echo "Oops, an error at $(date)" >&2; fi; sleep 1; done',
      runAsync: true,
    },
  )
  await new Promise((resolve) => setTimeout(resolve, 5000))
  const logs = await sandbox.process.getSessionCommandLogs(sessionId, command2.cmdId!)
  console.log(`[STDOUT]: ${logs.stdout}`)
  console.log(`[STDERR]: ${logs.stderr}`)

  await sandbox.delete()
}

main()
```

**Ruby:**
```ruby
require 'daytona'

daytona = Daytona::Daytona.new
sandbox = daytona.create
session_id = 'exec-session-1'
sandbox.process.create_session(session_id)

command = sandbox.process.execute_session_command(
  session_id,
  Daytona::SessionExecuteRequest.new(
    command: 'echo "Hello from stdout" && echo "Hello from stderr" >&2'
  )
)
puts "[STDOUT]: #{command.stdout}"
puts "[STDERR]: #{command.stderr}"

command = sandbox.process.execute_session_command(
  session_id,
  Daytona::SessionExecuteRequest.new(
    command: 'while true; do if (( RANDOM % 2 )); then echo "All good at $(date)"; else echo "Oops, an error at $(date)" >&2; fi; sleep 1; done',
    var_async: true
  )
)
sleep(5)
logs = sandbox.process.get_session_command_logs(session_id, command.cmd_id)
puts "[STDOUT]: #{logs.stdout}"
puts "[STDERR]: #{logs.stderr}"

daytona.delete(sandbox)
```

**Go:**
```go
package main

import (
	"context"
	"fmt"
	"time"
	"github.com/daytonaio/daytona/libs/sdk-go/pkg/daytona"
)

func main() {
	client, _ := daytona.NewClient()
	ctx := context.Background()
	sandbox, _ := client.Create(ctx, nil)

	sessionID := "exec-session-1"
	sandbox.Process.CreateSession(ctx, sessionID)

	cmd1, _ := sandbox.Process.ExecuteSessionCommand(ctx, sessionID,
		`echo "Hello from stdout" && echo "Hello from stderr" >&2`, false)
	if stdout, ok := cmd1["stdout"].(string); ok {
		fmt.Printf("[STDOUT]: %s\n", stdout)
	}

	cmd := `counter=1; while (( counter <= 5 )); do echo "Count: $counter"; ((counter++)); sleep 1; done`
	cmdResult, _ := sandbox.Process.ExecuteSessionCommand(ctx, sessionID, cmd, true)
	cmdID, _ := cmdResult["id"].(string)

	time.Sleep(5 * time.Second)

	logs, _ := sandbox.Process.GetSessionCommandLogs(ctx, sessionID, cmdID)
	if logContent, ok := logs["logs"].(string); ok {
		fmt.Printf("[LOGS]: %s\n", logContent)
	}

	sandbox.Delete(ctx)
}
```

**API:**
```bash
curl 'https://proxy.app.daytona.io/toolbox/{sandboxId}/process/session/{sessionId}/command/{commandId}/logs'
```

### mcp_server
MCP server setup and API reference for AI agents to programmatically manage Daytona sandboxes, files, git, and execute commands.

## Overview

The Daytona Model Context Protocol (MCP) Server enables AI agents to interact with Daytona's features programmatically. Supports Claude Desktop App, Claude Code, Cursor, and Windsurf.

## Prerequisites

- Daytona account
- Daytona CLI installed
- Compatible AI agent

## Installation

### Mac/Linux
```bash
brew install daytonaio/cli/daytona
daytona login
daytona mcp init [claude/cursor/windsurf]
```

### Windows
```bash
powershell -Command "irm https://get.daytona.io/windows | iex"
daytona login
daytona mcp init [claude/cursor/windsurf]
```

## Manual Configuration

Generate MCP configuration for other agents:
```bash
daytona mcp config
```

Output JSON configuration:
```json
{
  "mcpServers": {
    "daytona-mcp": {
      "command": "daytona",
      "args": ["mcp", "start"],
      "env": {
        "HOME": "${HOME}",
        "PATH": "${HOME}:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin:/opt/homebrew/bin",
        "APPDATA": "${APPDATA}"  // Windows only
      },
      "logFile": "${HOME}/Library/Logs/daytona/daytona-mcp-server.log"
    }
  }
}
```

## Sandbox Management

**Create Sandbox**
- Parameters: `name`, `target`, `snapshot`, `auto_stop_interval` (default: 15 min), `auto_archive_interval` (default: 10080 min), `auto_delete_interval` (default: -1, disabled), `volumes`, `network_block_all`, `network_allow_list` (comma-separated CIDR), `public`, `cpu`, `gpu`, `memory` (GB), `disk` (GB), `user`, `build_info`, `env`, `labels`

**Destroy Sandbox**
- Parameters: `id`

## File Operations

**Download File**
- Returns content as text or base64-encoded image
- Parameters: `id`, `file_path`

**Upload File**
- Supports text or base64-encoded binary content
- Creates parent directories automatically
- Parameters: `id`, `file_path`, `content`, `encoding`, `overwrite`

**Create Folder**
- Parameters: `id`, `folder_path`, `mode` (default: 0755)

**Get File Info**
- Parameters: `id`, `file_path`

**List Files**
- Parameters: `id`, `path` (defaults to current directory)

**Move File**
- Parameters: `id`, `source_path`, `dest_path`

**Delete File**
- Parameters: `id`, `file_path`

## Preview

**Preview Link**
- Generates accessible preview URLs for web applications
- Creates secure tunnels to expose local ports externally
- Validates server status on specified ports
- Parameters: `id`, `port`, `description`, `check_server`

## Git Operations

**Git Clone**
- Parameters: `id`, `url`, `path` (defaults to current), `branch`, `commit_id`, `username`, `password`

## Command Execution

**Execute Command**
- Runs shell commands with sandbox user permissions
- Returns stdout, stderr, exit code
- Parameters: `id`, `command`

## Troubleshooting

- Authentication: Run `daytona login`
- Connection errors: Verify MCP server configuration
- Sandbox errors: Use `daytona sandbox list`

### network-limits
Configure sandbox network access via tier-based restrictions or per-sandbox `networkAllowList`/`networkBlockAll` parameters; essential dev services always whitelisted.

## Network Egress Limiting

Daytona provides network egress limiting for sandboxes to control internet access, automatically applied based on organization billing tier or manually configured per sandbox.

### Tier-Based Restrictions

- **Tier 1 & 2**: Network access restricted, cannot be overridden at sandbox level. Organization-level restrictions take precedence over sandbox-level `networkAllowList` settings.
- **Tier 3 & 4**: Full internet access by default, custom network settings configurable.

### Creating Sandboxes with Network Restrictions

```python
from daytona import CreateSandboxFromSnapshotParams, Daytona

daytona = Daytona()

# Allow specific IPs/subnets
sandbox = daytona.create(CreateSandboxFromSnapshotParams(
    network_allow_list='208.80.154.232/32,199.16.156.103/32,192.168.1.0/24'
))

# Block all network access
sandbox = daytona.create(CreateSandboxFromSnapshotParams(
    network_block_all=True
))
```

TypeScript:
```typescript
const daytona = new Daytona()
const sandbox = await daytona.create({
  networkAllowList: '208.80.154.232/32,199.16.156.103/32,192.168.1.0/24'
})
const sandbox = await daytona.create({ networkBlockAll: true })
```

Ruby:
```ruby
daytona = Daytona::Daytona.new
sandbox = daytona.create(
  Daytona::CreateSandboxFromSnapshotParams.new(
    network_allow_list: '208.80.154.232/32,199.16.156.103/32,192.168.1.0/24'
  )
)
```

**Note**: If both `networkBlockAll` and `networkAllowList` are specified, `networkBlockAll` takes precedence.

### Network Allow List Format

`networkAllowList` accepts up to 5 CIDR blocks separated by commas:
- Single IP: `208.80.154.232/32`
- Subnet: `192.168.1.0/24`
- Multiple: `208.80.154.232/32,199.16.156.103/32,10.0.0.0/8`

### Essential Services (Whitelisted on All Tiers)

Package registries, container registries, Git repositories, CDN services, platform services, system package managers are always accessible.

**NPM**: `registry.npmjs.org`, `registry.npmjs.com`, `nodejs.org`, `nodesource.com`, `npm.pkg.github.com`, `classic.yarnpkg.com`, `registry.yarnpkg.com`, `repo.yarnpkg.com`, `releases.yarnpkg.com`, `yarn.npmjs.org`, `yarnpkg.netlify.com`, `dl.yarnpkg.com`, `yarnpkg.com`

**Git**: `github.com`, `api.github.com`, `raw.githubusercontent.com`, `github-releases.githubusercontent.com`, `codeload.github.com`, `ghcr.io`, `packages.github.com`, `gitlab.com`, `registry.gitlab.com`, `bitbucket.org`

**Python**: `pypi.org`, `pypi.python.org`, `files.pythonhosted.org`, `bootstrap.pypa.io`

**Ubuntu/Debian**: `archive.ubuntu.com`, `security.ubuntu.com`, `deb.debian.org`, `security.debian.org`, `cdn-fastly.deb.debian.org`, `ftp.debian.org`

**CDN**: `fastly.com`, `cloudflare.com`, `unpkg.com`, `jsdelivr.net`

**AI/ML**: `api.anthropic.com`, `api.openai.com`, `api.perplexity.ai`, `api.deepseek.com`, `api.groq.com`, `api.expo.dev`, `openrouter.ai`

**Docker**: `download.docker.com`, `registry-1.docker.io`, `registry.docker.io`, `auth.docker.io`, `index.docker.io`, `hub.docker.com`, `docker.io`, `mcr.microsoft.com`, `registry.k8s.io`, `gcr.io`, `asia.gcr.io`, `eu.gcr.io`, `us.gcr.io`, `marketplace.gcr.io`, `registry.cloud.google.com`, `quay.io`, `quay-registry.s3.amazonaws.com`

**Maven**: `repo1.maven.org`, `repo.maven.apache.org`

**Google Fonts**: `fonts.googleapis.com`, `fonts.gstatic.com`

**AWS S3**: `s3.us-east-1.amazonaws.com`, `s3.us-east-2.amazonaws.com`, `s3.us-west-1.amazonaws.com`, `s3.us-west-2.amazonaws.com`, `s3.eu-central-1.amazonaws.com`, `s3.eu-west-1.amazonaws.com`, `s3.eu-west-2.amazonaws.com`

**Daytona**: `app.daytona.io`

### Testing Network Access

```bash
curl -I https://208.80.154.232
apt update
npm ping
pip install --dry-run requests
```

### Security Benefits

- Prevents data exfiltration
- Reduces attack surface
- Complies with security policies
- Enables fine-grained control

**Caution**: Unrestricted network access poses security risks with untrusted code. Use `networkAllowList` or `networkBlockAll` instead.

### Organization Configuration

Network access policies are set automatically by tier and cannot be modified by administrators.

### organizations
Personal vs collaborative organizations with role-based access control (Owner/Member), granular assignments (Viewer, Developer, various Admins, Super Admin, Auditor), and member management (invite, remove, assignments).

## Personal vs Collaborative Organizations

Every user starts with a personal organization for solo use. Collaborative organizations are manually created for team collaboration.

| Feature | Personal | Collaborative |
|---------|----------|---------------|
| Creation | Automatic on signup | Manual |
| Members | Single user | Multiple (invite-based) |
| Access Control | No roles/permissions | Roles with granular assignments |
| Billing | Per user | Shared across team |
| Use Case | Personal testing, small projects | Company/team development, production |
| Quota Scope | Per user | Shared across members |
| Deletable | No | Yes (by Owner) |

Switch between organizations using the dropdown in the Dashboard sidebar. Each organization has its own sandboxes, API keys, and resource quotas.

## Organization Roles

- **Owners**: Full administrative access to organization and resources
- **Members**: No administrative access; resource access based on assignments

## Administrative Actions

Owners can:
- Invite new users
- Manage pending invitations
- Change user roles
- Update member assignments
- Remove users
- Inspect audit logs
- Delete organization

## Available Assignments

| Assignment | Description |
|-----------|-------------|
| **Viewer (required)** | Read access to all resources |
| **Developer** | Create sandboxes and API keys |
| **Sandboxes Admin** | Admin access to sandboxes |
| **Snapshots Admin** | Admin access to snapshots |
| **Registries Admin** | Admin access to registries |
| **Volumes Admin** | Admin access to volumes |
| **Super Admin** | Full access to all resources |
| **Auditor** | Access to audit logs |
| **Infrastructure Admin** | Admin access to infrastructure |

## Manage Members

### Invite Users

As Owner:
1. Navigate to Members page
2. Click Invite Member
3. Enter email address
4. Select role (Owner or Member with specific assignments)

### Remove Users

As Owner:
1. Navigate to Members page
2. Click Remove next to user
3. Confirm removal

## Manage Invitations

View pending invitations on the Invitations page (accessible from sidebar dropdown). Accepting an invitation grants access to organization's resource quotas and allows creating API keys and sandboxes.

## Organization Settings

The Settings subpage allows viewing Organization ID and Name, and deleting the organization (irreversible). Personal organizations cannot be deleted.

### oss-deployment
Docker Compose setup for local Daytona development with API, Runner, Proxy, SSH Gateway, PostgreSQL, Redis, Dex OIDC, Registry, MinIO, MailDev, Jaeger; includes comprehensive environment variable configuration for all services and optional Auth0 integration.

## Overview

Docker Compose configuration for running Daytona Open Source locally. Includes API, Proxy, Runner, SSH Gateway, PostgreSQL, Redis, Dex (OIDC), Docker Registry, MinIO (S3), MailDev, Jaeger, and PgAdmin.

**⚠️ Not production-safe** - development setup only.

## Quick Start

1. Clone Daytona repository
2. Install Docker and Docker Compose
3. Run from repo root:
   ```bash
   docker compose -f docker/docker-compose.yaml up -d
   ```
4. Access services:
   - Dashboard: http://localhost:3000 (dev@daytona.io / password)
   - PgAdmin: http://localhost:5050
   - Registry UI: http://localhost:5100
   - MinIO: http://localhost:9001 (minioadmin / minioadmin)

## DNS Setup for Proxy URLs

For local development, resolve `*.proxy.localhost` to `127.0.0.1`:
```bash
./scripts/setup-proxy-dns.sh
```
Configures dnsmasq with `address=/proxy.localhost/127.0.0.1`. Required for SDK examples and proxy access.

## Network Configuration

### HTTP Proxy

Set environment variables in docker-compose.yaml for services requiring outbound access (API service pulls images):
```yaml
environment:
  - HTTP_PROXY=<your-proxy>
  - HTTPS_PROXY=<your-proxy>
  - NO_PROXY=localhost,runner,dex,registry,minio,jaeger,otel-collector,<your-proxy>
```

### Extra CA Certificates

For TLS connections (e.g., with `DB_TLS` env vars):
```yaml
environment:
  - NODE_EXTRA_CA_CERTS=/path/to/cert-bundle.pem
```

## Environment Variables

### API Service

Core configuration:
- `ENCRYPTION_KEY` (string, default: `supersecretkey`) - **Must override in production**
- `ENCRYPTION_SALT` (string, default: `supersecretsalt`) - **Must override in production**
- `PORT` (number, default: `3000`)
- `ENVIRONMENT` (string, default: `dev`)

Database:
- `DB_HOST` (string, default: `db`)
- `DB_PORT` (number, default: `5432`)
- `DB_USERNAME` (string, default: `user`)
- `DB_PASSWORD` (string, default: `pass`)
- `DB_DATABASE` (string, default: `daytona`)
- `DB_TLS_ENABLED` (boolean, default: `false`)
- `DB_TLS_REJECT_UNAUTHORIZED` (boolean, default: `true`)
- `RUN_MIGRATIONS` (boolean, default: `true`)

Redis:
- `REDIS_HOST` (string, default: `redis`)
- `REDIS_PORT` (number, default: `6379`)

OIDC Authentication:
- `OIDC_CLIENT_ID` (string, default: `daytona`)
- `OIDC_ISSUER_BASE_URL` (string, default: `http://dex:5556/dex`)
- `PUBLIC_OIDC_DOMAIN` (string, default: `http://localhost:5556/dex`)
- `OIDC_AUDIENCE` (string, default: `daytona`)
- `OIDC_MANAGEMENT_API_ENABLED` (boolean)
- `OIDC_MANAGEMENT_API_CLIENT_ID` (string)
- `OIDC_MANAGEMENT_API_CLIENT_SECRET` (string)
- `OIDC_MANAGEMENT_API_AUDIENCE` (string)
- `SKIP_USER_EMAIL_VERIFICATION` (boolean, default: `true`)

Dashboard & URLs:
- `DASHBOARD_URL` (string, default: `http://localhost:3000/dashboard`)
- `DASHBOARD_BASE_API_URL` (string, default: `http://localhost:3000`)
- `DEFAULT_SNAPSHOT` (string, default: `daytonaio/sandbox:0.4.3`)

Analytics:
- `POSTHOG_API_KEY` (string, default: `phc_bYtEsdMDrNLydXPD4tufkBrHKgfO2zbycM30LOowYNv`)
- `POSTHOG_HOST` (string, default: `https://d18ag4dodbta3l.cloudfront.net`)
- `POSTHOG_ENVIRONMENT` (string, default: `local`)

Registry (Transient & Internal):
- `TRANSIENT_REGISTRY_URL` (string, default: `http://registry:6000`)
- `TRANSIENT_REGISTRY_ADMIN` (string, default: `admin`)
- `TRANSIENT_REGISTRY_PASSWORD` (string, default: `password`)
- `TRANSIENT_REGISTRY_PROJECT_ID` (string, default: `daytona`)
- `INTERNAL_REGISTRY_URL` (string, default: `http://registry:6000`)
- `INTERNAL_REGISTRY_ADMIN` (string, default: `admin`)
- `INTERNAL_REGISTRY_PASSWORD` (string, default: `password`)
- `INTERNAL_REGISTRY_PROJECT_ID` (string, default: `daytona`)

Email (SMTP):
- `SMTP_HOST` (string, default: `maildev`)
- `SMTP_PORT` (number, default: `1025`)
- `SMTP_USER` (string)
- `SMTP_PASSWORD` (string)
- `SMTP_SECURE` (boolean)
- `SMTP_EMAIL_FROM` (string, default: `"Daytona Team <no-reply@daytona.io>"`)

S3 Storage (MinIO):
- `S3_ENDPOINT` (string, default: `http://minio:9000`)
- `S3_STS_ENDPOINT` (string, default: `http://minio:9000/minio/v1/assume-role`)
- `S3_REGION` (string, default: `us-east-1`)
- `S3_ACCESS_KEY` (string, default: `minioadmin`)
- `S3_SECRET_KEY` (string, default: `minioadmin`)
- `S3_DEFAULT_BUCKET` (string, default: `daytona`)
- `S3_ACCOUNT_ID` (string, default: `/`)
- `S3_ROLE_NAME` (string, default: `/`)

Proxy:
- `PROXY_DOMAIN` (string, default: `proxy.localhost:4000`)
- `PROXY_PROTOCOL` (string, default: `http`)
- `PROXY_API_KEY` (string, default: `super_secret_key`)
- `PROXY_TEMPLATE_URL` (string, default: `http://{{PORT}}-{{sandboxId}}.proxy.localhost:4000`)
- `PROXY_TOOLBOX_BASE_URL` (string, default: `{PROXY_PROTOCOL}://{PROXY_DOMAIN}`)

Runner Configuration:
- `DEFAULT_RUNNER_DOMAIN` (string, default: `runner:3003`)
- `DEFAULT_RUNNER_API_URL` (string, default: `http://runner:3003`)
- `DEFAULT_RUNNER_PROXY_URL` (string, default: `http://runner:3003`)
- `DEFAULT_RUNNER_API_KEY` (string, default: `secret_api_token`)
- `DEFAULT_RUNNER_CPU` (number, default: `4`)
- `DEFAULT_RUNNER_MEMORY` (number, default: `8` GB)
- `DEFAULT_RUNNER_DISK` (number, default: `50` GB)
- `DEFAULT_RUNNER_API_VERSION` (string, default: `0`)

Organization Quotas (defaults):
- `DEFAULT_ORG_QUOTA_TOTAL_CPU_QUOTA` (number, default: `10000`)
- `DEFAULT_ORG_QUOTA_TOTAL_MEMORY_QUOTA` (number, default: `10000`)
- `DEFAULT_ORG_QUOTA_TOTAL_DISK_QUOTA` (number, default: `100000`)
- `DEFAULT_ORG_QUOTA_MAX_CPU_PER_SANDBOX` (number, default: `100`)
- `DEFAULT_ORG_QUOTA_MAX_MEMORY_PER_SANDBOX` (number, default: `100`)
- `DEFAULT_ORG_QUOTA_MAX_DISK_PER_SANDBOX` (number, default: `1000`)
- `DEFAULT_ORG_QUOTA_SNAPSHOT_QUOTA` (number, default: `1000`)
- `DEFAULT_ORG_QUOTA_MAX_SNAPSHOT_SIZE` (number, default: `1000`)
- `DEFAULT_ORG_QUOTA_VOLUME_QUOTA` (number, default: `10000`)

SSH Gateway:
- `SSH_GATEWAY_API_KEY` (string, default: `ssh_secret_api_token`)
- `SSH_GATEWAY_COMMAND` (string, default: `ssh -p 2222 {{TOKEN}}@localhost`)
- `SSH_GATEWAY_PUBLIC_KEY` (string, Base64-encoded OpenSSH public key)
- `SSH_GATEWAY_URL` (string, default: `localhost:2222`)

Runner Health & Scoring:
- `RUNNER_DECLARATIVE_BUILD_SCORE_THRESHOLD` (number, default: `10`)
- `RUNNER_AVAILABILITY_SCORE_THRESHOLD` (number, default: `10`)
- `RUNNER_HEALTH_TIMEOUT_SECONDS` (number, default: `3`)
- `RUNNER_START_SCORE_THRESHOLD` (number, default: `3`)

Admin Setup (initial setup only):
- `ADMIN_API_KEY` (string) - Auto-generated if empty, not recommended for production
- `ADMIN_TOTAL_CPU_QUOTA` (number, default: `0`)
- `ADMIN_TOTAL_MEMORY_QUOTA` (number, default: `0`)
- `ADMIN_TOTAL_DISK_QUOTA` (number, default: `0`)
- `ADMIN_MAX_CPU_PER_SANDBOX` (number, default: `0`)
- `ADMIN_MAX_MEMORY_PER_SANDBOX` (number, default: `0`)
- `ADMIN_MAX_DISK_PER_SANDBOX` (number, default: `0`)
- `ADMIN_SNAPSHOT_QUOTA` (number, default: `100`)
- `ADMIN_MAX_SNAPSHOT_SIZE` (number, default: `100`)
- `ADMIN_VOLUME_QUOTA` (number, default: `0`)

Rate Limiting (all empty by default - disabled):
- `RATE_LIMIT_ANONYMOUS_TTL` (number, seconds)
- `RATE_LIMIT_ANONYMOUS_LIMIT` (number, requests per TTL)
- `RATE_LIMIT_AUTHENTICATED_TTL` (number, seconds)
- `RATE_LIMIT_AUTHENTICATED_LIMIT` (number, requests per TTL)
- `RATE_LIMIT_SANDBOX_CREATE_TTL` (number, seconds)
- `RATE_LIMIT_SANDBOX_CREATE_LIMIT` (number, requests per TTL)
- `RATE_LIMIT_SANDBOX_LIFECYCLE_TTL` (number, seconds)
- `RATE_LIMIT_SANDBOX_LIFECYCLE_LIMIT` (number, requests per TTL)
- `RATE_LIMIT_FAILED_AUTH_TTL` (number, seconds)
- `RATE_LIMIT_FAILED_AUTH_LIMIT` (number, requests per TTL)

Regions:
- `DEFAULT_REGION_ID` (string, default: `us`)
- `DEFAULT_REGION_NAME` (string, default: `us`)
- `DEFAULT_REGION_ENFORCE_QUOTAS` (boolean, default: `false`)

Observability:
- `OTEL_ENABLED` (boolean, default: `true`)
- `OTEL_COLLECTOR_URL` (string, default: `http://jaeger:4318/v1/traces`)
- `OTEL_COLLECTOR_API_KEY` (string, default: `otel_collector_api_key`)
- `CLICKHOUSE_HOST` (string)
- `CLICKHOUSE_DATABASE` (string, default: `otel`)
- `CLICKHOUSE_PORT` (number, default: `8123`)
- `CLICKHOUSE_USERNAME` (string)
- `CLICKHOUSE_PASSWORD` (string)
- `CLICKHOUSE_PROTOCOL` (string, default: `https`)
- `SANDBOX_OTEL_ENDPOINT_URL` (string)

Other:
- `MAX_AUTO_ARCHIVE_INTERVAL` (number, default: `43200` seconds)
- `MAINTENANCE_MODE` (boolean, default: `false`)
- `HEALTH_CHECK_API_KEY` (string, default: `supersecretkey`)

### Runner Service

- `DAYTONA_API_URL` (string, default: `http://api:3000/api`)
- `DAYTONA_RUNNER_TOKEN` (string, default: `secret_api_token`)
- `VERSION` (string, default: `0.0.1`)
- `ENVIRONMENT` (string, default: `development`)
- `API_PORT` (number, default: `3003`)
- `LOG_FILE_PATH` (string, default: `/home/daytona/runner/runner.log`)
- `RESOURCE_LIMITS_DISABLED` (boolean, default: `true`)
- `AWS_ENDPOINT_URL` (string, default: `http://minio:9000`)
- `AWS_REGION` (string, default: `us-east-1`)
- `AWS_ACCESS_KEY_ID` (string, default: `minioadmin`)
- `AWS_SECRET_ACCESS_KEY` (string, default: `minioadmin`)
- `AWS_DEFAULT_BUCKET` (string, default: `daytona`)
- `DAEMON_START_TIMEOUT_SEC` (number, default: `60`)
- `SANDBOX_START_TIMEOUT_SEC` (number, default: `30`)
- `USE_SNAPSHOT_ENTRYPOINT` (boolean, default: `false`)
- `RUNNER_DOMAIN` (string)
- `VOLUME_CLEANUP_INTERVAL_SEC` (number, default: `30`, minimum: `10`)
- `COLLECTOR_WINDOW_SIZE` (number, default: `60`)
- `CPU_USAGE_SNAPSHOT_INTERVAL` (string, default: `5s`, minimum: `1s`)
- `ALLOCATED_RESOURCES_SNAPSHOT_INTERVAL` (string, default: `5s`, minimum: `1s`)
- `POLL_TIMEOUT` (string, default: `30s`)
- `POLL_LIMIT` (number, default: `10`, min: `1`, max: `100`)
- `HEALTHCHECK_INTERVAL` (string, default: `30s`, minimum: `10s`)
- `HEALTHCHECK_TIMEOUT` (string, default: `10s`)
- `API_VERSION` (number, default: `2`)

### SSH Gateway Service

- `API_URL` (string, default: `http://api:3000/api`)
- `API_KEY` (string, default: `ssh_secret_api_token`)
- `SSH_PRIVATE_KEY` (string, Base64-encoded OpenSSH private key)
- `SSH_HOST_KEY` (string, Base64-encoded OpenSSH host key)
- `SSH_GATEWAY_PORT` (number, default: `2222`)

### Proxy Service

- `DAYTONA_API_URL` (string, default: `http://api:3000/api`)
- `PROXY_PORT` (number, default: `4000`)
- `PROXY_API_KEY` (string, default: `super_secret_key`)
- `PROXY_PROTOCOL` (string, default: `http`)
- `COOKIE_DOMAIN` (string, default: `$PROXY_DOMAIN`)
- `OIDC_CLIENT_ID` (string, default: `daytona`)
- `OIDC_CLIENT_SECRET` (string, empty for SPA)
- `OIDC_DOMAIN` (string, default: `http://dex:5556/dex`)
- `OIDC_PUBLIC_DOMAIN` (string, default: `http://localhost:5556/dex`)
- `OIDC_AUDIENCE` (string, default: `daytona`)
- `REDIS_HOST` (string, default: `redis`)
- `REDIS_PORT` (number, default: `6379`)
- `TOOLBOX_ONLY_MODE` (boolean, default: `false`)
- `PREVIEW_WARNING_ENABLED` (boolean, default: `false`)
- `SHUTDOWN_TIMEOUT_SEC` (number, default: `3600`)

## Auth0 Configuration (Optional)

Default setup uses local Dex OIDC. To use Auth0 instead:

### Step 1: Create Auth0 Tenant
- Sign up at https://auth0.com/signup
- Choose account type (Company/Personal)
- Create Single Page Application (SPA) named e.g., "My Daytona"
- Select "Email and Password" authentication

### Step 2: Configure SPA Application
In `Applications > Applications`, select your app, go to `Settings` tab:

**Allowed Callback URIs:**
```
http://localhost:3000
http://localhost:3000/api/oauth2-redirect.html
http://localhost:4000/callback
http://proxy.localhost:4000/callback
```

**Allowed Logout URIs:**
```
http://localhost:3000
```

**Allowed Web Origins:**
```
http://localhost:3000
```

### Step 3: Create Machine-to-Machine Application
- Go to `Applications > Applications`, click `Create Application`
- Choose `Machine to Machine Applications`
- Name it e.g., "My Management API M2M"
- In `APIs` tab, authorize `Auth0 Management API`
- Grant permissions:
  - `read:users`
  - `update:users`
  - `read:connections`
  - `create:guardian_enrollment_tickets`
  - `read:connections_options`

### Step 4: Set Up Custom API
- Go to `Applications > APIs`, click `Create API`
- Name: e.g., "My Daytona API"
- Identifier: e.g., "my-daytona-api"
- In `Permissions` tab, add scopes:
  - `read:node` - Get workspace node info
  - `create:node` - Create new workspace node record
  - `create:user` - Create user account
  - `read:users` - Get all user accounts
  - `regenerate-key-pair:users` - Regenerate user SSH key-pair
  - `read:workspaces` - Read workspaces (user scope)
  - `create:registry` - Create docker registry auth record
  - `read:registries` - Get all docker registry records
  - `read:registry` - Get docker registry record
  - `write:registry` - Create or update docker registry record

### Step 5: Configure Environment Variables

**API Service:**
```bash
OIDC_CLIENT_ID=your_spa_app_client_id
OIDC_ISSUER_BASE_URL=your_spa_app_domain
OIDC_AUDIENCE=your_custom_api_identifier
OIDC_MANAGEMENT_API_ENABLED=true
OIDC_MANAGEMENT_API_CLIENT_ID=your_m2m_app_client_id
OIDC_MANAGEMENT_API_CLIENT_SECRET=your_m2m_app_client_secret
OIDC_MANAGEMENT_API_AUDIENCE=your_auth0_managment_api_identifier
```

**Proxy Service:**
```bash
OIDC_CLIENT_ID=your_spa_app_client_id
OIDC_CLIENT_SECRET=
OIDC_DOMAIN=your_spa_app_domain
OIDC_AUDIENCE=your_custom_api_identifier/
```

Note: `OIDC_CLIENT_SECRET` must be empty for proxy (SPA apps don't have secrets).

## Development Notes

- Shared networking for service communication
- Database and storage data persisted in Docker volumes
- Registry allows image deletion for testing
- Sandbox resource limits disabled (DinD environment limitation)

### playground
Interactive browser-based sandbox environment with Sandbox tab (management, file system, Git, code execution), Terminal tab (web-based CLI on port 22222), and VNC tab (GUI desktop with display/keyboard/mouse/screenshot controls).

## Overview

Daytona Playground is an interactive browser-based environment for creating sandboxes, running SDK operations, and exploring features. Access it at https://app.daytona.io/dashboard/playground.

## Sandbox Tab

Configure and manage sandboxes through the left panel (parameters) and right panel (auto-generated SDK code snippets).

### Management Section
Configure sandbox parameters:
- **Sandbox language**: select programming language runtime
- **Sandbox resources**: allocate CPU, memory, storage
- **Sandbox lifecycle**: set lifecycle policies

Note: Sandboxes are only created when explicitly clicking **Run**. In Terminal or VNC tabs, sandboxes auto-create if none exist.

### File System Section
Manage files and directories:
- Create directories with custom permissions
- List files and directories at specified paths
- Delete files and directories

### Git Operations Section
Manage Git repositories:
- Clone repositories (specify URL, destination, branch, commit ID, credentials)
- Get repository status
- List branches

### Process and Code Execution Section
Run code and commands:
- Execute shell commands (fixed)
- Run code snippets (language-dependent, changes based on selected sandbox language)

## Terminal Tab

Web-based terminal connected to the sandbox, running on port 22222. Provides direct command-line access for running commands, viewing files, and debugging. Remains active while sandbox runs; restart sandbox if it stops due to inactivity.

Access restricted to authenticated organization members.

## VNC Tab

Graphical desktop access for GUI application interaction and Computer Use feature testing. Left panel contains interaction controls, right panel shows desktop view.

### Display Section
- Get display information
- List open windows

### Keyboard Section
- Press hotkey combinations
- Press individual keys with optional modifiers
- Type text into active window

### Mouse Section
- Click at specified positions
- Drag between positions
- Move cursor
- Get current cursor position

### Screenshot Section
- Capture screenshots with configurable format, scale, quality
- Show/hide cursor
- Capture full screen or specific regions

### preview
Two preview URL types: standard (token in header, resets on restart) for programmatic access, signed (token in URL, custom expiry, persistent) for sharing; public sandboxes need no auth.

## Preview Links

Generate preview links for accessing Sandboxes. Any process listening on ports 3000–9999 can be previewed.

### Authentication

Public sandboxes (with `public` property set to `true`) have publicly accessible preview links. Private sandboxes require authentication, which differs by preview URL type.

### Standard Preview URL

URL structure: `https://{port}-{sandboxId}.{daytonaProxyDomain}`

Authentication via header token that resets on sandbox restart.

```python
preview_info = sandbox.get_preview_link(3000)
import requests
response = requests.get(
    preview_info.url,
    headers={"x-daytona-preview-token": preview_info.token}
)
```

```typescript
const previewInfo = await sandbox.getPreviewLink(3000);
const response = await fetch(previewInfo.url, {
  headers: { 'x-daytona-preview-token': previewInfo.token }
});
```

```ruby
preview_info = sandbox.preview_url(3000)
```

Use for: Programmatic access and API integrations where you control HTTP headers.

### Signed Preview URL

URL structure: `https://{port}-{token}.{daytonaProxyDomain}`

Token embedded in URL, no headers needed. Set custom expiry time (defaults to 60 seconds). Token persists across sandbox restarts until expiry. Can be manually revoked.

```python
signed_url = sandbox.create_signed_preview_url(3000, expires_in_seconds=3600)
import requests
response = requests.get(signed_url.url)
sandbox.expire_signed_preview_url(3000, signed_url.token)  # revoke
```

```typescript
const signedUrl = await sandbox.getSignedPreviewUrl(3000, 3600);
const response = await fetch(signedUrl.url);
await sandbox.expireSignedPreviewUrl(3000, signedUrl.token);  // revoke
```

```ruby
signed_url = sandbox.create_signed_preview_url(3000, expires_in_seconds=3600)
```

Use for: Sharing with users, embedding in iframes/emails, time-limited shareable links, webhooks.

### Warning Page

Browser warning page shown on first visit as security measure. Skip by:
- Sending `X-Daytona-Skip-Preview-Warning: true` header
- Upgrading to Tier 3
- Deploying custom preview proxy

### process_and_code_execution
Execute code (stateless/stateful Python), shell commands, and manage interactive background sessions with timeouts, environment variables, and error handling.

## Code Execution

### Stateless Execution
Run code snippets in a clean interpreter each time. Supports Python, TypeScript, Ruby, Go, and API.

```python
response = sandbox.process.code_run('''
def greet(name):
    return f"Hello, {name}!"
print(greet("Daytona"))
''')
print(response.result)
```

```typescript
let response = await sandbox.process.codeRun(`
function greet(name: string): string {
    return \`Hello, \${name}!\`;
}
console.log(greet("Daytona"));
`);

// With argv, environment variables, and timeout
response = await sandbox.process.codeRun(
    `console.log(\`Hello, \${process.argv[2]}!\`); console.log(\`FOO: \${process.env.FOO}\`);`,
    { argv: ["Daytona"], env: { FOO: "BAR" } },
    5  // timeout in seconds
);
```

```ruby
response = sandbox.process.code_run(code: <<~PYTHON)
  def greet(name):
      return f"Hello, {name}!"
  print(greet("Daytona"))
PYTHON
puts response.result
```

```go
result, err := sandbox.Process.ExecuteCommand(ctx, `python3 -c 'def greet(name): return f"Hello, {name}!"\nprint(greet("Daytona"))'`)
if err != nil { log.Fatal(err) }
fmt.Println(result.Result)

// With environment variables and timeout
result, err = sandbox.Process.ExecuteCommand(ctx, `python3 -c 'import os; print(f"FOO: {os.environ.get(\"FOO\")}")'`,
	options.WithCommandEnv(map[string]string{"FOO": "BAR"}),
	options.WithExecuteTimeout(5*time.Second),
)
```

### Stateful Execution (Python only)
Maintain variables and imports between calls. Create isolated contexts or use shared default context.

```python
from daytona import Daytona, OutputMessage

def handle_stdout(message: OutputMessage):
    print(f"[STDOUT] {message.output}")

daytona = Daytona()
sandbox = daytona.create()

# Shared default context
result = sandbox.code_interpreter.run_code(
    "counter = 1\nprint(f'Counter initialized at {counter}')",
    on_stdout=handle_stdout,
)

# Isolated context
ctx = sandbox.code_interpreter.create_context()
try:
    sandbox.code_interpreter.run_code("value = 'stored in ctx'", context=ctx)
    sandbox.code_interpreter.run_code("print(value)", context=ctx, on_stdout=handle_stdout)
finally:
    sandbox.code_interpreter.delete_context(ctx)
```

```typescript
const daytona = new Daytona()
const sandbox = await daytona.create()

// Shared default context
await sandbox.codeInterpreter.runCode(
    `counter = 1\nprint(f'Counter initialized at {counter}')`,
    { onStdout: (msg) => process.stdout.write(`[STDOUT] ${msg.output}`) },
)

// Isolated context
const ctx = await sandbox.codeInterpreter.createContext()
try {
    await sandbox.codeInterpreter.runCode(`value = 'stored in ctx'`, { context: ctx })
    await sandbox.codeInterpreter.runCode(`print(value)`, { context: ctx, onStdout: (msg) => process.stdout.write(`[STDOUT] ${msg.output}`) })
} finally {
    await sandbox.codeInterpreter.deleteContext(ctx)
}
```

```go
ctxInfo, err := sandbox.CodeInterpreter.CreateContext(ctx, nil)
if err != nil { log.Fatal(err) }
contextID := ctxInfo["id"].(string)

channels, err := sandbox.CodeInterpreter.RunCode(ctx,
	"counter = 1\nprint(f'Counter initialized at {counter}')",
	options.WithCustomContext(contextID),
)
if err != nil { log.Fatal(err) }

for msg := range channels.Stdout {
	fmt.Printf("[STDOUT] %s\n", msg.Text)
}

err = sandbox.CodeInterpreter.DeleteContext(ctx, contextID)
```

## Command Execution

Execute shell commands with optional working directory, timeout, and environment variables. Working directory defaults to sandbox WORKDIR or home directory; override with absolute path starting with `/`.

```python
response = sandbox.process.exec("ls -la")
response = sandbox.process.exec("sleep 3", cwd="workspace/src", timeout=5)
response = sandbox.process.exec("echo $CUSTOM_SECRET", env={"CUSTOM_SECRET": "DAYTONA"})
```

```typescript
const response = await sandbox.process.executeCommand("ls -la");
const response2 = await sandbox.process.executeCommand("sleep 3", "workspace/src", undefined, 5);
const response3 = await sandbox.process.executeCommand("echo $CUSTOM_SECRET", ".", {"CUSTOM_SECRET": "DAYTONA"});
```

```ruby
response = sandbox.process.exec(command: 'ls -la')
response = sandbox.process.exec(command: 'sleep 3', cwd: 'workspace/src', timeout: 5)
response = sandbox.process.exec(command: 'echo $CUSTOM_SECRET', env: { 'CUSTOM_SECRET' => 'DAYTONA' })
```

```go
response, err := sandbox.Process.ExecuteCommand(ctx, "ls -la")
response, err = sandbox.Process.ExecuteCommand(ctx, "sleep 3",
	options.WithCwd("workspace/src"),
	options.WithExecuteTimeout(5*time.Second),
)
response, err = sandbox.Process.ExecuteCommand(ctx, "echo $CUSTOM_SECRET",
	options.WithCommandEnv(map[string]string{"CUSTOM_SECRET": "DAYTONA"}),
)
```

```bash
daytona exec my-sandbox -- ls -la
daytona exec my-sandbox --cwd workspace/src --timeout 5 -- sleep 3
daytona exec my-sandbox -- sh -c 'CUSTOM_SECRET=DAYTONA echo $CUSTOM_SECRET'
```

## Session Operations

Manage background process sessions for long-running operations.

### Get Session Status

```python
session = sandbox.process.get_session(session_id)
for command in session.commands:
    print(f"Command: {command.command}, Exit Code: {command.exit_code}")

sessions = sandbox.process.list_sessions()
```

```typescript
const session = await sandbox.process.getSession(sessionId);
for (const command of session.commands) {
    console.log(`Command: ${command.command}, Exit Code: ${command.exitCode}`);
}
const sessions = await sandbox.process.listSessions();
```

```ruby
session = sandbox.process.get_session(session_id)
session.commands.each { |cmd| puts "Command: #{cmd.command}, Exit Code: #{cmd.exit_code}" }
sessions = sandbox.process.list_sessions
```

```go
session, err := sandbox.Process.GetSession(ctx, sessionID)
commands := session["commands"].([]any)
for _, cmd := range commands {
	cmdMap := cmd.(map[string]any)
	fmt.Printf("Command: %s, Exit Code: %v\n", cmdMap["command"], cmdMap["exitCode"])
}
sessions, err := sandbox.Process.ListSessions(ctx)
```

### Execute Interactive Commands

Send input to running commands that expect user interaction.

```python
session_id = "interactive-session"
sandbox.process.create_session(session_id)

command = sandbox.process.execute_session_command(
    session_id,
    SessionExecuteRequest(command='pip uninstall requests', run_async=True),
)

logs_task = asyncio.create_task(
    sandbox.process.get_session_command_logs_async(
        session_id,
        command.cmd_id,
        lambda log: print(f"[STDOUT]: {log}"),
        lambda log: print(f"[STDERR]: {log}"),
    )
)

await asyncio.sleep(1)
sandbox.process.send_session_command_input(session_id, command.cmd_id, "y")
await logs_task
```

```typescript
const sessionId = 'interactive-session'
await sandbox.process.createSession(sessionId)

const command = await sandbox.process.executeSessionCommand(sessionId, {
    command: 'pip uninstall requests',
    runAsync: true,
})

const logPromise = sandbox.process.getSessionCommandLogs(
    sessionId,
    command.cmdId!,
    (stdout) => console.log('[STDOUT]:', stdout),
    (stderr) => console.log('[STDERR]:', stderr),
)

await new Promise((resolve) => setTimeout(resolve, 1000))
await sandbox.process.sendSessionCommandInput(sessionId, command.cmdId!, 'y')
await logPromise
```

```ruby
session_id = "interactive-session"
sandbox.process.create_session(session_id)

interactive_command = sandbox.process.execute_session_command(
  session_id: session_id,
  req: Daytona::SessionExecuteRequest.new(command: 'pip uninstall requests', run_async: true)
)

sleep 1
sandbox.process.send_session_command_input(session_id: session_id, command_id: interactive_command.cmd_id, data: "y")

sandbox.process.get_session_command_logs_async(
  session_id: session_id,
  command_id: interactive_command.cmd_id,
  on_stdout: ->(log) { puts "[STDOUT]: #{log}" },
  on_stderr: ->(log) { puts "[STDERR]: #{log}" }
)
```

```go
sessionID := "interactive-session"
err := sandbox.Process.CreateSession(ctx, sessionID)
result, err := sandbox.Process.ExecuteSessionCommand(ctx, sessionID, "pip uninstall requests", true)
cmdID := result["cmdId"].(string)

stdout := make(chan string)
stderr := make(chan string)
go func() {
	sandbox.Process.GetSessionCommandLogsStream(ctx, sessionID, cmdID, stdout, stderr)
}()

time.Sleep(1 * time.Second)
// Use API endpoint to send input
```

## Resource Management

Clean up sessions after execution using try-finally or defer patterns.

```python
session_id = "long-running-cmd"
try:
    sandbox.process.create_session(session_id)
    session = sandbox.process.get_session(session_id)
    # Do work...
finally:
    sandbox.process.delete_session(session.session_id)
```

```typescript
const sessionId = "long-running-cmd";
try {
    await sandbox.process.createSession(sessionId);
    const session = await sandbox.process.getSession(sessionId);
    // Do work...
} finally {
    await sandbox.process.deleteSession(session.sessionId);
}
```

```ruby
session_id = 'long-running-cmd'
begin
  sandbox.process.create_session(session_id)
  session = sandbox.process.get_session(session_id)
  # Do work...
ensure
  sandbox.process.delete_session(session.session_id)
end
```

```go
sessionID := "long-running-cmd"
err := sandbox.Process.CreateSession(ctx, sessionID)
if err != nil { log.Fatal(err) }
defer sandbox.Process.DeleteSession(ctx, sessionID)

session, err := sandbox.Process.GetSession(ctx, sessionID)
```

## Error Handling

Check exit codes and handle exceptions.

```python
from daytona import DaytonaError

try:
    response = sandbox.process.code_run("invalid python code")
    if response.exit_code != 0:
        print(f"Exit code: {response.exit_code}")
        print(f"Error output: {response.result}")
except DaytonaError as e:
    print(f"Execution failed: {e}")
```

```typescript
import { DaytonaError } from '@daytonaio/sdk'

try {
    const response = await sandbox.process.codeRun("invalid typescript code");
    if (response.exitCode !== 0) {
        console.error("Exit code:", response.exitCode);
        console.error("Error output:", response.result);
    }
} catch (e) {
    if (e instanceof DaytonaError) {
        console.error("Execution failed:", e);
    }
}
```

```ruby
begin
  response = sandbox.process.code_run(code: 'invalid python code')
  if response.exit_code != 0
    puts "Exit code: #{response.exit_code}"
    puts "Error output: #{response.result}"
  end
rescue StandardError => e
  puts "Execution failed: #{e}"
end
```

```go
result, err := sandbox.Process.ExecuteCommand(ctx, "python3 -c 'invalid python code'")
if err != nil {
	fmt.Println("Execution failed:", err)
}
if result != nil && result.ExitCode != 0 {
	fmt.Println("Exit code:", result.ExitCode)
	fmt.Println("Error output:", result.Result)
}
```

## Common Issues

| Issue | Solutions |
|-------|-----------|
| Process execution failed | Check command syntax, verify dependencies, ensure permissions |
| Process timeout | Adjust timeout settings, optimize long-running operations, use background processes |
| Resource limits | Monitor memory usage, handle cleanup properly, use resource constraints |

### pty_sessions
Create, connect, list, get info, kill, resize PTY sessions; send input, wait for completion, handle interactive commands and long-running processes with proper resource cleanup.

## Pseudo Terminal (PTY) Sessions

PTY (Pseudo Terminal) is a virtual terminal interface enabling interactive terminal sessions in sandboxes. Use cases: REPLs, debuggers, build processes, system administration, terminal-based UIs.

### Create PTY Session

```python
from daytona.common.pty import PtySize
pty_handle = sandbox.process.create_pty_session(
    id="my-session",
    cwd="/workspace",
    envs={"TERM": "xterm-256color"},
    pty_size=PtySize(cols=120, rows=30)
)
```

```typescript
const ptyHandle = await sandbox.process.createPty({
  id: 'my-interactive-session',
  cwd: '/workspace',
  envs: { TERM: 'xterm-256color', LANG: 'en_US.UTF-8' },
  cols: 120,
  rows: 30,
  onData: (data) => {
    const text = new TextDecoder().decode(data)
    process.stdout.write(text)
  },
})
await ptyHandle.waitForConnection()
await ptyHandle.sendInput('ls -la\n')
const result = await ptyHandle.wait()
console.log(`Exit code: ${result.exitCode}`)
await ptyHandle.disconnect()
```

```ruby
pty_size = Daytona::PtySize.new(rows: 30, cols: 120)
pty_handle = sandbox.process.create_pty_session(
  id: 'my-interactive-session',
  cwd: '/workspace',
  envs: { 'TERM' => 'xterm-256color' },
  pty_size: pty_size
)
pty_handle.send_input("ls -la\n")
pty_handle.each { |data| print data }
puts "Exit code: #{pty_handle.exit_code}"
```

```go
handle, err := sandbox.Process.CreatePty(ctx, "my-interactive-session",
	options.WithCreatePtySize(types.PtySize{Cols: 120, Rows: 30}),
	options.WithCreatePtyEnv(map[string]string{"TERM": "xterm-256color"}),
)
if err != nil { log.Fatal(err) }
defer handle.Disconnect()
if err := handle.WaitForConnection(ctx); err != nil { log.Fatal(err) }
handle.SendInput([]byte("ls -la\n"))
for data := range handle.DataChan() { fmt.Print(string(data)) }
result, err := handle.Wait(ctx)
if err != nil { log.Fatal(err) }
fmt.Printf("Exit code: %d\n", *result.ExitCode)
```

```bash
curl 'https://proxy.app.daytona.io/toolbox/{sandboxId}/process/pty' \
  --request POST \
  --header 'Content-Type: application/json' \
  --data '{
  "cols": 120,
  "cwd": "/workspace",
  "envs": {"TERM": "xterm-256color"},
  "id": "my-session",
  "rows": 30
}'
```

### Connect to Existing PTY Session

```python
pty_handle = sandbox.process.connect_pty_session("my-session")
pty_handle.send_input("pwd\n")
pty_handle.send_input("exit\n")
for data in pty_handle:
    print(data.decode("utf-8", errors="replace"), end="")
print(f"Exit code: {pty_handle.exit_code}")
```

```typescript
const handle = await sandbox.process.connectPty('my-session', {
  onData: (data) => {
    const text = new TextDecoder().decode(data)
    process.stdout.write(text)
  },
})
await handle.waitForConnection()
await handle.sendInput('pwd\n')
const result = await handle.wait()
console.log(`Exit code: ${result.exitCode}`)
await handle.disconnect()
```

```ruby
pty_handle = sandbox.process.connect_pty_session('my-session')
pty_handle.send_input("echo 'Hello World'\n")
pty_handle.each { |data| print data }
puts "Exit code: #{pty_handle.exit_code}"
```

```go
handle, err := sandbox.Process.ConnectPty(ctx, "my-session")
if err != nil { log.Fatal(err) }
defer handle.Disconnect()
if err := handle.WaitForConnection(ctx); err != nil { log.Fatal(err) }
handle.SendInput([]byte("pwd\n"))
for data := range handle.DataChan() { fmt.Print(string(data)) }
result, err := handle.Wait(ctx)
if err != nil { log.Fatal(err) }
fmt.Printf("Exit code: %d\n", *result.ExitCode)
```

```bash
curl 'https://proxy.app.daytona.io/toolbox/{sandboxId}/process/pty/{sessionId}/connect'
```

### List PTY Sessions

```python
sessions = sandbox.process.list_pty_sessions()
for session in sessions:
    print(f"ID: {session.id}, Active: {session.active}, Created: {session.created_at}")
```

```typescript
const sessions = await sandbox.process.listPtySessions()
for (const session of sessions) {
  console.log(`ID: ${session.id}, Active: ${session.active}, Created: ${session.createdAt}`)
}
```

```ruby
sessions = sandbox.process.list_pty_sessions
sessions.each { |s| puts "ID: #{s.id}, Active: #{s.active}, Size: #{s.cols}x#{s.rows}" }
```

```go
sessions, err := sandbox.Process.ListPtySessions(ctx)
if err != nil { log.Fatal(err) }
for _, session := range sessions {
	fmt.Printf("ID: %s, Active: %t, Size: %dx%d\n", session.Id, session.Active, session.Cols, session.Rows)
}
```

```bash
curl 'https://proxy.app.daytona.io/toolbox/{sandboxId}/process/pty'
```

### Get PTY Session Info

```python
session_info = sandbox.process.get_pty_session_info("my-session")
print(f"ID: {session_info.id}, Active: {session_info.active}, CWD: {session_info.cwd}, Size: {session_info.cols}x{session_info.rows}")
```

```typescript
const session = await sandbox.process.getPtySessionInfo('my-session')
console.log(`ID: ${session.id}, Active: ${session.active}, CWD: ${session.cwd}, Size: ${session.cols}x${session.rows}`)
if (session.processId) console.log(`PID: ${session.processId}`)
```

```ruby
session_info = sandbox.process.get_pty_session_info('my-session')
puts "ID: #{session_info.id}, Active: #{session_info.active}, CWD: #{session_info.cwd}, Size: #{session_info.cols}x#{session_info.rows}"
```

```go
session, err := sandbox.Process.GetPtySessionInfo(ctx, "my-session")
if err != nil { log.Fatal(err) }
fmt.Printf("ID: %s, Active: %t, CWD: %s, Size: %dx%d\n", session.Id, session.Active, session.Cwd, session.Cols, session.Rows)
if session.ProcessId != nil { fmt.Printf("PID: %d\n", *session.ProcessId) }
```

```bash
curl 'https://proxy.app.daytona.io/toolbox/{sandboxId}/process/session/{sessionId}'
```

### Kill PTY Session

```python
sandbox.process.kill_pty_session("my-session")
pty_sessions = sandbox.process.list_pty_sessions()
for pty_session in pty_sessions:
    print(f"PTY session: {pty_session.id}")
```

```typescript
await sandbox.process.killPtySession('my-session')
try {
  const info = await sandbox.process.getPtySessionInfo('my-session')
  console.log(`Still exists, active: ${info.active}`)
} catch (error) {
  console.log('Session removed')
}
```

```ruby
sandbox.process.delete_pty_session('my-session')
sessions = sandbox.process.list_pty_sessions
sessions.each { |session| puts "PTY session: #{session.id}" }
```

```go
err := sandbox.Process.KillPtySession(ctx, "my-session")
if err != nil { log.Fatal(err) }
sessions, err := sandbox.Process.ListPtySessions(ctx)
if err != nil { log.Fatal(err) }
for _, session := range sessions {
	fmt.Printf("PTY session: %s\n", session.Id)
}
```

```bash
curl 'https://proxy.app.daytona.io/toolbox/{sandboxId}/process/session/{sessionId}' \
  --request DELETE
```

### Resize PTY Session

```python
from daytona.common.pty import PtySize
new_size = PtySize(rows=40, cols=150)
updated_info = sandbox.process.resize_pty_session("my-session", new_size)
print(f"Resized to {updated_info.cols}x{updated_info.rows}")
pty_handle.resize(new_size)
```

```typescript
const updatedInfo = await sandbox.process.resizePtySession('my-session', 150, 40)
console.log(`Resized to ${updatedInfo.cols}x${updatedInfo.rows}`)
await ptyHandle.resize(150, 40)
```

```ruby
pty_size = Daytona::PtySize.new(rows: 40, cols: 150)
session_info = sandbox.process.resize_pty_session('my-session', pty_size)
puts "Resized to #{session_info.cols}x#{session_info.rows}"
```

```go
updatedInfo, err := sandbox.Process.ResizePtySession(ctx, "my-session", types.PtySize{Cols: 150, Rows: 40})
if err != nil { log.Fatal(err) }
fmt.Printf("Resized to %dx%d\n", updatedInfo.Cols, updatedInfo.Rows)
info, err := handle.Resize(ctx, 150, 40)
if err != nil { log.Fatal(err) }
fmt.Printf("Resized to %dx%d\n", info.Cols, info.Rows)
```

```bash
curl 'https://proxy.app.daytona.io/toolbox/{sandboxId}/process/pty/{sessionId}/resize' \
  --request POST \
  --header 'Content-Type: application/json' \
  --data '{"cols": 150, "rows": 40}'
```

### Interactive Commands Example

```python
import time, threading
from daytona.common.pty import PtySize

def handle_pty_data(data: bytes):
    print(data.decode("utf-8", errors="replace"), end="")

pty_handle = sandbox.process.create_pty_session(
    id="interactive-session",
    pty_size=PtySize(cols=300, rows=100)
)

pty_handle.send_input('printf "Accept? (y/n): " && read confirm && if [ "$confirm" = "y" ]; then echo "Accepted"; else echo "Rejected"; fi\n')
time.sleep(1)
pty_handle.send_input("y\n")

pty_session_info = pty_handle.resize(PtySize(cols=210, rows=110))
print(f"Resized to {pty_session_info.cols}x{pty_session_info.rows}")

pty_handle.send_input('exit\n')
for data in pty_handle:
    handle_pty_data(data)
print(f"Exit code: {pty_handle.exit_code}")
```

```typescript
const ptyHandle = await sandbox.process.createPty({
  id: 'interactive-session',
  cols: 300,
  rows: 100,
  onData: data => {
    const text = new TextDecoder().decode(data)
    process.stdout.write(text)
  },
})
await ptyHandle.waitForConnection()

await ptyHandle.sendInput('printf "Accept? (y/n): " && read confirm && if [ "$confirm" = "y" ]; then echo "Accepted"; else echo "Rejected"; fi\n')
await new Promise(resolve => setTimeout(resolve, 1000))
await ptyHandle.sendInput('y\n')

const ptySessionInfo = await sandbox.process.resizePtySession('interactive-session', 210, 110)
console.log(`Resized to ${ptySessionInfo.cols}x${ptySessionInfo.rows}`)

await ptyHandle.sendInput('exit\n')
const result = await ptyHandle.wait()
console.log(`Exit code: ${result.exitCode}`)
```

```ruby
pty_handle = sandbox.process.create_pty_session(
  id: 'interactive-session',
  pty_size: Daytona::PtySize.new(cols: 300, rows: 100)
)

thread = Thread.new { pty_handle.each { |data| print data } }

pty_handle.send_input('printf "Accept? (y/n): " && read confirm && if [ "$confirm" = "y" ]; then echo "Accepted"; else echo "Rejected"; fi' + "\n")
sleep(1)
pty_handle.send_input("y\n")

pty_handle.resize(Daytona::PtySize.new(cols: 210, rows: 110))
puts "\nResized"

pty_handle.send_input("exit\n")
thread.join
puts "Exit code: #{pty_handle.exit_code}"
```

```go
handle, err := sandbox.Process.CreatePty(ctx, "interactive-session",
	options.WithCreatePtySize(types.PtySize{Cols: 300, Rows: 100}),
)
if err != nil { log.Fatal(err) }
defer handle.Disconnect()
if err := handle.WaitForConnection(ctx); err != nil { log.Fatal(err) }

go func() {
	for data := range handle.DataChan() {
		fmt.Print(string(data))
	}
}()

handle.SendInput([]byte(`printf "Accept? (y/n): " && read confirm && if [ "$confirm" = "y" ]; then echo "Accepted"; else echo "Rejected"; fi` + "\n"))
time.Sleep(1 * time.Second)
handle.SendInput([]byte("y\n"))

info, err := handle.Resize(ctx, 210, 110)
if err != nil { log.Fatal(err) }
fmt.Printf("\nResized to %dx%d\n", info.Cols, info.Rows)

handle.SendInput([]byte("exit\n"))
result, err := handle.Wait(ctx)
if err != nil { log.Fatal(err) }
fmt.Printf("Exit code: %d\n", *result.ExitCode)
```

### Long-Running Processes Example

```python
import time, threading
from daytona.common.pty import PtySize

pty_handle = sandbox.process.create_pty_session(
    id="long-running-session",
    pty_size=PtySize(cols=120, rows=30)
)

pty_handle.send_input('while true; do echo "Running... $(date)"; sleep 1; done\n')
time.sleep(3)

print("Killing process...")
pty_handle.kill()

for data in pty_handle:
    print(data.decode("utf-8", errors="replace"), end="")

print(f"Exit code: {pty_handle.exit_code}")
if pty_handle.error:
    print(f"Error: {pty_handle.error}")
```

```typescript
const ptyHandle = await sandbox.process.createPty({
  id: 'long-running-session',
  cols: 120,
  rows: 30,
  onData: (data) => {
    const text = new TextDecoder().decode(data)
    process.stdout.write(text)
  },
})
await ptyHandle.waitForConnection()

await ptyHandle.sendInput('while true; do echo "Running... $(date)"; sleep 1; done\n')
await new Promise(resolve => setTimeout(resolve, 3000))

console.log('Killing process...')
await ptyHandle.kill()

const result = await ptyHandle.wait()
console.log(`Exit code: ${result.exitCode}`)
if (result.error) console.log(`Error: ${result.error}`)
```

```ruby
pty_handle = sandbox.process.create_pty_session(
  id: 'long-running-session',
  pty_size: Daytona::PtySize.new(cols: 120, rows: 30)
)

thread = Thread.new { pty_handle.each { |data| print data } }

pty_handle.send_input("while true; do echo \"Running... $(date)\"; sleep 1; done\n")
sleep(3)

puts "Killing process..."
pty_handle.kill

thread.join
puts "Exit code: #{pty_handle.exit_code}"
puts "Error: #{pty_handle.error}" if pty_handle.error
```

```go
handle, err := sandbox.Process.CreatePty(ctx, "long-running-session",
	options.WithCreatePtySize(types.PtySize{Cols: 120, Rows: 30}),
)
if err != nil { log.Fatal(err) }
defer handle.Disconnect()
if err := handle.WaitForConnection(ctx); err != nil { log.Fatal(err) }

go func() {
	for data := range handle.DataChan() {
		fmt.Print(string(data))
	}
}()

handle.SendInput([]byte(`while true; do echo "Running... $(date)"; sleep 1; done` + "\n"))
time.Sleep(3 * time.Second)

fmt.Println("Killing process...")
if err := handle.Kill(ctx); err != nil { log.Fatal(err) }

result, err := handle.Wait(ctx)
if err != nil { log.Fatal(err) }
fmt.Printf("Exit code: %d\n", *result.ExitCode)
if result.Error != nil { fmt.Printf("Error: %s\n", *result.Error) }
```

### Resource Management

Always clean up PTY sessions to prevent resource leaks:

```python
pty_handle = None
try:
    pty_handle = sandbox.process.create_pty_session(id="session", pty_size=PtySize(cols=120, rows=30))
    # Do work...
finally:
    if pty_handle:
        pty_handle.kill()
```

```typescript
let ptyHandle
try {
  ptyHandle = await sandbox.process.createPty({id: 'session', cols: 120, rows: 30})
  // Do work...
} finally {
  if (ptyHandle) await ptyHandle.kill()
}
```

```ruby
pty_handle = nil
begin
  pty_handle = sandbox.process.create_pty_session(
    id: 'session',
    pty_size: Daytona::PtySize.new(cols: 120, rows: 30)
  )
  # Do work...
ensure
  pty_handle&.kill
end
```

```go
handle, err := sandbox.Process.CreatePty(ctx, "session",
	options.WithCreatePtySize(types.PtySize{Cols: 120, Rows: 30}),
)
if err != nil { log.Fatal(err) }
defer handle.Disconnect()
// Do work...
defer handle.Kill(ctx)
```

### PtyHandle Methods

**Send input**: Send commands or user input to the PTY session.

```python
pty_handle.send_input("ls -la\n")
pty_handle.send_input("y\n")
```

```typescript
await ptyHandle.sendInput('ls -la\n')
await ptyHandle.sendInput(new Uint8Array([3])) // Ctrl+C
```

```ruby
pty_handle.send_input("ls -la\n")
```

```go
handle.SendInput([]byte("ls -la\n"))
handle.SendInput([]byte{0x03}) // Ctrl+C
```

**Wait for completion**: Wait for PTY process to exit and get result.

```python
def handle_data(data: bytes):
    print(data.decode("utf-8", errors="replace"), end="")
result = pty_handle.wait(on_data=handle_data, timeout=30)
print(f"Exit code: {result.exit_code}")
```

```typescript
const result = await ptyHandle.wait()
if (result.exitCode === 0) {
  console.log('Success')
} else {
  console.log(`Failed: ${result.exitCode}`)
  if (result.error) console.log(`Error: ${result.error}`)
}
```

```ruby
pty_handle.each { |data| print data }
if pty_handle.exit_code == 0
  puts 'Success'
else
  puts "Failed: #{pty_handle.exit_code}"
  puts "Error: #{pty_handle.error}" if pty_handle.error
end
```

```go
result, err := handle.Wait(ctx)
if err != nil { log.Fatal(err) }
if result.ExitCode != nil && *result.ExitCode == 0 {
	fmt.Println("Success")
} else {
	fmt.Printf("Failed: %d\n", *result.ExitCode)
	if result.Error != nil { fmt.Printf("Error: %s\n", *result.Error) }
}
```

**Wait for connection**: Wait for WebSocket connection to be established before sending input.

```python
# Python handles connection internally
```

```typescript
await ptyHandle.waitForConnection()
await ptyHandle.sendInput('echo "Connected!"\n')
```

```ruby
# Ruby handles connection internally
pty_handle.send_input("echo 'Connected!'\n")
```

```go
if err := handle.WaitForConnection(ctx); err != nil { log.Fatal(err) }
handle.SendInput([]byte("echo 'Connected!'\n"))
```

**Kill PTY process**: Terminate the session from the handle.

```python
pty_handle.kill()
```

```typescript
await ptyHandle.kill()
const result = await ptyHandle.wait()
console.log(`Exit code: ${result.exitCode}`)
```

```ruby
pty_handle.kill
puts "Exit code: #{pty_handle.exit_code}"
```

```go
if err := handle.Kill(ctx); err != nil { log.Fatal(err) }
result, err := handle.Wait(ctx)
if err != nil { log.Fatal(err) }
fmt.Printf("Exit code: %d\n", *result.ExitCode)
```

**Resize from handle**: Change terminal dimensions directly from the handle.

```python
from daytona.common.pty import PtySize
pty_handle.resize(PtySize(cols=120, rows=30))
```

```typescript
await ptyHandle.resize(120, 30)
```

```ruby
pty_handle.resize(Daytona::PtySize.new(cols: 120, rows: 30))
```

```go
info, err := handle.Resize(ctx, 120, 30)
if err != nil { log.Fatal(err) }
fmt.Printf("Resized to %dx%d\n", info.Cols, info.Rows)
```

**Disconnect**: Disconnect from PTY session and clean up resources without killing the process.

```python
# Use kill() to terminate or let handle go out of scope
```

```typescript
try {
  // ... use PTY session
} finally {
  await ptyHandle.disconnect()
}
```

```ruby
begin
  # ... use PTY session
ensure
  pty_handle.kill
end
```

```go
handle, err := sandbox.Process.CreatePty(ctx, "session")
if err != nil { log.Fatal(err) }
defer handle.Disconnect()
// ... use PTY session
```

**Check connection status**: Check if PTY session is still connected.

```python
session_info = sandbox.process.get_pty_session_info("my-session")
print(f"Active: {session_info.active}")
```

```typescript
if (ptyHandle.isConnected()) {
  console.log('PTY session is active')
}
```

```ruby
session_info = sandbox.process.get_pty_session_info('my-session')
puts 'Active' if session_info.active
```

```go
if handle.IsConnected() {
	fmt.Println("PTY session is active")
}
```

**Exit code and error**: Access exit code and error message after process terminates.

```python
print(f"Exit code: {pty_handle.exit_code}")
if pty_handle.error:
    print(f"Error: {pty_handle.error}")
```

```typescript
console.log(`Exit code: ${ptyHandle.exitCode}`)
if (ptyHandle.error) console.log(`Error: ${ptyHandle.error}`)
```

```ruby
puts "Exit code: #{pty_handle.exit_code}"
puts "Error: #{pty_handle.error}" if pty_handle.error
```

```go
if exitCode := handle.ExitCode(); exitCode != nil {
	fmt.Printf("Exit code: %d\n", *exitCode)
}
if errMsg := handle.Error(); errMsg != nil {
	fmt.Printf("Error: %s\n", *errMsg)
}
```

**Iterate over output (Python/Ruby)**: Iterate over PTY handle to receive output data.

```python
for data in pty_handle:
    text = data.decode("utf-8", errors="replace")
    print(text, end="")
print(f"Exit code: {pty_handle.exit_code}")
```

```ruby
pty_handle.each do |data|
  print data
end
puts "Exit code: #{pty_handle.exit_code}"
```

TypeScript uses `onData` callback, Go uses `DataChan()` channel.

### Error Handling

Check exit codes and handle errors appropriately:

```python
result = pty_handle.wait()
if result.exit_code != 0:
    print(f"Failed: {result.exit_code}")
    print(f"Error: {result.error}")
```

```typescript
const result = await ptyHandle.wait()
if (result.exitCode !== 0) {
  console.log(`Failed: ${result.exitCode}`)
  console.log(`Error: ${result.error}`)
}
```

```ruby
pty_handle.each { |data| print data }
if pty_handle.exit_code != 0
  puts "Failed: #{pty_handle.exit_code}"
  puts "Error: #{pty_handle.error}"
end
```

```go
result, err := handle.Wait(ctx)
if err != nil { log.Fatal(err) }
if result.ExitCode != nil && *result.ExitCode != 0 {
	fmt.Printf("Failed: %d\n", *result.ExitCode)
	if result.Error != nil { fmt.Printf("Error: %s\n", *result.Error) }
}
```

### Troubleshooting

- **Connection issues**: Verify sandbox status, network connectivity, and proper session IDs
- **Performance issues**: Use appropriate terminal dimensions and efficient data handlers
- **Process management**: Use explicit `kill()` calls and proper timeout handling for long-running processes


### regions
Set sandbox region via `target` parameter: shared regions (us/eu), dedicated regions, or custom regions with your own runners.

## Regions

Sandboxes run on runners organized into **regions** — geographic or logical groupings of compute infrastructure. Specify a region via the `target` parameter during initialization.

### Configuration

**Python:**
```python
from daytona import Daytona, DaytonaConfig

config = DaytonaConfig(target="us")
daytona = Daytona(config)
```

**TypeScript:**
```typescript
import { Daytona } from '@daytonaio/sdk';
const daytona = new Daytona({ target: "eu" });
```

**Go:**
```go
client, _ := daytona.NewClientWithConfig(&types.DaytonaConfig{
    Target: "us",
})
```

**Ruby:**
```ruby
require 'daytona'
config = Daytona::Config.new(target: "eu")
daytona = Daytona::Daytona.new(config)
```

### Shared Regions

Managed by Daytona, available to all organizations without setup. Limits apply to your organization's default region. Contact sales@daytona.io for access to different shared regions.

| Region        | Target   |
| ------------- | -------- |
| United States | `us`     |
| Europe        | `eu`     |

### Dedicated Regions

Managed by Daytona, provisioned exclusively for individual organizations. Contact sales@daytona.io to set up.

### Custom Regions

Created and managed by your organization using your own runner machines. Provides maximum control over data locality, compliance, and infrastructure configuration. No limits on concurrent resource usage. See the runners guide for details.

### Benefits

- Choose specific geographic locations for reduced latency
- Comply with data residency requirements
- Use your own runner machines for custom regions
- Scale compute resources independently within each custom region

### custom-runners
Custom runners and regions: bring your own machines to custom regions with full control over data locality and compliance; configure with name, proxy/SSH/snapshot URLs; authenticate with provided tokens and API keys.

## Runners

Runners are machines that power Daytona's compute plane. Each runner handles:
- Workload execution for sandbox workloads
- Resource management (CPU, memory, disk allocation and monitoring)
- Health reporting to the control plane
- Network connectivity (networking, proxy, SSH access)

Runners in shared and dedicated regions are fully managed by Daytona. Custom regions require you to bring and manage your own runner machines.

:::caution
Custom runners are experimental and may change. Contact support@daytona.io for access.
:::

## Custom Regions

Custom regions are created and managed by your organization using your own runner machines, providing control over data locality, compliance, and infrastructure. No limits on concurrent resource usage.

### Configuration

**name** (required): Unique identifier containing only letters, numbers, underscores, periods, hyphens. Used when creating sandboxes.

**proxyUrl** (optional): URL of proxy service routing traffic to sandboxes. Required for private network deployments.

**sshGatewayUrl** (optional): URL of SSH gateway handling SSH connections. Required for private network deployments.

**snapshotManagerUrl** (optional): URL of snapshot manager for storage/retrieval. Required for private network deployments.

### Credentials

Daytona provides credentials for configured optional services:
- API key for proxy service authentication
- API key for SSH gateway authentication
- Basic auth credentials for snapshot manager access

Credentials can be regenerated but require redeploying services with updated credentials.

## Custom Runners

Custom runners are created and managed by your organization within custom regions.

### Configuration

**name** (required): Unique identifier containing only letters, numbers, underscores, periods, hyphens.

**regionId** (required): ID of the custom region this runner is assigned to. All runners in a region share the region's proxy and SSH gateway configuration.

### Token

When creating a custom runner, Daytona provides a secure token for runner authentication. Save it securely—it cannot be retrieved again.

### Installation

After registering a runner and obtaining its token, install and configure the Daytona runner application on your infrastructure. Detailed installation instructions will be provided in a future update. Contact support@daytona.io for assistance.

### sandboxes
Daytona Sandboxes: isolated runtimes (Python/TypeScript/JavaScript) with configurable resources (default 1 vCPU/1GB/3GiB), lifecycle operations (create/start/stop/archive/recover/resize/delete), and automated management (auto-stop after 15min inactivity, auto-archive after 7 days, optional auto-delete).

## Sandbox Lifecycle

Sandboxes are isolated runtime environments managed by Daytona. Default resources: 1 vCPU, 1GB RAM, 3GiB disk. Organizations can request up to 4 vCPUs, 8GB RAM, 10GB disk.

Sandboxes transition through states: created → running → stopped → archived → deleted, with error states possible.

## Runtime Support

Supports Python, TypeScript, and JavaScript. Default is Python. Set via `language` parameter.

Sandbox names are optional and reusable (become available after deletion).

## Creating Sandboxes

```python
from daytona import Daytona, CreateSandboxFromSnapshotParams, Resources, Image

daytona = Daytona()

# Basic creation
sandbox = daytona.create()

# With language, name, labels
sandbox = daytona.create(CreateSandboxFromSnapshotParams(
    language="python",
    name="my_awesome_sandbox",
    labels={"LABEL": "label"}
))

# Custom resources (CPU, memory, disk)
sandbox = daytona.create(CreateSandboxFromImageParams(
    image=Image.debian_slim("3.12"),
    resources=Resources(cpu=2, memory=4, disk=8)
))

# Ephemeral sandbox (auto-deleted when stopped)
sandbox = daytona.create(CreateSandboxFromSnapshotParams(
    ephemeral=True,
    auto_stop_interval=5  # minutes of inactivity
))
```

TypeScript: `await daytona.create({...})`, Ruby: `daytona.create(...)`, Go: `client.Create(ctx, params)`, CLI: `daytona create [flags]`, API: `POST /api/sandbox`.

Resource parameters are optional; defaults apply if omitted. Daytona maintains warm sandbox pools for fast launches.

## Lifecycle Operations

**Start**: `sandbox.start()` (Python/Ruby), `await sandbox.start()` (TypeScript), `sandbox.Start(ctx)` (Go), `daytona start [ID|NAME]` (CLI), `POST /api/sandbox/{id}/start` (API).

**List**: `daytona.list()` returns all sandboxes with ID, root directory, state. Supports label filtering: `daytona.list(labels={"env": "dev"})`.

**Stop**: `sandbox.stop()` - maintains filesystem, clears memory, incurs only disk costs. Can be restarted. Use `daytona.find_one(id)` to retrieve stopped sandbox.

**Archive**: `sandbox.archive()` - moves filesystem to cost-effective storage. Must be stopped first. Slower startup than stopped state.

**Recover**: `sandbox.recover()` - recovers from error state if `sandbox.recoverable` is true. Check before attempting.

**Resize**: `sandbox.resize(Resources(cpu=2, memory=4, disk=8))` - started sandboxes can only increase CPU/memory (not disk); stopped sandboxes can change all (disk only increases).

**Delete**: `sandbox.delete()` - permanently removes sandbox.

## Automated Lifecycle Management

**Auto-stop interval** (default 15 minutes): Stops running sandbox after inactivity. Set to `0` to disable. Resets on: preview access, SSH connections, Toolbox SDK API calls. Does NOT reset on: background scripts, long-running tasks without interaction.

```python
sandbox = daytona.create(CreateSandboxFromSnapshotParams(
    auto_stop_interval=0  # Run indefinitely
))
```

**Auto-archive interval** (default 7 days): Archives stopped sandbox after specified time. Set to `0` for max 30 days.

```python
sandbox = daytona.create(CreateSandboxFromSnapshotParams(
    auto_archive_interval=60  # 1 hour
))
```

**Auto-delete interval** (default: never): Deletes stopped sandbox after specified time. Set to `0` for immediate deletion after stop, `-1` to disable.

```python
sandbox = daytona.create(CreateSandboxFromSnapshotParams(
    auto_delete_interval=60  # 1 hour
))
sandbox.set_auto_delete_interval(0)  # Immediate
sandbox.set_auto_delete_interval(-1)  # Disable
```

All SDKs support setting these intervals on creation and via setter methods.

### snapshots
Create and manage sandbox templates from Docker/OCI images with custom resources, regions, and support for Docker-in-Docker and Kubernetes workloads.

## Snapshots

Snapshots are sandbox templates created from Docker or OCI compatible images. They provide consistent, reproducible sandbox environments with dependencies, settings, and resources.

### Creating Snapshots

Create snapshots via Dashboard, SDK (Python/TypeScript/Ruby/Go), CLI, or API.

**Basic parameters:**
- **name**: Identifier for referencing the snapshot
- **image**: Base image (tag or digest required; `latest`, `lts`, `stable` tags not allowed)
- **entrypoint** (optional): Long-running command; defaults to `sleep infinity`
- **resources** (optional): CPU, memory, disk; defaults to 1 vCPU, 1GiB memory, 3GiB storage
- **region_id** (optional): Region for snapshot availability

**Image sources:**
- Public images: `python:3.11-slim`
- Local images/Dockerfiles: Use CLI `daytona snapshot push` or `--dockerfile` flag
- Private registries: Configure registry credentials first (Docker Hub, Google Artifact Registry, GitHub Container Registry)

**Example - Create with custom resources:**
```python
daytona.snapshot.create(
  CreateSnapshotParams(
    name="my-snapshot",
    image=Image.debian_slim("3.12"),
    resources=Resources(cpu=2, memory=4, disk=8),
    region_id="us"
  ),
  on_logs=print
)
```

```typescript
await daytona.snapshot.create({
  name: 'my-snapshot',
  image: Image.debianSlim('3.13'),
  resources: { cpu: 2, memory: 4, disk: 8 },
  regionId: 'us'
}, { onLogs: console.log })
```

```bash
daytona snapshot create my-snapshot --image python:3.11-slim --cpu 2 --memory 4 --disk 8 --region us
```

```bash
curl https://app.daytona.io/api/snapshots \
  --request POST \
  --header 'Content-Type: application/json' \
  --header 'Authorization: Bearer YOUR_SECRET_TOKEN' \
  --data '{
    "name": "my-snapshot",
    "imageName": "python:3.11-slim",
    "cpu": 2,
    "memory": 4,
    "disk": 8,
    "regionId": "us"
  }'
```

**Local images:**
```bash
docker images  # Verify image exists
daytona snapshot push custom-alpine:3.21 --name alpine-minimal --cpu 2 --memory 4 --disk 8
```

**From Dockerfile:**
```bash
daytona snapshot create my-snapshot --dockerfile ./Dockerfile
```

**Private registries setup:**
1. Navigate to Daytona Registries dashboard
2. Add registry with credentials
3. Create snapshot using full image path (e.g., `docker.io/<username>/<image>:<tag>`, `us-central1-docker.pkg.dev/<project>/<repo>/<image>:<tag>`, `ghcr.io/<project>/<image>:<tag>`)

**Declarative Builder:** Use SDKs to programmatically define images instead of importing from registry.

### Managing Snapshots

**Get snapshot by name:**
```python
snapshot = daytona.snapshot.get("my-snapshot")
```

```typescript
const snapshot = await daytona.snapshot.get('my-snapshot')
```

```bash
curl https://app.daytona.io/api/snapshots/my-snapshot \
  --header 'Authorization: Bearer YOUR_SECRET_TOKEN'
```

**List snapshots with pagination:**
```python
result = daytona.snapshot.list(page=2, limit=10)
for snapshot in result.items:
    print(f"{snapshot.name} ({snapshot.image_name})")
```

```typescript
const result = await daytona.snapshot.list(1, 10)
console.log(`Found ${result.total} snapshots`)
```

```bash
daytona snapshot list --page 2 --limit 10
```

**Activate inactive snapshots** (auto-deactivate after 2 weeks of non-use):
```python
snapshot = daytona.snapshot.get("my-inactive-snapshot")
activated = daytona.snapshot.activate(snapshot)
```

```bash
curl https://app.daytona.io/api/snapshots/my-inactive-snapshot/activate \
  --request POST \
  --header 'Authorization: Bearer YOUR_SECRET_TOKEN'
```

**Deactivate snapshots:** Via dashboard (three dots menu → Deactivate)

**Delete snapshots:**
```python
daytona.snapshot.delete(snapshot)
```

```bash
daytona snapshot delete my-snapshot
```

### Docker-in-Docker

Sandboxes can run Docker containers (Docker-in-Docker) for building, testing, deploying containerized applications, running databases, microservices, etc.

**Requirements:** Allocate at least 2 vCPU and 4GiB memory.

**Pre-built images:**
- `docker:28.3.3-dind` (Alpine-based, lightweight)
- `docker:28.3.3-dind-rootless` (enhanced security)
- `docker:28.3.2-dind-alpine3.22`

**Manual installation:**
```dockerfile
FROM ubuntu:22.04
RUN curl -fsSL https://get.docker.com | VERSION=28.3.3 sh -
```

**Docker Compose example:**
```python
sandbox = daytona.create(CreateSandboxFromSnapshotParams(snapshot='docker-dind'))
compose_content = '''
services:
  web:
    image: nginx:alpine
    ports:
      - "8080:80"
'''
sandbox.fs.upload_file(compose_content.encode(), 'docker-compose.yml')
sandbox.process.exec('docker compose -p demo up -d')
sandbox.process.exec('docker compose -p demo ps')
sandbox.process.exec('docker compose -p demo down')
```

### Kubernetes (k3s)

Run k3s cluster inside sandbox:
```typescript
const sandbox = await daytona.create()
await sandbox.process.executeCommand('curl -sfL https://get.k3s.io | sh -')
const sessionName = 'k3s-server'
await sandbox.process.createSession(sessionName)
await sandbox.process.executeSessionCommand(sessionName, {
  command: 'sudo /usr/local/bin/k3s server',
  async: true
})
await new Promise(r => setTimeout(r, 30000))  // Wait for k3s startup
const pods = await sandbox.process.executeCommand('sudo /usr/local/bin/kubectl get pod -A')
```

### Default Snapshots

When no snapshot specified, Daytona uses default snapshots with Python, Node.js, language servers, and common packages.

| Snapshot | vCPU | Memory | Storage |
|----------|------|--------|---------|
| `daytona-small` | 1 | 1GiB | 3GiB |
| `daytona-medium` | 2 | 4GiB | 8GiB |
| `daytona-large` | 4 | 8GiB | 10GiB |

**Included Python packages:** anthropic, beautifulsoup4, claude-agent-sdk, daytona, django, flask, huggingface-hub, instructor, keras, langchain, llama-index, matplotlib, numpy, ollama, openai, opencv-python, pandas, pillow, pydantic-ai, requests, scikit-learn, scipy, seaborn, sqlalchemy, torch, transformers

**Included Node.js packages:** @anthropic-ai/claude-code, bun, openclaw, opencode-ai, ts-node, typescript, typescript-language-server


### ssh-access
Create time-limited SSH tokens for sandbox access, connect via ssh <token>@ssh.app.daytona.io, integrate with VSCode/JetBrains, revoke anytime.

## Creating SSH Access Tokens

Generate time-limited SSH tokens for sandbox access via dashboard or SDK:

```python
from daytona import Daytona

daytona = Daytona()
sandbox = daytona.get("sandbox-abc123")
ssh_access = sandbox.create_ssh_access(expires_in_minutes=60)
print(f"SSH Token: {ssh_access.token}")
```

```typescript
const daytona = new Daytona()
const sandbox = await daytona.get('sandbox-abc123')
const sshAccess = await sandbox.createSshAccess(60)
```

```ruby
daytona = Daytona::Daytona.new
sandbox = daytona.get('sandbox-abc123')
ssh_access = sandbox.create_ssh_access(expires_in_minutes: 60)
```

## Connection

Connect using the generated token:

```bash
ssh <token>@ssh.app.daytona.io
```

## IDE Integration

**VSCode**: Install Remote Explorer extension, add SSH connection with the command above.

**JetBrains IDEs**: Download JetBrains Gateway, add connection with SSH command, select IDE for sandbox installation.

## Token Management

Tokens expire after 60 minutes by default. Revoke all or specific tokens:

```python
sandbox.revoke_ssh_access()
sandbox.revoke_ssh_access(token="specific-token")
```

```typescript
await sandbox.revokeSshAccess()
await sandbox.revokeSshAccess('specific-token')
```

```ruby
sandbox.revoke_ssh_access
sandbox.revoke_ssh_access(token: 'specific-token')
```

### vnc-access
Browser-based VNC desktop for Daytona Sandbox with programmatic start/stop/status control and Computer Use automation for mouse, keyboard, screenshots, and display operations.

## VNC Access

Provides graphical desktop environment for Daytona Sandbox in browser. Works with Computer Use to enable both manual and automated desktop interactions.

### Use Cases
- GUI application development and testing
- Browser testing in full browser environment
- Visual debugging of graphical output
- Desktop tool access (IDEs, design tools)
- Observing AI agents performing automated tasks

### Requirements
VNC and Computer Use require default sandbox image. Custom images need manual package installation.

### Access from Dashboard
1. Navigate to Daytona Sandboxes
2. Locate sandbox, click options menu (⋮)
3. Select VNC from dropdown
4. Click Connect button in VNC viewer

VNC sessions remain active while sandbox runs. Auto-stopped sandboxes require restart before reconnecting.

### Programmatic VNC Management

**Start VNC** - Start all VNC processes (Xvfb, xfce4, x11vnc, novnc):
```python
result = sandbox.computer_use.start()
print("VNC processes started:", result.message)
```
```typescript
const result = await sandbox.computerUse.start();
console.log('VNC processes started:', result.message);
```
```ruby
result = sandbox.computer_use.start
puts "VNC processes started: #{result.message}"
```
```go
err := sandbox.ComputerUse.Start(ctx)
if err != nil { log.Fatal(err) }
defer sandbox.ComputerUse.Stop(ctx)
fmt.Println("VNC processes started")
```
```bash
curl 'https://proxy.app.daytona.io/toolbox/{sandboxId}/computeruse/start' --request POST
```

**Stop VNC** - Stop all VNC processes:
```python
result = sandbox.computer_use.stop()
```
```typescript
const result = await sandbox.computerUse.stop();
```
```ruby
result = sandbox.computer_use.stop
```
```go
err := sandbox.ComputerUse.Stop(ctx)
```
```bash
curl 'https://proxy.app.daytona.io/toolbox/{sandboxId}/computeruse/stop' --request POST
```

**Get VNC Status** - Check if VNC processes are running:
```python
response = sandbox.computer_use.get_status()
print("VNC status:", response.status)
```
```typescript
const status = await sandbox.computerUse.getStatus();
console.log('VNC status:', status.status);
```
```ruby
response = sandbox.computer_use.status
puts "VNC status: #{response.status}"
```
```go
status, err := sandbox.ComputerUse.GetStatus(ctx)
fmt.Printf("VNC status: %v\n", status["status"])
```
```bash
curl 'https://proxy.app.daytona.io/toolbox/{sandboxId}/computeruse/status'
```

### Automating Desktop Interactions

Once VNC is running, use Computer Use to automate:
- **Mouse**: click, move, drag, scroll, get cursor position
- **Keyboard**: type text, press keys, execute hotkey combinations
- **Screenshot**: capture full screen, regions, or compressed images
- **Display**: get display information, list open windows

Example - Automated browser interaction:
```python
sandbox.computer_use.start()
sandbox.computer_use.mouse.click(50, 50)
sandbox.computer_use.keyboard.type("https://www.daytona.io/docs/")
sandbox.computer_use.keyboard.press("Return")
screenshot = sandbox.computer_use.screenshot.take_full_screen()
```
```typescript
await sandbox.computerUse.start();
await sandbox.computerUse.mouse.click(50, 50);
await sandbox.computerUse.keyboard.type('https://www.daytona.io/docs/');
await sandbox.computerUse.keyboard.press('Return');
const screenshot = await sandbox.computerUse.screenshot.takeFullScreen();
```

### Required Packages for Custom Images

**VNC and desktop environment:**
- `xvfb` - X Virtual Framebuffer for headless display
- `xfce4` - Desktop environment
- `xfce4-terminal` - Terminal emulator
- `x11vnc` - VNC server
- `novnc` - Web-based VNC client
- `dbus-x11` - D-Bus session support

**X11 libraries:**
- `libx11-6` - X11 client library
- `libxrandr2` - X11 RandR extension (display configuration)
- `libxext6` - X11 extensions library
- `libxrender1` - X11 rendering extension
- `libxfixes3` - X11 fixes extension
- `libxss1` - X11 screen saver extension
- `libxtst6` - X11 testing extension (input simulation)
- `libxi6` - X11 input extension

### volumes
FUSE-based shared file mounts across sandboxes with S3 storage; create, mount to absolute paths (with subpath support), read/write like normal files, list/delete; max 100 per org, slower than local FS, no block storage.

## Overview

FUSE-based mounts providing shared file access across sandboxes. Enable instant reads from large files without manual uploads. Data stored in S3-compatible object store.

- Multiple volumes can mount to single sandbox
- Single volume can mount to multiple sandboxes

## Create Volumes

Via dashboard: Navigate to Daytona Volumes, click Create Volume, enter name.

Via SDK:
```python
daytona = Daytona()
volume = daytona.volume.create("my-awesome-volume")
```

```typescript
const daytona = new Daytona();
const volume = await daytona.volume.create("my-awesome-volume");
```

```ruby
daytona = Daytona::Daytona.new
volume = daytona.volume.create("my-awesome-volume")
```

## Mount Volumes

Mount via `CreateSandboxFromSnapshotParams` with `volumes` parameter containing `VolumeMount` objects.

Mount path requirements:
- Absolute paths starting with `/` (e.g., `/home/daytona/volume`)
- Cannot be root (`/` or `//`)
- No relative components (`/../`, `/./`, ending with `/..` or `/.`)
- No consecutive slashes (except at start)
- Cannot mount to system directories: `/proc`, `/sys`, `/dev`, `/boot`, `/etc`, `/bin`, `/sbin`, `/lib`, `/lib64`

Example with subpath (useful for multi-tenancy):
```python
from daytona import CreateSandboxFromSnapshotParams, Daytona, VolumeMount

daytona = Daytona()
volume = daytona.volume.get("my-volume", create=True)

params = CreateSandboxFromSnapshotParams(
    language="python",
    volumes=[VolumeMount(volume_id=volume.id, mount_path="/home/daytona/volume", subpath="users/alice")],
)
sandbox = daytona.create(params)
```

```typescript
const daytona = new Daytona()
const volume = await daytona.volume.get('my-volume', true)

const sandbox = await daytona.create({
  language: 'typescript',
  volumes: [{ volumeId: volume.id, mountPath: '/home/daytona/volume', subpath: 'users/alice' }],
})
```

```ruby
daytona = Daytona::Daytona.new
volume = daytona.volume.get('my-volume', create: true)

params = Daytona::CreateSandboxFromSnapshotParams.new(
  language: Daytona::CodeLanguage::PYTHON,
  volumes: [DaytonaApiClient::SandboxVolume.new(
    volume_id: volume.id,
    mount_path: '/home/daytona/volume',
    subpath: 'users/alice'
  )]
)
sandbox = daytona.create(params)
```

## Work with Volumes

Read/write like any directory. Data persists beyond sandbox lifecycle.

```python
with open("/home/daytona/volume/example.txt", "w") as f:
    f.write("Hello from Daytona volume!")
sandbox.delete()  # Volume persists
```

```typescript
import fs from 'fs/promises'
await fs.writeFile('/home/daytona/volume/example.txt', 'Hello from Daytona volume!')
await daytona.delete(sandbox1)
```

```ruby
sandbox.fs.upload_file('Hello from Daytona volume!', '/home/daytona/volume/example.txt')
daytona.delete(sandbox)
```

## Get Volume by Name

```python
daytona = Daytona()
volume = daytona.volume.get("my-awesome-volume", create=True)
print(f"{volume.name} ({volume.id})")
```

```typescript
const daytona = new Daytona()
const volume = await daytona.volume.get('my-awesome-volume', true)
console.log(`Volume ${volume.name} is in state ${volume.state}`)
```

## List Volumes

```python
daytona = Daytona()
volumes = daytona.volume.list()
for volume in volumes:
    print(f"{volume.name} ({volume.id})")
```

```typescript
const daytona = new Daytona()
const volumes = await daytona.volume.list()
volumes.forEach(vol => console.log(`${vol.name} (${vol.id})`))
```

## Delete Volumes

Deleted volumes cannot be recovered.

```python
volume = daytona.volume.get("my-volume", create=True)
daytona.volume.delete(volume)
```

```typescript
const volume = await daytona.volume.get('my-volume', true)
await daytona.volume.delete(volume)
```

```ruby
volume = daytona.volume.get('my-volume', create: true)
daytona.volume.delete(volume)
```

## Limitations

- Cannot be used for block storage access (database tables)
- Slower read/write compared to local sandbox filesystem

## Pricing & Limits

- Included at no additional cost
- Up to 100 volumes per organization
- Volume data doesn't count against storage quota


### vpn_connections
Connect sandboxes to Tailscale (browser login, auth key, or web terminal) or OpenVPN (config file + programmatic/terminal setup) for private network access; requires Tier 3+ and VPN credentials.

## VPN Connections

Connect Daytona Sandboxes to private networks via VPN, enabling access to private IP resources and allowing other devices on the VPN to access the sandbox. Requires Tier 3+ account and VPN provider credentials.

### Tailscale

Three connection methods:

**Browser Login (Interactive)**
- Install Tailscale, start daemon, run `tailscale up` to get login URL
- Visit URL in browser to authenticate
- Poll `tailscale status` until connected, verify with `tailscale ip -4`

Python example:
```python
from daytona import Daytona, DaytonaConfig
import time, re

config = DaytonaConfig(api_key="YOUR_API_KEY")
daytona = Daytona(config)
sandbox = daytona.create()

# Install and start
sandbox.process.exec("curl -fsSL https://tailscale.com/install.sh | sh", timeout=300)
sandbox.process.exec("nohup sudo tailscaled > /dev/null 2>&1 &", timeout=10)
time.sleep(3)

# Get login URL
sandbox.process.exec("sudo tailscale up > /tmp/tailscale-login.txt 2>&1 &", timeout=10)
time.sleep(3)
response = sandbox.process.exec("cat /tmp/tailscale-login.txt", timeout=10)
url_match = re.search(r'https://login\.tailscale\.com/a/[^\s]+', response.result)
if url_match:
    print(f"Visit: {url_match.group(0)}")
    
    # Poll for connection
    for _ in range(60):  # 5 min max
        time.sleep(5)
        status = sandbox.process.exec("tailscale status 2>&1", timeout=30)
        if status.exit_code == 0 and "logged out" not in status.result.lower():
            ip = sandbox.process.exec("tailscale ip -4 2>&1", timeout=10)
            if ip.exit_code == 0 and ip.result.strip():
                print(f"Connected! IP: {ip.result.strip()}")
                break
```

TypeScript equivalent uses `sandbox.process.executeCommand()` with same logic.

**Auth Key (Non-Interactive)**
- Generate auth key from Tailscale admin console (Add device → Linux server → Generate install script)
- Extract `tskey-auth-<AUTH_KEY>` from script
- Install and connect: `curl -fsSL https://tailscale.com/install.sh | sh && sudo tailscale up --auth-key=tskey-auth-<AUTH_KEY>`

Python:
```python
TAILSCALE_AUTH_KEY = "YOUR_AUTH_KEY"
sandbox = daytona.create()
sandbox.process.exec("curl -fsSL https://tailscale.com/install.sh | sh", timeout=300)
sandbox.process.exec("nohup sudo tailscaled > /dev/null 2>&1 &", timeout=10)
time.sleep(3)
sandbox.process.exec(f"sudo tailscale up --auth-key={TAILSCALE_AUTH_KEY}", timeout=60)
sandbox.process.exec("tailscale status", timeout=30)
```

**Web Terminal**
- Use Daytona Dashboard terminal or SSH access
- Install: `curl -fsSL https://tailscale.com/install.sh | sh`
- Run daemon in tmux: `tmux new -d -s tailscale 'sudo tailscaled'`
- Authenticate: `sudo tailscale up` → visit URL → confirm "Your device <id> is logged in to the <address> tailnet"

### OpenVPN

Two connection methods:

**Client Configuration File**
Required file format (`client.ovpn`):
```
client
proto udp
explicit-exit-notify
remote <YOUR_OPENVPN_SERVER_IP> <YOUR_OPENVPN_SERVER_PORT>
dev tun
resolv-retry infinite
nobind
persist-key
persist-tun
remote-cert-tls server
verify-x509-name <YOUR_OPENVPN_SERVER_NAME> name
auth SHA256
auth-nocache
cipher AES-128-GCM
ignore-unknown-option data-ciphers
data-ciphers AES-128-GCM
ncp-ciphers AES-128-GCM
tls-client
tls-version-min 1.2
tls-cipher TLS-ECDHE-ECDSA-WITH-AES-128-GCM-SHA256
tls-ciphersuites TLS_AES_256_GCM_SHA384:TLS_AES_128_GCM_SHA256:TLS_CHACHA20_POLY1305_SHA256
ignore-unknown-option block-outside-dns
setenv opt block-outside-dns
verb 3
<ca>
-----BEGIN CERTIFICATE-----
<YOUR_OPENVPN_SERVER_CERTIFICATE>
-----END CERTIFICATE-----
</ca>
<cert>
-----BEGIN CERTIFICATE-----
<YOUR_OPENVPN_CLIENT_CERTIFICATE>
-----END CERTIFICATE-----
</cert>
<key>
-----BEGIN PRIVATE KEY-----
<YOUR_OPENVPN_CLIENT_PRIVATE_KEY>
-----END PRIVATE KEY-----
</key>
<tls-crypt-v2>
-----BEGIN OpenVPN tls-crypt-v2 client key-----
<YOUR_OPENVPN_TLS_CRYPT_V2_CLIENT_KEY>
-----END OpenVPN tls-crypt-v2 client key-----
</tls-crypt-v2>
```

**Programmatic Connection**

Python:
```python
from daytona import Daytona, DaytonaConfig
import time

OPENVPN_CONFIG = """<your config content>"""
config = DaytonaConfig(api_key="YOUR_API_KEY")
daytona = Daytona(config)
sandbox = daytona.create()

# Install
sandbox.process.exec("sudo apt update && sudo apt install -y openvpn", timeout=120)

# Write config
sandbox.fs.upload_file(OPENVPN_CONFIG.encode(), "/home/daytona/client.ovpn")

# Start tunnel
sandbox.process.exec("nohup sudo openvpn /home/daytona/client.ovpn > /tmp/openvpn.log 2>&1 &", timeout=10)
time.sleep(10)

# Verify
sandbox.process.exec("ip addr show tun0", timeout=10)  # Check tunnel interface
sandbox.process.exec("curl -s ifconfig.me", timeout=30)  # Check public IP through VPN
```

TypeScript uses `sandbox.process.executeCommand()` and heredoc for config file:
```typescript
await sandbox.process.executeCommand(
  `cat << 'OVPNEOF' > /home/daytona/client.ovpn\n${ovpnConfig}\nOVPNEOF`,
  undefined, undefined, 30
);
```

**Web Terminal**
- Install: `sudo apt update && sudo apt install -y openvpn tmux`
- Create config: `sudo nano client.ovpn` (paste content, Ctrl+O, Enter, Ctrl+X)
- Run in background: `tmux new -d -s openvpn 'sudo openvpn client.ovpn'`
- Verify: `curl ifconfig.me`


### web-terminal
Web terminal for Sandbox interaction on port 22222, accessible only to Organization members regardless of public settings.

## Web Terminal

A web-based terminal interface for interacting with running Sandboxes.

### Access

Open the Web Terminal by clicking the Terminal icon `>_` in the Sandbox list under the Access column for any running Sandbox. It runs on port `22222` and is available by default.

### Security

Terminal access is restricted to users in your Organization only, regardless of the `public` parameter setting in `CreateSandboxFromSnapshotParams` or `CreateSandboxFromImageParams`.

### Example

```text
ID                    State         Region     Created             Access
──────────────────────────────────────────────────────────────────────────────
sandbox-963e3f71      STARTED       us         12 minutes ago      >_
```

The `>_` icon in the Access column indicates the Web Terminal is available for that Sandbox.

### webhooks
HTTP webhook callbacks for sandbox/snapshot/volume lifecycle events with HTTPS endpoint management, event filtering, testing, and delivery logs.

## Webhooks

HTTP callbacks that Daytona sends to specified endpoints when events occur. Enable real-time notifications, automated workflows, monitoring, integrations, and audit logging.

## Accessing Webhooks

Navigate to Daytona Dashboard → Webhooks in sidebar. Available to organization admins and members with appropriate permissions. Contact support@daytona.io with organization ID to enable if not visible.

## Create Webhook Endpoints

1. Dashboard → Webhooks → Add Endpoint
2. Configure:
   - **Endpoint URL**: HTTPS endpoint to receive events
   - **Description**: endpoint description
   - **Subscribe to events**: select event types
3. Click Create

## Test Webhook Endpoints

1. Dashboard → Webhooks → select endpoint
2. Testing tab → select event type → Send Example
3. Verify endpoint receives payload and application handles webhook format

## Edit Webhook Endpoints

1. Dashboard → Webhooks → select endpoint
2. Click Edit next to option
3. Update details → Save

## Delete Webhook Endpoints

1. Dashboard → Webhooks → select endpoint
2. Click ⋮ menu → Delete → Confirm

## Webhook Events

### Sandbox Events
- `sandbox.created`: New sandbox created
- `sandbox.state.updated`: Sandbox state changed

### Snapshot Events
- `snapshot.created`: New snapshot created
- `snapshot.state.updated`: Snapshot state changed
- `snapshot.removed`: Snapshot removed

### Volume Events
- `volume.created`: New volume created
- `volume.state.updated`: Volume state changed

## Webhook Payload Format

All payloads are JSON with common fields:
- `event` (string): Event type identifier
- `timestamp` (string): ISO 8601 timestamp

### sandbox.created
```json
{
  "event": "sandbox.created",
  "timestamp": "2025-12-19T10:30:00.000Z",
  "id": "sandbox123",
  "organizationId": "org123",
  "state": "started",
  "class": "small",
  "createdAt": "2025-12-19T10:30:00.000Z"
}
```

### sandbox.state.updated
```json
{
  "event": "sandbox.state.updated",
  "timestamp": "2025-12-19T10:30:00.000Z",
  "id": "sandbox123",
  "organizationId": "org123",
  "oldState": "started",
  "newState": "stopped",
  "updatedAt": "2025-12-19T10:30:00.000Z"
}
```

### snapshot.created
```json
{
  "event": "snapshot.created",
  "timestamp": "2025-12-19T10:30:00.000Z",
  "id": "snapshot123",
  "name": "my-snapshot",
  "organizationId": "org123",
  "state": "active",
  "createdAt": "2025-12-19T10:30:00.000Z"
}
```

### snapshot.state.updated
```json
{
  "event": "snapshot.state.updated",
  "timestamp": "2025-12-19T10:30:00.000Z",
  "id": "snapshot123",
  "name": "my-snapshot",
  "organizationId": "org123",
  "oldState": "building",
  "newState": "active",
  "updatedAt": "2025-12-19T10:30:00.000Z"
}
```

### snapshot.removed
```json
{
  "event": "snapshot.removed",
  "timestamp": "2025-12-19T10:30:00.000Z",
  "id": "snapshot123",
  "name": "my-snapshot",
  "organizationId": "org123",
  "removedAt": "2025-12-19T10:30:00.000Z"
}
```

### volume.created
```json
{
  "event": "volume.created",
  "timestamp": "2025-12-19T10:30:00.000Z",
  "id": "vol-12345678",
  "name": "my-volume",
  "organizationId": "org123",
  "state": "ready",
  "createdAt": "2025-12-19T10:30:00.000Z"
}
```

### volume.state.updated
```json
{
  "event": "volume.state.updated",
  "timestamp": "2025-12-19T10:30:00.000Z",
  "id": "vol-12345678",
  "name": "my-volume",
  "organizationId": "org123",
  "oldState": "creating",
  "newState": "ready",
  "updatedAt": "2025-12-19T10:30:00.000Z"
}
```

## Webhook Logs

Dashboard → Webhooks → Logs sidebar. Shows detailed webhook delivery information: message logs, event types, message IDs, timestamps.

