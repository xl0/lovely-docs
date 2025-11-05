## Creating a Project

Run `npx sv create my-app` to scaffold a project. Pages are Svelte components in `src/routes` that are server-rendered initially then client-side. Use VS Code with the Svelte extension.

## Project Types

SvelteKit supports multiple rendering patterns: default (SSR + CSR), static site generation with `adapter-static`, SPAs with CSR only, serverless with `adapter-vercel`/`adapter-netlify`/`adapter-cloudflare`, own server with `adapter-node`, and deployment as mobile apps (Tauri/Capacitor), desktop apps (Tauri/Wails/Electron), browser extensions, or embedded devices. Use `csr = false` to disable client-side rendering or `bundleStrategy: 'single'` to limit concurrent requests.

## Project Structure

```
src/
├ lib/              # Reusable code ($lib alias)
│ └ server/         # Server-only code ($lib/server)
├ params/           # Param matchers
├ routes/           # Routes
├ app.html          # Page template
├ error.html        # Error page
├ hooks.client.js   # Client hooks
├ hooks.server.js   # Server hooks
├ service-worker.js # Service worker
└ tracing.server.js # Observability
static/             # Static assets
tests/              # Tests
```

**app.html placeholders**: `%sveltekit.head%`, `%sveltekit.body%`, `%sveltekit.assets%`, `%sveltekit.nonce%`, `%sveltekit.env.[NAME]%`, `%sveltekit.version%`

**error.html placeholders**: `%sveltekit.status%`, `%sveltekit.error.message%`

**package.json** requires `@sveltejs/kit`, `svelte`, `vite` as devDependencies with `"type": "module"`

## Web Standards

SvelteKit uses standard Web APIs: `fetch`, `Request`/`Response`, `Headers`, `FormData`, Streams, `URL`/`URLSearchParams`, and `Web Crypto`.

```js
export function GET({ request }) {
	const userAgent = request.headers.get('user-agent');
	const foo = new URL(request.url).searchParams.get('foo');
	return json({ userAgent, foo });
}
```