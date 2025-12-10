## Setup

Disable SSR globally, use `adapter-static` with a `fallback` option (e.g., `'200.html'`):

```js
// src/routes/+layout.js
export const ssr = false;

// svelte.config.js
import adapter from '@sveltejs/adapter-static';
export default {
	kit: { adapter: adapter({ fallback: '200.html' }) }
};
```

## Prerender Specific Pages

```js
export const prerender = true;
export const ssr = true;
```

## Warnings

SPA mode has major drawbacks: multiple network round trips delay startup, harms SEO (Core Web Vitals failures), breaks without JavaScript. Prerender as many pages as possible; consider static site generation or server-side rendering adapters instead.

## Apache

Add `.htaccess` to route unmatched requests to fallback page.