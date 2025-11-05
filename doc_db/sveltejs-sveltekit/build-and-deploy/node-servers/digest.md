## Installation and Setup

Install `@sveltejs/adapter-node` and add to `svelte.config.js`:

```js
import adapter from '@sveltejs/adapter-node';

const config = {
	kit: {
		adapter: adapter()
	}
};

export default config;
```

## Building and Running

Build with `npm run build` (outputs to `build` directory by default). Deploy the `build` directory, `package.json`, and production dependencies. Start with `node build`.

Development dependencies are bundled via Rollup. Control bundling by placing packages in `devDependencies` (bundled) or `dependencies` (external).

## Compression

Use `@polka/compression` for streaming support instead of the popular `compression` package which doesn't support streaming.

## Environment Variables

### Loading .env files
In production, `.env` files aren't auto-loaded. Install dotenv and run:
```sh
node -r dotenv/config build
```

Or with Node.js v20.6+:
```sh
node --env-file=.env build
```

### Server Configuration
- `PORT` (default 3000) and `HOST` (default 0.0.0.0): `HOST=127.0.0.1 PORT=4000 node build`
- `SOCKET_PATH`: `SOCKET_PATH=/tmp/socket node build` (overrides HOST/PORT)
- `ORIGIN`: `ORIGIN=https://my.site node build` - tells SvelteKit the deployment URL
- `PROTOCOL_HEADER` and `HOST_HEADER`: For reverse proxies, e.g., `PROTOCOL_HEADER=x-forwarded-proto HOST_HEADER=x-forwarded-host node build`
- `ADDRESS_HEADER`: Read client IP from header (e.g., `ADDRESS_HEADER=True-Client-IP`) when behind proxies
- `XFF_DEPTH`: For `X-Forwarded-For` headers, specify number of trusted proxies to read from the right
- `BODY_SIZE_LIMIT`: Max request body size (default 512kb), supports K/M/G suffixes or `Infinity`
- `SHUTDOWN_TIMEOUT`: Seconds to wait before forcefully closing connections (default 30)
- `IDLE_TIMEOUT`: Seconds before auto-sleep with systemd socket activation

### Custom Prefix
Change environment variable prefix:
```js
adapter({ envPrefix: 'MY_CUSTOM_' })
```

Then use: `MY_CUSTOM_HOST=127.0.0.1 MY_CUSTOM_PORT=4000 node build`

## Adapter Options

```js
adapter({
	out: 'build',           // output directory
	precompress: true,      // gzip/brotli compression
	envPrefix: ''           // environment variable prefix
})
```

## Graceful Shutdown

On `SIGTERM`/`SIGINT`, the server:
1. Rejects new requests
2. Waits for in-flight requests to complete
3. Closes remaining connections after `SHUTDOWN_TIMEOUT`

Listen to `sveltekit:shutdown` event for cleanup:
```js
process.on('sveltekit:shutdown', async (reason) => {
	await db.close();
});
```

Reason is `SIGINT`, `SIGTERM`, or `IDLE`.

## Socket Activation (systemd)

Configure systemd socket activation for on-demand app scaling. Create service and socket units, then systemd passes `LISTEN_PID` and `LISTEN_FDS` environment variables.

## Custom Server

Import `handler.js` from build directory to use with Express, Connect, Polka, or Node's `http.createServer`:

```js
import { handler } from './build/handler.js';
import express from 'express';

const app = express();
app.get('/healthcheck', (req, res) => res.end('ok'));
app.use(handler);
app.listen(3000);
```