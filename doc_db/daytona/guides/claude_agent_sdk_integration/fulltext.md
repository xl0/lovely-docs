

## Pages

### two-agent_coding_system_with_claude_agent_sdk
Two-agent system with local Project Manager (claude-sonnet-4-20250514) delegating via `<developer_task>` tags to Developer Agent in Daytona sandbox using Claude Agent SDK; setup requires Node.js 18+, DAYTONA_API_KEY, ANTHROPIC_API_KEY; workflow: user prompt → planning → delegation → sandbox execution → review → TASK_COMPLETE.

## Overview

Build a two-agent autonomous coding system using Claude Agent SDK and Daytona sandboxes. The **Project Manager Agent** runs locally for high-level planning and task delegation. The **Developer Agent** runs in a Daytona sandbox using Claude Agent SDK for advanced coding and automation.

## Architecture

**Project Manager Agent (Local)**
- Runs locally using basic Anthropic interface with `claude-sonnet-4-20250514`
- Receives user prompts via CLI chat interface
- Plans workflows and delegates coding tasks to Developer Agent
- Reviews Developer Agent outputs and coordinates further actions
- Outputs `TASK_COMPLETE` to signal session completion
- Can present preview links from Developer Agent

**Developer Agent (Sandbox)**
- Provisioned inside Daytona sandbox
- Created using Claude Agent SDK with Claude Code capabilities
- Executes coding tasks and streams results back
- Can host web apps and provide preview links via Daytona Preview Links

## Setup

Clone repository:
```bash
git clone https://github.com/daytonaio/daytona.git
cd daytona/guides/typescript/anthropic/multi-agent-claude-sdk
```

Environment variables:
- `DAYTONA_API_KEY`: From Daytona Dashboard
- `ANTHROPIC_API_KEY`: For Project Manager Agent (required)
- `SANDBOX_ANTHROPIC_API_KEY`: For Developer Agent (optional, defaults to `ANTHROPIC_API_KEY`)

Copy `.env.example` to `.env`:
```bash
DAYTONA_API_KEY=your_daytona_key
ANTHROPIC_API_KEY=your_anthropic_key
SANDBOX_ANTHROPIC_API_KEY=your_anthropic_key
```

Requires Node.js 18+.

Install and run:
```bash
npm install
npm run start
```

## Workflow

1. Daytona sandbox created for Developer Agent
2. Project Manager Agent initialized locally
3. User provides prompt via CLI
4. Project Manager Agent plans and delegates tasks using `<developer_task>` tags
5. Developer Agent executes in sandbox, streams output
6. Project Manager reviews results and coordinates further actions
7. Process repeats until Project Manager outputs `TASK_COMPLETE`
8. Sandbox automatically deleted on exit

## Developer Agent Execution Details

1. Claude Agent SDK installed via `pip install`
2. Code interpreter context created for isolated execution
3. Coding agent script uploaded to sandbox
4. SDK initialized in interpreter context
5. Task received and executed via:
```typescript
const result = await sandbox.codeInterpreter.runCode(
  `coding_agent.run_query_sync(os.environ.get('PROMPT', ''))`,
  {
    context: ctx,
    envs: { PROMPT: task },
    onStdout,
    onStderr,
  }
);
```

## Example Usage

```
$ npm run start
Creating Developer Agent sandbox...
Installing Developer Agent SDK...
Initializing Developer Agent...
Initializing Project Manager Agent...

=== Two-Agent System Ready ===
Project Manager Agent: Manages tasks and delegates to Developer (Green text)
Developer Agent: Executes code in Daytona sandbox (White text)
Press Ctrl+C at any time to exit.

User: make a lunar lander web app

[Project Manager] Processing your request...

[Project Manager]: I'll help you create a lunar lander web app! Let me delegate this task to the Developer Agent.

<developer_task>
Create a lunar lander web game with the following features:
- HTML/CSS/JavaScript based
- Canvas graphics for the game
- Physics simulation (gravity, thrust, velocity)
- Keyboard controls (arrow keys)
- Landing detection (safe landing vs crash)
- Fuel management system
- Start the game on port 80 and provide the preview URL
</developer_task>

[Delegating to Developer Agent]...

I'll help you create a lunar lander web app! Let me build a complete game with physics simulation, graphics, and controls.
🔨 Write
🔨 Write
🔨 Bash
Perfect! The web server is now running.

Your Lunar Lander game is live at:
🌐 https://80-17ac1c0f-d684-4122-93b5-8f52fd5393f8.proxy.daytona.works

[Project Manager]: Excellent! The Developer Agent has successfully created your lunar lander web app. The game is now running and accessible at the preview URL above. The implementation includes:

✓ Physics simulation with gravity and thrust
✓ Canvas-based graphics
✓ Keyboard controls for gameplay
✓ Landing detection system
✓ Fuel management
✓ Web server running on port 80

TASK_COMPLETE

[Project Manager] All tasks completed!
```

## Customization

Modify system prompt in `src/index.ts` to customize Project Manager Agent behavior. Current implementation uses `<developer_task>` tags for delegation, automatically reviews outputs, and outputs `TASK_COMPLETE` when finished.

## Key Advantages

- Secure, isolated execution in Daytona sandboxes
- Hierarchical agent architecture for robust automation
- Extensible and reusable architecture
- Automatic dev server detection and live preview links
- Multi-language and full-stack support
- Simple setup and automatic cleanup

### build_a_coding_agent_using_claude_agent_sdk
Build autonomous coding agent with Claude Agent SDK in Daytona sandbox; agent executes user prompts via CLI to develop full-stack apps, manage servers, generate preview links; Node.js main program communicates with Python sandbox agent using code interpreter context.

## Overview

Build an autonomous coding agent using Claude Agent SDK inside a Daytona sandbox. The agent can develop full-stack web apps, write code in any language, install dependencies, run scripts, start dev servers, and generate preview links.

## Workflow

The main Node.js program creates a Daytona sandbox and initializes a Python agent inside it. Users interact via CLI, sending prompts that the agent executes and returns results.

Example session:
```
$ npm run start
Creating sandbox...
Installing Agent SDK...
Initializing Agent SDK...
Press Ctrl+C at any time to exit.
User: Build a Zelda-like game where I can move around the screen and talk to famous programmers
Thinking...
I'll build a Zelda-like game for you!
🔨 Write
🔨 Bash
Perfect! I've created a Zelda-like game called "Programmer's Quest" for you! 🎮

## Game Features:
- Top-down 2D view with classic retro aesthetics
- Grid-based movement system
- 5 famous programmers as NPCs (Linus Torvalds, Grace Hopper, Alan Turing, Ada Lovelace, Dennis Ritchie)
- Arrow Keys or WASD to move, SPACE to talk to NPCs

🎯 [Click here to play the game!](https://80-8e2c4d23-212a-4f1e-bb6c-abfa71aeed3a.proxy.daytona.works)
```

The agent automatically hosts web apps and generates preview links using Daytona Preview Links feature.

## Setup

Clone the repository:
```bash
git clone https://github.com/daytonaio/daytona.git
cd daytona/guides/typescript/anthropic/single-claude-agent-sdk
```

Get API keys from Daytona Dashboard and Anthropic Console. Copy `.env.example` to `.env`:
```bash
DAYTONA_API_KEY=your_daytona_key
SANDBOX_ANTHROPIC_API_KEY=your_anthropic_key
```

Note: `SANDBOX_ANTHROPIC_API_KEY` is passed into the sandbox and accessible to code executed inside it.

Requires Node.js 18+. Install and run:
```bash
npm install
npm run start
```

## Architecture

Two main components:

**Main Program** (`index.ts`): Node.js script on local machine using Daytona SDK to create/manage sandbox and provide CLI interface.

**Sandbox Agent** (`coding_agent.py`): Python script inside sandbox using Claude Agent SDK to create customized coding agent.

### Initialization

Main program:
1. Creates Daytona sandbox with Anthropic API key in environment variables
2. Installs Claude Agent SDK via `pip install`
3. Creates code interpreter context
4. Uploads coding agent script to sandbox
5. Initializes Claude Agent SDK by running `import coding_agent`
6. Waits for user input

### User Interaction

Each user request is passed to agent by running Python command in code interpreter context:
```typescript
const result = await sandbox.codeInterpreter.runCode(
  `coding_agent.run_query_sync(os.environ.get('PROMPT', ''))`,
  {
    context: ctx,
    envs: { PROMPT: prompt },
    onStdout,
    onStderr,
  }
)
```

`onStdout` and `onStderr` callbacks pass agent output back to main program.

### Sandbox Agent Configuration

Agent initialized with system prompt including workspace directory and preview URL format:
```python
system_prompt = """
You are running in a Daytona sandbox.
Use the /home/daytona directory instead of /workspace for file operations.
Your public preview URL for port 80 is: {}.
""".format(preview_url)

client = ClaudeSDKClient(
  options=ClaudeAgentOptions(
    allowed_tools=["Read", "Edit", "Glob", "Grep", "Bash"],
    permission_mode="acceptEdits",
    system_prompt=system_prompt
  )
)
```

Follows Anthropic's Claude Agent Python SDK documentation for running queries and receiving responses.

### Cleanup

Daytona sandbox and all files automatically deleted when main program exits.

## Example: Pet Store Landing Page

```
User: Create a fun pet store landing page in Svelte
I'll create a fun pet store landing page in Svelte for you!
🔨 Bash
🔨 Write (multiple times for components)
🔨 Bash (start dev server)

Perfect! I've created a fun and colorful pet store landing page in Svelte!

## Features:
- Hero section with gradient background and animated floating cards
- Features section with 4 key benefits and interactive cards
- Products section with 6 featured products and star ratings
- Newsletter section with email subscription
- Footer with navigation and social media icons
- Smooth scroll, responsive design, animations, interactive hover effects

Your pet store is now running at: https://80-b3739199-d90e-4bde-ab18-450d74c950e8.proxy.daytona.works
```

## Key Advantages

- Secure, isolated execution in Daytona sandboxes
- Direct terminal communication with agent
- Automatic dev server detection and live preview links
- Multi-language and full-stack support
- Simple setup and automatic cleanup

### run_claude_code_in_sandbox_via_cli
Install Daytona CLI, authenticate with API key, create sandbox, SSH in, run `claude` command and complete browser-based authentication to execute Claude Code in isolated sandbox environment.

## Prerequisites
- Daytona account and API key from Daytona Dashboard
- Local terminal (macOS, Linux, or Windows)

## Install CLI

Mac/Linux:
```bash
brew install daytonaio/cli/daytona
```

Windows:
```powershell
powershell -Command "irm https://get.daytona.io/windows | iex"
```

Verify version is 0.135.0 or higher with `daytona --version`.

## Authenticate

```bash
daytona login --api-key=YOUR_API_KEY
```

## Create Sandbox

```bash
daytona sandbox create --name claude-sandbox
```

Optional flags:
- `--snapshot daytona-large` or `--snapshot daytona-medium` for more resources

## Connect to Sandbox

```bash
daytona ssh claude-sandbox
```

## Run Claude Code

Inside the SSH session:
```bash
claude
```

On first run, Claude Code prompts for authentication:
1. Copy the authentication URL from terminal
2. Open URL in local browser
3. Complete authentication flow
4. Copy the code from browser
5. Paste code back into terminal

Once authenticated, Claude Code runs inside the sandbox controlled from your terminal.

### running_claude_code_in_sandboxes
Run Claude Code in isolated sandboxes with PTY-based real-time output streaming; AsyncDaytona recommended for automatic callbacks.

## Running Claude Code in a Daytona Sandbox

Execute Claude Code tasks inside isolated Daytona sandboxes with real-time log streaming.

### Python (AsyncDaytona recommended)

```python
import os
import asyncio
from daytona import AsyncDaytona

async def run_claude_code():
    async with AsyncDaytona() as daytona:
        sandbox = await daytona.create()
        
        # Install Claude Code
        await sandbox.process.exec("npm install -g @anthropic-ai/claude-code")
        
        # Create PTY session with streaming output
        pty_handle = await sandbox.process.create_pty_session(
            id="claude", on_data=lambda data: print(data.decode(), end="")
        )
        await pty_handle.wait_for_connection()
        
        # Run Claude Code command with API key
        claude_command = "claude --dangerously-skip-permissions -p 'write a dad joke about penguins' --output-format stream-json --verbose"
        await pty_handle.send_input(
            f"ANTHROPIC_API_KEY={os.environ['ANTHROPIC_API_KEY']} {claude_command}\n"
        )
        
        await pty_handle.wait()
        # await sandbox.delete()  # Clean up when done

asyncio.run(run_claude_code())
```

**Note:** AsyncDaytona is recommended for streaming PTY output via automatic `on_data` callbacks. Sync mode requires blocking iteration or manual threading.

### TypeScript

```typescript
import { Daytona } from "@daytonaio/sdk";

const daytona = new Daytona();
const sandbox = await daytona.create();

await sandbox.process.executeCommand("npm install -g @anthropic-ai/claude-code");

const ptyHandle = await sandbox.process.createPty({
    id: "claude",
    onData: (data) => process.stdout.write(data),
});

await ptyHandle.waitForConnection();

const claudeCommand = "claude --dangerously-skip-permissions -p 'write a dad joke about penguins' --output-format stream-json --verbose";
ptyHandle.sendInput(
    `ANTHROPIC_API_KEY=${process.env.ANTHROPIC_API_KEY} ${claudeCommand}\n`
);

await ptyHandle.wait();
// await sandbox.delete();
```

### Key Concepts

- **PTY Sessions:** Create pseudo-terminal sessions for interactive command execution with real-time output streaming
- **on_data Callback:** Automatically receives and processes output as it streams
- **API Key Injection:** Pass ANTHROPIC_API_KEY via environment variable in command
- **Cleanup:** Call `sandbox.delete()` to free resources after completion


