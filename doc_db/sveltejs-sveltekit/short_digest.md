## Getting Started
Create projects with `npx sv create my-app`. Pages in `src/routes` with SSR + CSR by default. Supports static generation, SPAs, serverless, custom servers, mobile/desktop/browser extension deployment.

## Core Concepts
**Routing**: Filesystem-based. `+page.svelte` (component), `+page.js`/`+page.server.js` (load), `+layout.svelte` (wrapper), `+server.js` (API), `+error.svelte` (errors).

**Loading Data**: Define load functions in `+page.js` (universal) or `+page.server.js` (server-only). Use provided `fetch` (inherits cookies, relative URLs on server). Return unresolved promises for streaming. Reruns on `params`/`url` changes; trigger with `invalidate(url)` or `invalidateAll()`.

**Form Actions**: Export `actions` from `+page.server.js`. Invoke default with `<form method="POST">`, named with `<form method="POST" action="?/register">`. Return `fail(400, data)` for validation. Use `use:enhance` for progressive enhancement.

**Page Options**: `prerender = true/'auto'` (static), `ssr = false` (client-only), `csr = false` (static HTML), `trailingSlash`.

**State Management**: Avoid shared server state. Load functions must be pure. Use context API. Store persistent state in URL. Use snapshots for ephemeral state.

**Remote Functions**: Type-safe client-server via `.remote.js`. Types: `query` (read, cached), `form` (write, validated), `command` (write, callable), `prerender` (build-time).

## Build & Deploy
**Adapters**: Deployment plugins in `svelte.config.js`. Official: Cloudflare, Netlify, Node, static, Vercel. `adapter-auto` auto-detects.

**Node.js**: `@sveltejs/adapter-node`. Env: `PORT`, `HOST`, `ORIGIN`, `PROTOCOL_HEADER`, `HOST_HEADER`, `ADDRESS_HEADER`, `XFF_DEPTH`, `BODY_SIZE_LIMIT`, `SHUTDOWN_TIMEOUT`.

**Static**: `adapter-static` with `prerender = true` in root layout.

**SPAs**: `adapter-static` with `fallback` and `ssr = false`. Poor SEO.

**Cloudflare**: `adapter-cloudflare`. Access bindings via `platform.env`. Use `read()` from `$app/server` instead of `fs`.

**Netlify**: `adapter-netlify` with `edge`/`split` options. Requires `netlify.toml`.

**Vercel**: `adapter-vercel`. Config: `split`, `runtime`, `regions`, `memory`, `isr`. Image optimization: `adapter({ images: { sizes: [640, 1920], formats: ['image/webp'] } })`.

## Advanced
**Routing**: Rest `[...file]`, optional `[[lang]]/home`, matchers in `src/params/fruit.js`, layout groups `(group)`, `+page@segment` breaks hierarchy.

**Hooks**: `handle` (modify request/response), `locals` (custom data), `handleFetch`, `handleValidationError`, `handleError`, `init`, `reroute`, `transport`.

**Error Handling**: `error(404, 'Not found')` renders nearest `+error.svelte`. Unexpected errors logged; handle in `handleError` hook.

**Link Navigation**: `data-sveltekit-preload-data`, `preload-code`, `reload`, `replacestate`, `keepfocus`, `noscroll`.

**Service Workers**: Auto-bundled `src/service-worker.js`. Access `$service-worker` for assets, build, version, base.

**Server-only Modules**: `.server` suffix or `$lib/server/` directory blocks imports from public code.

**Snapshots**: Export `snapshot` with `capture`/`restore` from `+page.svelte` or `+layout.svelte` to preserve DOM state.

**Shallow Routing**: `pushState(url, state)`, `replaceState(url, state)`. Access via `page.state`.

**Component Libraries**: `@sveltejs/package` generates `dist`. Define entry points in `package.json` `exports`. All relative imports need full paths with extensions.

## Best Practices
**Auth**: Sessions revocable but require DB queries; JWTs faster but not revocable. Check cookies in server hooks, store user in `locals`. Lucia recommended.

**Performance**: Optimize images with `@sveltejs/enhanced-img`. Compress videos to `.webm`/`.mp4`. Preload fonts. Find large packages with `rollup-plugin-visualizer`. Return promises from `load` for non-essential data. Colocate frontend/backend, deploy to edge, use CDN.

**Images**: Vite auto-processes imports. `@sveltejs/enhanced-img` generates avif/webp, multiple sizes. Serve via CDN, provide 2x resolution, set `fetchpriority="high"` for LCP, add width/height, always alt text.

**Accessibility**: Unique page titles in `<svelte:head>`. SvelteKit focuses `<body>` after navigation. Set `lang` on `<html>`.

**SEO**: SSR by default. Add unique `<title>` and `<meta name="description">`. Create dynamic sitemaps.

## API Reference
**Response**: `json(data)`, `text(body)`, `error(status, body)`, `redirect(status, location)`, `fail(status, data)`.

**RequestEvent**: `cookies`, `fetch`, `locals`, `params`, `url`, `setHeaders()`, `getClientAddress()`.

**LoadEvent**: Extends RequestEvent, adds `data`, `parent()`, `depends()`, `untrack()`.

**Hooks**: `handle({event, resolve})`, `handleError({error, event, status, message})`, `handleFetch({event, request, fetch})`, `reroute({url, fetch})`.

**Navigation**: `enhance`, `applyAction`, `goto(url, opts)`, `invalidate(resource)`, `beforeNavigate`/`afterNavigate`, `preloadData(href)`.

**Environment**: `$app/environment` (browser, building, dev, version), `$env/static/private`, `$env/static/public`, `$env/dynamic/private`, `$env/dynamic/public`, `$app/state` (navigating, page, updated), `$app/paths` (asset, resolve).

**Cookies**: `get(name)`, `getAll()`, `set(name, value, opts)` with required `path`, `delete(name, opts)`.

**Server**: `$app/server` (command, form, query, query.batch, prerender, read), `getRequestEvent()`.

**Configuration**: `adapter`, `csp`, `csrf`, `paths`, `prerender`, `router.type`, `version`.

**Types**: `$types` (RequestHandler, Load, PageData, LayoutData, ActionData), `$app/types` (RouteId, Pathname, RouteParams, LayoutParams), `app.d.ts` (Error, Locals, PageData, PageState, Platform).

## Migrations
**v2**: `error()`/`redirect()` no throw, cookies need `path: '/'`, top-level promises `await`ed, `goto()` rejects external URLs, `resolvePath` → `resolveRoute`, `handleError` receives `status`/`message`, `use:enhance` callbacks renamed, file inputs need `enctype="multipart/form-data"`, Node 18.13+, `$app/stores` → `$app/state`.

**Sapper**: Add `"type": "module"`, replace `sapper` with `@sveltejs/kit`, update scripts, replace config files, rename files (`_layout.svelte` → `+layout.svelte`), `preload` → `load`, `@sapper/app` → `$app/navigation`/`$app/stores`.