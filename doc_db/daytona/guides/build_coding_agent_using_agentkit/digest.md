## Build Coding Agent Using AgentKit

Autonomous coding agent that performs software development tasks in Daytona sandbox environments using AgentKit framework. The agent can create web apps, run tests, execute scripts, and automate multi-step workflows based on natural language prompts.

### Workflow Overview

User provides natural language prompt describing a software task. Agent reasons about the request, plans steps, and executes them securely in Daytona sandbox, handling everything from project setup to live previews.

### Project Setup

Clone repository:
```bash
git clone https://github.com/daytonaio/inngest-agentkit-coding-agent.git
cd inngest-agentkit-coding-agent
```

Get API keys from Daytona Dashboard and Anthropic Console. Copy `.env.example` to `.env`:
```bash
DAYTONA_API_KEY=your_daytona_key
ANTHROPIC_API_KEY=your_anthropic_key
```

**Local Usage (Node.js 18+ required):**
```bash
npm install
npm run start
```

**Docker:**
```bash
docker buildx build . -t coding-agent
docker run --rm -it coding-agent
```

### Configuration

- **Prompt Setting:** Edit main prompt in `network.run(...)` in `src/index.ts` to change agent's task
- **Debug Logs:** Set `enableDebugLogs=true` for detailed agent flow tracking

### Example Usage

Default prompt creates a React Notes app:
```typescript
const result = await network.run(
  `Create a minimal React app called "Notes" that lets users add, view, and delete notes. Each note should have a title and content. Use Create React App or Vite for setup. Include a simple UI with a form to add notes and a list to display them.`
)
```

Terminal output:
```
✔️ App is ready!
Preview: https://5173-3a828150-1573-42e3-bf9f-9793a2c2c0c2.proxy.daytona.works
```

### Agent Execution Flow

Agent uses LLM with access to specialized tools for Daytona sandbox operations:

1. **Project Initialization:** `shellTool` runs `npm create vite@latest notes -- --template react`
2. **Install Dependencies:** `shellTool` runs `cd notes && npm install`
3. **Create Components:** `uploadFilesTool` uploads App.jsx and App.css
4. **Start Dev Server:** `startDevServerTool` runs `cd notes && npm run dev`
5. **Health Check:** `checkDevServerHealthTool` verifies dev server is running
6. **Summary:** Agent outputs `DEV_SERVER_PORT=5173` and `TASK_COMPLETED` signal

The `DEV_SERVER_PORT` is auto-detected and used to generate preview link. `TASK_COMPLETED` signals task completion for agent routing logic.

### Key Advantages

- Secure, isolated execution in Daytona sandboxes
- Multi-language support
- Auto-detects dev server, starts it, generates preview link
- Detailed debug logs for agent actions