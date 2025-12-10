## prerender

```js
export const prerender = true | false | 'auto';
```

Render pages at build time as static HTML. Set in layouts to apply to children. Prerenderer crawls from root following links; specify additional pages via `entries()` function or `config.kit.prerender.entries`. Pages must return identical content for all users. Cannot prerender pages with form actions or that access `url.searchParams`. Use file extensions to avoid route conflicts (`foo.json`, `foo/bar.json`).

## entries

```js
export function entries() {
	return [{ slug: 'hello-world' }, { slug: 'another-blog-post' }];
}
export const prerender = true;
```

Tell prerenderer which parameter values to prerender for dynamic routes. Can be async.

## ssr / csr

```js
export const ssr = false;  // render only on client
export const csr = false;  // no JavaScript, HTML/CSS only
```

Control where rendering happens. Both false = nothing renders.

## trailingSlash

```js
export const trailingSlash = 'never' | 'always' | 'ignore';
```

Default `'never'` removes trailing slashes. Affects prerendering output format.

## config

```js
export const config = { runtime: 'edge', regions: 'all' };
```

Adapter-specific settings. Top-level keys merge with parent layouts; nested objects replace.