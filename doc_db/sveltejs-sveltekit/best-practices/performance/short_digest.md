## Key optimizations
SvelteKit provides automatic code-splitting, preloading, hashing, request coalescing, and prerendering.

## Diagnosing
Use PageSpeed Insights, WebPageTest, or browser devtools (Lighthouse, Network, Performance tabs). Test in preview mode, not dev mode.

## Assets
- **Images**: Use `@sveltejs/enhanced-img`
- **Videos**: Compress to `.webm`/`.mp4`, lazy-load with `preload="none"`, strip audio with FFmpeg
- **Fonts**: Preload in `handle` hook, subset to reduce size

## Code size
- Use latest Svelte version
- Use `rollup-plugin-visualizer` to find large packages
- Replace JS analytics with server-side (Cloudflare, Netlify, Vercel)
- Use dynamic `import(...)` for conditional code
- Run third-party scripts in web workers with Partytown

## Navigation
- Preload with link options
- Return promises from `load` for non-essential data
- Avoid waterfalls: use server `load` functions, combine DB queries with joins, avoid SPA mode

## Hosting
- Colocate frontend/backend, deploy to edge, use CDN for images, require HTTP/2+