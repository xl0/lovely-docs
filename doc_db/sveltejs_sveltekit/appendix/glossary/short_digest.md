## Key Rendering Terms

**CSR** - Client-side rendering in browser, enabled by default, disable with `csr = false`.

**SSR** - Server-side rendering on server, enabled by default, disable with `ssr` page option. Preferred for performance and SEO.

**Hybrid app** - SvelteKit default: SSR for initial HTML, then CSR for subsequent navigations.

**SPA** - Single-page app serving empty shell, all navigation client-side. Large performance impact, use `adapter-static`.

**SSG** - Static Site Generation, every page prerendered. Use `adapter-static` or `prerender` config.

**Prerendering** - Computing page contents at build time. Rule: same content for all users, no actions. Control with `prerender` page option.

**Hydration** - Attaching event listeners and initializing components on client with server-fetched data, enabled by default.

**ISR** - Incremental static regeneration, generate pages on-demand without redeploying. Available with `adapter-vercel`.

**Edge** - Rendering in CDN near user for lower latency.

**Routing** - Client-side navigation interception by default, skip with `data-sveltekit-reload`.

**PWA** - Progressive web app installable as mobile/desktop app, can use service workers for offline.

**MPA** - Multi-page app, traditional server-rendered per-page approach.