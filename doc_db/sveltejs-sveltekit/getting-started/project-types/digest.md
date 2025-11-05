SvelteKit supports multiple rendering and deployment patterns:

**Default rendering**: SSR for initial page load (better SEO and perceived performance), then CSR for subsequent navigation (faster updates without re-rendering common components).

**Static site generation**: Use `adapter-static` to prerender entire site, or use the `prerender` option for selective pages. `adapter-vercel` supports Incremental Static Regeneration (ISR) for large sites.

**Single-page app (SPA)**: Client-side rendering only. Can use SvelteKit backend or separate backend. Skip `server` file documentation if using separate backend.

**Multi-page app**: Remove JavaScript with `csr = false` to render subsequent links on server, or use `data-sveltekit-reload` for specific links.

**Separate backend**: Deploy SvelteKit frontend separately using `adapter-node` or serverless adapters. Alternatively deploy as SPA served by backend (worse SEO/performance).

**Serverless**: Use `adapter-auto` for zero-config, or `adapter-vercel`, `adapter-netlify`, `adapter-cloudflare` for platform-specific config. Some adapters support edge rendering.

**Own server/VPS**: Use `adapter-node`.

**Container**: Use `adapter-node` with Docker or LXC.

**Library**: Use `@sveltejs/package` add-on with `sv create` library option.

**Offline/PWA**: Full service worker support.

**Mobile app**: Convert SPA to mobile with Tauri or Capacitor. Use `bundleStrategy: 'single'` to limit concurrent requests (e.g., Capacitor uses HTTP/1).

**Desktop app**: Convert SPA to desktop with Tauri, Wails, or Electron.

**Browser extension**: Use `adapter-static` or community adapters.

**Embedded device**: Use `bundleStrategy: 'single'` to reduce concurrent requests on low-power devices.