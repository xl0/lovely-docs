## Load Functions

Define `load` functions in `+page.js`/`+page.server.js` or `+layout.js`/`+layout.server.js` files. Return values are available to components via the `data` prop.

```js
// +page.js - runs on server and browser
export function load({ params }) {
	return { post: { title: `Title for ${params.slug}` } };
}

// +page.server.js - runs only on server
import * as db from '$lib/server/database';
export async function load({ params }) {
	return { post: await db.getPost(params.slug) };
}
```

## Universal vs Server Load

- **Universal** (`+page.js`, `+layout.js`): Run on server during SSR, then in browser. Can return non-serializable data (classes, components). Use for external API calls.
- **Server** (`+page.server.js`, `+layout.server.js`): Run only on server. Must return serializable data (JSON, BigInt, Date, Map, Set, RegExp). Use for database access and private environment variables.

When both exist, server load runs first and its return value becomes the `data` property of the universal load's argument.

## Data Flow

Layout load data is available to child layouts and pages. Access parent data with `await parent()`:

```js
// +layout.js
export function load() { return { a: 1 }; }

// +page.js
export async function load({ parent }) {
	const { a } = await parent();
	return { c: a + 1 };
}
```

Access page data from root layout via `page.data`:

```svelte
<script>
	import { page } from '$app/state';
</script>
<title>{page.data.title}</title>
```

## URL Data

Load functions receive `url` (URL instance), `route` (route directory name), and `params` (derived from pathname and route):

```js
export function load({ url, route, params }) {
	console.log(route.id); // '/a/[b]/[...c]'
	console.log(params.b); // 'x' from /a/x/y/z
}
```

## Fetch Requests

Use the provided `fetch` function (not native fetch) to make requests. It:
- Inherits cookies and authorization headers on server
- Allows relative URLs on server
- Inlines responses into HTML during SSR
- Reuses responses during hydration

```js
export async function load({ fetch, params }) {
	const res = await fetch(`/api/items/${params.id}`);
	return { item: await res.json() };
}
```

## Cookies

Server load functions can access and set cookies:

```js
export async function load({ cookies }) {
	const sessionid = cookies.get('sessionid');
	return { user: await db.getUser(sessionid) };
}
```

Cookies are only passed through fetch if the target host is the same domain or a subdomain.

## Headers

Both universal and server load functions can set response headers via `setHeaders()` (server-side only):

```js
export async function load({ fetch, setHeaders }) {
	const response = await fetch('https://cms.example.com/products.json');
	setHeaders({
		'cache-control': response.headers.get('cache-control')
	});
	return response.json();
}
```

## Error Handling

Throw errors using the `error` helper to specify HTTP status code:

```js
import { error } from '@sveltejs/kit';

export function load({ locals }) {
	if (!locals.user) {
		error(401, 'not logged in');
	}
}
```

## Redirects

Use the `redirect` helper with a 3xx status code:

```js
import { redirect } from '@sveltejs/kit';

export function load({ locals }) {
	if (!locals.user) {
		redirect(307, '/login');
	}
}
```

## Streaming Promises

Server load functions can return unresolved promises for non-essential data. They stream to the browser as they resolve, enabling skeleton loading states:

```js
export async function load({ params }) {
	return {
		post: await loadPost(params.slug),
		comments: loadComments(params.slug) // unresolved
	};
}
```

```svelte
{#await data.comments}
	Loading...
{:then comments}
	{#each comments as comment}
		<p>{comment.content}</p>
	{/each}
{/await}
```

## Dependency Tracking & Rerunning

Load functions rerun when:
- Referenced `params` properties change
- Referenced `url` properties change (pathname, search, searchParams)
- `await parent()` is called and parent reruns
- A dependency URL is invalidated via `invalidate(url)` or `invalidateAll()`

Exclude from tracking with `untrack()`:

```js
export async function load({ untrack, url }) {
	if (untrack(() => url.pathname === '/')) {
		return { message: 'Welcome!' };
	}
}
```

Manually trigger reruns:

```js
export async function load({ depends }) {
	depends('app:random');
	return { number: Math.random() };
}
```

```svelte
<button onclick={() => invalidate('app:random')}>Refresh</button>
```

## getRequestEvent

Access the request event in shared logic without passing it around:

```js
// src/lib/server/auth.js
import { getRequestEvent } from '$app/server';

export function requireLogin() {
	const { locals, url } = getRequestEvent();
	if (!locals.user) {
		redirect(307, '/login');
	}
	return locals.user;
}
```

Then call in any load function or form action.