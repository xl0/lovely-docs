Hooks are app-wide functions that SvelteKit calls in response to specific events. Three optional hook files exist:
- `src/hooks.server.js` — server hooks
- `src/hooks.client.js` — client hooks  
- `src/hooks.js` — universal hooks (both client and server)

**Server Hooks:**

`handle` runs on every request and determines the response. Receives `event` and `resolve` function. Can modify response headers/bodies or bypass SvelteKit entirely. Supports optional second parameter with `transformPageChunk`, `filterSerializedResponseHeaders`, and `preload` options.

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

`locals` allows adding custom data to `event.locals`, accessible in `+server.js` and server `load` functions. Multiple `handle` functions can be sequenced together.

`handleFetch` modifies or replaces results of `event.fetch` calls on the server. Useful for redirecting API calls to localhost during SSR instead of public URLs. Handles credentials and cookies appropriately for same-origin and cross-origin requests.

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

`handleValidationError` called when a remote function receives an argument not matching its schema. Must return an object matching `App.Error` shape.

**Shared Hooks (server and client):**

`handleError` called when unexpected errors occur during loading, rendering, or endpoints. Allows logging and generating safe error representations for users. Can customize error shape via `App.Error` interface. Type is `HandleServerError` in server hooks and `HandleClientError` in client hooks.

`init` runs once when server starts or app loads in browser. Useful for async initialization like database connections. In browser, delays hydration so use carefully.

**Universal Hooks:**

`reroute` runs before `handle` and translates URLs into routes. Returns pathname used to select route and parameters. Can be async since version 2.18 to fetch data from backend. Must be pure and idempotent—SvelteKit caches results on client.

```js
export async function reroute({ url, fetch }) {
	const api = new URL('/api/reroute', url);
	api.searchParams.set('pathname', url.pathname);
	const result = await fetch(api).then(r => r.json());
	return result.pathname;
}
```

`transport` collection of transporters for passing custom types across server/client boundary. Each has `encode` (server) and `decode` (client) functions.

```js
export const transport = {
	Vector: {
		encode: (value) => value instanceof Vector && [value.x, value.y],
		decode: ([x, y]) => new Vector(x, y)
	}
};
```