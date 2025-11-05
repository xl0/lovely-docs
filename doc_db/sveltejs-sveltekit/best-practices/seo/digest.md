## Out of the box

**SSR**: SvelteKit uses server-side rendering by default, which search engines index more reliably than client-side rendered content. Keep it enabled unless you have a specific reason to disable it.

**Performance**: Core Web Vitals impact search rankings. Svelte/SvelteKit's minimal overhead helps build fast sites. Use hybrid rendering mode and optimize images. Test with PageSpeed Insights or Lighthouse.

**Normalized URLs**: SvelteKit automatically redirects trailing slash variants to maintain consistent URLs for SEO.

## Manual setup

**Title and Meta**: Add unique `<title>` and `<meta name="description">` in `<svelte:head>` on every page. Common pattern: return SEO data from page `load` functions and use it in root layout's `<svelte:head>`.

**Sitemaps**: Create dynamic sitemaps via endpoints to help search engines prioritize pages:

```js
/// file: src/routes/sitemap.xml/+server.js
export async function GET() {
	return new Response(
		`<?xml version="1.0" encoding="UTF-8" ?>
		<urlset xmlns="https://www.sitemaps.org/schemas/sitemap/0.9">
			<!-- <url> elements go here -->
		</urlset>`.trim(),
		{ headers: { 'Content-Type': 'application/xml' } }
	);
}
```

**AMP**: To create AMP versions, set `inlineStyleThreshold: Infinity` in config, disable `csr` in root layout, add `amp` attribute to `<html>`, and transform HTML using `@sveltejs/amp` in server hooks with `transformPageChunk`.