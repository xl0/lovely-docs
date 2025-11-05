## Project Setup

Run `npx sv create my-app` to scaffold. Pages are Svelte components in `src/routes` with SSR + CSR by default.

## Project Structure

```
src/
├ lib/              # Reusable code ($lib alias)
│ └ server/         # Server-only code
├ routes/           # Routes
├ app.html          # Page template with %sveltekit.head%, %sveltekit.body%, etc.
├ error.html        # Error page
├ hooks.client.js   # Client hooks
├ hooks.server.js   # Server hooks
```

## Deployment Patterns

Supports SSR + CSR (default), static generation (`adapter-static`), SPA (CSR only), serverless (`adapter-vercel`/`adapter-netlify`/`adapter-cloudflare`), Node server (`adapter-node`), and mobile/desktop/browser extension deployment.

## Web APIs

Uses standard Web APIs: `fetch`, `Request`/`Response`, `Headers`, `FormData`, `URL`/`URLSearchParams`, Web Crypto.

```js
export function GET({ request }) {
	const userAgent = request.headers.get('user-agent');
	const foo = new URL(request.url).searchParams.get('foo');
	return json({ userAgent, foo });
}
```