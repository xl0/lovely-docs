## Installation

Install with `npm i -D @sveltejs/adapter-node` and add to `svelte.config.js`:

```js
import adapter from '@sveltejs/adapter-node';

const config = {
	kit: {
		adapter: adapter()
	}
};

export default config;
```

## Building and Deploying

Build with `npm run build` (outputs to `build` by default). To run:

```sh
node build
```

You need: the output directory, `package.json`, and production dependencies. Generate production dependencies with `npm ci --omit dev`.

Development dependencies are bundled via Rollup. Control bundling by placing packages in `devDependencies` (bundled) or `dependencies` (external).

## Compression

For response compression, use `@polka/compression` instead of the popular `compression` package, as SvelteKit streams responses and `compression` doesn't support streaming.

## Environment Variables

### Loading .env files

In `dev` and `preview`, SvelteKit reads from `.env` (or `.env.local`, `.env.[mode]`). In production, install and invoke `dotenv`:

```sh
npm install dotenv
node -r dotenv/config build
```

Or with Node.js v20.6+:

```sh
node --env-file=.env build
```

### PORT, HOST, SOCKET_PATH

Default: `0.0.0.0:3000`. Customize with environment variables:

```sh
HOST=127.0.0.1 PORT=4000 node build
SOCKET_PATH=/tmp/socket node build
```

### ORIGIN, PROTOCOL_HEADER, HOST_HEADER, PORT_HEADER

Set `ORIGIN` to tell SvelteKit the deployment URL:

```sh
ORIGIN=https://my.site node build
```

Or use headers from a reverse proxy:

```sh
PROTOCOL_HEADER=x-forwarded-proto HOST_HEADER=x-forwarded-host node build
PROTOCOL_HEADER=x-forwarded-proto HOST_HEADER=x-forwarded-host PORT_HEADER=x-forwarded-port node build
```

Only set these if behind a trusted reverse proxy to prevent header spoofing.

### ADDRESS_HEADER, XFF_DEPTH

For `event.getClientAddress()` behind proxies, specify the header containing the client IP:

```sh
ADDRESS_HEADER=True-Client-IP node build
```

For `X-Forwarded-For` (comma-separated IPs), use `XFF_DEPTH` to specify trusted proxy count. Reads from the right to prevent spoofing:

```sh
ADDRESS_HEADER=X-Forwarded-For XFF_DEPTH=3 node build
```

### BODY_SIZE_LIMIT

Maximum request body size in bytes (default: 512kb). Supports unit suffixes: `K`, `M`, `G`:

```sh
BODY_SIZE_LIMIT=1M node build
```

Set to `Infinity` to disable and implement custom checks in `handle` hook.

### SHUTDOWN_TIMEOUT

Seconds to wait before forcefully closing connections after `SIGTERM`/`SIGINT` (default: 30).

### IDLE_TIMEOUT

With systemd socket activation, seconds before auto-sleep when idle. See Socket activation section.

## Adapter Options

```js
adapter({
	out: 'build',           // output directory
	precompress: true,      // gzip/brotli precompression for assets
	envPrefix: ''           // prefix for env vars (e.g., 'MY_CUSTOM_')
})
```

With `envPrefix: 'MY_CUSTOM_'`, use `MY_CUSTOM_HOST`, `MY_CUSTOM_PORT`, `MY_CUSTOM_ORIGIN`, etc.

## Graceful Shutdown

On `SIGTERM`/`SIGINT`, the adapter:
1. Rejects new requests
2. Waits for in-flight requests to finish
3. Closes remaining connections after `SHUTDOWN_TIMEOUT` seconds

Listen to `sveltekit:shutdown` event for cleanup:

```js
process.on('sveltekit:shutdown', async (reason) => {
  await jobs.stop();
  await db.close();
});
```

`reason` is one of: `SIGINT`, `SIGTERM`, `IDLE`.

## Socket Activation

Configure systemd socket activation for on-demand app scaling. The adapter listens on file descriptor 3.

1. Create systemd service with `IDLE_TIMEOUT`:

```ini
[Service]
Environment=NODE_ENV=production IDLE_TIMEOUT=60
ExecStart=/usr/bin/node /usr/bin/myapp/build
```

2. Create socket unit:

```ini
[Socket]
ListenStream=3000

[Install]
WantedBy=sockets.target
```

3. Enable: `sudo systemctl daemon-reload && sudo systemctl enable --now myapp.socket`

App auto-starts on first request.

## Custom Server

The build outputs `index.js` (standalone server) and `handler.js` (middleware). Import `handler.js` for Express, Connect, Polka, or Node's `http.createServer`:

```js
import { handler } from './build/handler.js';
import express from 'express';

const app = express();

app.get('/healthcheck', (req, res) => {
	res.end('ok');
});

app.use(handler);

app.listen(3000, () => {
	console.log('listening on port 3000');
});
```

SvelteKit handles prerendered pages and static assets.