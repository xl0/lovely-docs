## prerender

Control whether pages are rendered at build time as static HTML files.

```js
export const prerender = true;  // prerender this page
export const prerender = false; // don't prerender
export const prerender = 'auto'; // prerender if discovered, but allow dynamic SSR fallback
```

Set in root layout to prerender everything, then disable for specific pages. Routes with `prerender = true` are excluded from dynamic SSR manifests, reducing server size.

The prerenderer crawls from root following `<a>` links to discover pages. Specify additional pages via `config.kit.prerender.entries` or `entries()` function.

**Prerendering server routes**: `+server.js` files inherit prerender settings from pages that fetch from them. If a `+page.js` has `prerender = true` and calls `fetch('/my-server-route.json')`, then `src/routes/my-server-route.json/+server.js` is prerenderable unless it explicitly sets `prerender = false`.

**When not to prerender**: Pages must return identical content for all users. Pages with form actions cannot be prerendered (server must handle POST). Accessing `url.searchParams` during prerendering is forbidden—use only in browser (e.g., `onMount`). Personalized content should be fetched client-side.

**Route conflicts**: Prerendering writes files, so `src/routes/foo/+server.js` and `src/routes/foo/bar/+server.js` conflict (both try to create `foo`). Use file extensions: `src/routes/foo.json/+server.js` and `src/routes/foo/bar.json/+server.js`. Pages write to `foo/index.html` instead of `foo`.

**Troubleshooting**: "Routes marked as prerenderable but not prerendered" error means the route wasn't reached by the crawler. Fix by: adding links in `config.kit.prerender.entries`, ensuring links exist on prerendered pages, or changing to `prerender = 'auto'` for dynamic fallback.

## entries

Export an `entries()` function from dynamic routes to tell the prerenderer which parameter values to prerender:

```js
/// file: src/routes/blog/[slug]/+page.server.js
export function entries() {
	return [
		{ slug: 'hello-world' },
		{ slug: 'another-blog-post' }
	];
}

export const prerender = true;
```

Can be async to fetch from CMS/database. By default, SvelteKit prerenders all non-dynamic routes and crawls links to discover dynamic ones.

## ssr

Disable server-side rendering to render only on client:

```js
export const ssr = false;
```

Renders an empty shell page instead of full HTML. Useful for pages using browser-only globals like `document`. Not recommended in most cases. Setting in root layout makes entire app an SPA.

> If both `ssr` and `csr` are `false`, nothing renders.

## csr

Disable client-side rendering to ship no JavaScript:

```js
export const csr = false;
```

Page works with HTML/CSS only. Removes `<script>` tags, disables form progressive enhancement, uses full-page navigation for links, disables HMR.

Enable during development:
```js
import { dev } from '$app/environment';
export const csr = dev;
```

> If both `csr` and `ssr` are `false`, nothing renders.

## trailingSlash

Control trailing slash behavior: `'never'` (default), `'always'`, or `'ignore'`.

```js
export const trailingSlash = 'always';
```

Affects prerendering: `'always'` creates `about/index.html`, otherwise `about.html`. Ignoring is not recommended—relative path semantics differ (`./y` from `/x` is `/y` but from `/x/` is `/x/y`), and `/x` vs `/x/` are separate URLs (SEO issue).

## config

Adapter-specific configuration object. Top-level key-value pairs are merged (not nested levels):

```js
export const config = {
	runtime: 'edge',
	regions: 'all',
	foo: { bar: true }
};
```

Page config merges with layout config at top level only. Page `{ regions: ['us1'], foo: { baz: true } }` merged with layout above results in `{ runtime: 'edge', regions: ['us1'], foo: { baz: true } }` (nested `foo` is replaced, not merged).

## General

Export options from `+page.js`, `+page.server.js`, `+layout.js`, or `+layout.server.js`. Child layouts/pages override parent values. Can mix strategies: prerender marketing pages, SSR dynamic pages for SEO, client-only SPA for admin.

Page options evaluated statically if boolean/string literals. Otherwise, `+page.js`/`+layout.js` imported on server (build and runtime) to evaluate options—browser-only code must not run at module load, import in `+page.svelte`/`+layout.svelte` instead.

During prerendering, `building` from `$app/environment` is `true`.