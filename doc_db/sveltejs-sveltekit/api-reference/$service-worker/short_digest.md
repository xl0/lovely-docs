The `$service-worker` module exports build-time constants for service workers: `base` (deployment base path), `build` (Vite-generated files), `files` (static assets), `prerendered` (prerendered routes), and `version` (for cache invalidation).

```js
import { base, build, files, prerendered, version } from '$service-worker';
const CACHE = `cache-${version}`;
self.addEventListener('install', e => e.waitUntil(caches.open(CACHE).then(c => c.addAll([...build, ...files]))));
```