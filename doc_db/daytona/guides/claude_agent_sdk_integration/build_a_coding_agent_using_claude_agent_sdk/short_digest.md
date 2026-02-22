## Overview

Build autonomous coding agent using Claude Agent SDK in Daytona sandbox. Agent develops full-stack apps, writes code, installs dependencies, runs scripts, starts dev servers, generates preview links.

## Setup

```bash
git clone https://github.com/daytonaio/daytona.git
cd daytona/guides/typescript/anthropic/single-claude-agent-sdk
# Add DAYTONA_API_KEY and SANDBOX_ANTHROPIC_API_KEY to .env
npm install
npm run start
```

Requires Node.js 18+.

## Architecture

**Main Program** (`index.ts`): Node.js CLI that creates Daytona sandbox and manages agent interaction.

**Sandbox Agent** (`coding_agent.py`): Python script using Claude Agent SDK with tools `["Read", "Edit", "Glob", "Grep", "Bash"]` and `permission_mode="acceptEdits"`.

Initialization:
1. Create sandbox with Anthropic API key
2. Install Claude Agent SDK
3. Create code interpreter context
4. Upload and import coding agent script
5. Send user prompts via: `sandbox.codeInterpreter.runCode('coding_agent.run_query_sync(os.environ.get("PROMPT", ""))', {context: ctx, envs: {PROMPT: prompt}, onStdout, onStderr})`

Agent system prompt includes workspace directory (`/home/daytona`) and preview URL format for port 80.

## Examples

**Zelda-like game**: Agent creates top-down 2D game with player movement, 5 famous programmer NPCs, collision detection, dialog system, and hosts it with preview link.

**Pet store landing page**: Agent creates Svelte landing page with hero section, features, products, newsletter signup, footer, animations, responsive design, and hosts it.

Sandbox auto-deletes on exit.