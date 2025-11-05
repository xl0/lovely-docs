## prerender
Control whether pages are rendered at build time as static HTML files. Set `export const prerender = true` to prerender a page, `false` to disable, or `'auto'` to allow dynamic server rendering as fallback. Prerendered routes are excluded from dynamic SSR manifests. The prerenderer crawls links from entry points to discover pages; use the `entries` function to specify dynamic routes that won't be discovered through crawling.

Pages must return identical content for all users to be prerenderable. Pages with form actions cannot be prerendered. Accessing `url.searchParams` during prerendering is forbidden.

## entries
Export an `entries` function from dynamic routes to tell the prerenderer which parameter values to use:
```js
export function entries() {
	return [
		{ slug: 'hello-world' },
		{ slug: 'another-blog-post' }
	];
}
export const prerender = true;
```

## ssr
Set `export const ssr = false` to render only an empty shell on the server and render the full page on the client. Useful for pages that use browser-only APIs. Setting this in root layout makes the entire app client-rendered (SPA).

## csr
Set `export const csr = false` to disable client-side rendering. The page will be static HTML only—no JavaScript shipped. This removes `<script>` tags, disables form progressive enhancement, and disables HMR. Useful for content-only pages like blog posts.

## trailingSlash
Control trailing slash behavior with `'never'` (default), `'always'`, or `'ignore'`. Affects both routing and prerendering output format. Ignoring trailing slashes is not recommended due to SEO and relative path semantics.

## config
Export adapter-specific configuration as key-value pairs. Configs merge at top level only, so child pages override parent values without needing to repeat unchanged keys:
```js
// Layout
export const config = { runtime: 'edge', regions: 'all', foo: { bar: true } }
// Page overrides to
export const config = { regions: ['us1', 'us2'], foo: { baz: true } }
// Results in
{ runtime: 'edge', regions: ['us1', 'us2'], foo: { baz: true } }
```

Export these options from `+page.js`, `+page.server.js`, `+layout.js`, or `+layout.server.js`. Child layouts and pages override parent values.