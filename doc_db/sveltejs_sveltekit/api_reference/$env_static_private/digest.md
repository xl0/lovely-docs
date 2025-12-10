## Static Private Environment Variables

Module for accessing private environment variables that are statically injected at build time.

### Source
Variables are loaded by Vite from `.env` files and `process.env`. Only includes variables that:
- Do NOT begin with `config.kit.env.publicPrefix`
- DO start with `config.kit.env.privatePrefix` (if configured)

### Key Difference from Dynamic
Unlike `$env/dynamic/private`, values are statically injected into the bundle at build time, enabling optimizations like dead code elimination.

### Usage
```ts
import { API_KEY } from '$env/static/private';
```

### Important Notes
- Cannot be imported into client-side code
- All referenced environment variables should be declared in `.env` files, even if empty:
  ```
  MY_FEATURE_FLAG=""
  ```
- Override values from command line:
  ```sh
  MY_FEATURE_FLAG="enabled" npm run dev
  ```