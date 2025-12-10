
## Directories

### getting_started
Initial setup, project structure, rendering modes, and standard web APIs available in SvelteKit.

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

### core_concepts
Filesystem routing, load functions for data, form actions for mutations, page options for rendering strategy, state management patterns, and type-safe remote functions for client-server communication.

# Core Concepts

## Routing
Filesystem-based routing in `src/routes` directory. Route files use `+` prefix:
- `+page.svelte`: page component (SSR + CSR)
- `+page.js`: universal load function (server + browser)
- `+page.server.js`: server-only load function with database/env access
- `+layout.svelte`/`+layout.js`/`+layout.server.js`: layouts apply to directory and subdirectories
- `+error.svelte`: error boundary, walks up tree to find closest handler
- `+server.js`: API routes exporting HTTP handlers (GET, POST, PATCH, PUT, DELETE, OPTIONS, HEAD)

Load functions provide data to components via `data` prop. `+server.js` exports HTTP verb handlers returning Response. `$types` provides auto-generated type safety for load functions and components.

## Load Functions
Load functions return data to components. Universal loads (`+page.js`, `+layout.js`) run on server during SSR and in browser during navigation, can return any values. Server loads (`+page.server.js`, `+layout.server.js`) run server-only, must return serializable data (JSON, BigInt, Date, Map, Set, RegExp, promises).

Receive `params` (route parameters), `url` (URL object), `route` (route ID), `fetch` (credentialed fetch), `setHeaders` (cache headers), `parent()` (parent layout data), `depends(url)` (manual dependency), `untrack(fn)` (exclude from tracking).

Throw `error(status, message)` for errors, use `redirect(status, location)` for redirects. Streaming: return promises from server loads, they resolve on client. Rerun when params/url change, parent reruns, or `invalidate(url)` / `invalidateAll()` called. Search parameters tracked independently.

## Form Actions
Export `actions` from `+page.server.js` to handle POST from `<form>`. Default action or named actions via query parameter (`?/actionName`). Receive `RequestEvent`, read form data with `request.formData()`. Return data available as `form` prop and `page.form` app-wide.

Use `fail(status, data)` for validation errors (typically 400/422). Use `redirect(status, location)` to redirect after action. Page re-renders with action return value unless redirect/error. Load functions run after action completes.

Progressive enhancement with `use:enhance` directive (no full-page reload). Customize with `SubmitFunction` callback receiving `{ formElement, formData, action, cancel, submitter }` returning async callback with `{ result, update }`. Use `applyAction(result)` to apply result manually. `deserialize()` response (not JSON.parse) to handle Date/BigInt.

## Page Options
Export from `+page.js`, `+page.server.js`, `+layout.js`, or `+layout.server.js`:
- `prerender`: true/false/'auto' - render at build time as static HTML
- `ssr`: false - render only on client (empty shell)
- `csr`: false - no JavaScript, HTML/CSS only
- `trailingSlash`: 'never'/'always'/'ignore' - control trailing slash behavior
- `config`: adapter-specific configuration object

Child layouts/pages override parent values. Prerenderer crawls from root following `<a>` links; specify additional pages via `config.kit.prerender.entries`. Pages with form actions cannot be prerendered. Accessing `url.searchParams` during prerendering forbidden.

## State Management
Never store shared state in server variables (visible to all users). Load functions must be pure, don't write to stores. Use context API to safely share state per-request/user via `setContext`/`getContext`. Component state preserved on navigation (data props update but lifecycle methods don't rerun) - use `$derived` for reactivity, `afterNavigate`/`beforeNavigate` for code that must rerun, `{#key}` to destroy/remount.

Store URL-affecting state in search parameters (`?sort=price`). Use snapshots for ephemeral UI state (accordion open/closed) surviving navigation but not page refresh.

## Remote Functions
Type-safe client-server communication via `.remote.js`/`.remote.ts` files. Four types:
- `query(schema?, fn)`: read dynamic data, returns Promise-like with `loading`, `error`, `current`, or `await`. Caches per-page. Call `.refresh()` to re-fetch. Use `query.batch(schema, fn)` for n+1 problem.
- `form(schema, fn)`: write data, returns object with `method`, `action` for non-JS fallback, progressive enhancement. Access fields via `form.fields.fieldName.as(type)`. Validate with `.validate()`, `.preflight()`. Get/set values with `.value()`, `.set()`. Use `.enhance()` for custom submission, `.for(id)` for repeated forms, `.buttonProps` for multiple buttons.
- `command(schema, fn)`: write from anywhere, not tied to elements. Cannot call during render. Update queries via `.refresh()` or `.updates(query)`.
- `prerender(schema?, fn, options)`: build-time static data, cached via Cache API. Specify inputs via `inputs()` option. Excluded from server bundle by default; set `dynamic: true` to allow non-prerendered arguments.

Validate arguments with Standard Schema (Zod, Valibot). Both arguments and return values serialize via devalue. Single-flight mutations: server-side call `.refresh()` or `.set()` in form handler, client-side use `.updates()`. Sensitive fields use leading underscore to prevent repopulation. Use `getRequestEvent()` to access cookies/auth. Return `{ redirect: location }` from command instead of `redirect()`.


### build_and_deploy
Build process, deployment adapters (official and custom), and platform-specific configuration for Cloudflare, Netlify, Node, static sites, and Vercel.

## Build Process

SvelteKit builds in two stages via `vite build`:
1. **Vite optimization**: Creates optimized production builds of server, browser, and service worker code. Prerendering executes here if configured.
2. **Adapter tuning**: Adapter optimizes the build for the target deployment environment.

Code that shouldn't execute at build time must check the `building` flag from `$app/environment`:
```js
import { building } from '$app/environment';
if (!building) { setupMyDatabase(); }
```

Preview production builds locally with `vite preview` (doesn't perfectly reproduce deployed app).

## Adapters Overview

Adapters are deployment plugins configured in `svelte.config.js` that transform built SvelteKit apps into deployment-ready output.

**Official adapters**:
- `@sveltejs/adapter-cloudflare` — Cloudflare Workers/Pages
- `@sveltejs/adapter-netlify` — Netlify
- `@sveltejs/adapter-node` — Node servers
- `@sveltejs/adapter-static` — Static site generation
- `@sveltejs/adapter-vercel` — Vercel

Platform-specific context available via `RequestEvent.platform` (e.g., Cloudflare's `env` object with KV namespaces).

## adapter-auto (Zero-Config)

Default adapter that automatically detects deployment environment and uses the appropriate adapter. Supports Cloudflare Pages, Netlify, Vercel, Azure Static Web Apps, AWS via SST, Google Cloud Run. Install specific adapter for config options and CI optimization. Does not accept configuration options.

## adapter-node

Build standalone Node.js servers. Configuration via environment variables:
- `PORT`, `HOST`, `SOCKET_PATH` (default `0.0.0.0:3000`)
- `ORIGIN` or `PROTOCOL_HEADER`/`HOST_HEADER`/`PORT_HEADER` for reverse proxies
- `ADDRESS_HEADER`, `XFF_DEPTH` for client IP behind proxies
- `BODY_SIZE_LIMIT` (default 512kb, supports K/M/G suffixes)
- `SHUTDOWN_TIMEOUT` (default 30s)

Adapter options:
```js
adapter({
  out: 'build',
  precompress: true,
  envPrefix: ''
})
```

Graceful shutdown: listen to `sveltekit:shutdown` event for cleanup. Supports systemd socket activation with `IDLE_TIMEOUT`. Custom server via `handler.js` middleware for Express/Connect/Polka/Node http.

For response compression, use `@polka/compression` (not `compression` package, which doesn't support streaming).

Load `.env` files: in dev/preview SvelteKit reads automatically; in production use `node -r dotenv/config build` or Node v20.6+ `node --env-file=.env build`.

## adapter-static

Prerender entire SvelteKit site as static files. Configuration:
```js
adapter({
  pages: 'build',
  assets: 'build',
  fallback: undefined,
  precompress: false,
  strict: true
})
```

Set `trailingSlash: 'always'` if host doesn't render `/a.html` for `/a` requests.

**GitHub Pages**: Set `paths.base` to repo name, use `fallback: '404.html'`, add `.nojekyll` to `static/` if not using GitHub Actions.

## Single-Page Apps (SPA)

Configure SvelteKit as client-rendered SPA using `adapter-static` with fallback page. Disable SSR globally with `export const ssr = false` in `+layout.js`. Significant performance/SEO drawbacks: multiple network round trips before content displays, harms Core Web Vitals, fails accessibility if JS disabled. Mitigation: prerender as many pages as possible, especially homepage.

Fallback page serves any unhandled URLs. Avoid `index.html` to prevent conflicts with prerendering. Consult host docs for correct fallback filename (e.g., Surge uses `200.html`).

Re-enable `ssr` and `prerender` for specific pages to server-render them during build to static `.html` files.

Apache configuration example:
```
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^200\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /200.html [L]
</IfModule>
```

## adapter-cloudflare

Deploy to Cloudflare Workers or Pages. Configuration:
```js
adapter({
  config: undefined,
  platformProxy: { configPath, environment, persist },
  fallback: 'plaintext',
  routes: { include: ['/*'], exclude: ['<all>'] }
})
```

**Workers**: Create `wrangler.jsonc`:
```jsonc
{
  "name": "<any-name>",
  "main": ".svelte-kit/cloudflare/_worker.js",
  "compatibility_date": "2025-01-01",
  "assets": {
    "binding": "ASSETS",
    "directory": ".svelte-kit/cloudflare"
  }
}
```

**Pages**: Use Git integration with framework preset SvelteKit, build command `npm run build`, output directory `.svelte-kit/cloudflare`. Functions in `/functions` directory are NOT included; implement as SvelteKit server endpoints instead.

Access Cloudflare bindings via `platform.env`:
```js
declare global {
  namespace App {
    interface Platform {
      env: {
        YOUR_KV_NAMESPACE: KVNamespace;
        YOUR_DURABLE_OBJECT_NAMESPACE: DurableObjectNamespace;
      };
    }
  }
}
export async function POST({ request, platform }) {
  const x = platform?.env.YOUR_DURABLE_OBJECT_NAMESPACE.idFromName('x');
}
```

Local emulation: Cloudflare values in `platform` are emulated during dev/preview. For build testing use Wrangler v4: `wrangler dev .svelte-kit/cloudflare` (Workers) or `wrangler pages dev .svelte-kit/cloudflare` (Pages).

Troubleshooting: Add `nodejs_compat` flag for Node.js compatibility. Can't use `fs` in Workers; use `read()` from `$app/server` or prerender routes. Single bundled file must not exceed Cloudflare size limits.

Migration from deprecated `adapter-cloudflare-workers`: Replace adapter, remove `site` config, add `assets.directory` and `assets.binding` to wrangler config.

## adapter-netlify

Deploy to Netlify. Configuration:
```js
adapter({
  edge: false,
  split: false
})
```

Requires `netlify.toml`:
```toml
[build]
  command = "npm run build"
  publish = "build"
```

Set `edge: true` for Deno-based edge functions instead of Node. Set `split: true` to deploy each route as individual function.

**Netlify Forms**: Create HTML form with hidden `form-name` input, prerender the form page (`export const prerender = true`). For custom success messages, ensure success page exists and is prerendered.

**Netlify Functions**: SvelteKit endpoints become Netlify Functions. Access Netlify context via `event.platform?.context` in hooks and server endpoints.

Place `_headers` and `_redirects` files in project root for static asset responses. Use `_redirects` instead of `[[redirects]]` in `netlify.toml` (higher priority). Don't add custom catch-all rules.

Add custom Netlify functions by creating directory and configuring in `netlify.toml`:
```toml
[functions]
  directory = "functions"
```

Troubleshooting: Can't use `fs` in edge deployments; use `read()` from `$app/server` instead (works in both edge and serverless) or prerender routes.

## adapter-vercel

Deploy to Vercel. Configuration:
```js
adapter({
  images: { sizes, formats, minimumCacheTTL, domains },
  // route-level config via export const config = { ... }
})
```

Control route deployment via `export const config` in `+server.js`, `+page(.server).js`, or `+layout(.server).js`:
```js
export const config = {
  split: true,
  runtime: 'edge' | 'nodejs20.x' | 'nodejs22.x',
  regions: ['iad1'],
  memory: 1024,
  maxDuration: 10,
  isr: { expiration, bypassToken, allowQuery }
}
```

**Incremental Static Regeneration (ISR)**: Only use on routes where all visitors see same content (no user-specific data). Generate bypass token: `crypto.randomUUID()` (≥32 chars). Set as `BYPASS_TOKEN` environment variable on Vercel. Pull locally: `vercel env pull .env.development.local`. Bypass cache via `__prerender_bypass=<token>` cookie or `x-prerender-revalidate: <token>` header.

**Skew Protection**: Vercel routes requests to original deployment via cookie with deployment ID. When user reloads, they get newest deployment. `updated.current` is exempt and reports new deployments. Enable in Advanced project settings. Caveat: multiple tabs with different versions will route older tabs to newer deployment, triggering SvelteKit's built-in skew protection.

Environment variables from `$env/static/private` and `$env/dynamic/private` accessible on Vercel. Pass to client via server load.

Troubleshooting: Can't use `fs` in edge functions. In serverless functions, use `read()` from `$app/server` instead (works in edge functions too by fetching from deployed public assets) or prerender routes. When using `read()` in edge functions with Deployment Protection enabled, must enable Protection Bypass for Automation.

## Writing Custom Adapters

Adapter packages export default function returning `Adapter` object:
```js
export default function (options) {
  return {
    name: 'adapter-package-name',
    async adapt(builder) {
      // implementation
    },
    async emulate() {
      return {
        async platform({ config, prerender }) {
          // returned object becomes event.platform during dev, build, preview
        }
      }
    },
    supports: {
      read: ({ config, route }) => true/false,
      tracing: () => true/false
    }
  }
}
```

**Adapt method requirements**:
1. Clear build directory
2. Write SvelteKit output using `builder.writeClient()`, `builder.writeServer()`, `builder.writePrerendered()`
3. Output code that:
   - Imports `Server` from `${builder.getServerDirectory()}/index.js`
   - Instantiates app with manifest from `builder.generateManifest({ relativePath })`
   - Listens for platform requests, converts to standard `Request` if needed
   - Calls `server.respond(request, { getClientAddress })` to generate `Response`
   - Exposes platform-specific information via `platform` option to `server.respond()`
   - Globally shims `fetch` if necessary (SvelteKit provides `@sveltejs/kit/node/polyfills` for undici-compatible platforms)
4. Bundle output to avoid requiring dependencies on target platform (if necessary)
5. Place user's static files and generated JS/CSS in correct location for target platform

Recommended: place adapter output under `build/` directory with intermediate output under `.svelte-kit/[adapter-name]`. Look at source code of existing adapters for similar platforms as starting point.

### advanced_features
Advanced routing, hooks, error handling, link optimization, service workers, server-only modules, state preservation, shallow routing, observability, and component library packaging.

## Advanced Routing

**Rest Parameters**: `[...file]` matches variable segments. `/[org]/[repo]/tree/[branch]/[...file]` extracts all path parts. Validate with matchers. Enable custom 404 handling via catch-all routes.

**Optional Parameters**: `[[lang]]/home` matches both `home` and `en/home`. Cannot follow rest parameters.

**Matchers**: Restrict parameter values with `src/params/fruit.js` exporting `match(param)` function. Use in routes: `[page=fruit]`. Run on server and browser.

**Route Sorting**: When multiple routes match, priority is: static > dynamic > matchers > optional/rest. Alphabetical tiebreaker.

**Encoding**: Filesystem/URL-reserved characters use hex escapes `[x+nn]`: `\`→`[x+5c]`, `/`→`[x+2f]`, `:`, `*`, `?`, `"`, `<`, `>`, `|`, `#`, `%`, `[`, `]`, `(`, `)`. Unicode: `[u+nnnn]` or literal emoji.

**Route Groups**: Parenthesized directories `(app)`, `(marketing)` don't affect URL, enable different layouts per route set without affecting `/admin` routes.

**Layout Reset**: `@` suffix on `+page.svelte` or `+layout.svelte` breaks out of layout hierarchy. `+page@(app).svelte` inherits `(app)/+layout.svelte`. `+page@.svelte` inherits root layout. `+layout@.svelte` resets for all children.

## Hooks

**handle**: Runs every request. Modify response, bypass SvelteKit, transform HTML chunks, filter headers, control preloading. `resolve(event, { transformPageChunk, filterSerializedResponseHeaders, preload })`.

**locals**: Populate `event.locals` with custom data (e.g., user info from cookies) accessible in `+server.js` and server `load` functions.

**handleFetch**: Intercept `event.fetch` calls. Rewrite URLs, forward cookies to cross-origin APIs. Same-origin requests forward `cookie`/`authorization` headers by default; cross-origin includes cookies only for subdomains.

**handleValidationError**: Called when remote function receives invalid arguments. Return object matching `App.Error` shape.

**handleError**: Called on unexpected errors during loading/rendering/endpoints. Receives `error`, `event`, `status`, `message`. Log to services like Sentry. Not called for expected errors from `error()` helper. Must never throw.

**init**: Runs once at startup (server) or app start (browser). Async initialization like database connections. Top-level await equivalent.

**reroute**: Runs before `handle`. Changes URL-to-route mapping. Returns pathname used for route selection. Can be async (v2.18+) with `fetch` argument. Must be pure/idempotent; result cached on client.

**transport**: Custom type serialization across server/client boundary. Each type has `encode` (server) and `decode` (client) functions. Example: `Vector: { encode: v => v instanceof Vector && [v.x, v.y], decode: ([x,y]) => new Vector(x,y) }`.

## Errors

**Expected Errors**: Created with `error(404, { message: 'Not found' })` or `error(404, 'Not found')`. Caught by SvelteKit, sets status, renders nearest `+error.svelte` with `page.error`.

**Unexpected Errors**: Any exception not from `error()` helper. Default response: `{ "message": "Internal Error" }`. Pass through `handleError` hook for custom handling.

**Custom Error Shape**: Declare `App.Error` interface in `src/app.d.ts` with additional properties like `code`, `id`.

**Fallback Error Page**: Customize `src/error.html` with `%sveltekit.status%` and `%sveltekit.error.message%` placeholders.

**Error Boundaries**: Errors in `load` render nearest `+error.svelte`. Errors in root `+layout.js`/`+layout.server.js` use fallback page (root layout would contain error boundary).

## Link Options

**data-sveltekit-preload-data**: Preload page code and data. Values: `"hover"` (default), `"tap"`. Skipped if `navigator.connection.saveData` is true. Programmatic: `preloadData()` from `$app/navigation`.

**data-sveltekit-preload-code**: Preload only code with eagerness: `"eager"`, `"viewport"`, `"hover"`, `"tap"`. Only applies to links in DOM after navigation. No effect if `preload-data` is more eager. Respects `saveData`.

**data-sveltekit-reload**: Force full-page navigation instead of client-side. Same as `rel="external"`.

**data-sveltekit-replacestate**: Use `replaceState` instead of `pushState` for history.

**data-sveltekit-keepfocus**: Retain focus on currently focused element after navigation. Useful for search forms.

**data-sveltekit-noscroll**: Prevent scroll to top after navigation. Default scrolls to top unless link has `#hash`.

**Disabling**: Set attribute to `"false"` to disable inherited options. Works on `<form method="GET">` too.

## Service Workers

**Automatic Registration**: If `src/service-worker.js` or `src/service-worker/index.js` exists, auto-bundled and registered on page load.

**$service-worker Module**: Access `build` (built app files), `files` (static assets), `version` (app version for cache names), `base` (deployment base path).

**Example Strategy**: Cache-first for assets, network-first for dynamic content. Install handler caches all assets. Activate handler cleans old caches. Fetch handler serves cached assets, tries network with cache fallback.

**Development**: Only works in browsers supporting ES modules in service workers. Manual registration requires `type: dev ? 'module' : 'classic'`. `build` and `prerendered` are empty during dev.

**Caching Considerations**: Stale cached data worse than unavailable. Browsers auto-clear when full; avoid caching large assets.

## Server-only Modules

**Purpose**: Prevent accidental exposure of sensitive data (API keys, private env vars) to browser.

**Private Env Vars**: `$env/static/private` and `$env/dynamic/private` only importable in server-only code.

**Server-only Utilities**: `$app/server` module (contains `read()` for filesystem) is server-only.

**Creating**: Add `.server` suffix (`secrets.server.js`) or place in `$lib/server/` directory.

**Validation**: SvelteKit prevents importing server-only code into browser code, even indirectly through re-exports. Entire import chain checked. Error: "Cannot import ... into code that runs in the browser".

**Dynamic Imports**: Works with dynamic imports including interpolated: `` await import(`./${foo}.js`) ``.

**Testing**: Unit test frameworks don't distinguish; illegal import detection disabled when `process.env.TEST === 'true'`.

## Snapshots

**Purpose**: Preserve ephemeral DOM state (scroll, form values) across navigation.

**Implementation**: Export `snapshot` object from `+page.svelte` or `+layout.svelte` with `capture()` and `restore(value)` methods. `capture()` called before navigation, result stored in history. `restore()` called with stored value after page updates.

**Constraints**: Data must be JSON-serializable (persists to `sessionStorage`). State restored on reload or back navigation from different site. Avoid large objects—remain in memory for session duration.

## Shallow Routing

**Purpose**: Create history entries without navigation for modals/overlays.

**Basic Usage**: `pushState('', { showModal: true })` creates history entry, accessible via `page.state`. First arg is relative URL (use `''` for current). Type-safe via `App.PageState` interface in `src/app.d.ts`. Use `replaceState` to set state without new entry.

**Loading Data**: Use `preloadData(href)` to load route data for rendering another `+page.svelte` inside current page. Returns `{ type: 'loaded', status, data }` or error. If element has `data-sveltekit-preload-data`, request already made.

**Caveats**: `page.state` always empty during SSR. State not applied until navigation on first landing. Requires JavaScript; provide fallback.

**Legacy**: `page.state` from `$app/state` added in v2.12. Earlier versions use `$page.state` from `$app/stores`.

## Observability

**OpenTelemetry Tracing**: Server-side spans for `handle` hooks, `load` functions, form actions, remote functions (v2.31+).

**Enable**: Set `experimental: { tracing: { server: true }, instrumentation: { server: true } }` in `svelte.config.js`.

**Augmenting**: Access `event.tracing.root` and `event.tracing.current` spans via `getRequestEvent()`. Set attributes: `event.tracing.root.setAttribute('userId', user.id)`.

**Jaeger Setup**: Install `@opentelemetry/sdk-node`, `@opentelemetry/auto-instrumentations-node`, `@opentelemetry/exporter-trace-otlp-proto`, `import-in-the-middle`. Create `src/instrumentation.server.js` with NodeSDK config. Run Jaeger, view traces at localhost:16686.

**Peer Dependency**: `@opentelemetry/api` optional; satisfied by trace collection libraries or install manually.

## Packaging

**Overview**: Use `@sveltejs/package` to build component libraries. `src/lib` is public (library code), `src/routes` optional (docs/demo). `svelte-package` generates `dist` with preprocessed components, transpiled TypeScript, auto-generated types.

**package.json Fields**:
- `name`: Package name
- `license`: Usage rights (e.g., MIT)
- `files`: `["dist"]` (npm always includes package.json, README, LICENSE)
- `exports`: Entry points. Default: `{ ".": { "types": "./dist/index.d.ts", "svelte": "./dist/index.js" } }`. Multiple: `{ ".": {...}, "./Foo.svelte": {...} }` imported as `import Foo from 'your-library/Foo.svelte'`
- `svelte`: Legacy field for backwards compatibility
- `sideEffects`: `["**/*.css"]` for tree-shaking; list CSS and side-effect scripts

**TypeScript**: Auto-generated type definitions. Problem: TypeScript doesn't resolve `types` condition for non-root exports by default. Solutions: (1) Require consumers to set `moduleResolution` to `bundler`/`node16`/`nodenext` (recommended), (2) Use `typesVersions` field to map types: `{ "typesVersions": { ">4.0": { "foo": ["./dist/foo.d.ts"] } } }`.

**Best Practices**: Avoid SvelteKit-specific modules (`$app/*`); use `esm-env` instead. Pass context as props. Define aliases in `svelte.config.js`. Semantic versioning: removing `exports` paths is breaking; adding is not.

**Source Maps**: Enable `declarationMap: true` in tsconfig for "Go to Definition" support.

**svelte-package Options**: `-w`/`--watch`, `-i`/`--input` (default: `src/lib`), `-o`/`--output` (default: `dist`), `-p`/`--preserve-output`, `-t`/`--types` (default: true), `--tsconfig`.

**Caveats**: All relative imports must have extensions per Node ESM: `import { x } from './something/index.js'`. TypeScript imports use `.js` extension even for `.ts` files. Non-Svelte/TypeScript files copied as-is; Svelte preprocessed, TypeScript transpiled.

### best_practices
Comprehensive best practices covering authentication (sessions vs JWT), performance optimization (built-in features, asset optimization, code reduction, waterfall prevention), icons (CSS vs Svelte libraries), image handling (Vite, enhanced-img, CDN), accessibility (announcements, focus, lang), and SEO (SSR, titles, sitemaps, AMP).

## Authentication and Authorization

**Sessions vs Tokens**: Session IDs are stored in database, can be immediately revoked but require DB query per request. JWTs are not checked against datastore, cannot be immediately revoked, but offer improved latency and reduced load.

**Implementation**: Check auth cookies in server hooks, store user info in `locals`. Use Lucia for session-based auth via `npx sv add lucia`.

## Performance Optimization

**Built-in Features**: Code-splitting, asset preloading, file hashing, request coalescing, parallel loading, data inlining, conservative invalidation, prerendering, link preloading.

**Diagnosing**: Use PageSpeed Insights, WebPageTest, browser devtools (Chrome/Edge Lighthouse, Network, Performance tabs). Test in preview mode, not dev. Instrument slow APIs with OpenTelemetry or Server-Timing headers.

**Assets**: 
- Images: Use `@sveltejs/enhanced-img` package
- Videos: Compress with Handbrake to `.webm`/`.mp4`, lazy-load with `preload="none"`, strip audio with FFmpeg
- Fonts: In `handle` hook call `resolve` with `preload` filter, subset fonts to reduce size

**Code Reduction**: Use latest Svelte (5 < 4 < 3 in size). Use `rollup-plugin-visualizer` to identify large packages. Minimize third-party scripts; use server-side analytics (Cloudflare, Netlify, Vercel) instead of JS-based. Use dynamic `import(...)` for conditional loading instead of static imports.

**Navigation**: Return promises from `load` for slow non-essential data; server `load` functions stream after navigation. Prevent waterfalls: use server `load` functions for backend requests (avoids high-latency round trips), use database joins instead of sequential queries.

**Hosting**: Frontend in same datacenter as backend, deploy to edge for sites without central backend, serve images from CDN, use HTTP/2+.

## Icons

**CSS-based**: Use Iconify for many icon sets via CSS, works with Tailwind CSS or UnoCSS plugins via Iconify's framework plugins.

**Svelte**: Avoid libraries providing one `.svelte` file per icon (thousands of files severely slow Vite's dependency optimization, especially with umbrella + subpath imports).

## Images

**Vite Built-in**: Automatically processes imported assets with hashing for caching and inlining for small assets.

```svelte
<script>
	import logo from '$lib/assets/logo.png';
</script>
<img alt="The project logo" src={logo} />
```

**@sveltejs/enhanced-img**: Plug-and-play image processing generating smaller formats (avif/webp), setting intrinsic width/height to prevent layout shift, creating multiple sizes for devices, stripping EXIF.

Setup:
```js
import { enhancedImages } from '@sveltejs/enhanced-img';
export default defineConfig({
	plugins: [enhancedImages(), sveltekit()]
});
```

Usage:
```svelte
<enhanced:img src="./image.jpg" alt="text" />
```

At build time replaced with `<img>` wrapped by `<picture>` with multiple types/sizes. Provide highest resolution needed; smaller versions auto-generated. Provide 2x resolution for HiDPI.

Dynamic selection:
```svelte
<script>
	import MyImage from './image.jpg?enhanced';
	const imageModules = import.meta.glob('/path/*.{jpg,png}', {
		eager: true,
		query: { enhanced: true }
	});
</script>
<enhanced:img src={MyImage} alt="text" />
{#each Object.entries(imageModules) as [_path, module]}
	<enhanced:img src={module.default} alt="text" />
{/each}
```

Width/height auto-inferred preventing layout shift. For large images specify `sizes`:
```svelte
<enhanced:img src="./image.png" sizes="min(1280px, 100vw)"/>
<enhanced:img src="./image.png?w=1280;640;400" sizes="(min-width:1920px) 1280px, (min-width:1080px) 640px, (min-width:768px) 400px"/>
```

Per-image transforms via query string: `src="./image.jpg?blur=15"` (see imagetools repo for full directives).

**CDN for Dynamic Images**: For images not at build time (CMS, backend, database), use CDN. Libraries with Svelte support: `@unpic/svelte` (CDN-agnostic), Cloudinary, Contentful, Storyblok, Contentstack.

**Best Practices**: Mix solutions in one project. Serve all images via CDN to reduce latency. Original images should be high quality/resolution at 2x display width for HiDPI. For large images (>400px, hero), specify `sizes`. For important images (LCP), set `fetchpriority="high"` and avoid `loading="lazy"`. Constrain images with container/styling to prevent jumping (CLS). Use `width`/`height` to reserve space. Always provide good `alt` text. Don't use `em`/`rem` in `sizes` or change their default (in `sizes` and `@media`, `em`/`rem` mean user's default font-size; if CSS changes it, browser preloader slot size differs from actual layout).

## Accessibility

**Route Announcements**: SvelteKit injects live region announcing new page name after navigation by reading `<title>` element. Every page needs unique, descriptive title:
```svelte
<svelte:head>
	<title>Todo List</title>
</svelte:head>
```

**Focus Management**: SvelteKit focuses `<body>` after navigation/enhanced form submissions unless element with `autofocus` present. Customize with `afterNavigate` hook:
```js
import { afterNavigate } from '$app/navigation';
afterNavigate(() => {
	document.querySelector('.focus-me')?.focus();
});
```

`goto` function accepts `keepFocus` option to preserve currently-focused element. Ensure focused element still exists after navigation.

**Lang Attribute**: Set correct `lang` on `<html>` in `src/app.html` for assistive technology pronunciation. For multi-language, set dynamically:
```html
<!-- src/app.html -->
<html lang="%lang%">
```
```js
// src/hooks.server.js
export function handle({ event, resolve }) {
	return resolve(event, {
		transformPageChunk: ({ html }) => html.replace('%lang%', get_lang(event))
	});
}
```

**Built-in**: Svelte's compile-time accessibility checks apply to SvelteKit. SvelteKit provides accessible foundation; developers responsible for application code accessibility.

## SEO

**Out of Box**: SSR enabled by default (keep on for better indexing). Core Web Vitals impact rankings; Svelte/SvelteKit's minimal overhead helps build fast sites. SvelteKit auto-redirects trailing slash variants for consistent URLs.

**Title and Meta Tags**: Every page needs unique `<title>` and `<meta name="description">` in `<svelte:head>`. Common pattern: return SEO data from page `load` functions, use in root layout's `<svelte:head>`.

**Sitemaps**: Create dynamic sitemaps via endpoints:
```js
/// file: src/routes/sitemap.xml/+server.js
export async function GET() {
	return new Response(
		`<?xml version="1.0" encoding="UTF-8" ?>
		<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
			xmlns:xhtml="http://www.w3.org/1999/xhtml"
			xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0"
			xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
			xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
			xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
			<!-- <url> elements -->
		</urlset>`.trim(),
		{ headers: { 'Content-Type': 'application/xml' } }
	);
}
```

**AMP**: Set `inlineStyleThreshold: Infinity` in `svelte.config.js` (inline all styles), disable CSR in root `+layout.server.js` (`export const csr = false;`), add `amp` attribute to `<html>` in `app.html`, transform HTML in `src/hooks.server.js`:
```js
import * as amp from '@sveltejs/amp';
export async function handle({ event, resolve }) {
	let buffer = '';
	return await resolve(event, {
		transformPageChunk: ({ html, done }) => {
			buffer += html;
			if (done) return amp.transform(buffer);
		}
	});
}
```

Optional: Remove unused CSS with `dropcss`. Validate with `amphtml-validator` in handle hook (only prerendered pages due to performance).

### appendix
FAQ, integration setup, debugging, SvelteKit 2 migration guide, Sapper migration guide, rendering/architecture glossary.

## FAQ

**Package compatibility**: Check publint.dev for library packaging issues. ESM files need `.mjs` extension (or `"type": "module"` in package.json); CommonJS needs `.cjs`. The `exports` field takes precedence over `main`/`module`. Svelte components should be uncompiled `.svelte` files with ESM-only JS.

**Client-side libraries**: Wrap in `browser` check or `onMount` to avoid SSR issues. For side-effect-free libraries, static imports work (tree-shaken in server build). Use `{#await}` blocks for dynamic imports.

**Database**: Put queries in server routes, create `db.js` singleton for connections, run setup in `hooks.server.js`.

**Backend API**: Use `event.fetch` for external APIs. For CORS issues, proxy in production (rewrite `/api` paths) or dev (Vite `server.proxy`). Alternatively, create API route that forwards requests.

**Middleware**: In production use `adapter-node`. In dev, add via Vite plugin with `server.middlewares.use()`.

**View transitions**: Call `document.startViewTransition` in `onNavigate` callback.

**Yarn**: Use `nodeLinker: 'node-modules'` in `.yarnrc.yml` to avoid ESM issues with Plug'n'Play.

## Integrations

**vitePreprocess**: Enables Vite CSS flavors (PostCSS, SCSS, Less, Stylus, SugarSS). Import from `@sveltejs/vite-plugin-svelte`. TypeScript included by default; Svelte 5 supports TypeScript natively for type syntax only.

**npx sv add**: Installs common integrations: prettier, eslint, vitest, playwright, lucia, tailwind, drizzle, paraglide, mdsvex, storybook.

**svelte-preprocess**: Offers Pug, Babel, global styles support beyond vitePreprocess. May be slower; requires installing corresponding libraries (sass, less, etc).

**Vite plugins**: SvelteKit uses Vite, so any Vite plugin can enhance projects. Listed in vitejs/awesome-vite.

## Breakpoint Debugging

**VSCode Debug Terminal**: Open command palette, launch "Debug: JavaScript Debug Terminal", start `npm run dev`, set breakpoints.

**VSCode Launch Configuration**: Create `.vscode/launch.json` with `"command": "npm run dev"`, `"type": "node-terminal"`, use F5 to start.

**Browser DevTools**: Run `NODE_OPTIONS="--inspect" npm run dev`, open localhost:5173, click Node.js logo in DevTools or navigate to `chrome://inspect` / `edge://inspect`.

**Other editors**: WebStorm has built-in support; Neovim has community guides.

## SvelteKit 2 Breaking Changes

**error/redirect**: No longer thrown; call directly: `error(500, 'msg')` instead of `throw error(...)`. Use `isHttpError`/`isRedirect` to distinguish from unexpected errors.

**Cookies**: `path` now required: `cookies.set(name, value, { path: '/' })`. Use `path: '/'` for domain-wide, `''` for current path, `'.'` for current directory.

**Top-level promises**: No longer auto-awaited in load functions. Explicitly await or use `Promise.all()` to avoid waterfalls.

**goto()**: No longer accepts external URLs; use `window.location.href`. `state` object determines `$page.state` and must match `App.PageState`.

**Relative paths**: `paths.relative` defaults to `true` (was inconsistent). Makes apps portable when base path unknown.

**preloadCode**: Takes single base-prefixed argument instead of multiple.

**resolvePath → resolveRoute**: `resolveRoute('/blog/[slug]', { slug })` from `$app/paths` replaces `base + resolvePath(...)`.

**Error handling**: `handleError` receives `status` and `message`. For code errors, status is `500`, message is `Internal Error`. Message is safe to expose to users.

**Dynamic env vars**: Cannot use `$env/dynamic/*` during prerendering; use `$env/static/public`/`$env/static/private`. SvelteKit requests updated values from `/_app/env.js` on prerendered pages.

**use:enhance**: `form`/`data` removed; use `formElement`/`formData`.

**File forms**: Must have `enctype="multipart/form-data"`.

**tsconfig.json**: Stricter validation; use `alias` in `svelte.config.js` instead of `paths`/`baseUrl`.

**getRequest**: No longer throws on `Content-Length` exceeding limit; error deferred until body read.

**vitePreprocess import**: Import from `@sveltejs/vite-plugin-svelte`, not `@sveltejs/kit/vite`.

**Dependencies**: Node 18.13+, svelte@4, vite@5, typescript@5, @sveltejs/vite-plugin-svelte@3. Adapters: cloudflare@3, cloudflare-workers@2, netlify@3, node@2, static@3, vercel@4. tsconfig uses `"moduleResolution": "bundler"` and `verbatimModuleSyntax`.

**$app/stores deprecated** (2.12+): Use `$app/state` (Svelte 5 runes) instead. Replace imports and remove `$` prefixes. Run `npx sv migrate app-state` for auto-migration.

## Sapper Migration

**package.json**: Add `"type": "module"`. Replace sapper with `@sveltejs/kit` + adapter. Update scripts: `sapper build` → `vite build`, `sapper export` → `vite build` (static adapter), `sapper dev` → `vite dev`.

**Config files**: Replace webpack/rollup config with `svelte.config.js`. Move preprocessor options to `config.preprocess`. Add adapter (adapter-node ≈ sapper build, adapter-static ≈ sapper export).

**src/client.js**: No equivalent; move logic to `+layout.svelte` in `onMount`.

**src/server.js**: Use custom server with adapter-node or no equivalent for serverless.

**src/service-worker.js**: Update imports from `@sapper/service-worker` to `$service-worker`. `files` unchanged, `routes` removed, `shell` → `build`, `timestamp` → `version`.

**src/template.html → src/app.html**: Remove `%sapper.base%`, `%sapper.scripts%`, `%sapper.styles%`, `<div id="sapper">`. Replace `%sapper.head%` → `%sveltekit.head%`, `%sapper.html%` → `%sveltekit.body%`.

**src/node_modules → src/lib**: For internal libraries.

**Routes**: Rename `routes/about/index.svelte` → `routes/about/+page.svelte`, `_error.svelte` → `+error.svelte`, `_layout.svelte` → `+layout.svelte`.

**Imports**: Replace `@sapper/app` with `$app/navigation`/`$app/stores`. `goto` unchanged, `prefetch` → `preloadData`, `prefetchRoutes` → `preloadCode`, `stores` → `getStores` or import `navigating`/`page` directly (or `$app/state` in Svelte 5 + SvelteKit 2.12+).

**Preload → load**: Rename `preload` to `load`, move to `+page.js`/`+layout.js`. Single `event` argument replaces `page`/`session`. No `this` object; use `fetch` from input, throw `error()`/`redirect()`.

**Stores**: `page` still exists. `preloading` → `navigating` (with `from`/`to`). `page` has `url`/`params` (no `path`/`query`).

**Routing**: Regex routes removed; use advanced route matching. `segment` prop removed; use `$page.url.pathname`.

**URLs**: Relative URLs resolve against current page. Use root-relative URLs (starting with `/`) for context-independent meaning.

**Link attributes**: `sapper:prefetch` → `data-sveltekit-preload-data`, `sapper:noscroll` → `data-sveltekit-noscroll`.

**Endpoints**: No direct `req`/`res` access; SvelteKit is environment-agnostic. `fetch` available globally.

**HTML minifier**: Not included by default. Add as dependency and use in server hook with `transformPageChunk`.

## Glossary

**CSR** (Client-side rendering): Page generation in browser via JavaScript. Enabled by default, disable with `csr = false`.

**SSR** (Server-side rendering): Page generation on server. Enabled by default, disable with `ssr = false`. Improves performance and SEO.

**Hybrid app**: SvelteKit default. Initial HTML from server (SSR), subsequent navigations via client (CSR).

**Hydration**: SSR data transmitted to client with HTML. Components initialize with that data without re-fetching. Svelte checks DOM state and attaches listeners. Enabled by default, disable with `csr = false`.

**SPA** (Single-page app): All requests load single HTML file, client-side rendering based on URL. All navigation client-side. Serves empty shell initially (differs from hybrid). Large performance impact. Build with `adapter-static`.

**SSG** (Static Site Generation): Every page prerendered. No server maintenance. Served from CDNs. Implement with `adapter-static` or `prerender` config.

**Prerendering**: Computing page contents at build time, saving HTML. Benefits: same as SSR, avoids recomputing per visitor, scales nearly free. Tradeoff: expensive build, content updates only by rebuild/deploy. Rule: any two users hitting directly must get same content, page must not contain actions. Can prerender personalized pages if user-specific data fetched client-side.

**ISR** (Incremental Static Regeneration): Generate static pages as visitors request without redeploying. Reduces build times vs SSG. Available with `adapter-vercel`.

**Edge rendering**: Rendering in CDN near user, improving latency.

**Routing**: SvelteKit intercepts navigation (link clicks, forward/back), handles client-side by rendering new page component. Enabled by default, skip with `data-sveltekit-reload`.

**PWA** (Progressive Web App): Web app functioning like mobile/desktop app. Can be installed with shortcuts. Often uses service workers for offline.

**MPA** (Multi-page app): Traditional apps rendering each page on server, common in non-JavaScript languages.

### api_reference
Complete API reference for @sveltejs/kit covering all exports, types, hooks, utilities, environment modules, configuration, and auto-generated types.

## Complete API Reference

### Core Exports
Import from `@sveltejs/kit`: Server class, response helpers (error/fail/invalid/json/text/redirect), type guards (isActionFailure/isHttpError/isRedirect/isValidationError), normalizeUrl, VERSION.

### Response Helpers
- **error(status, body)** - Throws HTTP error, prevents handleError hook execution
- **fail(status, data?)** - Creates ActionFailure for form submission failures
- **invalid(...issues)** - Throws validation error in form actions with field-specific errors via `issue` helper
- **json(data, init?)** - Creates JSON Response
- **text(body, init?)** - Creates text Response
- **redirect(status, location)** - Redirects request (303 for GET after POST, 307/308 to keep method)
- **normalizeUrl(url)** - Strips SvelteKit suffixes and trailing slashes, returns {url, wasNormalized, denormalize}

### Form Actions
- **Action** - Single form action handler: `(event: RequestEvent) => MaybePromise<OutputData>`
- **Actions** - Multiple named actions in +page.server.js: `Record<string, Action>`
- **ActionFailure** - Result of fail(): `{status: number, data: T, [uniqueSymbol]: true}`
- **ActionResult** - Response from form action: success/failure/redirect/error types

### Load Functions
- **Load** - Generic load function: `(event: LoadEvent) => MaybePromise<OutputData>`
- **LoadEvent** - Extends NavigationEvent with: fetch (credentialed, relative URLs on server), data (from +layout.server.js), setHeaders(), parent(), depends(), untrack(), tracing
- **ServerLoad** - Server-only load function
- **ServerLoadEvent** - Extends RequestEvent with parent(), depends(), untrack(), tracing

### RequestEvent
Available in hooks and load functions:
```ts
interface RequestEvent {
  cookies: Cookies;
  fetch: typeof fetch;
  getClientAddress(): string;
  locals: App.Locals;
  params: Params;
  platform: App.Platform | undefined;
  request: Request;
  route: { id: RouteId };
  setHeaders(headers: Record<string, string>): void;
  url: URL;
  isDataRequest: boolean;
  isSubRequest: boolean;
  isRemoteRequest: boolean;
  tracing: { enabled: boolean; root: Span; current: Span };
}
```

### Cookies
```ts
interface Cookies {
  get(name: string, opts?: CookieParseOptions): string | undefined;
  getAll(opts?: CookieParseOptions): Array<{ name: string; value: string }>;
  set(name: string, value: string, opts: CookieSerializeOptions & { path: string }): void;
  delete(name: string, opts: CookieSerializeOptions & { path: string }): void;
  serialize(name: string, value: string, opts: CookieSerializeOptions & { path: string }): string;
}
```
httpOnly and secure default to true (except localhost where secure is false). sameSite defaults to lax. Must specify path.

### Navigation Types
- **Navigation** - Union of form/link/goto/popstate/external navigation
- **NavigationBase** - Common properties: from, to, willUnload, complete
- **NavigationTarget** - Target of navigation: params, route, url
- **NavigationType** - 'enter' | 'form' | 'leave' | 'link' | 'goto' | 'popstate'
- **BeforeNavigate** - Argument to beforeNavigate() hook with cancel() method
- **AfterNavigate** - Argument to afterNavigate() hook with type and willUnload: false
- **OnNavigate** - Argument to onNavigate() hook

### Page Store
```ts
interface Page<Params, RouteId> {
  url: URL & { pathname: ResolvedPathname };
  params: Params;
  route: { id: RouteId };
  status: number;
  error: App.Error | null;
  data: App.PageData & Record<string, any>;
  state: App.PageState;
  form: any;
}
```

### Hooks
- **Handle** - Runs on every request: `(input: {event, resolve}) => MaybePromise<Response>`
- **HandleFetch** - Intercepts event.fetch() calls
- **HandleServerError** - Handles unexpected server errors: `(input: {error, event, status, message}) => MaybePromise<void | App.Error>`
- **HandleClientError** - Handles unexpected client errors
- **HandleValidationError** - Handles remote function validation failures
- **Reroute** - Modifies URL before routing (v2.3.0+): `(event: {url, fetch}) => MaybePromise<void | string>`
- **Transport** - Custom type serialization: `Record<string, {encode(value): false | U, decode(data): T}>`
- **ClientInit** - Runs once app starts in browser (v2.10.0+)
- **ServerInit** - Runs before server responds to first request (v2.10.0+)

### Adapters
```ts
interface Adapter {
  name: string;
  adapt(builder: Builder): MaybePromise<void>;
  supports?: {
    read?(details: { config: any; route: { id: string } }): boolean;
    instrumentation?(): boolean;
  };
  emulate?(): MaybePromise<Emulator>;
}
```

**Builder** - Passed to adapt(): log, rimraf, mkdirp, config, prerendered, routes, createEntries, findServerAssets, generateFallback, generateEnvModule, generateManifest, getBuildDirectory, getClientDirectory, getServerDirectory, getAppPath, writeClient, writePrerendered, writeServer, copy, hasServerInstrumentationFile, instrument, compress

**Emulator** - Influences environment: `platform?(details: {config, prerender}): MaybePromise<App.Platform>`

**Prerendered** - Info about prerendered pages: pages, assets, redirects, paths

### Remote Functions
- **RemoteCommand** - Server function returning single value with pending property and updates() method
- **RemoteQuery** - Server function returning reactive value with set(), refresh(), withOverride()
- **RemoteForm** - Server form function with enhance(), for(), preflight(), validate(), result, pending, fields, buttonProps
- **RemoteResource** - Base for query/command results with error, loading, current, ready
- **RemoteFormField** - Form field accessor with as() method for element props
- **RemoteFormIssue** - Validation issue: {message, path}

### Error Types
- **HttpError** - From error(): `{status: 400-599, body: App.Error}`
- **Redirect** - From redirect(): `{status: 300|301|302|303|304|305|306|307|308, location}`
- **ValidationError** - From invalid(): `{issues: StandardSchemaV1.Issue[]}`

### Utilities
- **VERSION** - SvelteKit version string
- **ParamMatcher** - Custom route parameter validation: `(param: string) => boolean`
- **ResolveOptions** - Options for resolve() in handle hook: transformPageChunk, filterSerializedResponseHeaders, preload
- **RouteDefinition** - Route metadata: id, api, page, pattern, prerender, segments, methods, config
- **SSRManifest** - Server-side manifest with appDir, appPath, assets, mimeTypes, internal metadata
- **InvalidField** - Imperative validation error builder for field-specific issues
- **CspDirectives** - Content Security Policy directives with typed sources
- **MaybePromise<T>** - T | Promise<T>
- **TrailingSlash** - 'never' | 'always' | 'ignore'
- **PrerenderOption** - boolean | 'auto'
- **HttpMethod** - 'GET' | 'HEAD' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'OPTIONS'

### Additional Utilities
- **sequence()** - Chains handle hooks with different ordering: transformPageChunk reversed, preload/filterSerializedResponseHeaders forward with first-wins
- **installPolyfills()** - Makes web APIs (crypto, File) available as globals in Node.js
- **createReadableStream(path)** - Converts file to readable stream
- **getRequest({request, base, bodySizeLimit})** - Converts Node.js IncomingMessage to Fetch Request
- **setResponse(res, response)** - Writes Fetch Response to Node.js ServerResponse
- **sveltekit()** - Returns array of Vite plugins

### Environment Modules
- **$app/environment** - browser, building, dev, version constants
- **$app/forms** - applyAction, deserialize, enhance for form handling
- **$app/navigation** - afterNavigate, beforeNavigate, disableScrollHandling, goto, invalidate, invalidateAll, onNavigate, preloadCode, preloadData, pushState, replaceState, refreshAll
- **$app/paths** - asset(), resolve() for URL resolution; deprecated assets, base, resolveRoute
- **$app/server** - command, form, getRequestEvent, prerender, query, read for server functions
- **$app/state** - navigating, page, updated reactive state objects
- **$app/stores** - Deprecated store-based API (use $app/state instead)
- **$app/types** - Auto-generated types: Asset, RouteId, Pathname, ResolvedPathname, RouteParams, LayoutParams
- **$env/dynamic/private** - Runtime private environment variables
- **$env/dynamic/public** - Runtime public environment variables (PUBLIC_ prefix)
- **$env/static/private** - Build-time private environment variables
- **$env/static/public** - Build-time public environment variables
- **$lib** - Auto-configured alias to src/lib
- **$service-worker** - Service worker metadata: base, build, files, prerendered, version

### Configuration (svelte.config.js)
- **adapter** - Converts build for deployment
- **alias** - Import alias mappings
- **appDir** - Directory for SvelteKit assets (default: "_app")
- **csp** - Content Security Policy with mode (hash/nonce/auto), directives, reportOnly
- **csrf** - CSRF protection with checkOrigin, trustedOrigins
- **embedded** - Whether app is embedded in larger app
- **env** - Environment variable config: dir, publicPrefix, privatePrefix
- **experimental** - Experimental features: tracing, instrumentation, remoteFunctions
- **inlineStyleThreshold** - Max CSS length to inline in HTML head
- **moduleExtensions** - File extensions treated as modules (default: [".js", ".ts"])
- **outDir** - Build output directory (default: ".svelte-kit")
- **output** - Build format: preloadStrategy (modulepreload/preload-js/preload-mjs), bundleStrategy (split/single/inline)
- **paths** - URL paths: assets, base, relative
- **prerender** - Prerendering: concurrency, crawl, entries, handleHttpError, handleMissingId, handleEntryGeneratorMismatch, handleUnseenRoutes, origin
- **router** - Client router: type (pathname/hash), resolution (client/server)
- **typescript** - TypeScript config function
- **version** - Version management: name, pollInterval

### CLI
- **vite dev** - Start development server
- **vite build** - Build production version
- **vite preview** - Run production build locally
- **svelte-kit sync** - Generate tsconfig.json and type definitions

### Generated Types
SvelteKit auto-generates `.d.ts` files for each route with RouteParams, RequestHandler, PageLoad, PageData, LayoutData, ActionData, PageProps, LayoutProps types. Generated in `.svelte-kit/types/src/routes/[params]/$types.d.ts`. tsconfig.json must extend `.svelte-kit/tsconfig.json`.

### App Namespace (app.d.ts)
- **App.Error** - Shape of expected/unexpected errors
- **App.Locals** - Shape of event.locals
- **App.PageData** - Shape of page.data
- **App.PageState** - Shape of page.state
- **App.Platform** - Adapter-specific platform context


