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