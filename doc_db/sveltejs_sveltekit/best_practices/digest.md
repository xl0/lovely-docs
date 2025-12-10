## Authentication and Authorization

**Sessions vs Tokens**: Session IDs are stored in database, can be immediately revoked but require DB query per request. JWTs are not checked against datastore, cannot be immediately revoked, but offer improved latency and reduced load.

**Implementation**: Check auth cookies in server hooks, store user info in `locals`. Use Lucia for session-based auth via `npx sv add lucia`.

## Performance Optimization

**Built-in Features**: Code-splitting, asset preloading, file hashing, request coalescing, parallel loading, data inlining, conservative invalidation, prerendering, link preloading.

**Diagnosing**: Use PageSpeed Insights, WebPageTest, browser devtools (Chrome/Edge Lighthouse, Network, Performance tabs). Test in preview mode, not dev. Instrument slow APIs with OpenTelemetry or Server-Timing headers.

**Assets**: 
- Images: Use `@sveltejs/enhanced-img` package
- Videos: Compress with Handbrake to `.webm`/`.mp4`, lazy-load with `preload="none"`, strip audio with FFmpeg
- Fonts: In `handle` hook call `resolve` with `preload` filter, subset fonts to reduce size

**Code Reduction**: Use latest Svelte (5 < 4 < 3 in size). Use `rollup-plugin-visualizer` to identify large packages. Minimize third-party scripts; use server-side analytics (Cloudflare, Netlify, Vercel) instead of JS-based. Use dynamic `import(...)` for conditional loading instead of static imports.

**Navigation**: Return promises from `load` for slow non-essential data; server `load` functions stream after navigation. Prevent waterfalls: use server `load` functions for backend requests (avoids high-latency round trips), use database joins instead of sequential queries.

**Hosting**: Frontend in same datacenter as backend, deploy to edge for sites without central backend, serve images from CDN, use HTTP/2+.

## Icons

**CSS-based**: Use Iconify for many icon sets via CSS, works with Tailwind CSS or UnoCSS plugins via Iconify's framework plugins.

**Svelte**: Avoid libraries providing one `.svelte` file per icon (thousands of files severely slow Vite's dependency optimization, especially with umbrella + subpath imports).

## Images

**Vite Built-in**: Automatically processes imported assets with hashing for caching and inlining for small assets.

```svelte
<script>
	import logo from '$lib/assets/logo.png';
</script>
<img alt="The project logo" src={logo} />
```

**@sveltejs/enhanced-img**: Plug-and-play image processing generating smaller formats (avif/webp), setting intrinsic width/height to prevent layout shift, creating multiple sizes for devices, stripping EXIF.

Setup:
```js
import { enhancedImages } from '@sveltejs/enhanced-img';
export default defineConfig({
	plugins: [enhancedImages(), sveltekit()]
});
```

Usage:
```svelte
<enhanced:img src="./image.jpg" alt="text" />
```

At build time replaced with `<img>` wrapped by `<picture>` with multiple types/sizes. Provide highest resolution needed; smaller versions auto-generated. Provide 2x resolution for HiDPI.

Dynamic selection:
```svelte
<script>
	import MyImage from './image.jpg?enhanced';
	const imageModules = import.meta.glob('/path/*.{jpg,png}', {
		eager: true,
		query: { enhanced: true }
	});
</script>
<enhanced:img src={MyImage} alt="text" />
{#each Object.entries(imageModules) as [_path, module]}
	<enhanced:img src={module.default} alt="text" />
{/each}
```

Width/height auto-inferred preventing layout shift. For large images specify `sizes`:
```svelte
<enhanced:img src="./image.png" sizes="min(1280px, 100vw)"/>
<enhanced:img src="./image.png?w=1280;640;400" sizes="(min-width:1920px) 1280px, (min-width:1080px) 640px, (min-width:768px) 400px"/>
```

Per-image transforms via query string: `src="./image.jpg?blur=15"` (see imagetools repo for full directives).

**CDN for Dynamic Images**: For images not at build time (CMS, backend, database), use CDN. Libraries with Svelte support: `@unpic/svelte` (CDN-agnostic), Cloudinary, Contentful, Storyblok, Contentstack.

**Best Practices**: Mix solutions in one project. Serve all images via CDN to reduce latency. Original images should be high quality/resolution at 2x display width for HiDPI. For large images (>400px, hero), specify `sizes`. For important images (LCP), set `fetchpriority="high"` and avoid `loading="lazy"`. Constrain images with container/styling to prevent jumping (CLS). Use `width`/`height` to reserve space. Always provide good `alt` text. Don't use `em`/`rem` in `sizes` or change their default (in `sizes` and `@media`, `em`/`rem` mean user's default font-size; if CSS changes it, browser preloader slot size differs from actual layout).

## Accessibility

**Route Announcements**: SvelteKit injects live region announcing new page name after navigation by reading `<title>` element. Every page needs unique, descriptive title:
```svelte
<svelte:head>
	<title>Todo List</title>
</svelte:head>
```

**Focus Management**: SvelteKit focuses `<body>` after navigation/enhanced form submissions unless element with `autofocus` present. Customize with `afterNavigate` hook:
```js
import { afterNavigate } from '$app/navigation';
afterNavigate(() => {
	document.querySelector('.focus-me')?.focus();
});
```

`goto` function accepts `keepFocus` option to preserve currently-focused element. Ensure focused element still exists after navigation.

**Lang Attribute**: Set correct `lang` on `<html>` in `src/app.html` for assistive technology pronunciation. For multi-language, set dynamically:
```html
<!-- src/app.html -->
<html lang="%lang%">
```
```js
// src/hooks.server.js
export function handle({ event, resolve }) {
	return resolve(event, {
		transformPageChunk: ({ html }) => html.replace('%lang%', get_lang(event))
	});
}
```

**Built-in**: Svelte's compile-time accessibility checks apply to SvelteKit. SvelteKit provides accessible foundation; developers responsible for application code accessibility.

## SEO

**Out of Box**: SSR enabled by default (keep on for better indexing). Core Web Vitals impact rankings; Svelte/SvelteKit's minimal overhead helps build fast sites. SvelteKit auto-redirects trailing slash variants for consistent URLs.

**Title and Meta Tags**: Every page needs unique `<title>` and `<meta name="description">` in `<svelte:head>`. Common pattern: return SEO data from page `load` functions, use in root layout's `<svelte:head>`.

**Sitemaps**: Create dynamic sitemaps via endpoints:
```js
/// file: src/routes/sitemap.xml/+server.js
export async function GET() {
	return new Response(
		`<?xml version="1.0" encoding="UTF-8" ?>
		<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
			xmlns:xhtml="http://www.w3.org/1999/xhtml"
			xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0"
			xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
			xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
			xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
			<!-- <url> elements -->
		</urlset>`.trim(),
		{ headers: { 'Content-Type': 'application/xml' } }
	);
}
```

**AMP**: Set `inlineStyleThreshold: Infinity` in `svelte.config.js` (inline all styles), disable CSR in root `+layout.server.js` (`export const csr = false;`), add `amp` attribute to `<html>` in `app.html`, transform HTML in `src/hooks.server.js`:
```js
import * as amp from '@sveltejs/amp';
export async function handle({ event, resolve }) {
	let buffer = '';
	return await resolve(event, {
		transformPageChunk: ({ html, done }) => {
			buffer += html;
			if (done) return amp.transform(buffer);
		}
	});
}
```

Optional: Remove unused CSS with `dropcss`. Validate with `amphtml-validator` in handle hook (only prerendered pages due to performance).