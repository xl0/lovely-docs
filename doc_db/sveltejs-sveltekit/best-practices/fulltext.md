

## Pages

### auth
Authentication and authorization patterns in SvelteKit: comparing session vs token approaches, integration via server hooks, and using Lucia for session-based auth.

**Sessions vs Tokens**: Session IDs require DB queries but can be revoked immediately; JWTs offer better latency but cannot be revoked.

**SvelteKit Integration**: Check auth cookies in server hooks, store user info in `locals`.

**Lucia**: Recommended session-based auth library with SvelteKit examples. Add via `npx sv add lucia`.

### performance
Practical performance optimization techniques for SvelteKit apps covering diagnostics, asset optimization, code reduction, navigation patterns, and hosting considerations.

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

### icons
Two approaches to using icons in SvelteKit: CSS-based via Iconify, or Svelte component libraries (avoiding those with per-icon files).

**CSS approach**: Use Iconify CSS to include icons without per-file imports.

**Svelte approach**: Avoid icon libraries with one `.svelte` file per icon as they degrade Vite's dependency optimization performance.

### images
Optimize images using Vite's built-in handling, @sveltejs/enhanced-img for build-time optimization, or CDN-based solutions for dynamic images, following best practices for responsive sizing and performance.

## Image Optimization

**Vite built-in**: Auto-processes imported assets with hashing and inlining.

**@sveltejs/enhanced-img**: Build-time plugin generating avif/webp formats, multiple sizes, intrinsic dimensions.
```svelte
<enhanced:img src="./image.jpg" alt="text" />
<enhanced:img src="./image.jpg?w=1280;640;400" sizes="(min-width:1920px) 1280px, (min-width:1080px) 640px, (min-width:768px) 400px"/>
```

**CDN-based**: For dynamic/non-build-time images using `@unpic/svelte` or provider-specific libraries.

**Best practices**: Mix approaches per use case, serve via CDN, provide 2x resolution images, use `sizes` for large images, set `fetchpriority="high"` for LCP images, add width/height to prevent layout shift, always provide alt text, avoid em/rem in sizes.

### accessibility
SvelteKit provides built-in accessibility features: route announcements via page titles, automatic focus management, and language attribute configuration.

## Route announcements
Set unique page titles in `<svelte:head>` so screen readers announce page changes during client-side navigation.

## Focus management
SvelteKit focuses `<body>` after navigation (or an `autofocus` element if present). Customize with `afterNavigate` hook or use `goto` with `keepFocus` option.

## Language attribute
Set `lang` attribute on `<html>` in `src/app.html`. Use server handle hook to set dynamically for multi-language apps.

### seo
Technical SEO best practices for SvelteKit: leverage built-in SSR and performance optimizations, manage metadata and sitemaps, and optionally support AMP.

**SSR enabled by default** for reliable search engine indexing. **Performance matters** - use hybrid rendering and optimize images. **Normalized URLs** prevent duplicates.

Add unique `<title>` and `<meta name="description">` in `<svelte:head>`. Create dynamic sitemaps via endpoints. For AMP support, set `inlineStyleThreshold: Infinity`, disable `csr`, and transform HTML with `@sveltejs/amp` in server hooks.

