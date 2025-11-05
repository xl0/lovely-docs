Access public environment variables at runtime on the client side.

Public dynamic environment variables are those prefixed with `PUBLIC_` (configurable via `config.kit.env.publicPrefix`). Unlike static public environment variables, these are sent from server to client at runtime, resulting in larger network requests.

Usage:
```ts
import { env } from '$env/dynamic/public';
console.log(env.PUBLIC_DEPLOYMENT_SPECIFIC_VARIABLE);
```

Prefer `$env/static/public` when possible to avoid the network overhead of sending variables dynamically.