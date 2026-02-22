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