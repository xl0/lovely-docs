Service workers act as proxy servers for network requests, enabling offline support and performance optimization through precaching. SvelteKit automatically bundles and registers a `src/service-worker.js` file (or `src/service-worker/index.js`).

Inside the service worker, access the `$service-worker` module for static assets, build files, prerendered pages, app version, and base path. Vite's `define` config applies to service workers.

Example service worker implementation:
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
	event.waitUntil((async () => {
		const cache = await caches.open(CACHE);
		await cache.addAll(ASSETS);
	})());
});

self.addEventListener('activate', (event) => {
	event.waitUntil((async () => {
		for (const key of await caches.keys()) {
			if (key !== CACHE) await caches.delete(key);
		}
	})());
});

self.addEventListener('fetch', (event) => {
	if (event.request.method !== 'GET') return;
	event.respondWith((async () => {
		const url = new URL(event.request.url);
		const cache = await caches.open(CACHE);
		if (ASSETS.includes(url.pathname)) {
			const response = await cache.match(url.pathname);
			if (response) return response;
		}
		try {
			const response = await fetch(event.request);
			if (response instanceof Response && response.status === 200) {
				cache.put(event.request, response.clone());
			}
			return response;
		} catch (err) {
			const response = await cache.match(event.request);
			if (response) return response;
			throw err;
		}
	})());
});
```

Disable automatic registration via configuration if you need custom logic. During development, only browsers supporting ES modules in service workers work; use `{ type: dev ? 'module' : 'classic' }` when manually registering. The `build` and `prerendered` arrays are empty during development.

Alternatives: Workbox library or Vite PWA plugin for PWA applications.