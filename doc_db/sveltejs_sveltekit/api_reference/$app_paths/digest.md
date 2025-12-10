## asset

Resolve URLs of assets in the `static` directory by prefixing with `config.kit.paths.assets` or the base path.

During server rendering, the base path is relative to the current page.

```js
import { asset } from '$app/paths';

<img alt="a potato" src={asset('/potato.jpg')} />
```

Available since 2.26.

## assets (deprecated)

Use `asset()` instead.

An absolute path matching `config.kit.paths.assets`. During `vite dev` or `vite preview`, it's replaced with `'/_svelte_kit_assets'` since assets don't yet live at their eventual URL.

Type: `'' | 'https://${string}' | 'http://${string}' | '/_svelte_kit_assets'`

## base (deprecated)

Use `resolve()` instead.

A string matching `config.kit.paths.base`.

```js
<a href="{base}/your-page">Link</a>
```

Type: `'' | '/${string}'`

## resolve

Resolve a pathname by prefixing with the base path, or resolve a route ID by populating dynamic segments with parameters.

During server rendering, the base path is relative to the current page.

```js
import { resolve } from '$app/paths';

// pathname
const resolved = resolve(`/blog/hello-world`);

// route ID with parameters
const resolved = resolve('/blog/[slug]', { slug: 'hello-world' });
```

Available since 2.26.

## resolveRoute (deprecated)

Use `resolve()` instead.

Signature: `function resolveRoute<T extends RouteId | Pathname>(...args: ResolveArgs<T>): ResolvedPathname`