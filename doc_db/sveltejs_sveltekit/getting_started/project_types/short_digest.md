## Rendering approaches

- **Default**: SSR for initial page, CSR for subsequent pages (hybrid/transitional)
- **Static**: Use `adapter-static` or `prerender` option; `adapter-vercel` with ISR for large sites
- **SPA**: Exclusive CSR with `adapter-node` or serverless adapters
- **MPA**: Use `csr = false` or `data-sveltekit-reload` for server rendering specific pages
- **Separate backend**: Deploy frontend separately with `adapter-node` or serverless adapter

## Deployment targets

- **Serverless**: `adapter-auto`, `adapter-vercel`, `adapter-netlify`, `adapter-cloudflare`, or community adapters; some support edge rendering
- **Own server/VPS**: `adapter-node`
- **Container**: `adapter-node` with Docker/LXC
- **Library**: `@sveltejs/package` add-on with `sv create`
- **Offline/PWA**: Full service worker support
- **Mobile**: Tauri or Capacitor (use `bundleStrategy: 'single'` for HTTP/1 limits)
- **Desktop**: Tauri, Wails, or Electron
- **Browser extension**: `adapter-static` or community adapters
- **Embedded device**: Use `bundleStrategy: 'single'` for low-power devices with connection limits