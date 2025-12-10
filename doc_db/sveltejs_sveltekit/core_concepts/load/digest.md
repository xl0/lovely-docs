## Page data

`+page.svelte` can have a sibling `+page.js` exporting a `load` function. Return value is available via `data` prop:

```js
// src/routes/blog/[slug]/+page.js
export function load({ params }) {
	return {
		post: {
			title: `Title for ${params.slug}`,
			content: `Content for ${params.slug}`
		}
	};
}
```

```svelte
<!-- src/routes/blog/[slug]/+page.svelte -->
<script>
	let { data } = $props();
</script>
<h1>{data.post.title}</h1>
<div>{@html data.post.content}</div>
```

`+page.js` runs on server and browser. For server-only (private env vars, database access), use `+page.server.js` with `PageServerLoad` type.

## Layout data

`+layout.svelte` can load data via `+layout.js` or `+layout.server.js`. Data is available to the layout, child layouts, and the page:

```js
// src/routes/blog/[slug]/+layout.server.js
export async function load() {
	return { posts: await db.getPostSummaries() };
}
```

```svelte
<!-- src/routes/blog/[slug]/+layout.svelte -->
<script>
	let { data, children } = $props();
</script>
<main>{@render children()}</main>
<aside>
	<h2>More posts</h2>
	<ul>
		{#each data.posts as post}
			<li><a href="/blog/{post.slug}">{post.title}</a></li>
		{/each}
	</ul>
</aside>
```

Data from parent layouts is merged into child data. If multiple load functions return the same key, the last one wins.

## page.data

Parent layouts can access page data via `page.data` from `$app/state`:

```svelte
<!-- src/routes/+layout.svelte -->
<script>
	import { page } from '$app/state';
</script>
<svelte:head>
	<title>{page.data.title}</title>
</svelte:head>
```

Type info provided by `App.PageData`.

## Universal vs server

**Universal load** (`+page.js`, `+layout.js`):
- Run on server during SSR, then in browser
- Can return any values (classes, components)
- Use for fetching from external APIs without private credentials

**Server load** (`+page.server.js`, `+layout.server.js`):
- Always run on server only
- Must return serializable data (JSON, BigInt, Date, Map, Set, RegExp, promises)
- Use for database/filesystem access, private env vars

When both exist, server load return value is passed to universal load as `data` property:

```js
// +page.server.js
export async function load() {
	return { serverMessage: 'hello from server' };
}

// +page.js
export async function load({ data }) {
	return {
		serverMessage: data.serverMessage,
		universalMessage: 'hello from universal'
	};
}
```

## URL data

Load functions receive:

**url**: Instance of `URL` with `origin`, `hostname`, `pathname`, `searchParams`. `url.hash` unavailable on server.

**route**: Route directory name relative to `src/routes`:
```js
// src/routes/a/[b]/[...c]/+page.js
export function load({ route }) {
	console.log(route.id); // '/a/[b]/[...c]'
}
```

**params**: Derived from `url.pathname` and `route.id`. For route `/a/[b]/[...c]` and pathname `/a/x/y/z`:
```json
{ "b": "x", "c": "y/z" }
```

## Making fetch requests

Use provided `fetch` function (not native fetch):
- Makes credentialed requests on server (inherits cookies/auth headers)
- Makes relative requests on server
- Internal requests to `+server.js` go directly without HTTP overhead
- Response captured and inlined during SSR
- Response reused during hydration (prevents duplicate requests)

```js
// src/routes/items/[id]/+page.js
export async function load({ fetch, params }) {
	const res = await fetch(`/api/items/${params.id}`);
	return { item: await res.json() };
}
```

Cookies passed through `fetch` only if target host is same as app or more specific subdomain (e.g., `my.domain.com` receives cookies for `my.domain.com` and `sub.my.domain.com`, but not `domain.com` or `api.domain.com`).

## Headers

Both universal and server load functions have `setHeaders` function (only works on server):

```js
export async function load({ fetch, setHeaders }) {
	const response = await fetch('https://cms.example.com/products.json');
	setHeaders({
		age: response.headers.get('age'),
		'cache-control': response.headers.get('cache-control')
	});
	return response.json();
}
```

Can only set each header once. Use `cookies.set()` for `set-cookie` instead.

## Using parent data

Access parent load data with `await parent()`:

```js
// src/routes/+layout.js
export function load() {
	return { a: 1 };
}

// src/routes/abc/+layout.js
export async function load({ parent }) {
	const { a } = await parent();
	return { b: a + 1 };
}

// src/routes/abc/+page.js
export async function load({ parent }) {
	const { a, b } = await parent();
	return { c: a + b };
}
```

In `+page.server.js`/`+layout.server.js`, `parent` returns data from parent server layouts. In `+page.js`/`+layout.js`, returns data from parent universal layouts (missing `+layout.js` treated as passthrough).

Avoid waterfalls: call non-dependent operations before `await parent()`:

```js
export async function load({ params, parent }) {
	const data = await getData(params); // doesn't depend on parent
	const parentData = await parent();
	return { ...data, meta: { ...parentData.meta, ...data.meta } };
}
```

## Errors

Throw errors in load functions to render nearest `+error.svelte`. Use `error` helper for expected errors:

```js
import { error } from '@sveltejs/kit';

export function load({ locals }) {
	if (!locals.user) {
		error(401, 'not logged in');
	}
	if (!locals.user.isAdmin) {
		error(403, 'not an admin');
	}
}
```

Unexpected errors invoke `handleError` hook and treated as 500.

## Redirects

Use `redirect` helper to redirect users:

```js
import { redirect } from '@sveltejs/kit';

export function load({ locals }) {
	if (!locals.user) {
		redirect(307, '/login');
	}
}
```

Don't use inside `try` block. In browser, use `goto` from `$app/navigation` outside load functions.

## Streaming with promises

Server load functions stream promises to browser as they resolve. Useful for slow non-essential data:

```js
// src/routes/blog/[slug]/+page.server.js
export async function load({ params }) {
	return {
		comments: loadComments(params.slug), // not awaited
		post: await loadPost(params.slug)
	};
}
```

```svelte
<!-- src/routes/blog/[slug]/+page.svelte -->
<script>
	let { data } = $props();
</script>
<h1>{data.post.title}</h1>
<div>{@html data.post.content}</div>

{#await data.comments}
	Loading comments...
{:then comments}
	{#each comments as comment}
		<p>{comment.content}</p>
	{/each}
{:catch error}
	<p>error: {error.message}</p>
{/await}
```

Attach noop-catch to unhandled promises to prevent crashes:
```js
const ok = Promise.reject();
ok.catch(() => {});
return { ok };
```

Streaming only works with JavaScript enabled. Headers/status cannot change after streaming starts.

## Parallel loading

All load functions run concurrently during rendering/navigation. Multiple server load results grouped into single response. Page renders once all complete.

## Rerunning load functions

SvelteKit tracks dependencies to avoid unnecessary reruns. Load function reruns when:
- Referenced `params` property changes
- Referenced `url` property changes (pathname, search, searchParams)
- Calls `await parent()` and parent reruns
- Declared dependency via `fetch(url)` or `depends(url)` and URL invalidated
- `invalidateAll()` called

Search parameters tracked independently: accessing `url.searchParams.get("x")` reruns on `?x=1` to `?x=2` but not `?x=1&y=1` to `?x=1&y=2`.

### Untracking dependencies

Exclude from tracking with `untrack`:

```js
export async function load({ untrack, url }) {
	if (untrack(() => url.pathname === '/')) {
		return { message: 'Welcome!' };
	}
}
```

### Manual invalidation

Rerun load functions with `invalidate(url)` (reruns dependent functions) or `invalidateAll()` (reruns all):

```js
// +page.js
export async function load({ fetch, depends }) {
	const response = await fetch('https://api.example.com/random-number');
	depends('app:random');
	return { number: await response.json() };
}
```

```svelte
<!-- +page.svelte -->
<script>
	import { invalidate, invalidateAll } from '$app/navigation';
	let { data } = $props();

	function rerunLoadFunction() {
		invalidate('app:random');
		invalidate('https://api.example.com/random-number');
		invalidate(url => url.href.includes('random-number'));
		invalidateAll();
	}
</script>
<p>random number: {data.number}</p>
<button onclick={rerunLoadFunction}>Update</button>
```

Rerunning updates `data` prop but doesn't recreate component (internal state preserved). Use `afterNavigate` callback or `{#key}` block to reset state if needed.

## Authentication implications

- Layout load functions don't run on every request (e.g., client-side navigation between child routes)
- Layout and page load functions run concurrently unless `await parent()` called
- If layout load throws, page load still runs but client doesn't receive data

Strategies:
- Use hooks to protect routes before any load functions run
- Use auth guards in `+page.server.js` for route-specific protection
- Auth in `+layout.server.js` requires all child pages to `await parent()`

## getRequestEvent

Retrieve `event` object in server load functions with `getRequestEvent()` from `$app/server`. Allows shared logic to access request info:

```js
// src/lib/server/auth.js
import { redirect } from '@sveltejs/kit';
import { getRequestEvent } from '$app/server';

export function requireLogin() {
	const { locals, url } = getRequestEvent();
	if (!locals.user) {
		const redirectTo = url.pathname + url.search;
		redirect(307, `/login?redirectTo=${redirectTo}`);
	}
	return locals.user;
}
```

```js
// +page.server.js
import { requireLogin } from '$lib/server/auth';

export function load() {
	const user = requireLogin();
	return { message: `hello ${user.name}!` };
}
```