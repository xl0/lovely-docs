## Authentication
Sessions require DB queries but can be revoked immediately; JWTs offer better latency but cannot be revoked. Check auth cookies in server hooks, store user info in `locals`. Use Lucia for session-based auth.

## Performance
Diagnose with PageSpeed Insights, WebPageTest, or browser devtools in preview mode. Optimize images with `@sveltejs/enhanced-img`, compress videos to `.webm`/`.mp4`, preload fonts in `handle` hook. Find large packages with `rollup-plugin-visualizer`, replace JS analytics with server-side, use dynamic `import(...)` for conditional code. Avoid waterfalls by using server `load` functions. Colocate frontend/backend, deploy to edge, use CDN for images.

## Icons & Images
Use Iconify CSS for icons without per-file imports. Avoid icon libraries with one `.svelte` file per icon. Optimize images with `@sveltejs/enhanced-img` for build-time or `@unpic/svelte` for dynamic images. Set `fetchpriority="high"` for LCP images, add width/height to prevent layout shift.

## Accessibility
Set unique page titles in `<svelte:head>` for screen reader announcements. SvelteKit focuses `<body>` after navigation; customize with `afterNavigate` hook. Set `lang` attribute on `<html>` for multi-language apps.

## SEO
SSR enabled by default. Add unique `<title>` and `<meta name="description">` in `<svelte:head>`. Create dynamic sitemaps via endpoints. For AMP: set `inlineStyleThreshold: Infinity`, disable `csr`, transform HTML with `@sveltejs/amp`.