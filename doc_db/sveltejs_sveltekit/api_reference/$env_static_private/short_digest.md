## Static Private Environment Variables

Statically injected private environment variables loaded from `.env` files at build time.

```ts
import { API_KEY } from '$env/static/private';
```

- Server-side only (cannot import in client code)
- Includes variables starting with `config.kit.env.privatePrefix`, excluding `config.kit.env.publicPrefix`
- Enables dead code elimination vs `$env/dynamic/private`
- Declare all variables in `.env` even if empty; override via command line: `MY_VAR="value" npm run dev`