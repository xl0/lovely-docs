## Overview

Run Letta Code autonomous agent in Daytona sandbox. Agent develops web apps, writes code, installs dependencies, runs scripts with persistent memory.

## Setup

```bash
git clone https://github.com/daytonaio/daytona.git
cd daytona/guides/typescript/letta-code
npm install
npm run start
```

Create `.env` with Daytona and Letta API keys. Requires Node.js 18+.

## Architecture

- **index.ts**: Creates sandbox, installs Letta Code, manages interactive CLI
- **letta-session.ts**: Manages PTY bidirectional communication with JSON streaming

## Implementation

Create sandbox with Letta API key:
```typescript
sandbox = await daytona.create({
  envVars: { LETTA_API_KEY: process.env.SANDBOX_LETTA_API_KEY },
})
```

Create PTY for communication:
```typescript
this.ptyHandle = await this.sandbox.process.createPty({
  id: `letta-pty-${Date.now()}`,
  onData: (data: Uint8Array) => this.handleData(data),
})
```

Launch Letta Code with stream-json format and custom system prompt:
```typescript
await this.ptyHandle.sendInput(
  `letta --new --system-custom "${systemPrompt}" --input-format stream-json --output-format stream-json --yolo -p\n`,
)
```

Send user messages as JSON, parse streaming JSON responses with tool calls. `handleParsedMessage()` combines fragments and formats results.