

## Pages

### auth
Authentication and authorization patterns in SvelteKit: session IDs (revocable, DB-dependent) vs JWT (non-revocable, faster); implement via server hooks and locals; use Lucia for session-based auth.

## Authentication vs Authorization

Authentication verifies user identity based on credentials. Authorization determines which actions users are allowed to take.

## Sessions vs Tokens

After credential verification, users need to be authenticated on subsequent requests using either:

**Session IDs**: Stored in database, can be immediately revoked, but require a database query per request.

**JWT (JSON Web Tokens)**: Not checked against datastore, cannot be immediately revoked, but offer improved latency and reduced datastore load.

## Implementation in SvelteKit

Auth cookies can be checked inside server hooks. When a user matches provided credentials, store user information in `locals` (available in server hooks).

## Recommended Approach

Use Lucia for session-based auth. It provides example code and projects for SvelteKit integration. Add it with `npx sv create` (new project) or `npx sv add lucia` (existing project).

Auth systems are tightly coupled to web frameworks because most code involves validating user input, handling errors, and directing users appropriately. Generic JS auth libraries often include multiple web frameworks, so SvelteKit-specific guides like Lucia are preferable to avoid framework bloat in your project.

### performance
Performance optimization: built-in features (code-splitting, preloading, coalescing, inlining, prerendering), diagnosing tools (PageSpeed Insights, WebPageTest, devtools), asset optimization (images with enhanced-img, video compression, font subsetting/preloading), code reduction (latest Svelte, package analysis, server-side analytics, dynamic imports), navigation (link preloading, promise returns, waterfall prevention via server load functions and database joins), hosting (same-datacenter backend, edge deployment, CDN images, HTTP/2+).

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

### icons
Two approaches to icons: CSS-based via Iconify (supports many sets, framework plugins), or Svelte libraries (avoid per-icon .svelte files due to Vite optimization issues).

## CSS

Use Iconify for CSS-based icons. Iconify supports many popular icon sets via CSS inclusion. Works with CSS frameworks using Iconify's Tailwind CSS or UnoCSS plugins. No need to import icons into `.svelte` files.

## Svelte

When choosing icon libraries for Svelte, avoid libraries that provide one `.svelte` file per icon. These can have thousands of files, severely slowing Vite's dependency optimization. This problem is especially pronounced when icons are imported both via umbrella imports and subpath imports, as noted in the vite-plugin-svelte FAQ.

### images
Image optimization via Vite built-in handling, @sveltejs/enhanced-img plugin (auto-generates formats/sizes/width/height), or CDN for dynamic images; best practices for performance and layout stability.

## Image Optimization Techniques

Images impact app performance. Optimize by generating optimal formats (`.avif`, `.webp`), creating different sizes for different screens, and ensuring effective caching.

## Vite's Built-in Handling

Vite automatically processes imported assets with hashing for caching and inlining for small assets.

```svelte
<script>
	import logo from '$lib/assets/logo.png';
</script>

<img alt="The project logo" src={logo} />
```

## @sveltejs/enhanced-img

Plugin providing plug-and-play image processing: serves smaller formats (avif/webp), sets intrinsic width/height to prevent layout shift, creates multiple sizes for various devices, strips EXIF data.

**Note:** Only optimizes files on your machine during build. For images from CDN/CMS/backend, use dynamic loading approach.

### Setup

```sh
npm i -D @sveltejs/enhanced-img
```

```js
import { sveltekit } from '@sveltejs/kit/vite';
import { enhancedImages } from '@sveltejs/enhanced-img';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [
		enhancedImages(), // must come before SvelteKit plugin
		sveltekit()
	]
});
```

First build is slower due to image transformation, but subsequent builds use cache at `./node_modules/.cache/imagetools`.

### Basic Usage

```svelte
<enhanced:img src="./path/to/your/image.jpg" alt="An alt text" />
```

At build time, replaced with `<img>` wrapped by `<picture>` providing multiple image types and sizes. Provide highest resolution needed; smaller versions generated automatically. Provide 2x resolution for HiDPI displays.

**CSS selector note:** Use `enhanced\:img` to escape the colon in style blocks.

### Dynamic Image Selection

```svelte
<script>
	import MyImage from './path/to/your/image.jpg?enhanced';
</script>

<enhanced:img src={MyImage} alt="some alt text" />
```

With `import.meta.glob`:

```svelte
<script>
	const imageModules = import.meta.glob(
		'/path/to/assets/*.{avif,gif,heif,jpeg,jpg,png,tiff,webp}',
		{
			eager: true,
			query: { enhanced: true }
		}
	)
</script>

{#each Object.entries(imageModules) as [_path, module]}
	<enhanced:img src={module.default} alt="some alt text" />
{/each}
```

**Note:** SVG images only supported statically.

### Intrinsic Dimensions

`width` and `height` are optional and automatically inferred/added, preventing layout shift. To use different dimensions or auto-calculate one:

```svelte
<style>
	.hero-image img {
		width: var(--size);
		height: auto;
	}
</style>
```

### srcset and sizes

For large images (hero images, full-width), specify `sizes` for smaller versions on smaller devices:

```svelte
<enhanced:img src="./image.png" sizes="min(1280px, 100vw)"/>
```

With custom widths:

```svelte
<enhanced:img
  src="./image.png?w=1280;640;400"
  sizes="(min-width:1920px) 1280px, (min-width:1080px) 640px, (min-width:768px) 400px"
/>
```

Without `sizes`, generates HiDPI and standard resolution images. Provide 2x resolution source.

Smallest auto-generated image is 540px; use `?w=` query parameter for custom widths.

### Per-image Transforms

Apply transforms like blur, quality, flatten, rotate via query string:

```svelte
<enhanced:img src="./path/to/your/image.jpg?blur=15" alt="An alt text" />
```

See imagetools repo for full list of directives.

## Loading Images Dynamically from CDN

For images not accessible at build time (CMS, backend, database), use CDN for dynamic optimization.

CDNs provide flexibility with sizes but may have setup overhead and costs. Browser may not use cached copy until 304 response. CDNs serve appropriate format based on User-Agent header, allowing `<img>` tags instead of `<picture>`. Some CDNs generate images lazily, potentially impacting performance on low-traffic sites.

Libraries with Svelte support: `@unpic/svelte` (CDN-agnostic, many providers), Cloudinary, Contentful, Storyblok, Contentstack.

## Best Practices

- Mix and match solutions in one project (Vite for meta tags, enhanced-img for homepage, CDN for user content).
- Serve all images via CDN to reduce latency globally.
- Original images should be high quality/resolution at 2x display width for HiDPI. Image processing sizes down, not up.
- For large images (>400px, hero images), specify `sizes` for smaller device serving.
- For important images (LCP), set `fetchpriority="high"` and avoid `loading="lazy"`.
- Constrain images with container/styling to prevent jumping during load, affecting CLS. Use `width` and `height` to reserve space.
- Always provide good `alt` text (Svelte compiler warns if missing).
- Don't use `em` or `rem` in `sizes` or change their default. In `sizes` and `@media`, `em`/`rem` mean user's default font-size. If CSS changes font-size (e.g., `html { font-size: 62.5%; }`), browser preloader slot size differs from actual CSS layout slot.

### accessibility
SvelteKit's built-in accessibility: route announcements via live regions reading page titles, focus management on navigation with customization hooks, and language attribute configuration for assistive technology.

## Route announcements

SvelteKit uses client-side routing, which doesn't trigger full page reloads. To compensate for the loss of automatic screen reader announcements, SvelteKit injects a live region that announces the new page name after navigation by reading the `<title>` element.

Every page should have a unique, descriptive title:

```svelte
<svelte:head>
	<title>Todo List</title>
</svelte:head>
```

## Focus management

In traditional server-rendered apps, navigation resets focus to the top of the page. SvelteKit simulates this by focusing the `<body>` element after navigation and enhanced form submissions, unless an element with the `autofocus` attribute is present.

Customize focus management with the `afterNavigate` hook:

```js
import { afterNavigate } from '$app/navigation';

afterNavigate(() => {
	const to_focus = document.querySelector('.focus-me');
	to_focus?.focus();
});
```

The `goto` function accepts a `keepFocus` option to preserve the currently-focused element instead of resetting focus. Ensure the focused element still exists after navigation to avoid losing focus.

## The "lang" attribute

Set the correct `lang` attribute on the `<html>` element in `src/app.html` for proper assistive technology pronunciation:

```html
<html lang="de">
```

For multi-language content, set `lang` dynamically using the handle hook:

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

## Built-in features

- Svelte's compile-time accessibility checks apply to SvelteKit applications
- SvelteKit provides an accessible foundation, but developers remain responsible for application code accessibility

### seo
SSR enabled by default, use unique titles/meta tags, create sitemaps via endpoints, support AMP with inlineStyleThreshold and transformPageChunk hook.

## Out of the box

### SSR
Server-side rendering is enabled by default and should be kept on for better search engine indexing. SvelteKit supports dynamic rendering if needed, though SSR has benefits beyond SEO.

### Performance
Core Web Vitals impact search rankings. Svelte/SvelteKit's minimal overhead helps build fast sites. Use Google PageSpeed Insights or Lighthouse to test. Hybrid rendering mode and image optimization significantly improve speed.

### Normalized URLs
SvelteKit automatically redirects trailing slash variants to maintain consistent URLs, preventing SEO penalties from duplicates.

## Manual setup

### Title and Meta Tags
Every page needs unique `<title>` and `<meta name="description">` in `<svelte:head>`. Common pattern: return SEO data from page `load` functions and use it in root layout's `<svelte:head>`.

### Sitemaps
Create dynamic sitemaps via endpoints:

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
			<!-- <url> elements go here -->
		</urlset>`.trim(),
		{ headers: { 'Content-Type': 'application/xml' } }
	);
}
```

### AMP
To create Accelerated Mobile Pages versions:

1. Set `inlineStyleThreshold: Infinity` in `svelte.config.js` (inline all styles since `<link rel="stylesheet">` isn't allowed)
2. Disable CSR in root `+layout.server.js`: `export const csr = false;`
3. Add `amp` attribute to `<html>` in `app.html`
4. Transform HTML in `src/hooks.server.js`:

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

Optional: Remove unused CSS with `dropcss`:

```js
import * as amp from '@sveltejs/amp';
import dropcss from 'dropcss';

export async function handle({ event, resolve }) {
	let buffer = '';
	return await resolve(event, {
		transformPageChunk: ({ html, done }) => {
			buffer += html;
			if (done) {
				let css = '';
				const markup = amp.transform(buffer)
					.replace('⚡', 'amp')
					.replace(/<style amp-custom([^>]*?)>([^]+?)<\/style>/, (match, attributes, contents) => {
						css = contents;
						return `<style amp-custom${attributes}></style>`;
					});
				css = dropcss({ css, html: markup }).css;
				return markup.replace('</style>', `${css}</style>`);
			}
		}
	});
}
```

Validate transformed HTML with `amphtml-validator` in the handle hook (only for prerendered pages due to performance).

