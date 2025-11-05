## Server-only modules

Prevent sensitive data leaks to the browser by marking modules as server-only using `.server` filename suffix or `$lib/server/` directory.

SvelteKit blocks any import chain from public-facing code to server-only modules, even indirect imports:

```js
// $lib/server/secrets.js - server-only
export const apiKey = 'secret';

// src/routes/utils.js
export { apiKey } from '$lib/server/secrets.js';

// src/routes/+page.svelte - ERROR: import chain includes server-only code
import { apiKey } from './utils.js';
```

Works with dynamic imports. Disabled during tests when `process.env.TEST === 'true'`.