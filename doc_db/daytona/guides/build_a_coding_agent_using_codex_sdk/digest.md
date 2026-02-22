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