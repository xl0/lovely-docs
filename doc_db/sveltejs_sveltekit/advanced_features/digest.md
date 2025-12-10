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