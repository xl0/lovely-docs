## asset (2.26+)

Resolve static directory asset URLs with base path or configured assets path prefix.

```js
import { asset } from '$app/paths';
<img src={asset('/potato.jpg')} />
```

## resolve (2.26+)

Resolve pathnames with base path prefix, or route IDs with dynamic segment parameters.

```js
import { resolve } from '$app/paths';
resolve(`/blog/hello-world`);
resolve('/blog/[slug]', { slug: 'hello-world' });
```

## Deprecated

- `assets`: Use `asset()` instead
- `base`: Use `resolve()` instead  
- `resolveRoute`: Use `resolve()` instead