## Setup
Install `@sveltejs/adapter-cloudflare` and configure in svelte.config.js with options for config path, platformProxy, fallback (plaintext/spa), and routes (include/exclude with `<build>`, `<files>`, `<prerendered>`, `<all>`).

## Cloudflare Workers
Requires wrangler.jsonc with `main`, `compatibility_date`, and `assets` config. Deploy via Cloudflare Workers framework guide.

## Cloudflare Pages
Build command: `npm run build`, output: `.svelte-kit/cloudflare`. Implement functions as SvelteKit server endpoints (compiled to `_worker.js`), not `/functions` directory.

## Runtime APIs
Access bindings via `platform.env` (KV, Durable Objects, etc.) in hooks/endpoints. Install `@cloudflare/workers-types` and declare in `src/app.d.ts`. Emulated locally via Wrangler config.

## Troubleshooting
- Node.js: add `nodejs_compat` flag
- Size limits: import large libraries client-side
- File system: use `read()` from `$app/server` or prerender
- Migration: replace adapter, remove `site` config, add `assets` config