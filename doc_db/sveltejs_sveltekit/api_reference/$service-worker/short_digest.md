## $service-worker Module

Available only in service workers. Exports:
- `base`: deployment base path from `location.pathname`
- `build`: Vite-generated files for caching (empty in dev)
- `files`: static directory files
- `prerendered`: prerendered page/endpoint pathnames (empty in dev)
- `version`: from config, for unique cache names

```js
import { base, build, files, prerendered, version } from '$service-worker';
caches.open(`cache-${version}`).then(cache => cache.addAll([...build, ...files]));
```