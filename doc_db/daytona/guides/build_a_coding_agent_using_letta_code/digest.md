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