## Overview

Run OpenCode coding agent in Daytona sandbox with web interface. Supports 75+ LLM providers, automatic preview links for web apps.

## Setup

```bash
git clone https://github.com/daytonaio/daytona.git
cd daytona/guides/typescript/opencode
# Create .env with DAYTONA_API_KEY
npm install && npm run start
```

Requires Node.js 18+.

## Implementation

Execute OpenCode as async command and replace localhost URLs with preview links:

```typescript
const command = await sandbox.process.executeSessionCommand(sessionId, {
  command: `opencode web --port 3000`,
  runAsync: true,
})

const opencodePreviewLink = await sandbox.getPreviewLink(3000)
const replaceUrl = (text: string) =>
  text.replace(/http:\/\/127\.0\.0\.1:3000/g, opencodePreviewLink.url)
```

Persist API keys via environment variables:
```typescript
sandbox = await daytona.create({
  envVars: { ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY || '' },
})
```

Custom agent configuration with Daytona-aware system prompt:
```json
{
  "default_agent": "daytona",
  "agent": {
    "daytona": {
      "prompt": "Use /home/daytona directory. Services accessible as <PREVIEW_URL_PATTERN>. Start servers in background with &."
    }
  }
}
```

Automatic cleanup on Ctrl+C deletes sandbox.