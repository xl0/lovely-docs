
## Directories

### getting-started
Initial setup, project structure, deployment options, and standard Web API usage in SvelteKit.

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

### core-concepts
Fundamental patterns for routing, data loading, form handling, rendering control, state management, and type-safe client-server communication in SvelteKit.

## Routing

Filesystem-based routing via `src/routes` directory. Files prefixed with `+` are route files.

**Page files**: `+page.svelte` (component), `+page.js`/`+page.server.js` (load functions), `+page.server.js` (server-only operations, form actions)

**Layout files**: `+layout.svelte` (wraps pages with `{@render children()}`), `+layout.js`/`+layout.server.js` (load functions, data available to children)

**Error handling**: `+error.svelte` (customizes error pages, walks tree to find closest boundary), falls back to `src/error.html`

**API routes**: `+server.js` exports HTTP handlers (`GET`, `POST`, etc.), can coexist with `+page` via content negotiation

**Type safety**: Use auto-generated `$types` module with `PageProps`, `LayoutProps`, `PageLoad`, `PageServerLoad`

## Loading Data

Define load functions in `+page.js`/`+page.server.js` or `+layout.js`/`+layout.server.js`. Return values available via `data` prop.

**Universal** (`+page.js`): Runs on server and browser, can return non-serializable data.
**Server** (`+page.server.js`): Runs only on server, must return serializable data.

Layout data available to children. Access parent data with `await parent()`. Load receives `url`, `route`, `params`.

Use provided `fetch` (not native)—inherits cookies, allows relative URLs on server, inlines responses during SSR.

Return unresolved promises for non-essential data to enable streaming.

Load reruns when `params`, `url`, or dependencies change. Manually trigger with `invalidate(url)` or `invalidateAll()`.

```js
export async function load({ params, fetch, depends }) {
	depends('app:random');
	return {
		post: await fetch(`/api/posts/${params.slug}`).then(r => r.json()),
		comments: loadComments(params.slug)
	};
}
```

Throw errors with `error(401, 'not logged in')` or redirect with `redirect(307, '/login')`.

## Form Actions

Export `actions` from `+page.server.js` to handle POST submissions.

```js
export const actions = {
	default: async ({ request }) => {
		const data = await request.formData();
		return { success: true };
	},
	login: async (event) => {},
	register: async (event) => {}
};
```

Invoke default with `<form method="POST">`, named actions with `<form method="POST" action="?/register">`.

Return `fail(400, { email, missing: true })` for validation errors. Return values available as `form` prop.

Progressive enhancement via `use:enhance` directive:
```svelte
<script>
	import { enhance } from '$app/forms';
</script>
<form method="POST" use:enhance>
```

## Page Options

Control per-page rendering behavior via exports in `+page.js`, `+page.server.js`, `+layout.js`, or `+layout.server.js`:

- `prerender = true/'auto'`: Render pages at build time as static HTML. Use `entries()` function for dynamic routes.
- `ssr = false`: Render only on client, skip server rendering.
- `csr = false`: No JavaScript shipped, static HTML only.
- `trailingSlash = 'never'/'always'/'ignore'`: Control trailing slash behavior.
- `config`: Adapter-specific configuration.

## State Management

**Avoid shared state on server**: Authenticate with cookies, use databases instead of shared variables.

**Load functions must be pure**: Return data instead of writing to stores.

**Use context API**: Attach state to component tree with `setContext`/`getContext` instead of globals.

**Component state is preserved**: Components reuse on navigation; use `$derived` for reactivity or `{#key}` to force remounting.

**URL for persistent state**: Store filters/sorting in URL search parameters.

**Snapshots for ephemeral state**: Use snapshots for temporary UI state.

## Remote Functions

Type-safe client-server communication via `.remote.js` files. Four types: **query** (read data, cached, refreshable), **form** (write data with validation), **command** (write data callable from anywhere), **prerender** (build-time static data).

```js
export const getPost = query(v.string(), async (slug) => {
	return await db.sql`SELECT * FROM post WHERE slug = ${slug}`;
});

export const createPost = form(v.object({title: v.string(), content: v.string()}), async (data) => {
	await db.sql`INSERT INTO post VALUES (...)`;
});

export const addLike = command(v.string(), async (id) => {
	await db.sql`UPDATE item SET likes = likes + 1 WHERE id = ${id}`;
	getLikes(id).refresh();
});
```

Enable with `kit.experimental.remoteFunctions: true` in config.

### build-and-deploy
Adapters deploy SvelteKit apps to various platforms with platform-specific configuration and runtime APIs.

## Building

SvelteKit builds in two stages: Vite optimizes code, then an adapter tunes it for the target environment. Prevent build-time code execution using the `building` flag from `$app/environment`. Preview with `vite preview`.

## Adapters

Adapters are deployment plugins configured in `svelte.config.js` that transform built apps for specific platforms. Official adapters: Cloudflare, Netlify, Node, static sites, and Vercel. Access platform-specific context via `RequestEvent.platform`.

## Deployment Options

**adapter-auto** automatically detects and uses the correct adapter for Cloudflare Pages, Netlify, Vercel, Azure Static Web Apps, AWS (via SST), or Google Cloud Run.

**Node.js**: Install `@sveltejs/adapter-node`. Configure via environment variables: `PORT` (3000), `HOST` (0.0.0.0), `ORIGIN`, `PROTOCOL_HEADER`, `HOST_HEADER`, `ADDRESS_HEADER`, `XFF_DEPTH`, `BODY_SIZE_LIMIT` (512kb), `SHUTDOWN_TIMEOUT` (30s). Listen to `sitelkit:shutdown` event for graceful cleanup. Custom server example:
```js
import { handler } from './build/handler.js';
import express from 'express';
const app = express();
app.use(handler);
app.listen(3000);
```

**Static Site Generation**: Use `adapter-static` with `export const prerender = true;` in root layout. Options: `pages` (output dir), `fallback` (for SPA), `precompress`, `strict`, `trailingSlash`.

**Single-Page Apps**: Use `adapter-static` with `fallback` option and `export const ssr = false;` in root layout. Optionally prerender specific pages with `export const prerender = true;`. Note: poor performance, SEO penalties, requires JavaScript.

**Cloudflare**: Use `adapter-cloudflare`. Options: `fallback` (plaintext or spa), `routes` (customize `_routes.json`). Access bindings via `platform.env`. Use `read()` from `$app/server` instead of `fs`. Enable `nodejs_compat` flag if needed.

**Netlify**: Use `adapter-netlify` with `edge` and `split` options. Requires `netlify.toml`. Access context via `event.platform?.context`. Supports `_headers`, `_redirects`, Forms, and custom Functions.

**Vercel**: Use `adapter-vercel`. Route configuration:
```js
export const config = {
	split: true,
	runtime: 'edge',  // or 'nodejs20.x'
	regions: ['iad1'],
	memory: 1024,
	isr: { expiration: 60, bypassToken: TOKEN, allowQuery: ['search'] }
};
```
Image optimization: `adapter({ images: { sizes: [640, 1920], formats: ['image/webp'] } })`. Use `$env/static/private` for environment variables.

## Custom Adapters

Export a function returning an `Adapter` object with required `name` and `adapt(builder)` properties. The `adapt` method must clear build directory, write output via `builder.writeClient/Server/Prerendered()`, generate code that imports `Server`, creates app with `builder.generateManifest()`, converts platform requests to `Request`, calls `server.respond()`, and returns `Response`. Expose platform info via `platform` option and shim `fetch` globally if needed.

### advanced-techniques
Advanced SvelteKit patterns for routing, hooks, error handling, navigation, service workers, security, state management, and library publishing.

## Routing
- **Rest parameters**: `[...file]` matches variable segments
- **Optional parameters**: `[[lang]]/home` matches `/home` and `/en/home`
- **Matchers**: Validate parameters in `src/params/fruit.js` with `export function match(param)`; use as `[page=fruit]`
- **Route sorting**: Specificity > matchers > alphabetical; rest/optional params lowest priority unless final
- **Encoding**: `/` → `[x+2f]`, `:` → `[x+3a]`, `🤪` → `[u+d83e][u+dd2a]`
- **Layout groups**: `(group)` directories organize routes without affecting URLs; use `+page@segment` to break layout hierarchy

## Hooks
App-wide functions for specific events in `src/hooks.server.js`, `src/hooks.client.js`, `src/hooks.js`.

**Server hooks**: `handle` (modify every request/response), `locals` (add custom data), `handleFetch` (modify fetch calls), `handleValidationError` (schema validation failures)

**Shared hooks**: `handleError` (log/customize errors), `init` (async initialization)

**Universal hooks**: `reroute` (translate URLs), `transport` (pass custom types across boundary)

Example:
```js
export async function handle({ event, resolve }) {
	if (event.url.pathname.startsWith('/custom')) return new Response('custom');
	const response = await resolve(event);
	response.headers.set('x-custom-header', 'value');
	return response;
}
```

## Error Handling
- **Expected errors**: Use `error(404, 'Not found')` helper; renders nearest `+error.svelte` with `page.error`
- **Unexpected errors**: Logged but not exposed (generic message shown); handle in `handleError` hook
- **Fallback page**: Customize with `src/error.html` using `%sveltekit.status%` and `%sveltekit.error.message%` placeholders

## Link Navigation
Configure `<a>` behavior with `data-sveltekit-*` attributes:
- `data-sveltekit-preload-data`: `"hover"` or `"tap"`
- `data-sveltekit-preload-code`: `"eager"`, `"viewport"`, `"hover"`, or `"tap"`
- `data-sveltekit-reload`: force full-page navigation
- `data-sveltekit-replacestate`: replace history instead of push
- `data-sveltekit-keepfocus`: keep focus on current element
- `data-sveltekit-noscroll`: prevent scroll to top

## Service Workers
SvelteKit automatically bundles `src/service-worker.js`. Access `$service-worker` module for assets, build files, version, and base path. Example caches built app and static files on install, cleans old caches on activate, serves from cache with network fallback on fetch.

## Server-only Modules
Mark modules as server-only using `.server` suffix or `$lib/server/` directory to prevent sensitive data leaks. SvelteKit blocks import chains from public code to server-only modules, including indirect imports. Works with dynamic imports; disabled during tests when `process.env.TEST === 'true'`.

## Snapshots
Preserve DOM state across navigation by exporting `snapshot` object with `capture` and `restore` methods from `+page.svelte` or `+layout.svelte`. Data stored in history stack and `sessionStorage`; must be JSON-serializable.

## Shallow Routing
Create history entries without navigating using `pushState(url, state)` and `replaceState(url, state)`. Access state via `page.state`. Use `preloadData(href)` to load data before shallow navigation. State is empty during SSR and initial page load; requires JavaScript.

## Observability
Enable OpenTelemetry in `svelte.config.js`:
```js
kit: {
	experimental: {
		tracing: { server: true },
		instrumentation: { server: true }
	}
}
```
Create `src/instrumentation.server.ts` for setup. Add custom attributes: `event.tracing.root.setAttribute('userId', user.id)`.

## Component Libraries
Use `@sveltejs/package` to build libraries. Structure: `src/lib` is public, `svelte-package` generates `dist` with preprocessed components and auto-generated types.

**package.json fields**:
- `exports`: Define entry points with `types` and `svelte` conditions
- `files`: Typically `["dist"]`
- `sideEffects`: Mark CSS: `["**/*.css"]`

**TypeScript**: Types auto-generated; use `typesVersions` for non-root exports or require `"moduleResolution": "bundler"`.

**Important**: All relative imports need full paths with extensions: `import { x } from './something/index.js'`

### best-practices
Production-ready patterns for authentication, performance optimization, accessibility, SEO, and asset handling in SvelteKit applications.

## Authentication
- **Sessions vs Tokens**: Sessions require DB queries but can be revoked immediately; JWTs offer better latency but cannot be revoked
- **Integration**: Check auth cookies in server hooks, store user info in `locals`
- **Lucia**: Recommended session-based auth library, add via `npx sv add lucia`

## Performance
- **Diagnostics**: Use PageSpeed Insights, WebPageTest, or browser devtools (Lighthouse, Network, Performance tabs) in preview mode
- **Images**: Use `@sveltejs/enhanced-img` for build-time optimization
- **Videos**: Compress to `.webm`/`.mp4`, lazy-load with `preload="none"`
- **Fonts**: Preload in `handle` hook, subset to reduce size
- **Code size**: Use `rollup-plugin-visualizer` to find large packages, replace JS analytics with server-side, use dynamic `import(...)` for conditional code, run third-party scripts in web workers with Partytown
- **Navigation**: Preload with link options, return promises from `load` for non-essential data, use server `load` functions to avoid waterfalls
- **Hosting**: Colocate frontend/backend, deploy to edge, use CDN for images, require HTTP/2+

## Icons
- **CSS approach**: Use Iconify CSS to include icons without per-file imports
- **Svelte approach**: Avoid icon libraries with one `.svelte` file per icon

## Images
- **Vite built-in**: Auto-processes imported assets with hashing and inlining
- **@sveltejs/enhanced-img**: Build-time plugin generating avif/webp formats, multiple sizes, intrinsic dimensions
  ```svelte
  <enhanced:img src="./image.jpg?w=1280;640;400" sizes="(min-width:1920px) 1280px, (min-width:1080px) 640px, (min-width:768px) 400px"/>
  ```
- **CDN-based**: For dynamic images using `@unpic/svelte` or provider-specific libraries
- **Best practices**: Serve via CDN, provide 2x resolution images, set `fetchpriority="high"` for LCP images, add width/height to prevent layout shift, always provide alt text

## Accessibility
- **Route announcements**: Set unique page titles in `<svelte:head>` for screen reader announcements during client-side navigation
- **Focus management**: SvelteKit focuses `<body>` after navigation (or an `autofocus` element if present), customize with `afterNavigate` hook or `goto` with `keepFocus` option
- **Language attribute**: Set `lang` attribute on `<html>` in `src/app.html`, use server handle hook for multi-language apps

## SEO
- **SSR enabled by default** for reliable search engine indexing
- **Performance matters** - use hybrid rendering and optimize images
- **Metadata**: Add unique `<title>` and `<meta name="description">` in `<svelte:head>`
- **Sitemaps**: Create dynamic sitemaps via endpoints
- **AMP support**: Set `inlineStyleThreshold: Infinity`, disable `csr`, transform HTML with `@sveltejs/amp` in server hooks

### appendix
Reference material covering FAQs, integrations, debugging, migration guides from v1 and Sapper, and terminology for SvelteKit development.

## Frequently Asked Questions

**Package Management**: Import JSON with `import pkg from './package.json' with { type: 'json' };`. Yarn 2/3 requires `nodeLinker: 'node-modules'` in `.yarnrc.yml`.

**Library Packaging**: Distribute Svelte components as uncompiled `.svelte` files with ESM-only JS. Use `svelte-package` for Svelte libraries. Validate with publint.dev.

**View Transitions**: Wrap navigation with `document.startViewTransition()`:
```js
import { onNavigate } from '$app/navigation';
onNavigate((navigation) => {
	if (!document.startViewTransition) return;
	return new Promise((resolve) => {
		document.startViewTransition(async () => {
			resolve();
			await navigation.complete;
		});
	});
});
```

**Client-side Code**: Check `browser` environment variable or use `onMount` for dynamic imports.

**Database**: Query via `db.js` singleton in server routes, setup in `hooks.server.js`.

**External APIs**: Use `event.fetch` in server routes, proxy via `server.proxy` in dev, or create API routes in production.

**Middleware**: Dev uses Vite plugin with `configureServer`. Production uses `adapter-node` middleware.

## Integrations

**vitePreprocess**: Enables CSS preprocessing (PostCSS, SCSS, Less, Stylus, SugarSS), included by default with TypeScript.

**Add-ons**: `npx sv add` installs prettier, eslint, vitest, playwright, lucia, tailwind, drizzle, paraglide, mdsvex, storybook.

**Alternatives**: `svelte-preprocess` supports Pug, Babel, global styles. Any Vite plugin from vitejs/awesome-vite works.

## Breakpoint Debugging

VSCode Debug Terminal: `CMD/Ctrl + Shift + P` → "Debug: JavaScript Debug Terminal" → `npm run dev`. Browser DevTools: `NODE_OPTIONS="--inspect" npm run dev` → open `localhost:5173` → click Node.js DevTools icon.

## Migration to v2

**Breaking Changes**:
- `error()` and `redirect()` no longer need `throw`
- Cookies require explicit `path: '/'`
- Top-level promises must be explicitly `await`ed
- `goto()` rejects external URLs; use `window.location.href`
- Paths relative by default; `preloadCode` needs `base` prefix
- `resolvePath` → `resolveRoute` (includes `base` automatically)
- `handleError` receives `status` and `message`
- Dynamic env vars blocked during prerendering
- `use:enhance` callbacks: `form`/`data` → `formElement`/`formData`
- File input forms need `enctype="multipart/form-data"`
- TypeScript: `moduleResolution: "bundler"`, `verbatimModuleSyntax`
- Node 18.13+, svelte@4, vite@5, typescript@5
- `$app/stores` deprecated; migrate to `$app/state`

## Migration from Sapper

**Setup**: Add `"type": "module"` to package.json. Replace `sapper` with `@sveltejs/kit` and adapter. Update scripts: `sapper build` → `vite build`, `sapper dev` → `vite dev`.

**Configuration**: Replace `webpack.config.js`/`rollup.config.js` with `svelte.config.js`.

**File Structure**: `src/template.html` → `src/app.html`, `_layout.svelte` → `+layout.svelte`, `_error.svelte` → `+error.svelte`, `routes/about.svelte` → `routes/about/+page.svelte`.

**API Changes**: `preload` → `load` in `+page.js`/`+layout.js` with single `event` argument. `@sapper/app` imports → `$app/navigation`, `$app/stores`. `stores()` → import `navigating`, `page` directly. No `this` object; throw `error()`, `redirect()`. Relative URLs resolve against current page, not base. `sapper:prefetch` → `data-sveltekit-preload-data`.

## Glossary

**Rendering Modes**: CSR (browser-based, default), SSR (server-side, default), Hybrid (SSR initial + CSR navigation), SPA (single HTML file, poor SEO), MPA (traditional server-rendered).

**Static Generation**: Prerendering (build-time HTML), SSG (all pages prerendered with `adapter-static`), ISR (on-demand with `adapter-vercel`).

**Other**: Hydration (server HTML enhanced with client interactivity), Routing (client-side navigation interception, skip with `data-sveltekit-reload`), Edge (CDN-based rendering), PWA (installable web app).

## Additional Resources

FAQs: SvelteKit FAQ, Svelte FAQ, vite-plugin-svelte FAQ. Examples: Official examples (realworld blog, HackerNews clone, svelte.dev), community examples on GitHub. Support: Discord, StackOverflow.

### api-reference
Complete TypeScript API reference for SvelteKit covering response helpers, request/event types, hooks, forms, navigation, environment variables, configuration, and auto-generated types.

## Core Response & Error Handling
- `json(data)`, `text(body)` - Create responses
- `error(status, body)`, `redirect(status, location)`, `fail(status, data)` - Throw errors/redirects
- `isHttpError()`, `isRedirect()`, `isActionFailure()` - Type guards

## Request & Page Types
- **RequestEvent**: `cookies`, `fetch`, `locals`, `params`, `url`, `setHeaders()`, `getClientAddress()`
- **LoadEvent**: Extends RequestEvent, adds `data`, `parent()`, `depends()`, `untrack()`
- **Page**: `url`, `params`, `route.id`, `status`, `error`, `data`, `state`, `form`
- **ActionResult**: `{type: 'success'|'failure'|'redirect'|'error', ...}`

## Hooks
- **handle**: `(input: {event, resolve}) => Response`
- **handleError**: `(input: {error, event, status, message}) => App.Error`
- **handleFetch**: `(input: {event, request, fetch}) => Response`
- **reroute**: `(event: {url, fetch}) => void | string`
- **sequence**: Chain multiple handle middleware with specific ordering

## Forms & Navigation
- **enhance**: Intercept form submissions, prevent default, update form state
- **applyAction**: Update `form` property and `page.status`
- **deserialize**: Deserialize form submission responses
- **goto(url, opts)**: Programmatic navigation with `replaceState`, `noScroll`, `keepFocus`, `invalidateAll`
- **invalidate(resource)**: Re-run load functions for resource
- **beforeNavigate/afterNavigate**: Navigation lifecycle hooks
- **preloadData(href)**: Preload page code and load functions

## Environment & Configuration
- **$app/environment**: `browser`, `building`, `dev`, `version` constants
- **$env/static/private**: Build-time private variables
- **$env/static/public**: Build-time public variables (PUBLIC_ prefix)
- **$env/dynamic/private**: Runtime private variables (server-only)
- **$env/dynamic/public**: Runtime public variables (PUBLIC_ prefix)
- **$app/state**: `navigating`, `page`, `updated` read-only state objects
- **$app/paths**: `asset(file)`, `resolve(pathname, params?)` - Path resolution with base path handling

## Cookies & Server
- `get(name)`, `getAll()`, `set(name, value, opts)`, `delete(name, opts)` - `path` required, `httpOnly`/`secure` default true
- **$app/server**: `command`, `form`, `query`, `query.batch`, `prerender`, `read` - Remote functions and asset reading
- **getRequestEvent**: Access current RequestEvent in server context

## Adapter & Build
- **Builder**: `log`, `rimraf`, `mkdirp`, `config`, `routes`, `writeClient()`, `writeServer()`, `generateManifest()`, `compress()`
- **Node utilities**: `createReadableStream(file)`, `getRequest({request, base, bodySizeLimit})`, `setResponse(res, response)`
- **installPolyfills()**: Install web API polyfills for Node.js

## Configuration (svelte.config.js)
- **adapter** - Platform output converter (required)
- **csp** - Content Security Policy with mode ('hash'|'nonce'|'auto')
- **csrf** - CSRF protection: checkOrigin, trustedOrigins
- **paths** - URL config: assets (CDN), base, relative
- **prerender** - concurrency, crawl, entries, origin
- **router.type** - 'pathname' (default) or 'hash'
- **version** - name, pollInterval

## Types
- **$types**: Auto-generated typed `RequestHandler`, `Load` functions, `PageData`, `LayoutData`, `ActionData`
- **$app/types**: `RouteId`, `Pathname`, `RouteParams<'/blog/[slug]'>`, `LayoutParams`
- **app.d.ts**: Ambient types for `Error`, `Locals`, `PageData`, `PageState`, `Platform`

## Service Worker
- **$service-worker**: `base`, `build`, `files`, `prerendered`, `version` constants for cache management


