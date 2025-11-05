Hooks are app-wide functions SvelteKit calls for specific events. Three optional files: `src/hooks.server.js`, `src/hooks.client.js`, `src/hooks.js`.

**Server hooks:** `handle` (runs on every request, can modify response), `locals` (add custom data to event), `handleFetch` (modify fetch calls), `handleValidationError` (handle schema validation failures).

**Shared hooks:** `handleError` (log errors, customize error display), `init` (async initialization).

**Universal hooks:** `reroute` (translate URLs to routes, can be async), `transport` (pass custom types across server/client boundary).

Example `handle`:
```js
export async function handle({ event, resolve }) {
	if (event.url.pathname.startsWith('/custom')) return new Response('custom');
	const response = await resolve(event);
	response.headers.set('x-custom-header', 'value');
	return response;
}
```