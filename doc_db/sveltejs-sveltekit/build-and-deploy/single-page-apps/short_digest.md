## Creating an SPA

Use `adapter-static` with `fallback` option and disable SSR in root layout:

```js
export const ssr = false;
```

```js
import adapter from '@sveltejs/adapter-static';
const config = {
	kit: { adapter: adapter({ fallback: '200.html' }) }
};
```

## Prerendering specific pages

```js
export const prerender = true;
export const ssr = true;
```

## Caveats

SPA mode has poor performance impact: multiple network round trips, SEO penalties, Core Web Vitals failures, and breaks without JavaScript. Prerender as many pages as possible or use static site generation instead.