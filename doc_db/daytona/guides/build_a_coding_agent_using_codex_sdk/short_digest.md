## Overview

Build autonomous coding agent using OpenAI Codex in Daytona sandbox. Agent develops full-stack apps, installs dependencies, runs scripts, starts servers, and generates preview links.

## Setup

```bash
git clone https://github.com/daytonaio/daytona.git
cd daytona/guides/typescript/openai/codex-sdk
# Copy .env.example to .env with DAYTONA_API_KEY and SANDBOX_OPENAI_API_KEY
npm install
npm run start
```

Requires Node.js 18+.

## Architecture

**Main Program** (`src/index.ts`): Creates sandbox, configures Codex via `.codex/config.toml`, uploads agent, runs CLI loop.

**Sandbox Agent** (`agent/index.ts`): Uses Codex SDK with custom options and thread persistence.

Main program system prompt:
```typescript
const config = `developer_instructions = "You are running in a Daytona sandbox. Use /home/daytona directory. Services accessible as: ${previewUrlPattern}"`
await sandbox.fs.createFolder('.codex', '755')
await sandbox.fs.uploadFile(Buffer.from(config, 'utf8'), '.codex/config.toml')
```

Agent execution loop:
```typescript
const sessionId = `codex-session-${Date.now()}`
await sandbox.process.createSession(sessionId)
const command = await sandbox.process.executeSessionCommand(sessionId, {
  command: `${environmentPrefix({ PROMPT: prompt })} npm exec --prefix /tmp/agent tsx -- /tmp/agent/index.ts`,
  runAsync: true,
})
await sandbox.process.getSessionCommandLogs(sessionId, command.cmdId, onStdout, onStderr)
await sandbox.process.deleteSession(sessionId)
```

Agent initialization:
```typescript
const options: ThreadOptions = {
  workingDirectory: '/home/daytona',
  skipGitRepoCheck: true,
  sandboxMode: 'danger-full-access',
}
const threadId = (await readFileIfExisting('/tmp/codex-thread-id'))?.trim()
const thread = threadId ? codex.resumeThread(threadId, options) : codex.startThread(options)
```