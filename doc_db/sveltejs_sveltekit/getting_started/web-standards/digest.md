## Fetch APIs

SvelteKit uses standard `fetch` for network requests in hooks, server routes, and the browser.

A special version of `fetch` is available in `load` functions, server hooks, and API routes for invoking endpoints directly during server-side rendering without HTTP calls, while preserving credentials. Server-side `fetch` outside `load` requires explicit `cookie` and/or `authorization` headers. This version also allows relative requests.

### Request

`Request` instances are accessible in hooks and server routes as `event.request`. Contains methods like `request.json()` and `request.formData()` for accessing posted data.

### Response

`Response` instances are returned from `await fetch(...)` and handlers in `+server.js` files. A SvelteKit app fundamentally transforms a `Request` into a `Response`.

### Headers

The `Headers` interface reads incoming `request.headers` and sets outgoing `response.headers`:

```js
import { json } from '@sveltejs/kit';

export function GET({ request }) {
	console.log(...request.headers);
	return json({
		userAgent: request.headers.get('user-agent')
	}, {
		headers: { 'x-custom-header': 'potato' }
	});
}
```

## FormData

Handle HTML form submissions with `FormData` objects:

```js
import { json } from '@sveltejs/kit';

export async function POST(event) {
	const body = await event.request.formData();
	console.log([...body]);
	return json({
		name: body.get('name') ?? 'world'
	});
}
```

## Stream APIs

For responses too large for memory or delivered in chunks, use streams: `ReadableStream`, `WritableStream`, and `TransformStream`.

## URL APIs

URLs use the `URL` interface with properties like `origin` and `pathname`. Appears in `event.url` (hooks/server routes), `page.url` (pages), and navigation callbacks.

### URLSearchParams

Access query parameters via `url.searchParams` (a `URLSearchParams` instance):

```js
const foo = url.searchParams.get('foo');
```

## Web Crypto

The Web Crypto API is available via the `crypto` global. Used internally for Content Security Policy headers. Example:

```js
const uuid = crypto.randomUUID();
```