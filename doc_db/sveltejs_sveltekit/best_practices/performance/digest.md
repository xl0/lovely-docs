## Built-in Performance Features

SvelteKit automatically provides:
- Code-splitting (load only code for current page)
- Asset preloading (prevent waterfalls)
- File hashing (cache assets forever)
- Request coalescing (group separate server `load` function requests into single HTTP request)
- Parallel loading (separate universal `load` functions fetch simultaneously)
- Data inlining (replay server-rendered `fetch` requests in browser without new request)
- Conservative invalidation (`load` functions re-run only when necessary)
- Prerendering (per-route configurable for pages without dynamic data)
- Link preloading (eagerly anticipate data/code for client-side navigation)

## Diagnosing Issues

Use Google PageSpeed Insights and WebPageTest for deployed sites. Browser devtools:
- Chrome: Lighthouse, Network, Performance
- Edge: Lighthouse, Network, Performance
- Firefox: Network, Performance
- Safari: enhancing the performance of your webpage

Test in preview mode after building, not dev mode. For slow API calls, instrument backend with OpenTelemetry or Server-Timing headers.

## Optimizing Assets

### Images
Use `@sveltejs/enhanced-img` package. Lighthouse identifies worst offenders.

### Videos
- Compress with Handbrake, convert to `.webm` or `.mp4`
- Lazy-load below-the-fold videos with `preload="none"` (slows playback initiation)
- Strip audio from muted videos with FFmpeg

### Fonts
SvelteKit doesn't preload fonts by default (may download unused weights). In `handle` hook, call `resolve` with `preload` filter to include fonts. Subset fonts to reduce file size.

## Reducing Code Size

### Svelte Version
Use latest Svelte version (5 < 4 < 3 in size/speed).

### Packages
Use `rollup-plugin-visualizer` to identify large packages. Inspect build output with `build: { minify: false }` in Vite config. Check network tab in devtools.

### External Scripts
Minimize third-party scripts. Use server-side analytics (Cloudflare, Netlify, Vercel) instead of JavaScript-based. Run third-party scripts in web worker with Partytown's SvelteKit integration to avoid blocking main thread.

### Selective Loading
Static `import` declarations bundle automatically. Use dynamic `import(...)` to lazy-load conditionally.

## Navigation

### Preloading
Speed up client-side navigation with link options (configured by default on `<body>`).

### Non-essential Data
Return promises from `load` function for slow data not needed immediately. Server `load` functions will stream data after navigation/initial page load.

### Preventing Waterfalls
Waterfalls are sequential request chains (especially costly for mobile/distant servers).

**Browser waterfalls**: HTML requests JS → CSS → background image/font. SvelteKit adds `modulepreload` tags/headers. Check devtools network tab for additional preload needs. Web fonts need manual handling. SPA mode causes waterfalls (empty page → JS → render).

**Backend waterfalls**: Universal `load` fetches user → uses response to fetch items → uses that to fetch item details = multiple sequential requests. Solution: use server `load` functions to make backend requests from server instead of browser (avoids high-latency round trips). Server `load` functions can also have waterfalls (e.g., query user → query items) — use database joins instead.

## Hosting

- Frontend in same data center as backend to minimize latency
- For sites without central backend, deploy to edge (many adapters support this, some support per-route configuration)
- Serve images from CDN (many adapter hosts do this automatically)
- Use HTTP/2 or newer (Vite's code splitting creates many small files for cacheability, requires parallel loading)

## Further Reading

Building performant SvelteKit apps follows general web performance principles. Apply Core Web Vitals information to any web experience.