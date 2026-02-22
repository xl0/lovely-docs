## Two-Agent System

**Project Manager Agent** (local, `claude-sonnet-4-20250514`) plans and delegates tasks via `<developer_task>` tags. **Developer Agent** (Daytona sandbox, Claude Agent SDK) executes code and streams results back.

## Setup

```bash
git clone https://github.com/daytonaio/daytona.git
cd daytona/guides/typescript/anthropic/multi-agent-claude-sdk
npm install
npm run start
```

Environment variables: `DAYTONA_API_KEY`, `ANTHROPIC_API_KEY`, optional `SANDBOX_ANTHROPIC_API_KEY`. Requires Node.js 18+.

## Workflow

1. Sandbox created, agents initialized
2. User prompt → Project Manager plans and delegates via `<developer_task>` tags
3. Developer Agent executes in sandbox, streams output
4. Project Manager reviews and coordinates further tasks
5. Outputs `TASK_COMPLETE` to end session
6. Sandbox auto-deleted on exit

## Developer Agent Execution

SDK installed via pip, code interpreter context created, script uploaded, then executed via:
```typescript
await sandbox.codeInterpreter.runCode(
  `coding_agent.run_query_sync(os.environ.get('PROMPT', ''))`,
  { context: ctx, envs: { PROMPT: task }, onStdout, onStderr }
);
```

## Example

User requests "make a lunar lander web app" → Project Manager delegates → Developer Agent creates game with physics, canvas graphics, keyboard controls, landing detection, fuel management → serves on port 80 with preview link → Project Manager presents results and outputs `TASK_COMPLETE`.