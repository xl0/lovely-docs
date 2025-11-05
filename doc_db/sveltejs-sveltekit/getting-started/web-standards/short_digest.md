SvelteKit uses standard Web APIs: `fetch` (with special server-side version for direct endpoint invocation), `Request`/`Response`, `Headers`, `FormData`, Streams, `URL`/`URLSearchParams`, and `Web Crypto`. Example - reading headers and query params:
```js
export function GET({ request }) {
	const userAgent = request.headers.get('user-agent');
	const foo = new URL(request.url).searchParams.get('foo');
	return json({ userAgent, foo });
}
```