## Adapters

Adapters transform built SvelteKit apps for deployment. Configure in `svelte.config.js`. Official adapters: Cloudflare, Netlify, Node, static sites, Vercel. **adapter-auto** auto-detects the platform.

## Deployment

**Node.js**: `@sveltejs/adapter-node`. Configure via `PORT`, `HOST`, `ORIGIN`, `PROTOCOL_HEADER`, `HOST_HEADER`, `BODY_SIZE_LIMIT`, `SHUTDOWN_TIMEOUT`. Listen to `sveltekit:shutdown` for cleanup.

**Static**: `@sveltejs/adapter-static` with `export const prerender = true;`

**SPA**: `adapter-static` with `fallback` option and `export const ssr = false;`

**Cloudflare**: `@sveltejs/adapter-cloudflare`. Access bindings via `platform.env`. Use `read()` from `$app/server` instead of `fs`.

**Netlify**: `@sveltejs/adapter-netlify` with `edge` and `split` options. Access context via `event.platform?.context`.

**Vercel**: `@sveltejs/adapter-vercel`. Configure `split`, `runtime`, `regions`, `memory`, `isr`. Image optimization available.