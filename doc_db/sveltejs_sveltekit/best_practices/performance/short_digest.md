## Built-in Features
SvelteKit provides code-splitting, asset preloading, file hashing, request coalescing, parallel loading, data inlining, conservative invalidation, prerendering, and link preloading.

## Diagnosing
Use PageSpeed Insights, WebPageTest, and browser devtools (Lighthouse, Network, Performance tabs). Test in preview mode, not dev. Instrument slow APIs with OpenTelemetry or Server-Timing headers.

## Assets
- **Images**: Use `@sveltejs/enhanced-img`, check Lighthouse
- **Videos**: Compress with Handbrake (`.webm`/`.mp4`), lazy-load with `preload="none"`, strip audio with FFmpeg
- **Fonts**: Manually preload in `handle` hook with `resolve` `preload` filter, subset fonts

## Code Size
- Use latest Svelte version
- Identify large packages with `rollup-plugin-visualizer`
- Replace JS analytics with server-side (Cloudflare/Netlify/Vercel)
- Run third-party scripts in web worker with Partytown
- Use dynamic `import(...)` for conditional code

## Navigation
- Preload with link options (default on `<body>`)
- Return promises from `load` for non-essential data (streams after navigation)
- Prevent waterfalls: use server `load` for backend requests, use database joins instead of sequential queries, check devtools for resource preload needs, avoid SPA mode

## Hosting
- Frontend in same data center as backend
- Deploy to edge for sites without central backend
- Serve images from CDN
- Use HTTP/2+ for parallel file loading