## Setup

Clone the Mastra coding agent template and configure with OpenAI API key and Daytona API key:
```env
OPENAI_API_KEY=your_openai_key
MODEL=openai/gpt-4o-mini
DAYTONA_API_KEY=your-daytona-api-key-here
```

Install and run:
```bash
pnpm install
pnpm run dev
```

Access Mastra Studio at `http://localhost:4111`.

## Agent Tools

The agent uses three main tools to interact with Daytona sandboxes:

**createSandbox**: Provisions a new sandbox with specified language
```json
{"name": "project_name", "language": "python"}
```

**writeFiles**: Create multiple files in a sandbox
```json
{
  "sandboxId": "...",
  "files": [
    {"path": "file.py", "data": "..."},
    {"path": "test.py", "data": "..."}
  ]
}
```

**runCommand**: Execute commands with output capture
```json
{
  "sandboxId": "...",
  "command": "python3 test.py",
  "timeoutSeconds": 20,
  "captureOutput": true
}
```

All tool calls and results are logged with full execution details, token usage, and caching metrics for debugging.