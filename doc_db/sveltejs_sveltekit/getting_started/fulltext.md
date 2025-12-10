

## Pages

### creating_a_project
Initialize SvelteKit projects with `npx sv create`, organize pages as Svelte components in `src/routes` with server-side rendering, use VS Code + Svelte extension.

## Quick Start

Create a new SvelteKit project:

```sh
npx sv create my-app
cd my-app
npm run dev
```

The CLI scaffolds a new project and optionally sets up TypeScript and other tooling. Development server runs on localhost:5173.

## Core Concepts

- Each page is a Svelte component
- Pages are created by adding files to `src/routes` directory
- Pages are server-rendered on first visit for performance, then client-side app takes over

## Editor Setup

Recommended: Visual Studio Code with the Svelte extension. Other editors are also supported via the Svelte Society editor support collection.

### project_types
SvelteKit supports multiple rendering modes (SSR/CSR hybrid default, SSG, SPA, MPA) and deployment targets (serverless, own server, containers, mobile/desktop apps, browser extensions, embedded devices) via configurable adapters.

## Default rendering

SvelteKit uses hybrid rendering by default: server-side rendering (SSR) for the initial page load (improves SEO and perceived performance), then client-side rendering (CSR) for subsequent pages (faster navigation without re-rendering common components). This approach is called transitional apps.

## Static site generation

Use `adapter-static` to fully prerender your site as a static site generator (SSG). Alternatively, use the `prerender` page option to prerender only specific pages while dynamically server-rendering others with a different adapter. For very large statically generated sites, use `adapter-vercel` with Incremental Static Regeneration (ISR) to avoid long build times. SvelteKit allows mixing different rendering types on different pages.

## Single-page app

Build SPAs with SvelteKit using exclusive client-side rendering (CSR). Write your backend in SvelteKit or another language/framework. If using a separate backend, ignore `server` files in the docs.

## Multi-page app

SvelteKit isn't typically used for traditional MPAs, but you can:
- Remove all JavaScript on a page with `csr = false` to render subsequent links on the server
- Use `data-sveltekit-reload` to render specific links on the server

## Separate backend

Deploy your SvelteKit frontend separately from a backend written in Go, Java, PHP, Ruby, Rust, or C#. Recommended approach: use `adapter-node` or a serverless adapter. Alternative: deploy as an SPA served by your backend server (but has worse SEO and performance). Ignore `server` files in the docs. Reference the FAQ for making calls to a separate backend.

## Serverless app

Use `adapter-auto` for zero-config deployment to supported platforms, or use platform-specific adapters: `adapter-vercel`, `adapter-netlify`, `adapter-cloudflare`. Community adapters support almost any serverless environment. Some adapters offer an `edge` option for edge rendering to improve latency.

## Your own server

Deploy to your own server or VPS using `adapter-node`.

## Container

Run SvelteKit apps in containers (Docker, LXC) using `adapter-node`.

## Library

Create a library for other Svelte apps using the `@sveltejs/package` add-on by choosing the library option when running `sv create`.

## Offline app

SvelteKit has full service worker support for building offline apps and progressive web apps (PWAs).

## Mobile app

Turn a SvelteKit SPA into a mobile app with Tauri or Capacitor. Mobile features (camera, geolocation, push notifications) available via plugins. These platforms start a local web server and serve your app like a static host on your phone. Use `bundleStrategy: 'single'` to limit concurrent requests (e.g., Capacitor's HTTP/1 local server limits concurrent connections).

## Desktop app

Turn a SvelteKit SPA into a desktop app with Tauri, Wails, or Electron.

## Browser extension

Build browser extensions using `adapter-static` or community adapters tailored for browser extensions.

## Embedded device

Svelte's efficient rendering runs on low-power devices. Microcontrollers and TVs may limit concurrent connections. Use `bundleStrategy: 'single'` to reduce concurrent requests.

### project_structure
Standard directory layout: src/ (lib/, server/, params/, routes/, app.html, error.html, hooks, service-worker, tracing), static/, tests/, config files (package.json with ES modules, svelte.config.js, tsconfig.json, vite.config.js)

## Directory structure

A typical SvelteKit project has this layout:

```
my-project/
├ src/
│ ├ lib/
│ │ ├ server/          [server-only lib files]
│ │ └ [lib files]
│ ├ params/            [param matchers]
│ ├ routes/            [routes]
│ ├ app.html
│ ├ error.html
│ ├ hooks.client.js
│ ├ hooks.server.js
│ ├ service-worker.js
│ └ tracing.server.js
├ static/              [static assets]
├ tests/               [tests]
├ package.json
├ svelte.config.js
├ tsconfig.json
└ vite.config.js
```

## src directory

The `src` directory contains the project core. Everything except `src/routes` and `src/app.html` is optional.

- **lib**: Library code (utilities, components). Imported via `$lib` alias or packaged with `svelte-package`
  - **server**: Server-only code. Imported via `$lib/server` alias. SvelteKit prevents importing in client code
- **params**: Param matchers for advanced routing
- **routes**: Application routes. Can colocate route-specific components here
- **app.html**: Page template with placeholders:
  - `%sveltekit.head%` — `<link>` and `<script>` elements, plus `<svelte:head>` content
  - `%sveltekit.body%` — rendered page markup (should be inside a `<div>` or similar, not directly in `<body>`)
  - `%sveltekit.assets%` — either `paths.assets` or relative path to `paths.base`
  - `%sveltekit.nonce%` — CSP nonce for manually included links/scripts
  - `%sveltekit.env.[NAME]%` — replaced at render time with environment variable (must start with `publicPrefix`, usually `PUBLIC_`)
  - `%sveltekit.version%` — app version from configuration
- **error.html**: Fallback error page with placeholders:
  - `%sveltekit.status%` — HTTP status
  - `%sveltekit.error.message%` — error message
- **hooks.client.js**: Client hooks
- **hooks.server.js**: Server hooks
- **service-worker.js**: Service worker
- **tracing.server.js**: Observability setup and instrumentation (requires adapter support, runs before app code)

If Vitest is added, unit tests live in `src` with `.test.js` extension.

## Other directories and files

- **static**: Static assets served as-is (robots.txt, favicon.png, etc.)
- **tests**: Playwright browser tests (if added during setup)
- **package.json**: Must include `@sveltejs/kit`, `svelte`, `vite` as devDependencies. Includes `"type": "module"` for ES modules (`.cjs` for CommonJS)
- **svelte.config.js**: Svelte and SvelteKit configuration
- **tsconfig.json** or **jsconfig.json**: TypeScript configuration. SvelteKit generates `.svelte-kit/tsconfig.json` which your config extends
- **vite.config.js**: Vite configuration using `@sveltejs/kit/vite` plugin
- **.svelte-kit**: Generated directory (configurable as `outDir`). Can be deleted anytime, regenerated on dev/build

### web-standards
Web APIs available in SvelteKit: fetch (with special SSR version), Request/Response/Headers, FormData, Streams, URL/URLSearchParams, and Web Crypto.

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

