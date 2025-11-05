Public environment variables that are safely exposed to client-side code. Only includes variables beginning with the configured public prefix (defaults to `PUBLIC_`). Values are replaced statically at build time.

Import public environment variables:
```ts
import { PUBLIC_BASE_URL } from '$env/static/public';
```

Unlike `$env/static/private`, these variables can be safely used in browser code since they're intended to be public.