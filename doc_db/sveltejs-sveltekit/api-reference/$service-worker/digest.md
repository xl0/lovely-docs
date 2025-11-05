The `$service-worker` module provides build-time constants available only within service workers.

**base** - The base path of the deployment, calculated from `location.pathname`. Equivalent to `config.kit.paths.base` but works correctly for subdirectory deployments. Note: `assets` is not available since service workers cannot be used with `config.kit.paths.assets`.

**build** - Array of URL strings for Vite-generated files suitable for caching with `cache.addAll(build)`. Empty during development.

**files** - Array of URL strings for static directory files (or custom directory via `config.kit.files.assets`). Customizable via `config.kit.serviceWorker.files`.

**prerendered** - Array of pathnames for prerendered pages and endpoints. Empty during development.

**version** - The version string from `config.kit.version`, useful for generating unique cache names to invalidate old caches on deployment.

Example usage in a service worker:
```js
import { base, build, files, prerendered, version } from '$service-worker';
const CACHE = `cache-${version}`;
self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll([...build, ...files, ...prerendered])));
});
```