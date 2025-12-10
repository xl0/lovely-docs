Public environment variables (prefixed with `PUBLIC_` by default) that are statically replaced at build time and safe to expose to client-side code.

```ts
import { PUBLIC_BASE_URL } from '$env/static/public';
```