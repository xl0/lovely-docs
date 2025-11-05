## Routing
Filesystem-based via `src/routes`. Files prefixed with `+` are route files: `+page.svelte`, `+page.server.js` (load/actions), `+layout.svelte`, `+server.js` (API). Auto-generated `$types` for type safety.

## Loading Data
Define load functions in `+page.js`/`+page.server.js` or `+layout.js`/`+layout.server.js`. Universal (`+page.js`) runs on server and browser; Server (`+page.server.js`) runs only on server. Use provided `fetch`, return promises for streaming, reruns on `params`/`url` changes.

## Form Actions
Export `actions` from `+page.server.js`. Invoke with `<form method="POST" action="?/actionName">`. Return `fail(400, data)` for validation errors. Progressive enhancement via `use:enhance`.

## Page Options
`prerender`, `ssr`, `csr`, `trailingSlash`, `config` exports control rendering behavior.

## State Management
Avoid shared server state. Keep load functions pure. Use context API instead of globals. Store persistent state in URLs, ephemeral state in snapshots.

## Remote Functions
Type-safe client-server communication via `.remote.js`: **query** (read, cached), **form** (write, validated), **command** (write, anywhere), **prerender** (build-time). Enable with `kit.experimental.remoteFunctions: true`.