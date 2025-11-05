

## Pages

### @sveltejs∕kit-api-reference
Complete TypeScript API reference for @sveltejs/kit covering response helpers, request/event types, hooks, adapters, remote functions, and cookies.

## Core Functions
- `json(data)`, `text(body)` - Create responses
- `error(status, body)`, `redirect(status, location)`, `fail(status, data)` - Throw errors/redirects
- `isHttpError()`, `isRedirect()`, `isActionFailure()` - Type guards
- `normalizeUrl(url)` - Strip SvelteKit suffixes

## Key Types
- **RequestEvent**: `cookies`, `fetch`, `locals`, `params`, `url`, `setHeaders()`, `getClientAddress()`
- **LoadEvent**: Extends RequestEvent, adds `data`, `parent()`, `depends()`, `untrack()`
- **Page**: `url`, `params`, `route.id`, `status`, `error`, `data`, `state`, `form`
- **ActionResult**: `{type: 'success'|'failure'|'redirect'|'error', ...}`

## Hooks
- **handle**: `(input: {event, resolve}) => Response`
- **handleError**: `(input: {error, event, status, message}) => App.Error`
- **handleFetch**: `(input: {event, request, fetch}) => Response`
- **reroute**: `(event: {url, fetch}) => void | string`

## Adapter
- **Builder**: `log`, `rimraf`, `mkdirp`, `config`, `routes`, `writeClient()`, `writeServer()`, `generateManifest()`, `compress()`

## Remote Functions
- **RemoteCommand**: `(arg) => Promise` with `pending`, `updates()`
- **RemoteForm**: `{action, enhance(), fields, result, pending}`
- **RemoteQuery**: Promise-like with `current`, `ready`, `loading`, `error`, `set()`, `refresh()`

## Cookies
- `get(name)`, `getAll()`, `set(name, value, opts)`, `delete(name, opts)` - `path` required, `httpOnly`/`secure` default true

### hooks
The sequence helper chains multiple handle middleware functions with different execution orders for different options.

## sequence

Chains multiple `handle` middleware with specific ordering:
- `transformPageChunk`: reverse order, merged
- `preload`: forward order, first wins
- `filterSerializedResponseHeaders`: forward order, first wins

```js
import { sequence } from '@sveltejs/kit/hooks';
export const handle = sequence(first, second);
```

### node-polyfills
Function to install web API polyfills for Node.js environments.

`installPolyfills()` from `@sveltejs/kit/node/polyfills` makes web APIs (`crypto`, `File`) available as globals in Node.js.

### node-adapter-api
API reference for @sveltejs/kit/node module providing Node.js HTTP integration utilities.

Three utilities for Node.js integration:
- `createReadableStream(file)` - converts file to readable stream
- `getRequest({request, base, bodySizeLimit})` - converts Node IncomingMessage to Request
- `setResponse(res, response)` - writes Response to Node ServerResponse

### vite-plugin
The sveltekit() function exports Vite plugins for SvelteKit integration.

`sveltekit()` from `@sveltejs/kit/vite` returns the Vite plugins array needed for SvelteKit integration.

```js
import { sveltekit } from '@sveltejs/kit/vite';
const plugins = await sveltekit();
```

### $app∕environment
Runtime environment detection constants for conditional code execution in SvelteKit apps.

Export constants from `$app/environment`:
- `browser` - true in browser
- `building` - true during build/prerender
- `dev` - true when dev server running
- `version` - from `config.kit.version.name`

### $app∕forms
API for handling form submissions and responses in SvelteKit with functions to enhance forms, apply actions, and deserialize responses.

## applyAction
Updates `form` property and `page.status`, redirects to error page on error.

## deserialize
Deserializes form submission responses from fetch requests.

## enhance
Form action that enhances `<form>` elements to work without JavaScript. Intercepts submission via `submit` callback, allows cancellation, and provides default behavior (form updates, redirects, invalidation). Custom callbacks can invoke `update()` with `reset` and `invalidateAll` options.

### navigation-api
API for programmatic navigation, lifecycle hooks, and data preloading in SvelteKit applications.

## Navigation API

**afterNavigate(callback)** - Runs on mount and every navigation.

**beforeNavigate(callback)** - Intercept navigation, call `cancel()` to prevent. `navigation.willUnload` indicates if document will unload.

**goto(url, opts)** - Programmatic navigation with options like `replaceState`, `noScroll`, `keepFocus`, `invalidateAll`, `invalidate`.

**invalidate(resource)** - Re-run load functions for resource. Example: `invalidate((url) => url.pathname === '/path')`.

**invalidateAll()** - Re-run all load functions.

**onNavigate(callback)** - Run before navigation (except full-page). Can return Promise to delay, or function to run after DOM update.

**preloadCode(pathname)** - Import code for routes (patterns: `/about`, `/blog/*`).

**preloadData(href)** - Preload page code and load functions. Returns `{type: 'loaded', status, data}` or `{type: 'redirect', location}`.

**pushState/replaceState(url, state)** - Manage history for shallow routing.

### $app∕paths
API reference for $app/paths module providing asset and pathname resolution utilities with base path handling.

## Path resolution utilities

**asset(file)** - Resolve static file URLs with proper asset/base path prefixing
```js
import { asset } from '$app/paths';
<img src={asset('/potato.jpg')} />
```

**resolve(pathname | routeId, params?)** - Resolve pathnames with base path or populate dynamic route segments
```js
resolve(`/blog/hello-world`);
resolve('/blog/[slug]', { slug: 'hello-world' });
```

Deprecated: `assets`, `base`, `resolveRoute()`

### $app∕server
API reference for $app/server module providing remote function utilities (command, form, query, prerender) and asset reading capabilities.

## $app/server API

Server-side utilities for remote functions and asset reading:

- **command**: Remote command execution via fetch
- **form**: Server-side form handling with validation
- **getRequestEvent**: Access current RequestEvent in server context
- **prerender**: Remote prerender function for static generation
- **query**: Remote data fetching from server
- **query.batch**: Batch multiple queries into single request
- **read**: Read imported asset contents from filesystem

### $app∕state
Read-only state objects for navigation, page data, and app updates in SvelteKit.

## $app/state

Three read-only state objects:

**navigating**: In-progress navigation with `from`, `to`, `type`, `delta` properties; `null` when idle.

**page**: Current page info including `data`, `form`, `state`, `url`, `route`, `params`, `error`. Use runes for reactivity:
```svelte
const id = $derived(page.params.id); // Correct
$: badId = page.params.id; // Won't update
```

**updated**: Boolean `current` property and `check()` method. Reflects new app versions when polling enabled.

### $app∕stores
Deprecated store-based API for accessing page, navigation, and update state; replaced by $app/state in SvelteKit 2.12+.

## Deprecated $app/stores API

Store-based equivalents of `$app/state` (use `$app/state` instead in SvelteKit 2.12+).

- **getStores()** — returns object with `page`, `navigating`, `updated` stores
- **navigating** — Readable store with Navigation object during navigation, null otherwise
- **page** — Readable store with page data
- **updated** — Readable store (boolean) with `check()` method for version polling

### $app∕types
Auto-generated TypeScript types for type-safe access to routes, pathnames, and parameters in your SvelteKit app.

## Generated Route and Asset Types

Auto-generated TypeScript utilities for type-safe route handling:

- **Asset**: Union of static files and dynamic imports
- **RouteId**: All route IDs in your app
- **Pathname**: All valid pathnames
- **ResolvedPathname**: Pathnames with base path prefix
- **RouteParams**: Get parameters for a route: `RouteParams<'/blog/[slug]'>` → `{ slug: string }`
- **LayoutParams**: Route parameters including optional child route params

### $env∕dynamic∕private
Module for accessing private runtime environment variables on the server side only.

Access server-side runtime environment variables via `$env/dynamic/private`. Cannot be used in client code. Respects `config.kit.env.privatePrefix` configuration.

```ts
import { env } from '$env/dynamic/private';
console.log(env.DEPLOYMENT_SPECIFIC_VARIABLE);
```

### $env∕dynamic∕public
Runtime access to public environment variables prefixed with PUBLIC_ on the client side.

Access public environment variables at runtime via `$env/dynamic/public`. Variables must be prefixed with `PUBLIC_`. Prefer `$env/static/public` to avoid network overhead.

```ts
import { env } from '$env/dynamic/public';
console.log(env.PUBLIC_DEPLOYMENT_SPECIFIC_VARIABLE);
```

### $env∕static∕private
Static private environment variables that are injected at build time and cannot be accessed from client-side code.

Static private environment variables injected at build time from `.env` files. Cannot be used in client code. Import with `import { API_KEY } from '$env/static/private'`. Declare all referenced variables in `.env` and override via command line: `MY_FEATURE_FLAG="enabled" npm run dev`.

### $env∕static∕public
Module for importing public environment variables that are statically replaced at build time and safe to expose to client code.

Access public environment variables (prefixed with `PUBLIC_` by default) that are safe for client-side code. Values are replaced at build time.

```ts
import { PUBLIC_BASE_URL } from '$env/static/public';
```

### $lib-import-alias
$lib is an automatic import alias pointing to src/lib for importing reusable components and utilities.

SvelteKit provides a `$lib` import alias for `src/lib` directory, allowing imports like `import Component from '$lib/Component.svelte'`. The alias target can be configured in the config file.

### $service-worker
API reference for the $service-worker module that provides build-time constants to service workers.

The `$service-worker` module exports build-time constants for service workers: `base` (deployment base path), `build` (Vite-generated files), `files` (static assets), `prerendered` (prerendered routes), and `version` (for cache invalidation).

```js
import { base, build, files, prerendered, version } from '$service-worker';
const CACHE = `cache-${version}`;
self.addEventListener('install', e => e.waitUntil(caches.open(CACHE).then(c => c.addAll([...build, ...files]))));
```

### configuration
SvelteKit configuration options in svelte.config.js for adapters, routing, CSP, CSRF, prerendering, bundling, and version management.

## svelte.config.js Structure

```js
import adapter from '@sveltejs/adapter-auto';

const config = {
	kit: {
		adapter: adapter()
	}
};

export default config;
```

## Essential Options

**adapter** - Platform output converter (required for build)

**alias** - Import path aliases

**appDir** - Static assets directory (default: "_app")

**csp** - Content Security Policy with mode ('hash'|'nonce'|'auto'), directives, reportOnly

**csrf** - CSRF protection: checkOrigin (default: true), trustedOrigins array

**env** - Environment variables: dir, publicPrefix ("PUBLIC_"), privatePrefix ("")

**inlineStyleThreshold** - Max CSS size to inline (default: 0)

**outDir** - Build output directory (default: ".svelte-kit")

**output.bundleStrategy** - 'split' (lazy), 'single', or 'inline' (no server)

**output.preloadStrategy** - 'modulepreload' (default), 'preload-js', 'preload-mjs'

**paths** - URL config: assets (CDN), base (/path), relative (default: true)

**prerender** - concurrency, crawl, entries, error handlers, origin

**router.type** - 'pathname' (default) or 'hash'

**router.resolution** - 'client' (manifest) or 'server' (per-navigation)

**version** - name (deterministic string), pollInterval (ms)

### command-line-interface
SvelteKit CLI overview: Vite commands for development/building and svelte-kit sync for project initialization and type generation.

SvelteKit uses Vite CLI via npm scripts (`vite dev`, `vite build`, `vite preview`). The `svelte-kit sync` command generates `tsconfig.json` and type definitions (`./$types`) and runs automatically as the `prepare` script.

### types
SvelteKit generates type definitions for routes and pages, providing typed RequestHandler/Load functions via $types imports, and defines ambient App namespace types in app.d.ts.

## Generated types

SvelteKit auto-generates `.d.ts` files with typed `RequestHandler` and `Load` functions. Import from `$types` instead of manually typing params:
```js
/** @type {import('./$types').RequestHandler} */
export async function GET({ params }) {}
```

Return types available as `PageData`, `LayoutData`, `ActionData`. Helper type `PageProps` combines data with form (v2.16.0+).

## $lib and app.d.ts

`$lib` aliases `src/lib`. `$lib/server` prevents client-side imports.

`app.d.ts` defines ambient types: `Error`, `Locals`, `PageData`, `PageState`, `Platform`.

