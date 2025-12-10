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
