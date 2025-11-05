## Server-only modules

Prevent accidental exposure of sensitive data (API keys, private environment variables) to the browser by marking modules as server-only.

### Private environment variables

Import `$env/static/private` and `$env/dynamic/private` only in server-side files like `hooks.server.js` or `+page.server.js`.

### Server utilities

The `$app/server` module (containing `read()` for filesystem access) can only be imported by server-side code.

### Creating server-only modules

Two approaches:
1. Add `.server` to filename: `secrets.server.js`
2. Place in `$lib/server/`: `$lib/server/secrets.js`

### How it works

SvelteKit prevents any import chain from public-facing code to server-only modules, even if the public code doesn't directly use the sensitive exports:

```js
// $lib/server/secrets.js
export const apiKey = 'secret';

// src/routes/utils.js
export { apiKey } from '$lib/server/secrets.js';
export const add = (a, b) => a + b;

// src/routes/+page.svelte
import { add } from './utils.js'; // ERROR: import chain includes server-only code
```

Works with dynamic imports including interpolated ones like `` await import(`./${foo}.js`) ``.

### Testing note

Unit testing frameworks like Vitest don't distinguish between server and public code, so illegal import detection is disabled when `process.env.TEST === 'true'`.