

## Pages

### advanced-routing
Advanced routing techniques including rest parameters, optional parameters, matchers, route sorting, character encoding, and layout grouping in SvelteKit.

## Rest Parameters
`[...file]` matches variable segments: `/[org]/[repo]/tree/[branch]/[...file]` → `file: 'documentation/docs/04-advanced-routing.md'`

## Optional Parameters
`[[lang]]/home` matches both `/home` and `/en/home`

## Matching
Validate parameters with matchers in `src/params/fruit.js`:
```js
export function match(param) {
	return param === 'apple' || param === 'orange';
}
```
Use as `[page=fruit]` in routes.

## Route Sorting
Priority: specificity > matchers > alphabetical. Rest/optional params have lowest priority unless final.

## Encoding
Special characters: `/` → `[x+2f]`, `:` → `[x+3a]`. Unicode: `🤪` → `[u+d83e][u+dd2a]`

## Layout Groups
`(group)` directories organize routes without affecting URLs. Use `+page@segment` to break out of layout hierarchy.

### hooks
App-wide functions that give fine-grained control over SvelteKit's behavior in response to specific events.

Hooks are app-wide functions SvelteKit calls for specific events. Three optional files: `src/hooks.server.js`, `src/hooks.client.js`, `src/hooks.js`.

**Server hooks:** `handle` (runs on every request, can modify response), `locals` (add custom data to event), `handleFetch` (modify fetch calls), `handleValidationError` (handle schema validation failures).

**Shared hooks:** `handleError` (log errors, customize error display), `init` (async initialization).

**Universal hooks:** `reroute` (translate URLs to routes, can be async), `transport` (pass custom types across server/client boundary).

Example `handle`:
```js
export async function handle({ event, resolve }) {
	if (event.url.pathname.startsWith('/custom')) return new Response('custom');
	const response = await resolve(event);
	response.headers.set('x-custom-header', 'value');
	return response;
}
```

### errors
How to handle expected and unexpected errors in SvelteKit, customize error objects, and control error page rendering.

## Expected Errors

Throw with the `error` helper:

```js
import { error } from '@sveltejs/kit';
error(404, 'Not found');
```

Renders nearest `+error.svelte` with `page.error` containing the error object. Customize error shape via `App.Error` interface in `src/app.d.ts`.

## Unexpected Errors

Any other exception is logged but not exposed to users (generic `{ "message": "Internal Error" }` instead). Handle in `handleError` hook.

## Error Responses

Customize fallback error page with `src/error.html` using `%sveltekit.status%` and `%sveltekit.error.message%` placeholders. Errors in `load` functions render nearest `+error.svelte`; errors in root layout use fallback page.

### link-options
Configure SvelteKit link navigation behavior with data-sveltekit-* attributes for preloading, history, focus, and scroll control.

Customize `<a>` link behavior with `data-sveltekit-*` attributes:
- **data-sveltekit-preload-data**: `"hover"` or `"tap"` - when to preload page data
- **data-sveltekit-preload-code**: `"eager"`, `"viewport"`, `"hover"`, or `"tap"` - when to preload code
- **data-sveltekit-reload**: force full-page navigation
- **data-sveltekit-replacestate**: replace history instead of push
- **data-sveltekit-keepfocus**: keep focus on current element
- **data-sveltekit-noscroll**: prevent scroll to top

Disable with `"false"` value. Applies to `<form method="GET">` too.

### service-workers
How to implement service workers in SvelteKit for offline support and performance optimization.

SvelteKit automatically bundles `src/service-worker.js` for offline support and performance. Access `$service-worker` module for assets, build files, version, and base path. Example caches built app and static files on install, cleans old caches on activate, and serves from cache with network fallback on fetch. Disable auto-registration via config. During dev, manually register with `{ type: dev ? 'module' : 'classic' }`.

### server-only-modules
Prevent accidental exposure of sensitive data to the browser by marking modules as server-only using .server suffix or $lib/server/ directory.

## Server-only modules

Prevent sensitive data leaks to the browser by marking modules as server-only using `.server` filename suffix or `$lib/server/` directory.

SvelteKit blocks any import chain from public-facing code to server-only modules, even indirect imports:

```js
// $lib/server/secrets.js - server-only
export const apiKey = 'secret';

// src/routes/utils.js
export { apiKey } from '$lib/server/secrets.js';

// src/routes/+page.svelte - ERROR: import chain includes server-only code
import { apiKey } from './utils.js';
```

Works with dynamic imports. Disabled during tests when `process.env.TEST === 'true'`.

### snapshots
Use snapshot objects to preserve and restore ephemeral DOM state when navigating between pages.

Preserve DOM state across navigation by exporting a `snapshot` object with `capture` and `restore` methods from `+page.svelte` or `+layout.svelte`. Data is stored in the history stack and `sessionStorage`, and must be JSON-serializable.

### shallow-routing
Shallow routing lets you create browser history entries with associated state without navigating, enabling history-driven modals and overlays.

Create history entries without navigating using `pushState(url, state)` and `replaceState(url, state)`. Access state via `page.state`. Use `preloadData(href)` to load data before shallow navigation. State is empty during SSR and initial page load; requires JavaScript.

### observability
Emit and collect OpenTelemetry spans for server-side operations like hooks, load functions, and form actions.

## Observability with OpenTelemetry

Enable in `svelte.config.js`:
```js
kit: {
	experimental: {
		tracing: { server: true },
		instrumentation: { server: true }
	}
}
```

Create `src/instrumentation.server.ts` for tracing setup.

Add custom attributes to spans:
```js
event.tracing.root.setAttribute('userId', user.id);
```

For local development with Jaeger, install dependencies and create `src/instrumentation.server.js` with NodeSDK configuration. View traces at localhost:16686.

### packaging
How to build and publish component libraries using @sveltejs/package, including package.json configuration, TypeScript support, and best practices.

## Building Component Libraries with @sveltejs/package

Structure: `src/lib` is public-facing, `package.json` used for publishing. `svelte-package` generates `dist` with preprocessed components and auto-generated type definitions.

**Key package.json fields:**
- `exports` - Define entry points with `types` and `svelte` conditions
- `files` - Specify what npm publishes (typically `["dist"]`)
- `sideEffects` - Mark CSS as having side effects: `["**/*.css"]`
- `svelte` - Legacy field pointing to root entry

**TypeScript:** Type definitions auto-generated. For non-root exports, use `typesVersions` to map types or require consumers to use `"moduleResolution": "bundler"`.

**Best practices:** Avoid SvelteKit-specific modules, define aliases in `svelte.config.js`, follow semantic versioning (removing exports is breaking), use declaration maps for source navigation.

**Important:** All relative imports need full paths with extensions: `import { x } from './something/index.js'`

