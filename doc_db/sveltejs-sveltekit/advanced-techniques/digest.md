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