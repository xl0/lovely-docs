## Creating an SPA

Disable SSR in your root layout to serve all pages via a fallback page:

```js
/// file: src/routes/+layout.js
export const ssr = false;
```

Use `adapter-static` with the `fallback` option to generate your SPA:

```js
/// file: svelte.config.js
import adapter from '@sveltejs/adapter-static';

const config = {
	kit: {
		adapter: adapter({
			fallback: '200.html'
		})
	}
};

export default config;
```

The fallback page is an HTML file that loads your app and navigates to the correct route. The specific filename depends on your host (e.g., `200.html` for Surge).

## Prerendering specific pages

Re-enable SSR and add `prerender` for pages you want prerendered:

```js
/// file: src/routes/my-prerendered-page/+page.js
export const prerender = true;
export const ssr = true;
```

## Performance considerations

SPA mode has significant drawbacks: multiple network round trips delay startup, harms SEO through performance penalties and Core Web Vitals failures, and breaks for users without JavaScript. Prerender as many pages as possible, especially your homepage. If you can prerender all pages, use static site generation instead. Otherwise, use an adapter with server-side rendering support.

## Apache configuration

Add `static/.htaccess` to route requests to the fallback page:

```
<IfModule mod_rewrite.c>
	RewriteEngine On
	RewriteBase /
	RewriteRule ^200\.html$ - [L]
	RewriteCond %{REQUEST_FILENAME} !-f
	RewriteCond %{REQUEST_FILENAME} !-d
	RewriteRule . /200.html [L]
</IfModule>
```

Note: The fallback page always uses absolute asset paths regardless of the `paths.relative` configuration.