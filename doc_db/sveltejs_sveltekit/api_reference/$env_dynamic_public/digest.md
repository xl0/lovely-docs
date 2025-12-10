## Dynamic Public Environment Variables

Access environment variables that begin with the public prefix (default: `PUBLIC_`) on the client side.

### Purpose
- Only includes variables prefixed with `config.kit.env.publicPrefix` (defaults to `PUBLIC_`)
- Can be safely exposed to client-side code
- Counterpart to `$env/dynamic/private` for public variables

### Usage
```ts
import { env } from '$env/dynamic/public';
console.log(env.PUBLIC_DEPLOYMENT_SPECIFIC_VARIABLE);
```

### Performance Consideration
Public dynamic environment variables are sent from server to client, increasing network request size. Use `$env/static/public` instead when possible for better performance.