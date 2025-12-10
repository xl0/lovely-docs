## Runtime Environment Variables

Access runtime environment variables defined by your platform via the `$env/dynamic/private` module.

### Usage

```ts
import { env } from '$env/dynamic/private';
console.log(env.DEPLOYMENT_SPECIFIC_VARIABLE);
```

### Variable Filtering

This module only includes variables that:
- Do NOT begin with `config.kit.env.publicPrefix`
- DO start with `config.kit.env.privatePrefix` (if configured)

### Client-Side Restriction

This module cannot be imported into client-side code.

### Development vs Production

In `dev`, `$env/dynamic` always includes environment variables from `.env`. In `prod`, this behavior depends on your adapter (e.g., `adapter-node` uses `process.env`).
