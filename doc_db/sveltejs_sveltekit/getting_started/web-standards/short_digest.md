## Fetch APIs

`fetch` available in hooks, server routes, and browser. Special version in `load`, server hooks, and API routes allows direct endpoint invocation during SSR without HTTP calls, preserves credentials, and supports relative requests.

**Request/Response/Headers**: `event.request` contains methods like `json()` and `formData()`. Responses from `fetch` or `+server.js` handlers. Headers interface reads/sets request/response headers.

```js
import { json } from '@sveltejs/kit';
export function GET({ request }) {
	return json({ userAgent: request.headers.get('user-agent') }, 
		{ headers: { 'x-custom-header': 'potato' } });
}
```

## FormData

Handle form submissions:
```js
export async function POST(event) {
	const body = await event.request.formData();
	return json({ name: body.get('name') ?? 'world' });
}
```

## Stream APIs

Use `ReadableStream`, `WritableStream`, `TransformStream` for large/chunked responses.

## URL APIs

`URL` interface with `origin`, `pathname` properties. Access query parameters via `url.searchParams.get()`.

## Web Crypto

`crypto` global provides Web Crypto API. Example: `crypto.randomUUID()`