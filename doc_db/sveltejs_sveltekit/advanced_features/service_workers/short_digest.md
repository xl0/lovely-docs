## Service Workers in SvelteKit

Automatically bundled from `src/service-worker.js`, service workers proxy network requests for offline support and performance via precaching.

### Access to Build Info

```js
import { build, files, version } from '$service-worker';
const CACHE = `cache-${version}`;
const ASSETS = [...build, ...files];
```

### Caching Strategy

```js
self.addEventListener('install', (event) => {
	event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(ASSETS)));
});

self.addEventListener('fetch', (event) => {
	if (event.request.method !== 'GET') return;
	event.respondWith((async () => {
		const cache = await caches.open(CACHE);
		const url = new URL(event.request.url);
		
		if (ASSETS.includes(url.pathname)) {
			return cache.match(url.pathname);
		}
		
		try {
			const response = await fetch(event.request);
			if (response instanceof Response && response.status === 200) {
				cache.put(event.request, response.clone());
			}
			return response;
		} catch {
			return cache.match(event.request);
		}
	})());
});
```

### Development

During dev, manually register with `type: dev ? 'module' : 'classic'`. Disable automatic registration via config if using custom logic.

### Caveats

Stale cached data can be worse than offline unavailability. Avoid caching large assets.