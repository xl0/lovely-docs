## Project Creation

Initialize with `npx sv create my-app`, runs on localhost:5173. CLI scaffolds project and optionally sets up TypeScript. Each page is a Svelte component in `src/routes`, server-rendered on first visit then client-side app takes over.

## Project Structure

```
src/
├ lib/              [utilities, components, imported via $lib]
│ └ server/        [server-only code, imported via $lib/server]
├ params/          [param matchers]
├ routes/          [application routes]
├ app.html         [page template with %sveltekit.head%, %sveltekit.body%, %sveltekit.assets%, %sveltekit.nonce%, %sveltekit.env.[NAME]%, %sveltekit.version%]
├ error.html       [fallback error page with %sveltekit.status%, %sveltekit.error.message%]
├ hooks.client.js  [client hooks]
├ hooks.server.js  [server hooks]
├ service-worker.js
└ tracing.server.js
static/            [static assets served as-is]
tests/             [Playwright tests]
package.json       [must include @sveltejs/kit, svelte, vite as devDependencies, "type": "module"]
svelte.config.js   [Svelte/SvelteKit config]
tsconfig.json      [extends .svelte-kit/tsconfig.json]
vite.config.js     [uses @sveltejs/kit/vite plugin]
```

Everything except `src/routes` and `src/app.html` is optional. `.svelte-kit/` is generated and can be deleted.

## Rendering Modes

**Default (Hybrid)**: SSR for initial load (SEO, perceived performance), then CSR for navigation (faster without re-rendering common components).

**Static Site Generation**: Use `adapter-static` to prerender entire site, or `prerender` option for specific pages. Use `adapter-vercel` with ISR for large sites.

**Single-Page App**: Exclusive CSR. Write backend separately in SvelteKit or another language.

**Multi-Page App**: Remove JavaScript with `csr = false` or use `data-sveltekit-reload` for server-rendered links.

**Serverless**: Use `adapter-auto` for zero-config, or platform-specific: `adapter-vercel`, `adapter-netlify`, `adapter-cloudflare`. Some offer `edge` option for edge rendering.

**Own Server/Container**: Use `adapter-node`.

**Library**: Use `@sveltejs/package` add-on.

**Offline/PWA**: Full service worker support.

**Mobile/Desktop**: Turn SPA into mobile app with Tauri/Capacitor or desktop app with Tauri/Wails/Electron. Use `bundleStrategy: 'single'` to limit concurrent requests.

**Browser Extension**: Use `adapter-static` or community adapters.

**Embedded Device**: Use `bundleStrategy: 'single'` for low-power devices.

## Web APIs

Standard `fetch` available in hooks, server routes, browser. Special version in `load` functions, server hooks, API routes invokes endpoints directly during SSR without HTTP calls, preserving credentials. Server-side `fetch` outside `load` requires explicit `cookie`/`authorization` headers. Allows relative requests.

`Request` accessible in hooks/server routes as `event.request`. Methods: `request.json()`, `request.formData()`.

`Response` returned from `await fetch(...)` and `+server.js` handlers.

`Headers` interface reads `request.headers`, sets `response.headers`:
```js
import { json } from '@sveltejs/kit';
export function GET({ request }) {
	return json({ userAgent: request.headers.get('user-agent') }, 
		{ headers: { 'x-custom-header': 'potato' } });
}
```

`FormData` for HTML form submissions:
```js
export async function POST(event) {
	const body = await event.request.formData();
	return json({ name: body.get('name') ?? 'world' });
}
```

Streams: `ReadableStream`, `WritableStream`, `TransformStream` for large/chunked responses.

URL APIs: `URL` interface in `event.url` (hooks/server routes), `page.url` (pages). Query parameters via `url.searchParams.get('foo')`.

Web Crypto: `crypto` global available, e.g., `crypto.randomUUID()`.

## Editor Setup

Recommended: Visual Studio Code with Svelte extension.