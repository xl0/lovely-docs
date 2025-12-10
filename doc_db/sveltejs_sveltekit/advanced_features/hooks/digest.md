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