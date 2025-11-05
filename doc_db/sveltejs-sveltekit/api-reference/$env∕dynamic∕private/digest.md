Access runtime environment variables that are private (server-side only). This module provides variables that don't begin with `config.kit.env.publicPrefix` and do start with `config.kit.env.privatePrefix`.

Cannot be imported into client-side code.

```ts
import { env } from '$env/dynamic/private';
console.log(env.DEPLOYMENT_SPECIFIC_VARIABLE);
```

In development, `$env/dynamic` includes variables from `.env`. In production, behavior depends on your adapter (e.g., adapter-node uses `process.env`).