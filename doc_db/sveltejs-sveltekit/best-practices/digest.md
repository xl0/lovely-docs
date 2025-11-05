## Authentication
- **Sessions vs Tokens**: Sessions require DB queries but can be revoked immediately; JWTs offer better latency but cannot be revoked
- **Integration**: Check auth cookies in server hooks, store user info in `locals`
- **Lucia**: Recommended session-based auth library, add via `npx sv add lucia`

## Performance
- **Diagnostics**: Use PageSpeed Insights, WebPageTest, or browser devtools (Lighthouse, Network, Performance tabs) in preview mode
- **Images**: Use `@sveltejs/enhanced-img` for build-time optimization
- **Videos**: Compress to `.webm`/`.mp4`, lazy-load with `preload="none"`
- **Fonts**: Preload in `handle` hook, subset to reduce size
- **Code size**: Use `rollup-plugin-visualizer` to find large packages, replace JS analytics with server-side, use dynamic `import(...)` for conditional code, run third-party scripts in web workers with Partytown
- **Navigation**: Preload with link options, return promises from `load` for non-essential data, use server `load` functions to avoid waterfalls
- **Hosting**: Colocate frontend/backend, deploy to edge, use CDN for images, require HTTP/2+

## Icons
- **CSS approach**: Use Iconify CSS to include icons without per-file imports
- **Svelte approach**: Avoid icon libraries with one `.svelte` file per icon

## Images
- **Vite built-in**: Auto-processes imported assets with hashing and inlining
- **@sveltejs/enhanced-img**: Build-time plugin generating avif/webp formats, multiple sizes, intrinsic dimensions
  ```svelte
  <enhanced:img src="./image.jpg?w=1280;640;400" sizes="(min-width:1920px) 1280px, (min-width:1080px) 640px, (min-width:768px) 400px"/>
  ```
- **CDN-based**: For dynamic images using `@unpic/svelte` or provider-specific libraries
- **Best practices**: Serve via CDN, provide 2x resolution images, set `fetchpriority="high"` for LCP images, add width/height to prevent layout shift, always provide alt text

## Accessibility
- **Route announcements**: Set unique page titles in `<svelte:head>` for screen reader announcements during client-side navigation
- **Focus management**: SvelteKit focuses `<body>` after navigation (or an `autofocus` element if present), customize with `afterNavigate` hook or `goto` with `keepFocus` option
- **Language attribute**: Set `lang` attribute on `<html>` in `src/app.html`, use server handle hook for multi-language apps

## SEO
- **SSR enabled by default** for reliable search engine indexing
- **Performance matters** - use hybrid rendering and optimize images
- **Metadata**: Add unique `<title>` and `<meta name="description">` in `<svelte:head>`
- **Sitemaps**: Create dynamic sitemaps via endpoints
- **AMP support**: Set `inlineStyleThreshold: Infinity`, disable `csr`, transform HTML with `@sveltejs/amp` in server hooks