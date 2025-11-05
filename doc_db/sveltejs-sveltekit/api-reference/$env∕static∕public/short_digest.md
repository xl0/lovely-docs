Access public environment variables (prefixed with `PUBLIC_` by default) that are safe for client-side code. Values are replaced at build time.

```ts
import { PUBLIC_BASE_URL } from '$env/static/public';
```