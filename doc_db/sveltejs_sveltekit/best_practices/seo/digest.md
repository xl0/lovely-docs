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