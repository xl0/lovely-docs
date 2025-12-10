## Overview

Service workers act as proxy servers handling network requests, enabling offline functionality and navigation speed improvements through precaching of built JS and CSS.

## Automatic Registration

If `src/service-worker.js` or `src/service-worker/index.js` exists, it's automatically bundled and registered. The default registration:

```js
if ('serviceWorker' in navigator) {
	addEventListener('load', function () {
		navigator.serviceWorker.register('./path/to/service-worker.js');
	});
}
```

Automatic registration can be disabled via configuration to use custom logic.

## Inside the Service Worker

Access the `$service-worker` module providing:
- `build`: paths to built app files
- `files`: paths to static assets
- `version`: app version string for unique cache names
- `base`: deployment base path
- Vite `define` config is applied to service workers

### Example: Eager Static Caching with Network Fallback

```js
/// <reference no-default-lib="true"/>
/// <reference lib="esnext" />
/// <reference lib="webworker" />
/// <reference types="@sveltejs/kit" />

import { build, files, version } from '$service-worker';

const self = /** @type {ServiceWorkerGlobalScope} */ (globalThis.self);
const CACHE = `cache-${version}`;
const ASSETS = [...build, ...files];

self.addEventListener('install', (event) => {
	event.waitUntil(
		caches.open(CACHE).then(cache => cache.addAll(ASSETS))
	);
});

self.addEventListener('activate', (event) => {
	event.waitUntil(
		caches.keys().then(keys => 
			Promise.all(keys.map(key => key !== CACHE && caches.delete(key)))
		)
	);
});

self.addEventListener('fetch', (event) => {
	if (event.request.method !== 'GET') return;

	event.respondWith((async () => {
		const url = new URL(event.request.url);
		const cache = await caches.open(CACHE);

		// Serve cached assets
		if (ASSETS.includes(url.pathname)) {
			return await cache.match(url.pathname);
		}

		// Network first, cache fallback
		try {
			const response = await fetch(event.request);
			if (response instanceof Response && response.status === 200) {
				cache.put(event.request, response.clone());
			}
			return response;
		} catch (err) {
			const cached = await cache.match(event.request);
			return cached || (() => { throw err; })();
		}
	})());
});
```

## Development

Service workers are bundled for production only. During development, only browsers supporting ES modules in service workers work. Manual registration requires:

```js
import { dev } from '$app/environment';

navigator.serviceWorker.register('/service-worker.js', {
	type: dev ? 'module' : 'classic'
});
```

Note: `build` and `prerendered` are empty arrays during development.

## Caching Considerations

- Stale cached data can be worse than unavailable data offline
- Browsers auto-clear caches when full; avoid caching large assets like videos

## Alternatives

For PWA applications, consider Workbox library or Vite PWA plugin for SvelteKit.