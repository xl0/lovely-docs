## Dynamic Public Environment Variables

Access client-safe environment variables prefixed with `PUBLIC_` (configurable via `config.kit.env.publicPrefix`).

```ts
import { env } from '$env/dynamic/public';
console.log(env.PUBLIC_DEPLOYMENT_SPECIFIC_VARIABLE);
```

**Note:** Sends all variables to client, increasing request size—prefer `$env/static/public` when possible.