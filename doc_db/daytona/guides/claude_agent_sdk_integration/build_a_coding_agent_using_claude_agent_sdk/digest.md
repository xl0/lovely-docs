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