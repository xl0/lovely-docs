**Build**: Two-stage process (Vite optimization + adapter tuning). Check `building` flag from `$app/environment` to skip build-time code execution. Preview with `vite preview`.

**Adapters**: Deployment plugins configured in `svelte.config.js`. Official: Cloudflare, Netlify, Node, static, Vercel. `adapter-auto` auto-detects environment. Platform context via `RequestEvent.platform`.

**adapter-node**: Standalone Node servers. Env vars: `PORT`, `HOST`, `ORIGIN`, `ADDRESS_HEADER`, `BODY_SIZE_LIMIT`, `SHUTDOWN_TIMEOUT`. Graceful shutdown via `sveltekit:shutdown` event. Systemd socket activation support. Custom server via `handler.js` middleware.

**adapter-static**: Prerender entire site. Config: `pages`, `assets`, `fallback`, `precompress`, `strict`. GitHub Pages: set `paths.base` to repo name, use `fallback: '404.html'`.

**SPA mode**: `adapter-static` with fallback page, `export const ssr = false`. Major performance/SEO drawbacks. Prerender homepage and key pages.

**adapter-cloudflare**: Workers/Pages. Config: `config`, `platformProxy`, `fallback`, `routes`. Access bindings via `platform.env`. Local emulation during dev/preview. Can't use `fs`; use `read()` from `$app/server` or prerender.

**adapter-netlify**: Node or Deno edge functions. Netlify Forms: prerender form page. Access context via `event.platform?.context`. Place `_headers`/`_redirects` in root.

**adapter-vercel**: Route-level config via `export const config`. ISR: `expiration`, `bypassToken`, `allowQuery`. Skew protection via deployment ID cookie. Can't use `fs` in edge; use `read()` or prerender.

**Custom adapters**: Export function returning `Adapter` with `name`, `adapt(builder)`, optional `emulate()` and `supports`. `adapt()` must write output, generate manifest, handle requests via `server.respond()`, shim fetch, bundle, place files correctly.