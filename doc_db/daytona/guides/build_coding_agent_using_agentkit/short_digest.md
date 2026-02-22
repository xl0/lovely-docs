## Build Coding Agent Using AgentKit

Autonomous agent that executes software development tasks in Daytona sandboxes using AgentKit framework.

### Setup

Clone repo, configure `.env` with Daytona and Anthropic API keys, then:
```bash
npm install && npm run start
# or: docker buildx build . -t coding-agent && docker run --rm -it coding-agent
```

### Usage

Edit prompt in `src/index.ts` `network.run(...)` call. Example creates React Notes app with add/view/delete functionality using Vite. Agent auto-detects dev server port, generates preview link, outputs `DEV_SERVER_PORT` and `TASK_COMPLETED` signals.

### Execution

Agent uses LLM with tools: `shellTool` (run commands), `uploadFilesTool` (create files), `startDevServerTool`, `checkDevServerHealthTool`. Handles project initialization, dependency installation, component creation, server startup, and health verification.

### Configuration

Set `enableDebugLogs=true` for detailed flow tracking.