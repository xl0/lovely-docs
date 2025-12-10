

## Pages

### advanced_routing
Rest parameters `[...file]`, optional `[[param]]`, matchers `[param=type]`, route sorting rules, character encoding `[x+nn]`, layout groups `(name)`, and layout reset `@ancestor`.

## Rest Parameters

Use `[...file]` syntax to match variable number of segments:
```
/[org]/[repo]/tree/[branch]/[...file]
```
Request `/sveltejs/kit/tree/main/documentation/docs/04-advanced-routing.md` yields:
```js
{ org: 'sveltejs', repo: 'kit', branch: 'main', file: 'documentation/docs/04-advanced-routing.md' }
```

Route `src/routes/a/[...rest]/z/+page.svelte` matches `/a/z` (empty rest), `/a/b/z`, `/a/b/c/z`, etc. Validate rest parameter values using matchers.

### Custom 404 Pages

Rest parameters enable custom 404 handling. Without a catch-all route, nested error pages don't render for unmatched paths:

```tree
src/routes/
├ marx-brothers/
│ ├ [...path]/
│ ├ chico/
│ ├ harpo/
│ ├ groucho/
│ └ +error.svelte
└ +error.svelte
```

```js
// src/routes/marx-brothers/[...path]/+page.js
import { error } from '@sveltejs/kit';
export function load(event) {
	error(404, 'Not Found');
}
```

Unhandled 404s appear in `handleError` hook.

## Optional Parameters

Wrap parameter in double brackets to make optional: `[[lang]]/home` matches both `home` and `en/home`.

Cannot follow rest parameters: `[...rest]/[[optional]]` is invalid (rest is greedy).

## Matching

Restrict parameter values with matchers in `src/params/` directory:

```js
// src/params/fruit.js
export function match(param) {
	return param === 'apple' || param === 'orange';
}
```

Use in routes: `src/routes/fruits/[page=fruit]`

Matchers run on server and browser. Test files (`*.test.js`, `*.spec.js`) are excluded from matchers.

## Route Sorting

When multiple routes match a path, SvelteKit sorts by:
1. Specificity (no parameters > dynamic parameters)
2. Matchers (`[name=type]` > `[name]`)
3. `[[optional]]` and `[...rest]` lowest priority unless final segment
4. Alphabetical ties

Example: `/foo-abc` matches these routes in priority order:
```
src/routes/foo-abc/+page.svelte
src/routes/foo-[c]/+page.svelte
src/routes/[[a=x]]/+page.svelte
src/routes/[b]/+page.svelte
src/routes/[...catchall]/+page.svelte
```

## Encoding

Filesystem and URL-reserved characters require hex escape sequences `[x+nn]`:
- `\` → `[x+5c]`, `/` → `[x+2f]`, `:` → `[x+3a]`, `*` → `[x+2a]`, `?` → `[x+3f]`
- `"` → `[x+22]`, `<` → `[x+3c]`, `>` → `[x+3e]`, `|` → `[x+7c]`
- `#` → `[x+23]`, `%` → `[x+25]`, `[` → `[x+5b]`, `]` → `[x+5d]`, `(` → `[x+28]`, `)` → `[x+29]`

Example: `/smileys/:-)` → `src/routes/smileys/[x+3a]-[x+29]/+page.svelte`

Get hex code: `':'.charCodeAt(0).toString(16)` → `'3a'`

Unicode escapes `[u+nnnn]` (0000-10ffff) also work:
```
src/routes/[u+d83e][u+dd2a]/+page.svelte
src/routes/🤪/+page.svelte
```

For TypeScript compatibility with leading `.` directories, encode: `src/routes/[x+2e]well-known/...`

## Advanced Layouts

### Route Groups

Parenthesized directories don't affect URL pathname, enabling different layouts for different route sets:

```tree
src/routes/
├ (app)/
│ ├ dashboard/
│ ├ item/
│ └ +layout.svelte
├ (marketing)/
│ ├ about/
│ ├ testimonials/
│ └ +layout.svelte
├ admin/
└ +layout.svelte
```

`(app)` and `(marketing)` routes have separate layouts; `/admin` skips both group layouts.

### Breaking Out of Layouts

Use `@` suffix on `+page.svelte` or `+layout.svelte` to reset hierarchy to a specific ancestor:

```tree
src/routes/
├ (app)/
│ ├ item/
│ │ ├ [id]/
│ │ │ ├ embed/
│ │ │ │ └ +page@(app).svelte
│ │ │ └ +layout.svelte
│ │ └ +layout.svelte
│ └ +layout.svelte
└ +layout.svelte
```

Options for `/item/[id]/embed`:
- `+page@[id].svelte` - inherits `[id]/+layout.svelte`
- `+page@item.svelte` - inherits `item/+layout.svelte`
- `+page@(app).svelte` - inherits `(app)/+layout.svelte`
- `+page@.svelte` - inherits root `+layout.svelte`

Layouts can also break out: `+layout@.svelte` resets hierarchy for all children.

### Alternatives to Layout Groups

For complex nesting or single outliers, use composition instead:

```svelte
<!--- src/routes/nested/route/+layout@.svelte --->
<script>
	import ReusableLayout from '$lib/ReusableLayout.svelte';
	let { data, children } = $props();
</script>

<ReusableLayout {data}>
	{@render children()}
</ReusableLayout>
```

```js
// src/routes/nested/route/+layout.js
import { reusableLoad } from '$lib/reusable-load-function';
export function load(event) {
	return reusableLoad(event);
}
```

### hooks
App-wide hooks for request handling (handle), error handling (handleError), initialization (init), URL routing (reroute), fetch interception (handleFetch), custom data (locals), validation errors (handleValidationError), and type serialization (transport) across server/client boundaries.

## Overview

Hooks are app-wide functions that SvelteKit calls in response to specific events, providing fine-grained control over framework behavior. Three optional hook files exist:
- `src/hooks.server.js` — server hooks
- `src/hooks.client.js` — client hooks  
- `src/hooks.js` — universal hooks (both client and server)

Hook modules run at startup, useful for initializing database clients.

## Server Hooks

### handle
Runs on every request (including prerendering). Receives `event` and `resolve` function. Allows modifying response headers/bodies or bypassing SvelteKit entirely.

```js
export async function handle({ event, resolve }) {
	if (event.url.pathname.startsWith('/custom')) {
		return new Response('custom response');
	}
	const response = await resolve(event);
	response.headers.set('x-custom-header', 'value');
	return response;
}
```

Default: `({ event, resolve }) => resolve(event)`

Static assets and prerendered pages are not handled by SvelteKit. During prerendering, check `$app/environment#building` to exclude code.

`resolve` accepts optional second parameter:
- `transformPageChunk(opts: { html: string, done: boolean }): MaybePromise<string | undefined>` — transform HTML chunks
- `filterSerializedResponseHeaders(name: string, value: string): boolean` — filter headers in serialized responses from `load` functions
- `preload(input: { type: 'js' | 'css' | 'font' | 'asset', path: string }): boolean` — determine preload behavior (js/css preloaded by default)

```js
export async function handle({ event, resolve }) {
	return resolve(event, {
		transformPageChunk: ({ html }) => html.replace('old', 'new'),
		filterSerializedResponseHeaders: (name) => name.startsWith('x-'),
		preload: ({ type, path }) => type === 'js' || path.includes('/important/')
	});
}
```

`resolve` never throws; returns `Promise<Response>` with appropriate status. Errors elsewhere in `handle` are fatal, returning JSON error or fallback error page (customizable via `src/error.html`).

### locals
Populate `event.locals` to add custom data passed to handlers in `+server.js` and server `load` functions.

```js
declare namespace App {
	interface Locals {
		user: User;
	}
}

export async function handle({ event, resolve }) {
	event.locals.user = await getUserInformation(event.cookies.get('sessionid'));
	const response = await resolve(event);
	response.headers.set('x-custom-header', 'potato');
	return response;
}
```

Multiple `handle` functions can be executed with the `sequence` helper.

### handleFetch
Modifies or replaces results of `event.fetch` calls on server/prerendering in endpoints, `load`, `action`, `handle`, `handleError`, or `reroute`.

```js
export async function handleFetch({ request, fetch }) {
	if (request.url.startsWith('https://api.yourapp.com/')) {
		request = new Request(
			request.url.replace('https://api.yourapp.com/', 'http://localhost:9999/'),
			request
		);
	}
	return fetch(request);
}
```

`event.fetch` follows browser credentials model: same-origin requests forward `cookie` and `authorization` headers unless `credentials: "omit"`. Cross-origin requests include cookies if URL is subdomain of app. Sibling subdomains don't include parent domain cookies; manually set via `handleFetch`:

```js
export async function handleFetch({ event, request, fetch }) {
	if (request.url.startsWith('https://api.my-domain.com/')) {
		request.headers.set('cookie', event.request.headers.get('cookie'));
	}
	return fetch(request);
}
```

### handleValidationError
Called when remote function receives argument not matching Standard Schema. Must return object matching `App.Error` shape.

```js
export function handleValidationError({ issues }) {
	return { message: 'No thank you' };
}
```

## Shared Hooks (server and client)

### handleError
Called when unexpected error thrown during loading, rendering, or from endpoint. Receives `error`, `event`, `status`, `message`. Allows logging and generating safe error representation for users.

For errors from your code: status is 500, message is "Internal Error". `error.message` may contain sensitive info; `message` is safe.

Customize error shape via `App.Error` interface:

```ts
declare global {
	namespace App {
		interface Error {
			message: string;
			errorId: string;
		}
	}
}
```

```js
// src/hooks.server.js
import * as Sentry from '@sentry/sveltekit';
Sentry.init({/*...*/})

export async function handleError({ error, event, status, message }) {
	const errorId = crypto.randomUUID();
	Sentry.captureException(error, { extra: { event, errorId, status } });
	return { message: 'Whoops!', errorId };
}
```

```js
// src/hooks.client.js
export async function handleError({ error, event, status, message }) {
	const errorId = crypto.randomUUID();
	Sentry.captureException(error, { extra: { event, errorId, status } });
	return { message: 'Whoops!', errorId };
}
```

In client hooks, type is `HandleClientError` and `event` is `NavigationEvent` not `RequestEvent`.

Not called for expected errors (thrown with `error()` from `@sveltejs/kit`). During development, syntax errors in Svelte code include `frame` property. `handleError` must never throw.

### init
Runs once when server created or app starts in browser. Useful for async initialization like database connections.

```js
import * as db from '$lib/server/database';

export async function init() {
	await db.connect();
}
```

In browser, async work delays hydration; be mindful. Top-level await is equivalent if environment supports it.

## Universal Hooks

### reroute
Runs before `handle`. Changes how URLs translate to routes. Returns pathname (defaults to `url.pathname`) used to select route and parameters.

```js
const translated = {
	'/en/about': '/en/about',
	'/de/ueber-uns': '/de/about',
	'/fr/a-propos': '/fr/about',
};

export function reroute({ url }) {
	if (url.pathname in translated) {
		return translated[url.pathname];
	}
}
```

Doesn't change browser address bar or `event.url`. Since v2.18, can be async for fetching backend data (use provided `fetch` argument; `params` and `id` unavailable to `handleFetch`):

```js
export async function reroute({ url, fetch }) {
	if (url.pathname === '/api/reroute') return;
	const api = new URL('/api/reroute', url);
	api.searchParams.set('pathname', url.pathname);
	const result = await fetch(api).then(r => r.json());
	return result.pathname;
}
```

Must be pure, idempotent function (same input = same output, no side effects). SvelteKit caches result on client.

### transport
Collection of transporters allowing custom types from `load` and form actions across server/client boundary. Each has `encode` (server) and `decode` (client) functions:

```js
import { Vector } from '$lib/math';

export const transport = {
	Vector: {
		encode: (value) => value instanceof Vector && [value.x, value.y],
		decode: ([x, y]) => new Vector(x, y)
	}
};
```

### errors
Expected errors via error() helper render +error.svelte; unexpected errors expose generic message and pass through handleError hook; customize error shape with App.Error interface and fallback page with src/error.html.

## Error objects

SvelteKit distinguishes between expected and unexpected errors, both represented as `{ message: string }` objects by default. Additional properties like `code` or `id` can be added (requires TypeScript `Error` interface redefinition).

## Expected errors

Created with the `error()` helper from `@sveltejs/kit`:

```js
import { error } from '@sveltejs/kit';

export async function load({ params }) {
	const post = await db.getPost(params.slug);
	if (!post) {
		error(404, { message: 'Not found' });
	}
	return { post };
}
```

This throws an exception caught by SvelteKit, setting the response status code and rendering the nearest `+error.svelte` component where `page.error` contains the error object.

```svelte
<script>
	import { page } from '$app/state';
</script>
<h1>{page.error.message}</h1>
```

Custom error shape with TypeScript:

```ts
declare global {
	namespace App {
		interface Error {
			message: string;
			code: string;
			id: string;
		}
	}
}
```

Then use: `error(404, { message: 'Not found', code: 'NOT_FOUND', id: '123' })`

Shorthand: `error(404, 'Not found')` passes a string as the second argument.

## Unexpected errors

Any exception occurring during request handling that isn't created with the `error()` helper. These can contain sensitive information, so unexpected error messages and stack traces are not exposed to users.

Default response: `{ "message": "Internal Error" }`

Unexpected errors pass through the `handleError` hook where you can add custom error handling (e.g., sending to a reporting service, returning a custom error object that becomes `$page.error`).

## Responses

If an error occurs inside `handle` or `+server.js`, SvelteKit responds with either a fallback error page or JSON representation depending on the request's `Accept` headers.

Customize the fallback error page with `src/error.html`:

```html
<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="utf-8" />
		<title>%sveltekit.error.message%</title>
	</head>
	<body>
		<h1>My custom error page</h1>
		<p>Status: %sveltekit.status%</p>
		<p>Message: %sveltekit.error.message%</p>
	</body>
</html>
```

SvelteKit replaces `%sveltekit.status%` and `%sveltekit.error.message%` with their values.

If an error occurs inside a `load` function while rendering a page, SvelteKit renders the nearest `+error.svelte` component. If the error occurs in a `load` function in `+layout(.server).js`, the closest error boundary is an `+error.svelte` file _above_ that layout.

Exception: errors in the root `+layout.js` or `+layout.server.js` use the fallback error page (since the root layout would ordinarily contain the `+error.svelte` component).

## Type safety

Customize error shape by declaring an `App.Error` interface in `src/app.d.ts`:

```ts
declare global {
	namespace App {
		interface Error {
			message: string;
			code: string;
			id: string;
		}
	}
}
export {};
```

The `message: string` property is always included.

### link-options
Six `data-sveltekit-*` attributes customize link navigation: preload-data/code (hover/tap/eager/viewport), reload (full-page), replacestate (history), keepfocus (focus retention), noscroll (scroll behavior).

## data-sveltekit-preload-data

Preload page code and data before navigation based on user interaction:

- `"hover"` - preload on mouse hover (desktop) or `touchstart` (mobile)
- `"tap"` - preload on `touchstart` or `mousedown` only

Default in template: `<body data-sveltekit-preload-data="hover">`

```html
<a data-sveltekit-preload-data="tap" href="/stonks">
	Get current stonk values
</a>
```

Preloading is skipped if `navigator.connection.saveData` is `true`.

Can be invoked programmatically via `preloadData` from `$app/navigation`.

## data-sveltekit-preload-code

Preload only page code (not data) with four eagerness levels:

- `"eager"` - preload immediately
- `"viewport"` - preload when link enters viewport
- `"hover"` - preload on hover
- `"tap"` - preload on tap/click

Only applies to links in DOM immediately after navigation. Links added later (e.g., in `{#if}` blocks) preload only on `hover`/`tap`.

Has no effect if a `data-sveltekit-preload-data` attribute specifies a more eager value. Respects `navigator.connection.saveData`.

## data-sveltekit-reload

Force full-page browser navigation instead of SvelteKit client-side navigation:

```html
<a data-sveltekit-reload href="/path">Path</a>
```

Links with `rel="external"` receive the same treatment and are ignored during prerendering.

## data-sveltekit-replacestate

Replace current history entry instead of creating new one:

```html
<a data-sveltekit-replacestate href="/path">Path</a>
```

Uses `replaceState` instead of `pushState`.

## data-sveltekit-keepfocus

Retain focus on currently focused element after navigation:

```html
<form data-sveltekit-keepfocus>
	<input type="text" name="query">
</form>
```

Useful for search forms that submit while typing. Avoid on links since focus would be on the `<a>` tag itself. Only use on elements that persist after navigation.

## data-sveltekit-noscroll

Prevent automatic scroll to top (0,0) after navigation:

```html
<a href="path" data-sveltekit-noscroll>Path</a>
```

Default behavior scrolls to top unless link has `#hash` (scrolls to matching element ID).

## Disabling options

Disable inherited options with `"false"` value:

```html
<div data-sveltekit-preload-data="hover">
	<a href="/a">preloaded</a>
	<div data-sveltekit-preload-data="false">
		<a href="/b">NOT preloaded</a>
	</div>
</div>
```

Conditionally apply attributes:

```svelte
<div data-sveltekit-preload-data={condition ? 'hover' : false}>
```

These attributes also apply to `<form method="GET">` elements.

### service_workers
Service workers proxy requests for offline support and precaching; auto-registered from src/service-worker.js with access to build/files/version via $service-worker module; implement install/activate/fetch handlers with cache-first or network-first strategies; dev requires module type registration.

## Overview

Service workers act as proxy servers handling network requests, enabling offline functionality and navigation speed improvements through precaching of built JS and CSS.

## Automatic Registration

If `src/service-worker.js` or `src/service-worker/index.js` exists, it's automatically bundled and registered. The default registration:

```js
if ('serviceWorker' in navigator) {
	addEventListener('load', function () {
		navigator.serviceWorker.register('./path/to/service-worker.js');
	});
}
```

Automatic registration can be disabled via configuration to use custom logic.

## Inside the Service Worker

Access the `$service-worker` module providing:
- `build`: paths to built app files
- `files`: paths to static assets
- `version`: app version string for unique cache names
- `base`: deployment base path
- Vite `define` config is applied to service workers

### Example: Eager Static Caching with Network Fallback

```js
/// <reference no-default-lib="true"/>
/// <reference lib="esnext" />
/// <reference lib="webworker" />
/// <reference types="@sveltejs/kit" />

import { build, files, version } from '$service-worker';

const self = /** @type {ServiceWorkerGlobalScope} */ (globalThis.self);
const CACHE = `cache-${version}`;
const ASSETS = [...build, ...files];

self.addEventListener('install', (event) => {
	event.waitUntil(
		caches.open(CACHE).then(cache => cache.addAll(ASSETS))
	);
});

self.addEventListener('activate', (event) => {
	event.waitUntil(
		caches.keys().then(keys => 
			Promise.all(keys.map(key => key !== CACHE && caches.delete(key)))
		)
	);
});

self.addEventListener('fetch', (event) => {
	if (event.request.method !== 'GET') return;

	event.respondWith((async () => {
		const url = new URL(event.request.url);
		const cache = await caches.open(CACHE);

		// Serve cached assets
		if (ASSETS.includes(url.pathname)) {
			return await cache.match(url.pathname);
		}

		// Network first, cache fallback
		try {
			const response = await fetch(event.request);
			if (response instanceof Response && response.status === 200) {
				cache.put(event.request, response.clone());
			}
			return response;
		} catch (err) {
			const cached = await cache.match(event.request);
			return cached || (() => { throw err; })();
		}
	})());
});
```

## Development

Service workers are bundled for production only. During development, only browsers supporting ES modules in service workers work. Manual registration requires:

```js
import { dev } from '$app/environment';

navigator.serviceWorker.register('/service-worker.js', {
	type: dev ? 'module' : 'classic'
});
```

Note: `build` and `prerendered` are empty arrays during development.

## Caching Considerations

- Stale cached data can be worse than unavailable data offline
- Browsers auto-clear caches when full; avoid caching large assets like videos

## Alternatives

For PWA applications, consider Workbox library or Vite PWA plugin for SvelteKit.

### server-only_modules
Prevent sensitive data leakage to browser: mark modules as server-only via `.server` suffix or `$lib/server/` directory; SvelteKit validates entire import chains to prevent indirect exposure.

## Purpose
Prevent accidental exposure of sensitive data (API keys, private environment variables) to browser code when developing backend and frontend in the same repository.

## Private Environment Variables
- `$env/static/private` and `$env/dynamic/private` modules can only be imported in server-only code
- Server-only contexts: `hooks.server.js`, `+page.server.js`

## Server-only Utilities
- `$app/server` module (contains `read()` function for filesystem access) is server-only

## Creating Server-only Modules
Two approaches:
1. Add `.server` to filename: `secrets.server.js`
2. Place in `$lib/server/`: `$lib/server/secrets.js`

## How It Works
SvelteKit prevents importing server-only code into public-facing code (browser code), even indirectly through re-exports.

Example - this fails:
```js
// $lib/server/secrets.js
export const atlantisCoordinates = [/* redacted */];

// src/routes/utils.js
export { atlantisCoordinates } from '$lib/server/secrets.js';
export const add = (a, b) => a + b;

// src/routes/+page.svelte
<script>
  import { add } from './utils.js';  // ERROR: import chain includes server-only code
</script>
```

Error message:
```
Cannot import $lib/server/secrets.ts into code that runs in the browser, as this could leak sensitive information.
```

The error occurs even though `+page.svelte` only uses `add`, not `atlantisCoordinates`. The entire import chain is checked because server code could end up in browser JavaScript.

## Dynamic Imports
Works with dynamic imports including interpolated ones: ``await import(`./${foo}.js`)``

## Testing
Unit testing frameworks (Vitest) don't distinguish between server-only and public code. Illegal import detection is disabled when `process.env.TEST === 'true'`.

### snapshots
Preserve ephemeral DOM state across navigation using snapshot capture/restore methods; data must be JSON-serializable and is stored in sessionStorage.

## Snapshots

Preserve ephemeral DOM state (scroll positions, form input values, etc.) across navigation by exporting a `snapshot` object from `+page.svelte` or `+layout.svelte`.

### How it works

Export a `snapshot` object with `capture` and `restore` methods:

```svelte
<script>
	let comment = $state('');

	/** @type {import('./$types').Snapshot<string>} */
	export const snapshot = {
		capture: () => comment,
		restore: (value) => comment = value
	};
</script>

<form method="POST">
	<label for="comment">Comment</label>
	<textarea id="comment" bind:value={comment} />
	<button>Post comment</button>
</form>
```

- `capture()` is called immediately before the page updates when navigating away, and its return value is stored in the browser's history stack
- `restore(value)` is called with the stored value as soon as the page updates when navigating back

### Constraints

- Data must be JSON-serializable to persist to `sessionStorage`
- State is restored on page reload or when navigating back from a different site
- Avoid returning large objects from `capture` — they remain in memory for the session duration and may exceed `sessionStorage` limits

### shallow-routing
Create history entries without navigation via pushState/replaceState for modals and overlays; use preloadData to load route data for shallow-rendered components.

## Shallow Routing

Create history entries without navigating using `pushState` and `replaceState` functions. Useful for modals and other UI patterns where you want back/forward navigation to dismiss overlays without changing the page.

### Basic Usage

```svelte
<script>
	import { pushState } from '$app/navigation';
	import { page } from '$app/state';
	import Modal from './Modal.svelte';

	function showModal() {
		pushState('', { showModal: true });
	}
</script>

{#if page.state.showModal}
	<Modal close={() => history.back()} />
{/if}
```

The first argument to `pushState` is a relative URL (use `''` to stay on current URL). The second argument is the new page state, accessible via `page.state`. Make page state type-safe by declaring an `App.PageState` interface in `src/app.d.ts`.

Use `replaceState` instead of `pushState` to set page state without creating a new history entry.

### Loading Data for Routes

When rendering another `+page.svelte` inside the current page (e.g., photo detail in a modal), use `preloadData` to load the required data:

```svelte
<script>
	import { preloadData, pushState, goto } from '$app/navigation';
	import { page } from '$app/state';
	import Modal from './Modal.svelte';
	import PhotoPage from './[id]/+page.svelte';

	let { data } = $props();
</script>

{#each data.thumbnails as thumbnail}
	<a
		href="/photos/{thumbnail.id}"
		onclick={async (e) => {
			if (innerWidth < 640 || e.shiftKey || e.metaKey || e.ctrlKey) return;
			e.preventDefault();

			const result = await preloadData(e.currentTarget.href);
			if (result.type === 'loaded' && result.status === 200) {
				pushState(e.currentTarget.href, { selected: result.data });
			} else {
				goto(e.currentTarget.href);
			}
		}}
	>
		<img alt={thumbnail.alt} src={thumbnail.src} />
	</a>
{/each}

{#if page.state.selected}
	<Modal onclose={() => history.back()}>
		<PhotoPage data={page.state.selected} />
	</Modal>
{/if}
```

If the element uses `data-sveltekit-preload-data`, the data will already be requested and `preloadData` will reuse that request.

### Caveats

- During server-side rendering, `page.state` is always an empty object
- On the first page the user lands on, state is not applied until they navigate (reload or return from another document won't restore state)
- Shallow routing requires JavaScript; provide fallback behavior for when JavaScript is unavailable

### Legacy

`page.state` from `$app/state` was added in SvelteKit 2.12. For earlier versions or Svelte 4, use `$page.state` from `$app/stores` instead.

### observability
Server-side OpenTelemetry tracing for handle hooks, load functions, form actions, and remote functions; enable via experimental config flags, set up with NodeSDK and Jaeger, augment spans with custom attributes via event.tracing.

## Overview

SvelteKit can emit server-side OpenTelemetry spans (available since 2.31) for:
- `handle` hook and `handle` functions in `sequence`
- Server and universal `load` functions (when run on server)
- Form actions
- Remote functions

Requires opt-in via `svelte.config.js`:
```js
const config = {
	kit: {
		experimental: {
			tracing: { server: true },
			instrumentation: { server: true }
		}
	}
};
```

Both features are experimental and subject to change. Tracing can have nontrivial overhead—consider enabling only in development/preview.

## Augmenting Built-in Tracing

Access `root` span and `current` span via `event.tracing`:
```js
import { getRequestEvent } from '$app/server';

async function authenticate() {
	const user = await getAuthenticatedUser();
	const event = getRequestEvent();
	event.tracing.root.setAttribute('userId', user.id);
}
```

The root span is associated with the root `handle` function. The current span depends on context (handle, load, form action, or remote function).

## Development Quickstart with Jaeger

1. Enable experimental flags in `svelte.config.js`
2. Install dependencies:
   ```sh
   npm i @opentelemetry/sdk-node @opentelemetry/auto-instrumentations-node @opentelemetry/exporter-trace-otlp-proto import-in-the-middle
   ```
3. Create `src/instrumentation.server.js`:
   ```js
   import { NodeSDK } from '@opentelemetry/sdk-node';
   import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
   import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-proto';
   import { createAddHookMessageChannel } from 'import-in-the-middle';
   import { register } from 'node:module';

   const { registerOptions } = createAddHookMessageChannel();
   register('import-in-the-middle/hook.mjs', import.meta.url, registerOptions);

   const sdk = new NodeSDK({
   	serviceName: 'test-sveltekit-tracing',
   	traceExporter: new OTLPTraceExporter(),
   	instrumentations: [getNodeAutoInstrumentations()]
   });

   sdk.start();
   ```

4. Run Jaeger locally and view traces at localhost:16686

## @opentelemetry/api

SvelteKit uses `@opentelemetry/api` as an optional peer dependency. If you install trace collection libraries like `@opentelemetry/sdk-node` or `@vercel/otel`, they'll satisfy this dependency. If you see a missing dependency error after setting up trace collection, install `@opentelemetry/api` manually.

### packaging
Build component libraries with @sveltejs/package; configure exports, types, sideEffects in package.json; auto-generate type definitions; avoid $app modules; use typesVersions or moduleResolution for non-root export types; all imports need extensions.

## Overview

Use `@sveltejs/package` to build component libraries with SvelteKit. Structure: `src/lib` is public-facing (library code), `src/routes` is optional documentation/demo site. Running `svelte-package` generates a `dist` directory with preprocessed Svelte components, transpiled TypeScript, and auto-generated type definitions.

## package.json Configuration

### Essential Fields

**name** - Package name for npm installation
```json
{ "name": "your-library" }
```

**license** - Specify usage rights (e.g., MIT)
```json
{ "license": "MIT" }
```

**files** - Files to publish (npm always includes package.json, README, LICENSE)
```json
{ "files": ["dist"] }
```
Use `.npmignore` to exclude unnecessary files (tests, src/routes imports).

**exports** - Entry points for the package. Default single export:
```json
{
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "svelte": "./dist/index.js"
    }
  }
}
```

The `types` condition points to type definitions; `svelte` condition indicates Svelte component library. For non-Svelte libraries, use `default` instead of `svelte`.

Multiple entry points example:
```json
{
  "exports": {
    ".": { "types": "./dist/index.d.ts", "svelte": "./dist/index.js" },
    "./Foo.svelte": { "types": "./dist/Foo.svelte.d.ts", "svelte": "./dist/Foo.svelte" }
  }
}
```

Consumers import as: `import Foo from 'your-library/Foo.svelte'`

**svelte** - Legacy field for backwards compatibility with outdated tooling
```json
{ "svelte": "./dist/index.js" }
```

**sideEffects** - Helps bundlers with tree-shaking. Mark CSS files as having side effects for webpack compatibility:
```json
{ "sideEffects": ["**/*.css"] }
```

If scripts have side effects, list them:
```json
{ "sideEffects": ["**/*.css", "./dist/sideEffectfulFile.js"] }
```

## TypeScript & Type Definitions

Auto-generated for JavaScript, TypeScript, and Svelte files. Ensure `types` condition in exports points to correct files.

**Problem**: TypeScript doesn't resolve `types` condition for non-root exports like `./foo` by default. It searches for `foo.d.ts` at package root instead of `dist/foo.d.ts`.

**Solution 1** (recommended): Require consumers to set `moduleResolution` to `bundler` (TypeScript 5+), `node16`, or `nodenext` in their `tsconfig.json`.

**Solution 2**: Use `typesVersions` field to map types:
```json
{
  "exports": {
    "./foo": { "types": "./dist/foo.d.ts", "svelte": "./dist/foo.js" }
  },
  "typesVersions": {
    ">4.0": { "foo": ["./dist/foo.d.ts"] }
  }
}
```

The `>4.0` applies to TypeScript versions > 4. Use `*` wildcard for multiple mappings. Must declare all type imports through `typesVersions` if used, including root (`"index.d.ts": [..]`).

## Best Practices

- Avoid SvelteKit-specific modules (`$app/environment`, `$app/state`, `$app/navigation`) unless library is SvelteKit-only. Use `esm-env` instead: `import { BROWSER } from 'esm-env'`
- Pass context (URL, navigation) as props rather than importing from `$app`
- Define aliases in `svelte.config.js` (not `vite.config.js` or `tsconfig.json`) so `svelte-package` processes them
- Semantic versioning: removing `exports` paths or export conditions is a breaking change; adding new paths is not

## Source Maps

Enable declaration maps for editor "Go to Definition" support:
```json
{
  "tsconfig.json": { "declarationMap": true },
  "package.json": {
    "files": [
      "dist",
      "!dist/**/*.test.*",
      "!dist/**/*.spec.*",
      "src/lib",
      "!src/lib/**/*.test.*",
      "!src/lib/**/*.spec.*"
    ]
  }
}
```

## svelte-package Options

- `-w`/`--watch` — watch `src/lib` for changes
- `-i`/`--input` — input directory (default: `src/lib`)
- `-o`/`--output` — output directory (default: `dist`)
- `-p`/`--preserve-output` — skip deleting output directory before packaging
- `-t`/`--types` — generate type definitions (default: `true`, strongly recommended)
- `--tsconfig` — path to tsconfig/jsconfig

## Publishing

```sh
npm publish
```

## Caveats

- All relative imports must be fully specified with extensions per Node ESM: `import { x } from './something/index.js'`
- TypeScript imports: use `.js` extension even for `.ts` files. Set `"moduleResolution": "NodeNext"` in tsconfig
- Non-Svelte/TypeScript files copied as-is; Svelte files preprocessed, TypeScript transpiled to JavaScript

