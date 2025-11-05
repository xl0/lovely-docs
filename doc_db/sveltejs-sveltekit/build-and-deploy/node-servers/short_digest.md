## Setup
Install `@sveltejs/adapter-node` and add to `svelte.config.js`. Build with `npm run build`, deploy `build/`, `package.json`, and `node_modules/`. Start with `node build`.

## Environment Variables
- `PORT` (3000), `HOST` (0.0.0.0), `SOCKET_PATH`
- `ORIGIN=https://my.site` or `PROTOCOL_HEADER=x-forwarded-proto HOST_HEADER=x-forwarded-host`
- `ADDRESS_HEADER` and `XFF_DEPTH` for client IP behind proxies
- `BODY_SIZE_LIMIT` (512kb), `SHUTDOWN_TIMEOUT` (30s), `IDLE_TIMEOUT`
- Custom prefix: `adapter({ envPrefix: 'MY_CUSTOM_' })`

## Loading .env
```sh
node -r dotenv/config build
# or Node v20.6+
node --env-file=.env build
```

## Graceful Shutdown
Listens to `sveltekit:shutdown` event for cleanup:
```js
process.on('sveltekit:shutdown', async (reason) => {
	await db.close();
});
```

## Custom Server
```js
import { handler } from './build/handler.js';
import express from 'express';
const app = express();
app.use(handler);
app.listen(3000);
```