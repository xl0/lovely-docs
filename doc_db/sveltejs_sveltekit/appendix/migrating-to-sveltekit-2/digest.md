## Breaking Changes in SvelteKit 2

### `redirect` and `error` no longer require throwing
Previously you had to `throw error(...)` and `throw redirect(...)`. Now just call them directly:
```js
// Before
throw error(500, 'something went wrong');
// After
error(500, 'something went wrong');
```
Use `isHttpError` and `isRedirect` from `@sveltejs/kit` to distinguish them from unexpected errors in try blocks.

### `path` is required when setting cookies
Browsers set cookie path to the parent resource if not specified. Now you must explicitly set `path`:
```js
cookies.set(name, value, { path: '/' });
cookies.delete(name, { path: '/' });
cookies.serialize(name, value, { path: '/' });
```
Use `path: '/'` for domain-wide cookies, `''` for current path, `'.'` for current directory.

### Top-level promises are no longer awaited
In v1, top-level promise properties in load function returns were auto-awaited. Now you must explicitly await:
```js
// Single promise
export async function load({ fetch }) {
	const response = await fetch(url).then(r => r.json());
	return { response };
}

// Multiple promises - use Promise.all to avoid waterfalls
export async function load({ fetch }) {
	const [a, b] = await Promise.all([
		fetch(url1).then(r => r.json()),
		fetch(url2).then(r => r.json()),
	]);
	return { a, b };
}
```

### `goto(...)` changes
- No longer accepts external URLs; use `window.location.href = url` instead
- `state` object now determines `$page.state` and must adhere to `App.PageState` interface

### Paths are now relative by default
`paths.relative` now defaults to `true` (was inconsistent in v1). This makes apps more portable when base path is unknown or different at runtime (e.g., Internet Archive, IPFS).

### Server fetches are not trackable anymore
Removed `dangerZone.trackServerFetches` setting due to security risk (private URLs leaking).

### `preloadCode` arguments must be prefixed with `base`
Both `preloadCode` and `preloadData` now require paths prefixed with `base` if set. Additionally, `preloadCode` now takes a single argument instead of multiple.

### `resolvePath` replaced with `resolveRoute`
```js
// Before
import { resolvePath } from '@sveltejs/kit';
import { base } from '$app/paths';
const path = base + resolvePath('/blog/[slug]', { slug });

// After
import { resolveRoute } from '$app/paths';
const path = resolveRoute('/blog/[slug]', { slug });
```

### Improved error handling
`handleError` hooks now receive `status` and `message` properties. For errors from your code, status is `500` and message is `Internal Error`. The `message` property is safe to expose to users (unlike `error.message` which may contain sensitive info).

### Dynamic environment variables cannot be used during prerendering
Use `$env/static/public` and `$env/static/private` during prerendering instead of `$env/dynamic/*`. SvelteKit will request updated dynamic values from `/_app/env.js` when landing on prerendered pages.

### `form` and `data` removed from `use:enhance` callbacks
These were deprecated in favor of `formElement` and `formData`, now removed entirely.

### Forms with file inputs must use `multipart/form-data`
SvelteKit 2 throws an error if a form with `<input type="file">` lacks `enctype="multipart/form-data"` during `use:enhance` submission.

### Generated `tsconfig.json` is more strict
Validation now warns against using `paths` or `baseUrl` in `tsconfig.json`. Use the `alias` config option in `svelte.config.js` instead.

### `getRequest` no longer throws errors
In `@sveltejs/kit/node`, `getRequest` no longer throws on `Content-Length` header exceeding size limit; error is deferred until request body is read.

### `vitePreprocess` no longer exported from `@sveltejs/kit/vite`
Import directly from `@sveltejs/vite-plugin-svelte` instead.

### Updated dependency requirements
- Node `18.13+`
- `svelte@4`
- `vite@5`
- `typescript@5`
- `@sveltejs/vite-plugin-svelte@3` (now peerDependency)
- Adapter versions: cloudflare@3, cloudflare-workers@2, netlify@3, node@2, static@3, vercel@4

Generated `tsconfig.json` now uses `"moduleResolution": "bundler"` and `verbatimModuleSyntax` (replaces `importsNotUsedAsValues` and `preserveValueImports`).

### SvelteKit 2.12: `$app/stores` deprecated
`$app/state` (based on Svelte 5 runes) replaces `$app/stores` with finer-grained reactivity. Migrate by replacing imports and removing `$` prefixes:
```svelte
// Before
import { page } from '$app/stores';
{$page.data}

// After
import { page } from '$app/state';
{page.data}
```
Use `npx sv migrate app-state` for auto-migration in `.svelte` components.