# Core Concepts

**Routing**: Filesystem-based in `src/routes`. Files with `+` prefix: `+page.svelte` (component), `+page.js`/`+page.server.js` (load), `+layout.*` (layouts), `+error.svelte` (errors), `+server.js` (API routes with GET/POST/etc handlers).

**Load functions**: Return data to components. Universal (`+page.js`, `+layout.js`) run server+browser, can return any values. Server (`+page.server.js`, `+layout.server.js`) run server-only, must return serializable data. Receive `params`, `url`, `fetch`, `parent()`, `depends()`. Throw `error()` or `redirect()`. Rerun on param/url changes or `invalidate()` calls. Support streaming promises.

**Form actions**: Export `actions` from `+page.server.js` to handle POST. Default or named actions. Return data as `form` prop. Use `fail(status, data)` for validation, `redirect()` for redirects. Progressive enhancement with `use:enhance` directive and `applyAction()`.

**Page options**: `prerender` (build-time static), `ssr` (client-only), `csr` (no JS), `trailingSlash`, `config` (adapter-specific). Set per-page or inherit from layouts.

**State**: Never use shared server variables. Load functions must be pure. Use context API for per-request state. Component state preserved on navigation - use `$derived` for reactivity. Store URL-affecting state in search params.

**Remote functions**: Type-safe client-server via `.remote.js`. `query(schema, fn)` reads data with caching/refresh. `form(schema, fn)` writes with progressive enhancement, field validation, single-flight mutations. `command(schema, fn)` writes from anywhere. `prerender(schema, fn, options)` for build-time static data. Validate with Standard Schema, serialize via devalue.
