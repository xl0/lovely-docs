## Server-only Modules
Prevent sensitive data leakage to browser code.

**Private environment variables:** `$env/static/private` and `$env/dynamic/private` only importable in server code (`hooks.server.js`, `+page.server.js`)

**Create server-only modules:**
- Filename: `secrets.server.js`
- Directory: `$lib/server/secrets.js`

**How it works:** SvelteKit prevents importing server-only code into browser code, even indirectly through re-exports. Entire import chain is validated.

```js
// $lib/server/secrets.js
export const secret = 'hidden';

// src/routes/utils.js
export { secret } from '$lib/server/secrets.js';  // Re-export
export const add = (a, b) => a + b;

// src/routes/+page.svelte
import { add } from './utils.js';  // ERROR: import chain includes server-only code
```

Works with dynamic imports including interpolated: ``await import(`./${foo}.js`)``

**Testing:** Illegal import detection disabled when `process.env.TEST === 'true'`