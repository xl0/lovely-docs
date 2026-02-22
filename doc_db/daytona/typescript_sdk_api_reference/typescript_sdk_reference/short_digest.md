## Installation

```bash
npm install @daytonaio/sdk
```

## Quick Start

```typescript
import { Daytona } from '@daytonaio/sdk'

const daytona = new Daytona()
const sandbox = await daytona.create({ language: 'typescript' })
const response = await sandbox.process.executeCommand('echo "Hello, World!"')
```

## Configuration

Environment variables: `DAYTONA_API_KEY`, `DAYTONA_API_URL`, `DAYTONA_TARGET`

Or pass options to constructor: `apiKey`, `apiUrl`, `target`

## Browser/Serverless Support

Works in Node.js, browsers, Cloudflare Workers, AWS Lambda, Azure Functions. Requires node polyfills for Vite and Next.js (examples provided).