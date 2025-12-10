## Purpose
Prevent accidental exposure of sensitive data (API keys, private environment variables) to browser code when developing backend and frontend in the same repository.

## Private Environment Variables
- `$env/static/private` and `$env/dynamic/private` modules can only be imported in server-only code
- Server-only contexts: `hooks.server.js`, `+page.server.js`

## Server-only Utilities
- `$app/server` module (contains `read()` function for filesystem access) is server-only

## Creating Server-only Modules
Two approaches:
1. Add `.server` to filename: `secrets.server.js`
2. Place in `$lib/server/`: `$lib/server/secrets.js`

## How It Works
SvelteKit prevents importing server-only code into public-facing code (browser code), even indirectly through re-exports.

Example - this fails:
```js
// $lib/server/secrets.js
export const atlantisCoordinates = [/* redacted */];

// src/routes/utils.js
export { atlantisCoordinates } from '$lib/server/secrets.js';
export const add = (a, b) => a + b;

// src/routes/+page.svelte
<script>
  import { add } from './utils.js';  // ERROR: import chain includes server-only code
</script>
```

Error message:
```
Cannot import $lib/server/secrets.ts into code that runs in the browser, as this could leak sensitive information.
```

The error occurs even though `+page.svelte` only uses `add`, not `atlantisCoordinates`. The entire import chain is checked because server code could end up in browser JavaScript.

## Dynamic Imports
Works with dynamic imports including interpolated ones: ``await import(`./${foo}.js`)``

## Testing
Unit testing frameworks (Vitest) don't distinguish between server-only and public code. Illegal import detection is disabled when `process.env.TEST === 'true'`.