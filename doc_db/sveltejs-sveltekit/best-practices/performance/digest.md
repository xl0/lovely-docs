## Built-in optimizations
SvelteKit automatically handles: code-splitting, asset preloading, file hashing, request coalescing, parallel loading, data inlining, conservative invalidation, prerendering, and link preloading.

## Diagnosing performance issues
Use PageSpeed Insights or WebPageTest for deployed sites. Browser devtools provide Lighthouse, Network, and Performance tabs. Test in preview mode after building, not in dev mode. Instrument backends with OpenTelemetry or Server-Timing headers to identify slow API calls.

## Optimizing assets
**Images**: Use `@sveltejs/enhanced-img` package. Lighthouse identifies problematic images.
**Videos**: Compress with Handbrake to `.webm` or `.mp4`. Lazy-load with `preload="none"`. Strip audio from muted videos with FFmpeg.
**Fonts**: Preload fonts in the `handle` hook with a `preload` filter. Subset fonts to reduce file size.

## Reducing code size
- Use latest Svelte version (5 is smaller/faster than 4, which is smaller/faster than 3)
- Use `rollup-plugin-visualizer` to identify large packages
- Replace JavaScript analytics with server-side implementations (Cloudflare, Netlify, Vercel)
- Use Partytown's SvelteKit integration to run third-party scripts in web workers
- Use dynamic `import(...)` instead of static imports for conditionally-needed code

## Navigation performance
**Preloading**: Use link options to eagerly preload code and data (configured by default on `<body>`).
**Non-essential data**: Return promises from `load` functions to stream data after navigation.
**Preventing waterfalls**: 
- Browser waterfalls: SvelteKit adds `modulepreload` tags/headers. Manually preload web fonts.
- SPA mode causes waterfalls (empty page → JS → render). Avoid unless necessary.
- Backend waterfalls: Use server `load` functions instead of universal ones to avoid sequential API calls from the browser. Combine database queries with joins instead of multiple sequential queries.

## Hosting
- Colocate frontend and backend in same data center
- Deploy to edge for sites without central backend
- Serve images from CDN
- Use HTTP/2 or newer (Vite's code splitting creates many small files that benefit from parallel loading)