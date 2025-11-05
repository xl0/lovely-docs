## Load Functions

Define in `+page.js`/`+page.server.js` or `+layout.js`/`+layout.server.js`. Return values available via `data` prop.

**Universal** (`+page.js`): Run on server and browser, can return non-serializable data.
**Server** (`+page.server.js`): Run only on server, must return serializable data.

```js
// +page.server.js
export async function load({ params }) {
	return { post: await db.getPost(params.slug) };
}
```

## Data Flow

Layout data available to children. Access parent data with `await parent()`. Access page data from root layout via `page.data`.

## URL Data

Load receives `url`, `route`, `params`:

```js
export function load({ url, route, params }) {
	console.log(params.slug); // from /blog/[slug]
}
```

## Fetch

Use provided `fetch` (not native). Inherits cookies, allows relative URLs on server, inlines responses during SSR:

```js
export async function load({ fetch, params }) {
	return { item: await fetch(`/api/items/${params.id}`).then(r => r.json()) };
}
```

## Errors & Redirects

```js
import { error, redirect } from '@sveltejs/kit';

export function load({ locals }) {
	if (!locals.user) error(401, 'not logged in');
	if (!locals.user.isAdmin) redirect(307, '/login');
}
```

## Streaming Promises

Return unresolved promises for non-essential data:

```js
export async function load({ params }) {
	return {
		post: await loadPost(params.slug),
		comments: loadComments(params.slug)
	};
}
```

## Rerunning

Load reruns when `params`, `url`, or dependencies change. Manually trigger with `invalidate(url)` or `invalidateAll()`.

```js
export async function load({ depends }) {
	depends('app:random');
}
```

```svelte
<button onclick={() => invalidate('app:random')}>Refresh</button>
```