## Installation

```bash
npm install @daytonaio/sdk
# or
yarn add @daytonaio/sdk
```

## Create and Execute in Sandbox

```typescript
import { Daytona } from '@daytonaio/sdk'

const daytona = new Daytona()
const sandbox = await daytona.create({
  language: 'typescript',
  envVars: { NODE_ENV: 'development' },
})
const response = await sandbox.process.executeCommand('echo "Hello, World!"')
console.log(response.result)
```

## Configuration

Configure via environment variables (`DAYTONA_API_KEY`, `DAYTONA_API_URL`, `DAYTONA_TARGET`) or constructor:

```typescript
const daytona = new Daytona({
  apiKey: 'YOUR_API_KEY',
  apiUrl: 'https://app.daytona.io/api',
  target: 'us'
})
```

## Runtime Support

Works across Node.js, browsers, and serverless platforms (Cloudflare Workers, AWS Lambda, Azure Functions).

### Vite Configuration

Add to `vite.config.ts`:

```typescript
import { nodePolyfills } from 'vite-plugin-node-polyfills'

export default defineConfig({
  plugins: [
    nodePolyfills({
      globals: { global: true, process: true, Buffer: true },
      overrides: { path: 'path-browserify-win32' },
    }),
  ],
})
```

### Next.js Configuration

Add to `next.config.ts`:

```typescript
import type { NextConfig } from 'next'
import NodePolyfillPlugin from 'node-polyfill-webpack-plugin'
import { env, nodeless } from 'unenv'

const { alias: turbopackAlias } = env(nodeless, {})

const nextConfig: NextConfig = {
  experimental: {
    turbo: { resolveAlias: turbopackAlias },
  },
  webpack: (config, { isServer }) => {
    if (!isServer) config.plugins.push(new NodePolyfillPlugin())
    return config
  },
}

export default nextConfig
```