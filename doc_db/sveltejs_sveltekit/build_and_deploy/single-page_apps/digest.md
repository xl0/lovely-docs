## Overview

Turn a SvelteKit app into a fully client-rendered single-page app (SPA) by specifying a fallback page that serves any URLs not handled by other means (prerendered pages, etc).

## Performance and SEO Warnings

SPA mode has significant drawbacks:
- Multiple network round trips required (HTML, JavaScript, data) before content displays
- Delays startup, especially on mobile with high latency
- Harms SEO: sites often downranked for performance, fails Core Web Vitals, excluded from search engines that don't render JS
- Makes app inaccessible if JavaScript fails or is disabled

Mitigation: prerender as many pages as possible (especially homepage). If all pages can be prerendered, use static site generation instead. Otherwise, use an adapter supporting server-side rendering.

## Basic Setup

Disable SSR for pages to serve via fallback:

```js
/// file: src/routes/+layout.js
export const ssr = false;
```

For apps without server-side logic, use `adapter-static`:

```js
/// file: svelte.config.js
import adapter from '@sveltejs/adapter-static';

const config = {
	kit: {
		adapter: adapter({
			fallback: '200.html' // host-specific, e.g., Surge uses 200.html
		})
	}
};

export default config;
```

The fallback page is an HTML file created from your page template (e.g., `app.html`) that loads your app and navigates to the correct route. Consult your host's documentation for the correct fallback filename. Avoid `index.html` to prevent conflicts with prerendering.

Note: Fallback pages always use absolute asset paths (starting with `/`) regardless of `paths.relative` configuration.

## Prerendering Individual Pages

Re-enable `ssr` and `prerender` for specific pages:

```js
/// file: src/routes/my-prerendered-page/+page.js
export const prerender = true;
export const ssr = true;
```

These pages are server-rendered during build to output static `.html` files deployable on any static host without requiring a Node server.

## Apache Configuration

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