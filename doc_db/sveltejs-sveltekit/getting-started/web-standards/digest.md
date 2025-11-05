SvelteKit builds on standard Web APIs available in modern browsers and environments like Cloudflare Workers, Deno, and Vercel Functions. Node-based adapters provide polyfills where necessary.

**Fetch APIs**: `fetch` is available in hooks, server routes, and the browser. A special version in `load` functions, server hooks, and API routes allows invoking endpoints directly during server-side rendering without HTTP calls while preserving credentials. Relative requests are supported server-side.

**Request**: Accessible as `event.request` in hooks and server routes. Provides methods like `request.json()` and `request.formData()` for reading posted data.

**Response**: Returned from `await fetch(...)` and handlers in `+server.js` files. A SvelteKit app fundamentally transforms a `Request` into a `Response`.

**Headers**: Read incoming `request.headers` and set outgoing `response.headers`:
```js
export function GET({ request }) {
	console.log(...request.headers);
	return json({ userAgent: request.headers.get('user-agent') }, {
		headers: { 'x-custom-header': 'potato' }
	});
}
```

**FormData**: Handle HTML form submissions with `FormData` objects:
```js
export async function POST(event) {
	const body = await event.request.formData();
	return json({ name: body.get('name') ?? 'world' });
}
```

**Stream APIs**: Use ReadableStream, WritableStream, and TransformStream for large or chunked responses.

**URL APIs**: URLs use the `URL` interface with properties like `origin` and `pathname`. Access query parameters via `url.searchParams` (URLSearchParams instance).

**Web Crypto**: Available via the `crypto` global for operations like generating UUIDs: `crypto.randomUUID()`.