## Routing
- Rest parameters: `[...file]`, optional: `[[lang]]/home`, matchers: `[page=fruit]`
- Layout groups: `(group)` directories; break hierarchy with `+page@segment`

## Hooks
Server hooks: `handle`, `locals`, `handleFetch`, `handleValidationError`
Shared: `handleError`, `init`
Universal: `reroute`, `transport`

## Error Handling
- Expected: `error(404, 'message')` → renders `+error.svelte`
- Unexpected: logged, generic message shown
- Customize fallback with `src/error.html`

## Link Navigation
`data-sveltekit-preload-data`, `data-sveltekit-preload-code`, `data-sveltekit-reload`, `data-sveltekit-replacestate`, `data-sveltekit-keepfocus`, `data-sveltekit-noscroll`

## Service Workers
Auto-bundled `src/service-worker.js`; access `$service-worker` module for assets/version

## Server-only Modules
Use `.server` suffix or `$lib/server/` directory; blocks import chains from public code

## Snapshots
Export `snapshot` with `capture`/`restore` from `+page.svelte` or `+layout.svelte`

## Shallow Routing
`pushState(url, state)` and `replaceState(url, state)` create history without navigation

## Observability
Enable tracing in `svelte.config.js`; create `src/instrumentation.server.ts`

## Component Libraries
`@sveltejs/package` generates `dist`; configure `exports`, `files`, `sideEffects` in package.json; all relative imports need full paths with extensions