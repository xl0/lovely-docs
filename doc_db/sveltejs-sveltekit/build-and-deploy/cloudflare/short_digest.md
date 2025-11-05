## Setup

```js
import adapter from '@sveltejs/adapter-cloudflare';
const config = { kit: { adapter: adapter() } };
export default config;
```

## Key Options

- **fallback**: plaintext or spa for 404 handling
- **routes**: Customize `_routes.json` with include/exclude patterns (max 100 rules)

## Cloudflare Workers

Requires `wrangler.jsonc` with `assets.binding` and `assets.directory`.

## Cloudflare Pages

Build command: `npm run build`, output: `.svelte-kit/cloudflare`. Use server endpoints instead of `/functions` directory.

## Runtime APIs

Access bindings via `platform.env` after installing `@cloudflare/workers-types` and declaring in `src/app.d.ts`.

## Common Issues

- Use `read()` from `$app/server` instead of `fs`
- Add `nodejs_compat` flag for Node.js compatibility
- Reduce worker size by importing large libraries client-side