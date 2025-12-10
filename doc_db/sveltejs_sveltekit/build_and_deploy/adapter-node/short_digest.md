## Setup

```js
import adapter from '@sveltejs/adapter-node';
export default { kit: { adapter: adapter() } };
```

Build with `npm run build`, run with `node build`.

## Key Environment Variables

- `PORT`, `HOST`: Server address (default `0.0.0.0:3000`)
- `SOCKET_PATH`: Unix socket instead of port
- `ORIGIN`: Deployment URL (required for correct URL resolution)
- `PROTOCOL_HEADER`, `HOST_HEADER`, `PORT_HEADER`: Headers from reverse proxy (e.g., `x-forwarded-proto`)
- `ADDRESS_HEADER`, `XFF_DEPTH`: Client IP from proxy headers
- `BODY_SIZE_LIMIT`: Max request size (default 512kb)
- `SHUTDOWN_TIMEOUT`: Graceful shutdown wait time (default 30s)
- `IDLE_TIMEOUT`: Auto-sleep with systemd socket activation

## Adapter Options

```js
adapter({ out: 'build', precompress: true, envPrefix: '' })
```

## Graceful Shutdown & Custom Server

Listen to `sveltekit:shutdown` event for cleanup. Import `handler.js` to use with Express/Polka/http.createServer for custom server setup.

## Production .env Loading

```sh
npm install dotenv
node -r dotenv/config build
# or Node v20.6+:
node --env-file=.env build
```