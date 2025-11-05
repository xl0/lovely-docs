## prerender
`export const prerender = true/false/'auto'` — render pages at build time as static HTML. Prerenderer crawls links to discover pages; use `entries()` function for dynamic routes not discoverable through crawling. Pages must return identical content for all users.

## entries
```js
export function entries() {
	return [{ slug: 'hello-world' }, { slug: 'another-blog-post' }];
}
export const prerender = true;
```

## ssr
`export const ssr = false` — render only on client, skip server rendering. Useful for browser-only code.

## csr
`export const csr = false` — no JavaScript shipped, static HTML only. Disables scripts, form enhancement, and HMR.

## trailingSlash
`export const trailingSlash = 'never'/'always'/'ignore'` — control trailing slash behavior.

## config
Adapter-specific configuration. Merges at top level only:
```js
export const config = { runtime: 'edge', regions: ['us1', 'us2'] }
```

Export from `+page.js`, `+page.server.js`, `+layout.js`, or `+layout.server.js`.