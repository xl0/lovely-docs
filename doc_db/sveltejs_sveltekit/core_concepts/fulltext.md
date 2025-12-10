

## Pages

### routing
Filesystem-based routing with `src/routes` directory; route files use `+` prefix (+page.svelte, +page.js, +page.server.js, +layout.svelte, +layout.js, +layout.server.js, +error.svelte, +server.js); load functions provide data to components; +server.js exports HTTP handlers for APIs; $types provides auto-generated type safety.

# Routing

SvelteKit uses a filesystem-based router where routes are defined by directory structure in `src/routes`:
- `src/routes` is the root route
- `src/routes/about` creates `/about`
- `src/routes/blog/[slug]` creates a parameterized route

Route directories contain files with `+` prefix. Key rules:
- All files can run on the server
- All files run on the client except `+server` files
- `+layout` and `+error` files apply to subdirectories and their own directory

## +page.svelte and +page.js

`+page.svelte` defines a page component, rendered on server (SSR) initially and in browser (CSR) for navigation. Pages receive data via `data` prop from `load` functions.

```svelte
<!--- +page.svelte --->
<script>
	let { data } = $props();
</script>
<h1>{data.title}</h1>
```

`+page.js` exports a `load` function that runs on server during SSR and in browser during navigation:

```js
export function load({ params }) {
	if (params.slug === 'hello-world') {
		return { title: 'Hello world!', content: 'Welcome...' };
	}
	error(404, 'Not found');
}
```

`+page.js` can also export page options: `prerender`, `ssr`, `csr`.

## +page.server.js

For server-only load functions (database access, private environment variables), use `+page.server.js` with `PageServerLoad` type. Data is serialized via devalue for client-side navigation.

```js
export async function load({ params }) {
	const post = await getPostFromDatabase(params.slug);
	if (post) return post;
	error(404, 'Not found');
}
```

`+page.server.js` can also export `actions` for form submissions using `<form>` elements.

## +error.svelte

Customize error pages per-route with `+error.svelte`:

```svelte
<script>
	import { page } from '$app/state';
</script>
<h1>{page.status}: {page.error.message}</h1>
```

SvelteKit walks up the tree to find the closest error boundary. If none exists, renders default error page. If error occurs in root `+layout` load, renders static fallback (`src/error.html`). 404s use `src/routes/+error.svelte` or default.

Note: `+error.svelte` is not used for errors in `handle` hook or `+server.js` handlers.

## +layout.svelte and +layout.js

Layouts apply to every page in their directory and subdirectories. Default layout:

```svelte
<script>
	let { children } = $props();
</script>
{@render children()}
```

Custom layout with navigation:

```svelte
<script>
	let { children } = $props();
</script>
<nav>
	<a href="/">Home</a>
	<a href="/about">About</a>
</nav>
{@render children()}
```

Layouts can be nested. Child layouts inherit parent layouts.

`+layout.js` exports a `load` function providing data to the layout and all child pages:

```js
export function load() {
	return {
		sections: [
			{ slug: 'profile', title: 'Profile' },
			{ slug: 'notifications', title: 'Notifications' }
		]
	};
}
```

Child pages access layout data:

```svelte
<script>
	let { data } = $props();
	console.log(data.sections); // from parent layout
</script>
```

`+layout.js` can export page options (`prerender`, `ssr`, `csr`) as defaults for child pages. SvelteKit intelligently reruns load functions only when necessary.

## +layout.server.js

For server-only layout load functions, use `+layout.server.js` with `LayoutServerLoad` type. Can export page options like `+layout.js`.

## +server.js

API routes defined with `+server.js` export HTTP verb handlers (`GET`, `POST`, `PATCH`, `PUT`, `DELETE`, `OPTIONS`, `HEAD`) taking `RequestEvent` and returning `Response`:

```js
export function GET({ url }) {
	const min = Number(url.searchParams.get('min') ?? '0');
	const max = Number(url.searchParams.get('max') ?? '1');
	const d = max - min;
	if (isNaN(d) || d < 0) {
		error(400, 'min and max must be numbers, and min must be less than max');
	}
	return new Response(String(min + Math.random() * d));
}
```

Response first argument can be `ReadableStream` for streaming large data or server-sent events.

Use `error()`, `redirect()`, `json()` from `@sveltejs/kit` for convenience. Errors return JSON or fallback error page (customizable via `src/error.html`) based on `Accept` header. `+error.svelte` is not rendered for `+server.js` errors.

### Receiving data

`+server.js` can handle `POST`/`PUT`/`PATCH`/`DELETE`/`OPTIONS`/`HEAD` for complete APIs:

```svelte
<!--- +page.svelte --->
<script>
	let a = $state(0), b = $state(0), total = $state(0);
	async function add() {
		const response = await fetch('/api/add', {
			method: 'POST',
			body: JSON.stringify({ a, b }),
			headers: { 'content-type': 'application/json' }
		});
		total = await response.json();
	}
</script>
<input type="number" bind:value={a}> +
<input type="number" bind:value={b}> = {total}
<button onclick={add}>Calculate</button>
```

```js
/// +server.js
export async function POST({ request }) {
	const { a, b } = await request.json();
	return json(a + b);
}
```

Form actions are preferred for browser-to-server data submission.

If `GET` handler exists, `HEAD` request returns `content-length` of GET response body.

### Fallback method handler

Export `fallback` handler to match unhandled HTTP methods:

```js
export async function POST({ request }) {
	const { a, b } = await request.json();
	return json(a + b);
}

export async function fallback({ request }) {
	return text(`I caught your ${request.method} request!`);
}
```

For `HEAD` requests, `GET` handler takes precedence over `fallback`.

### Content negotiation

`+server.js` can coexist with `+page` files in same directory:
- `PUT`/`PATCH`/`DELETE`/`OPTIONS` always handled by `+server.js`
- `GET`/`POST`/`HEAD` treated as page requests if `accept` header prioritizes `text/html`, else handled by `+server.js`
- `GET` responses include `Vary: Accept` header for separate caching

## $types

SvelteKit generates `$types.d.ts` for type safety. Annotate components with `PageProps` or `LayoutProps` to type the `data` prop:

```svelte
<script>
	let { data } = $props();
</script>
```

Annotate load functions with `PageLoad`, `PageServerLoad`, `LayoutLoad`, or `LayoutServerLoad` to type `params` and return values.

VS Code and IDEs with TypeScript plugins can omit these types entirely—Svelte's IDE tooling inserts correct types automatically.

## Other files

Files in route directories without `+` prefix are ignored, allowing colocating components and utilities with routes. For multi-route usage, place in `$lib`.

### load
Load functions in +page.js/+page.server.js and +layout.js/+layout.server.js return data to components; universal loads run server+browser, server loads run server-only with serializable data; dependency tracking reruns on params/url changes or manual invalidation; streaming promises, parent data access, error/redirect handling, and authentication patterns.

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

### form_actions
Export `actions` from `+page.server.js` to handle form POST requests; supports default/named actions, validation errors via `fail()`, redirects, and progressive enhancement with `use:enhance` or manual fetch+`deserialize`+`applyAction`.

## Form actions

Export `actions` from `+page.server.js` to handle `POST` requests from `<form>` elements. Client-side JavaScript is optional; forms work without it.

### Default actions

```js
// src/routes/login/+page.server.js
export const actions = {
	default: async (event) => {
		// handle POST
	}
};
```

```svelte
<!-- Invokes default action on /login -->
<form method="POST">
	<input name="email" type="email">
	<input name="password" type="password">
	<button>Log in</button>
</form>

<!-- Invoke from another page -->
<form method="POST" action="/login">
	<!-- content -->
</form>
```

### Named actions

Multiple actions per page:

```js
export const actions = {
	login: async (event) => { /* ... */ },
	register: async (event) => { /* ... */ }
};
```

Invoke with query parameter:
```svelte
<form method="POST" action="?/register">
	<!-- content -->
</form>

<!-- From another page -->
<form method="POST" action="/login?/register">
	<!-- content -->
</form>

<!-- Use formaction on button -->
<form method="POST" action="?/login">
	<button>Log in</button>
	<button formaction="?/register">Register</button>
</form>
```

> Cannot mix default and named actions on same page (query parameter would persist in URL).

### Anatomy of an action

Actions receive `RequestEvent`. Read form data with `request.formData()`. Return data available as `form` prop on page and `page.form` app-wide until next update.

```js
import * as db from '$lib/server/db';

export async function load({ cookies }) {
	const user = await db.getUserFromSession(cookies.get('sessionid'));
	return { user };
}

export const actions = {
	login: async ({ cookies, request }) => {
		const data = await request.formData();
		const email = data.get('email');
		const password = data.get('password');

		const user = await db.getUser(email);
		cookies.set('sessionid', await db.createSession(user), { path: '/' });

		return { success: true };
	}
};
```

```svelte
<script>
	let { data, form } = $props();
</script>

{#if form?.success}
	<p>Successfully logged in! Welcome back, {data.user.name}</p>
{/if}
```

### Validation errors

Use `fail(status, data)` to return HTTP status code (typically 400 or 422) with validation errors. Status available via `page.status`, data via `form`:

```js
import { fail } from '@sveltejs/kit';

export const actions = {
	login: async ({ cookies, request }) => {
		const data = await request.formData();
		const email = data.get('email');
		const password = data.get('password');

		if (!email) {
			return fail(400, { email, missing: true });
		}

		const user = await db.getUser(email);

		if (!user || user.password !== db.hash(password)) {
			return fail(400, { email, incorrect: true });
		}

		cookies.set('sessionid', await db.createSession(user), { path: '/' });
		return { success: true };
	}
};
```

```svelte
<form method="POST" action="?/login">
	{#if form?.missing}<p class="error">The email field is required</p>{/if}
	{#if form?.incorrect}<p class="error">Invalid credentials!</p>{/if}
	<label>
		Email
		<input name="email" type="email" value={form?.email ?? ''}>
	</label>
	<label>
		Password
		<input name="password" type="password">
	</label>
	<button>Log in</button>
	<button formaction="?/register">Register</button>
</form>
```

Returned data must be JSON-serializable. Structure is up to you; use `id` property to distinguish multiple forms.

### Redirects

Use `redirect(status, location)` to redirect after action:

```js
import { fail, redirect } from '@sveltejs/kit';

export const actions = {
	login: async ({ cookies, request, url }) => {
		const data = await request.formData();
		const email = data.get('email');
		const password = data.get('password');

		const user = await db.getUser(email);
		if (!user) {
			return fail(400, { email, missing: true });
		}

		if (user.password !== db.hash(password)) {
			return fail(400, { email, incorrect: true });
		}

		cookies.set('sessionid', await db.createSession(user), { path: '/' });

		if (url.searchParams.has('redirectTo')) {
			redirect(303, url.searchParams.get('redirectTo'));
		}

		return { success: true };
	}
};
```

## Loading data

After action runs, page re-renders (unless redirect/error) with action's return value as `form` prop. Page's `load` functions run after action completes.

`handle` runs before action and doesn't rerun before `load` functions. If using `handle` to populate `event.locals` from cookie, update `event.locals` when setting/deleting cookie in action:

```js
// src/hooks.server.js
export async function handle({ event, resolve }) {
	event.locals.user = await getUser(event.cookies.get('sessionid'));
	return resolve(event);
}
```

```js
// src/routes/account/+page.server.js
export function load(event) {
	return { user: event.locals.user };
}

export const actions = {
	logout: async (event) => {
		event.cookies.delete('sessionid', { path: '/' });
		event.locals.user = null;
	}
};
```

## Progressive enhancement

### use:enhance

Add `use:enhance` action to progressively enhance form without full-page reload:

```svelte
<script>
	import { enhance } from '$app/forms';
	let { form } = $props();
</script>

<form method="POST" use:enhance>
	<!-- content -->
</form>
```

> `use:enhance` requires `method="POST"` and actions in `+page.server.js`. Won't work with `method="GET"` or `+server.js` endpoints.

Without arguments, `use:enhance`:
- Updates `form`, `page.form`, `page.status` on success/invalid response (only if action on same page)
- Resets `<form>` element
- Invalidates all data on success
- Calls `goto` on redirect
- Renders nearest `+error` boundary on error
- Resets focus

### Customising use:enhance

Provide `SubmitFunction` to customize behavior:

```svelte
<form
	method="POST"
	use:enhance={({ formElement, formData, action, cancel, submitter }) => {
		// formElement: this <form>
		// formData: FormData object being submitted
		// action: URL form posts to
		// cancel(): prevent submission
		// submitter: HTMLElement that caused submission

		return async ({ result, update }) => {
			// result: ActionResult object
			// update: triggers default post-submission logic
		};
	}}
>
```

Override default behavior by returning callback. Call `update` to restore defaults, or use `applyAction`:

```svelte
<script>
	import { enhance, applyAction } from '$app/forms';
	let { form } = $props();
</script>

<form
	method="POST"
	use:enhance={({ formElement, formData, action, cancel }) => {
		return async ({ result }) => {
			if (result.type === 'redirect') {
				goto(result.location);
			} else {
				await applyAction(result);
			}
		};
	}}
>
```

`applyAction(result)` behavior by `result.type`:
- `success`, `failure`: sets `page.status` to `result.status`, updates `form` and `page.form` to `result.data` (works regardless of submission origin)
- `redirect`: calls `goto(result.location, { invalidateAll: true })`
- `error`: renders nearest `+error` boundary with `result.error`

All cases reset focus.

### Custom event listener

Implement progressive enhancement manually:

```svelte
<script>
	import { invalidateAll, goto } from '$app/navigation';
	import { applyAction, deserialize } from '$app/forms';

	let { form } = $props();

	async function handleSubmit(event) {
		event.preventDefault();
		const data = new FormData(event.currentTarget, event.submitter);

		const response = await fetch(event.currentTarget.action, {
			method: 'POST',
			body: data
		});

		const result = deserialize(await response.text());

		if (result.type === 'success') {
			await invalidateAll();
		}

		applyAction(result);
	}
</script>

<form method="POST" onsubmit={handleSubmit}>
	<!-- content -->
</form>
```

Must `deserialize` response (not `JSON.parse`) because actions support `Date` and `BigInt`.

To `POST` to `+page.server.js` action when `+server.js` exists alongside, use header:

```js
const response = await fetch(this.action, {
	method: 'POST',
	body: data,
	headers: {
		'x-sveltekit-action': 'true'
	}
});
```

## Alternatives

Form actions are preferred (progressively enhanced), but can also use `+server.js` for JSON API:

```svelte
<script>
	function rerun() {
		fetch('/api/ci', { method: 'POST' });
	}
</script>

<button onclick={rerun}>Rerun CI</button>
```

```js
// src/routes/api/ci/+server.js
export function POST() {
	// do something
}
```

## GET vs POST

Use `method="POST"` to invoke form actions. For forms that don't POST (e.g., search), use `method="GET"` or no method. SvelteKit treats them like `<a>` elements, using client-side router without full page navigation:

```html
<form action="/search">
	<label>
		Search
		<input name="q">
	</label>
</form>
```

Submitting navigates to `/search?q=...`, invokes load function, but not action. Supports `data-sveltekit-reload`, `data-sveltekit-replacestate`, `data-sveltekit-keepfocus`, `data-sveltekit-noscroll` attributes.

### page-options
Page-level options to control rendering strategy (prerender, SSR, CSR), trailing slashes, and adapter-specific config; can be set per-page or inherited from layouts.

## prerender

Control whether pages are rendered at build time as static HTML files.

```js
export const prerender = true;  // prerender this page
export const prerender = false; // don't prerender
export const prerender = 'auto'; // prerender if discovered, but allow dynamic SSR fallback
```

Set in root layout to prerender everything, then disable for specific pages. Routes with `prerender = true` are excluded from dynamic SSR manifests, reducing server size.

The prerenderer crawls from root following `<a>` links to discover pages. Specify additional pages via `config.kit.prerender.entries` or `entries()` function.

**Prerendering server routes**: `+server.js` files inherit prerender settings from pages that fetch from them. If a `+page.js` has `prerender = true` and calls `fetch('/my-server-route.json')`, then `src/routes/my-server-route.json/+server.js` is prerenderable unless it explicitly sets `prerender = false`.

**When not to prerender**: Pages must return identical content for all users. Pages with form actions cannot be prerendered (server must handle POST). Accessing `url.searchParams` during prerendering is forbidden—use only in browser (e.g., `onMount`). Personalized content should be fetched client-side.

**Route conflicts**: Prerendering writes files, so `src/routes/foo/+server.js` and `src/routes/foo/bar/+server.js` conflict (both try to create `foo`). Use file extensions: `src/routes/foo.json/+server.js` and `src/routes/foo/bar.json/+server.js`. Pages write to `foo/index.html` instead of `foo`.

**Troubleshooting**: "Routes marked as prerenderable but not prerendered" error means the route wasn't reached by the crawler. Fix by: adding links in `config.kit.prerender.entries`, ensuring links exist on prerendered pages, or changing to `prerender = 'auto'` for dynamic fallback.

## entries

Export an `entries()` function from dynamic routes to tell the prerenderer which parameter values to prerender:

```js
/// file: src/routes/blog/[slug]/+page.server.js
export function entries() {
	return [
		{ slug: 'hello-world' },
		{ slug: 'another-blog-post' }
	];
}

export const prerender = true;
```

Can be async to fetch from CMS/database. By default, SvelteKit prerenders all non-dynamic routes and crawls links to discover dynamic ones.

## ssr

Disable server-side rendering to render only on client:

```js
export const ssr = false;
```

Renders an empty shell page instead of full HTML. Useful for pages using browser-only globals like `document`. Not recommended in most cases. Setting in root layout makes entire app an SPA.

> If both `ssr` and `csr` are `false`, nothing renders.

## csr

Disable client-side rendering to ship no JavaScript:

```js
export const csr = false;
```

Page works with HTML/CSS only. Removes `<script>` tags, disables form progressive enhancement, uses full-page navigation for links, disables HMR.

Enable during development:
```js
import { dev } from '$app/environment';
export const csr = dev;
```

> If both `csr` and `ssr` are `false`, nothing renders.

## trailingSlash

Control trailing slash behavior: `'never'` (default), `'always'`, or `'ignore'`.

```js
export const trailingSlash = 'always';
```

Affects prerendering: `'always'` creates `about/index.html`, otherwise `about.html`. Ignoring is not recommended—relative path semantics differ (`./y` from `/x` is `/y` but from `/x/` is `/x/y`), and `/x` vs `/x/` are separate URLs (SEO issue).

## config

Adapter-specific configuration object. Top-level key-value pairs are merged (not nested levels):

```js
export const config = {
	runtime: 'edge',
	regions: 'all',
	foo: { bar: true }
};
```

Page config merges with layout config at top level only. Page `{ regions: ['us1'], foo: { baz: true } }` merged with layout above results in `{ runtime: 'edge', regions: ['us1'], foo: { baz: true } }` (nested `foo` is replaced, not merged).

## General

Export options from `+page.js`, `+page.server.js`, `+layout.js`, or `+layout.server.js`. Child layouts/pages override parent values. Can mix strategies: prerender marketing pages, SSR dynamic pages for SEO, client-only SPA for admin.

Page options evaluated statically if boolean/string literals. Otherwise, `+page.js`/`+layout.js` imported on server (build and runtime) to evaluate options—browser-only code must not run at module load, import in `+page.svelte`/`+layout.svelte` instead.

During prerendering, `building` from `$app/environment` is `true`.

### state-management
Avoid shared server state; use pure load functions; manage state with context API, URL parameters, or snapshots; use $derived for reactive component values.

## Avoid shared state on the server

Servers are stateless and shared by multiple users. Never store data in shared variables that persist across requests, as one user's data will be visible to others.

```js
// ❌ WRONG - shared across all users
let user;
export function load() {
	return { user };
}
export const actions = {
	default: async ({ request }) => {
		user = { name: data.get('name'), secret: data.get('secret') };
	}
}
```

Instead, authenticate users with cookies and persist data to a database.

## No side-effects in load functions

Load functions must be pure. Don't write to stores or global state inside load functions, as this creates shared state across all users.

```js
// ❌ WRONG - modifies shared store
import { user } from '$lib/user';
export async function load({ fetch }) {
	const response = await fetch('/api/user');
	user.set(await response.json()); // shared across all users!
}

// ✅ CORRECT - return data
export async function load({ fetch }) {
	const response = await fetch('/api/user');
	return { user: await response.json() };
}
```

Pass data to components that need it or use `page.data`.

## Using state and stores with context

Use Svelte's context API to safely share state without creating shared variables. State attached to the component tree via `setContext` is isolated per user/request.

```svelte
<!-- src/routes/+layout.svelte -->
<script>
	import { setContext } from 'svelte';
	let { data } = $props();
	setContext('user', () => data.user);
</script>

<!-- src/routes/user/+page.svelte -->
<script>
	import { getContext } from 'svelte';
	const user = getContext('user');
</script>
<p>Welcome {user().name}</p>
```

Pass functions into `setContext` to maintain reactivity across boundaries. With SSR, state updates in child components during rendering won't affect parent components (already rendered), but on the client (CSR) values propagate up. Pass state down rather than up to avoid flashing during hydration.

If not using SSR, you can safely keep state in a shared module without the context API.

## Component and page state is preserved

When navigating between routes, SvelteKit reuses layout and page components instead of destroying/recreating them. This means `data` props update but lifecycle methods (`onMount`, `onDestroy`) don't rerun and non-reactive values don't recalculate.

```svelte
<!-- ❌ WRONG - estimatedReadingTime won't update on navigation -->
<script>
	let { data } = $props();
	const wordCount = data.content.split(' ').length;
	const estimatedReadingTime = wordCount / 250;
</script>

<!-- ✅ CORRECT - use $derived for reactivity -->
<script>
	let { data } = $props();
	let wordCount = $derived(data.content.split(' ').length);
	let estimatedReadingTime = $derived(wordCount / 250);
</script>
```

Use `afterNavigate` and `beforeNavigate` if code in lifecycle methods must run again after navigation. To destroy and remount a component on navigation, use `{#key page.url.pathname}`.

## Storing state in the URL

For state that should survive reloads and affect SSR (filters, sorting), use URL search parameters like `?sort=price&order=ascending`. Set them in `<a href>` or `<form action>` attributes, or programmatically via `goto('?key=value')`. Access them in load functions via the `url` parameter and in components via `page.url.searchParams`.

## Storing ephemeral state in snapshots

For disposable UI state (accordion open/closed) that should persist across navigation but not survive page refresh, use snapshots to associate component state with history entries.

### remote_functions
Type-safe client-server communication: query (read), form (write+progressive enhancement), command (write anywhere), prerender (build-time); validate with Standard Schema; single-flight mutations; progressive enhancement; getRequestEvent for auth.

## Overview

Remote functions enable type-safe client-server communication. They're exported from `.remote.js` or `.remote.ts` files, automatically transformed to fetch wrappers on the client, and always execute on the server. Four types exist: `query`, `form`, `command`, and `prerender`.

Enable with `kit.experimental.remoteFunctions: true` in `svelte.config.js`, optionally with `compilerOptions.experimental.async: true` for component-level `await`.

## query

Reads dynamic server data. Returns a Promise-like object with `loading`, `error`, `current` properties, or use `await`:

```js
// src/routes/blog/data.remote.js
import { query } from '$app/server';
import * as db from '$lib/server/database';

export const getPosts = query(async () => {
  const posts = await db.sql`SELECT title, slug FROM post ORDER BY published_at DESC`;
  return posts;
});

export const getPost = query(v.string(), async (slug) => {
  const [post] = await db.sql`SELECT * FROM post WHERE slug = ${slug}`;
  if (!post) error(404, 'Not found');
  return post;
});
```

```svelte
<script>
  import { getPosts, getPost } from './data.remote';
  let { params } = $props();
</script>

<h1>Recent posts</h1>
<ul>
  {#each await getPosts() as { title, slug }}
    <li><a href="/blog/{slug}">{title}</a></li>
  {/each}
</ul>

<h1>{(await getPost(params.slug)).title}</h1>
```

Validate arguments with Standard Schema libraries (Zod, Valibot). Both arguments and return values serialize via devalue (handles Date, Map, custom types). Call `.refresh()` to re-fetch. Queries cache per-page: `getPosts() === getPosts()`.

### query.batch

Batches simultaneous requests to solve n+1 problem. Server callback receives array of arguments, must return function `(input, index) => output`:

```js
export const getWeather = query.batch(v.string(), async (cities) => {
  const weather = await db.sql`SELECT * FROM weather WHERE city = ANY(${cities})`;
  const lookup = new Map(weather.map(w => [w.city, w]));
  return (city) => lookup.get(city);
});
```

```svelte
{#each cities as city}
  <h3>{city.name}</h3>
  <CityWeather weather={await getWeather(city.id)} />
{/each}
```

## form

Writes data to server. Takes schema and callback receiving FormData-constructed `data`. Returns object with `method`, `action` properties for non-JS fallback, plus progressive enhancement:

```js
export const createPost = form(
  v.object({
    title: v.pipe(v.string(), v.nonEmpty()),
    content: v.pipe(v.string(), v.nonEmpty())
  }),
  async ({ title, content }) => {
    const user = await auth.getUser();
    if (!user) error(401, 'Unauthorized');
    const slug = title.toLowerCase().replace(/ /g, '-');
    await db.sql`INSERT INTO post (slug, title, content) VALUES (${slug}, ${title}, ${content})`;
    redirect(303, `/blog/${slug}`);
  }
);
```

```svelte
<form {...createPost}>
  <label>
    Title
    <input {...createPost.fields.title.as('text')} />
    {#each createPost.fields.title.issues() as issue}
      <p class="error">{issue.message}</p>
    {/each}
  </label>

  <label>
    Content
    <textarea {...createPost.fields.content.as('text')}></textarea>
  </label>

  <button>Publish</button>
</form>

{#if createPost.result?.success}
  <p>Published!</p>
{/if}
```

### Fields

Access via `form.fields.fieldName`. Call `.as(type)` for input attributes (text, number, checkbox, radio, file, select). Supports nested objects and arrays. Unchecked checkboxes omit values—make optional in schema. For radio/checkbox groups with same field, pass value as second arg: `.as('radio', 'windows')`.

Sensitive fields (passwords, credit cards) use leading underscore to prevent repopulation on validation failure: `_password`.

### Validation

Call `.validate()` programmatically (e.g., `oninput`). By default ignores untouched fields; use `validate({ includeUntouched: true })`. Use `.preflight(schema)` for client-side validation preventing server submission if invalid. Get all issues via `fields.allIssues()`.

Programmatic validation via `invalid()` function for server-side checks:

```js
export const buyHotcakes = form(
  v.object({ qty: v.pipe(v.number(), v.minValue(1)) }),
  async (data, issue) => {
    try {
      await db.buy(data.qty);
    } catch (e) {
      if (e.code === 'OUT_OF_STOCK') {
        invalid(issue.qty(`we don't have enough hotcakes`));
      }
    }
  }
);
```

### Getting/setting inputs

`field.value()` returns current value, auto-updated as user interacts. `form.fields.value()` returns object of all values. Use `.set(...)` to update:

```svelte
<form {...createPost}>
  <!-- -->
</form>

<div class="preview">
  <h2>{createPost.fields.title.value()}</h2>
  <div>{@html render(createPost.fields.content.value())}</div>
</div>

<button onclick={() => createPost.fields.set({ title: 'New', content: 'Lorem...' })}>
  Populate
</button>
```

### Single-flight mutations

By default all queries refresh after successful form submission. For efficiency, specify which queries to refresh. Server-side: call `await getPosts().refresh()` or `await getPost(id).set(result)` in form handler. Client-side: use `enhance` with `submit().updates(...)`.

### enhance

Customize submission with `enhance` callback receiving `{ form, data, submit }`:

```svelte
<form {...createPost.enhance(async ({ form, data, submit }) => {
  try {
    await submit().updates(getPosts());
    form.reset();
    showToast('Published!');
  } catch (error) {
    showToast('Error');
  }
})}>
  <!-- -->
</form>
```

Use `.updates(query)` for single-flight mutations. Use `.withOverride(fn)` for optimistic updates:

```js
await submit().updates(
  getPosts().withOverride((posts) => [newPost, ...posts])
);
```

### Multiple instances

For repeated forms in lists, create isolated instances via `.for(id)`:

```svelte
{#each await getTodos() as todo}
  {@const modify = modifyTodo.for(todo.id)}
  <form {...modify}>
    <!-- -->
    <button disabled={!!modify.pending}>save</button>
  </form>
{/each}
```

### buttonProps

Different buttons can submit to different URLs via `formaction`. Use `form.buttonProps` on button:

```svelte
<form {...login}>
  <input {...login.fields.username.as('text')} />
  <input {...login.fields._password.as('password')} />
  <button>login</button>
  <button {...register.buttonProps}>register</button>
</form>
```

## command

Like `form` but not tied to elements, callable from anywhere. Prefer `form` for graceful degradation. Validate arguments with Standard Schema:

```js
export const getLikes = query(v.string(), async (id) => {
  const [row] = await db.sql`SELECT likes FROM item WHERE id = ${id}`;
  return row.likes;
});

export const addLike = command(v.string(), async (id) => {
  await db.sql`UPDATE item SET likes = likes + 1 WHERE id = ${id}`;
  getLikes(id).refresh();
});
```

```svelte
<button onclick={async () => {
  try {
    await addLike(item.id);
  } catch (error) {
    showToast('Error');
  }
}}>
  add like
</button>

<p>likes: {await getLikes(item.id)}</p>
```

Cannot be called during render. Update queries via `.refresh()` in command, or `.updates(query)` when calling:

```js
await addLike(item.id).updates(getLikes(item.id));
// or with optimistic update:
await addLike(item.id).updates(
  getLikes(item.id).withOverride((n) => n + 1)
);
```

## prerender

Invoked at build time for static data. Results cached via Cache API, survives reloads, cleared on new deployment:

```js
export const getPosts = prerender(async () => {
  const posts = await db.sql`SELECT title, slug FROM post ORDER BY published_at DESC`;
  return posts;
});

export const getPost = prerender(v.string(), async (slug) => {
  const [post] = await db.sql`SELECT * FROM post WHERE slug = ${slug}`;
  if (!post) error(404, 'Not found');
  return post;
});
```

Specify prerender inputs via `inputs` option:

```js
export const getPost = prerender(
  v.string(),
  async (slug) => { /* ... */ },
  {
    inputs: () => ['first-post', 'second-post', 'third-post']
  }
);
```

By default excluded from server bundle—cannot call with non-prerendered arguments. Set `dynamic: true` to allow:

```js
export const getPost = prerender(
  v.string(),
  async (slug) => { /* ... */ },
  {
    dynamic: true,
    inputs: () => ['first-post', 'second-post', 'third-post']
  }
);
```

## Validation errors

SvelteKit returns generic 400 Bad Request for invalid arguments (prevents information leakage to attackers). Customize via `handleValidationError` server hook:

```js
// src/hooks.server.ts
export function handleValidationError({ event, issues }) {
  return { message: 'Nice try, hacker!' };
}
```

Opt out of validation with `'unchecked'` string (use carefully):

```ts
export const getStuff = query('unchecked', async ({ id }: { id: string }) => {
  // bad actors might call with other arguments
});
```

## getRequestEvent

Access current RequestEvent inside `query`, `form`, `command` via `getRequestEvent()` for cookies, etc:

```ts
import { getRequestEvent, query } from '$app/server';

export const getProfile = query(async () => {
  const user = await getUser();
  return { name: user.name, avatar: user.avatar };
});

const getUser = query(async () => {
  const { cookies } = getRequestEvent();
  return await findUser(cookies.get('session_id'));
});
```

Note: cannot set headers (except cookies in `form`/`command`). `route`, `params`, `url` relate to calling page, not endpoint. Queries don't re-run on navigation unless argument changes.

## Redirects

Use `redirect()` inside `query`, `form`, `prerender`. Not allowed in `command` (return `{ redirect: location }` instead).

