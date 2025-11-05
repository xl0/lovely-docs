## Path resolution utilities

**asset(file)** - Resolve static file URLs with proper asset/base path prefixing
```js
import { asset } from '$app/paths';
<img src={asset('/potato.jpg')} />
```

**resolve(pathname | routeId, params?)** - Resolve pathnames with base path or populate dynamic route segments
```js
resolve(`/blog/hello-world`);
resolve('/blog/[slug]', { slug: 'hello-world' });
```

Deprecated: `assets`, `base`, `resolveRoute()`