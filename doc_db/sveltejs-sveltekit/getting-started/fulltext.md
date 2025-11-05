

## Pages

### creating-a-project
How to create a new SvelteKit project and understand its basic structure.

Run `npx sv create my-app` to scaffold a project. Pages are Svelte components in `src/routes` that are server-rendered initially then client-side. Use VS Code with the Svelte extension.

### project-types
Overview of different application types and deployment patterns supported by SvelteKit with corresponding adapters and configuration options.

SvelteKit supports multiple rendering patterns: default (SSR + CSR), static site generation with `adapter-static`, SPAs with CSR only, serverless with `adapter-vercel`/`adapter-netlify`/`adapter-cloudflare`, own server with `adapter-node`, and can be deployed as mobile apps (Tauri/Capacitor), desktop apps (Tauri/Wails/Electron), browser extensions, or on embedded devices. Use `csr = false` to disable client-side rendering or `bundleStrategy: 'single'` to limit concurrent requests.

### project-structure
Standard directory layout and configuration files for a SvelteKit project with descriptions of each directory and key template placeholders.

## Directory Structure

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

### web-standards
SvelteKit leverages standard Web APIs (Fetch, Request/Response, Headers, FormData, Streams, URL, Web Crypto) available across modern browsers and server environments.

SvelteKit uses standard Web APIs: `fetch` (with special server-side version for direct endpoint invocation), `Request`/`Response`, `Headers`, `FormData`, Streams, `URL`/`URLSearchParams`, and `Web Crypto`. Example - reading headers and query params:
```js
export function GET({ request }) {
	const userAgent = request.headers.get('user-agent');
	const foo = new URL(request.url).searchParams.get('foo');
	return json({ userAgent, foo });
}
```

