## Rendering Modes

**CSR (Client-Side Rendering)**: Page generation in the browser using JavaScript. Default in SvelteKit, can be disabled with `csr = false`.

**SSR (Server-Side Rendering)**: Page generation on the server. Default in SvelteKit, can be disabled with `ssr = false`. Preferred for performance and SEO.

**Hybrid App**: SvelteKit's default mode combining SSR for initial HTML load and CSR for subsequent navigations.

**SPA (Single-Page App)**: Single HTML file served on initial request with client-side rendering. Has performance and SEO downsides; use only in limited cases like mobile app wrappers. Build with `adapter-static`.

**MPA (Multi-Page App)**: Traditional server-rendered pages, common in non-JavaScript languages.

## Static Generation

**Prerendering**: Computing page contents at build time and saving HTML. Scales well but requires rebuilding to update content. Controlled via `prerender` page option or config in `svelte.config.js`. Pages must return same content for all users and cannot contain form actions.

**SSG (Static Site Generation)**: Every page prerendered. No server maintenance needed; can be served from CDNs. Use `adapter-static` or configure all pages with `prerender` option.

**ISR (Incremental Static Regeneration)**: Generate static pages on-demand as visitors request them without redeploying. Reduces build times for large sites. Available with `adapter-vercel`.

## Other Concepts

**Hydration**: Process where server-rendered HTML is enhanced with client-side interactivity. SvelteKit transmits fetched data with HTML so components initialize without re-fetching. Enabled by default, disabled with `csr = false`.

**Routing**: Client-side navigation interception and page updates. Default behavior; skip with `data-sveltekit-reload`.

**Edge**: Rendering in CDNs near users to reduce latency.

**PWA (Progressive Web App)**: Web app functioning like mobile/desktop app. Can be installed and use service workers for offline capabilities.