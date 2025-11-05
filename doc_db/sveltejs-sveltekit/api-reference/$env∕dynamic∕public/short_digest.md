Access public environment variables at runtime via `$env/dynamic/public`. Variables must be prefixed with `PUBLIC_`. Prefer `$env/static/public` to avoid network overhead.

```ts
import { env } from '$env/dynamic/public';
console.log(env.PUBLIC_DEPLOYMENT_SPECIFIC_VARIABLE);
```