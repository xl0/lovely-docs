## Getting Started
Create projects with `npx sv create my-app`. Pages are Svelte components in `src/routes` with SSR + CSR by default. Supports multiple rendering patterns: SSR+CSR, static generation, SPAs, serverless, custom servers, and mobile/desktop/browser extension deployment.

Project structure: `src/lib/` (reusable code), `src/lib/server/` (server-only), `src/routes/` (routes), `src/params/` (matchers), `static/` (assets). `app.html` uses placeholders: `%sveltekit.head%`, `%sveltekit.body%`, `%sveltekit.assets%`, `%sveltekit.nonce%`, `%sveltekit.env.[NAME]%`, `%sveltekit.version%`.

Uses standard Web APIs: `fetch`, `Request`/`Response`, `Headers`, `FormData`, Streams, `URL`/`URLSearchParams`, Web Crypto.

## Core Concepts
**Routing**: Filesystem-based via `src/routes`. Files prefixed with `+` are route files. `+page.svelte` (component), `+page.js`/`+page.server.js` (load functions), `+layout.svelte` (wraps pages), `+server.js` (API routes), `+error.svelte` (error pages). Use `$types` for type safety.

**Loading Data**: Define load functions in `+page.js` (universal, runs on server/browser), `+page.server.js` (server-only), or layout files. Return values available via `data` prop. Use provided `fetch` (inherits cookies, allows relative URLs on server). Return unresolved promises for non-essential data to enable streaming. Reruns when `params`, `url`, or dependencies change; manually trigger with `invalidate(url)` or `invalidateAll()`.

**Form Actions**: Export `actions` from `+page.server.js` to handle POST submissions. Invoke default with `<form method="POST">`, named actions with `<form method="POST" action="?/register">`. Return `fail(400, data)` for validation errors. Use `use:enhance` directive for progressive enhancement.

**Page Options**: Control rendering via exports: `prerender = true/'auto'` (build-time static HTML), `ssr = false` (client-only), `csr = false` (static HTML only), `trailingSlash = 'never'/'always'/'ignore'`.

**State Management**: Avoid shared state on server; authenticate with cookies. Load functions must be pure. Use context API with `setContext`/`getContext`. Store persistent state in URL search parameters. Use snapshots for ephemeral UI state.

**Remote Functions**: Type-safe client-server communication via `.remote.js` files. Four types: `query` (read, cached), `form` (write with validation), `command` (write callable anywhere), `prerender` (build-time data). Enable with `kit.experimental.remoteFunctions: true`.

## Build & Deploy
**Building**: Vite optimizes code, then adapter tunes for target environment. Use `building` flag from `$app/environment` to prevent build-time code execution.

**Adapters**: Deployment plugins configured in `svelte.config.js`. Official: Cloudflare, Netlify, Node, static sites, Vercel. `adapter-auto` auto-detects for Cloudflare Pages, Netlify, Vercel, Azure Static Web Apps, AWS (SST), Google Cloud Run.

**Node.js**: `@sveltejs/adapter-node`. Configure via env: `PORT` (3000), `HOST` (0.0.0.0), `ORIGIN`, `PROTOCOL_HEADER`, `HOST_HEADER`, `ADDRESS_HEADER`, `XFF_DEPTH`, `BODY_SIZE_LIMIT` (512kb), `SHUTDOWN_TIMEOUT` (30s). Listen to `sitelkit:shutdown` for graceful cleanup.

**Static Sites**: `adapter-static` with `export const prerender = true;` in root layout. Options: `pages`, `fallback` (for SPA), `precompress`, `strict`, `trailingSlash`.

**SPAs**: `adapter-static` with `fallback` and `export const ssr = false;` in root layout. Poor performance and SEO.

**Cloudflare**: `adapter-cloudflare`. Options: `fallback`, `routes`. Access bindings via `platform.env`. Use `read()` from `$app/server` instead of `fs`.

**Netlify**: `adapter-netlify` with `edge` and `split` options. Requires `netlify.toml`. Access context via `event.platform?.context`.

**Vercel**: `adapter-vercel`. Route config: `split`, `runtime` ('edge'|'nodejs20.x'), `regions`, `memory`, `isr`. Image optimization: `adapter({ images: { sizes: [640, 1920], formats: ['image/webp'] } })`.

**Custom Adapters**: Export function returning `Adapter` with `name` and `adapt(builder)`. Must clear build dir, write output via `builder.writeClient/Server/Prerendered()`, generate code importing `Server`, create app with `builder.generateManifest()`, convert platform requests to `Request`, call `server.respond()`, return `Response`.

## Advanced Techniques
**Routing**: Rest parameters `[...file]`, optional parameters `[[lang]]/home`, matchers in `src/params/fruit.js` with `export function match(param)`, layout groups `(group)` organize without affecting URLs, `+page@segment` breaks layout hierarchy.

**Hooks**: App-wide functions in `src/hooks.server.js`, `src/hooks.client.js`, `src/hooks.js`. Server: `handle` (modify request/response), `locals` (custom data), `handleFetch` (modify fetch), `handleValidationError`. Shared: `handleError`, `init`. Universal: `reroute` (translate URLs), `transport` (custom types).

**Error Handling**: Use `error(404, 'Not found')` for expected errors; renders nearest `+error.svelte` with `page.error`. Unexpected errors logged but not exposed; handle in `handleError` hook. Customize fallback with `src/error.html`.

**Link Navigation**: Configure `<a>` with `data-sveltekit-*` attributes: `preload-data` ('hover'|'tap'), `preload-code` ('eager'|'viewport'|'hover'|'tap'), `reload` (full-page), `replacestate`, `keepfocus`, `noscroll`.

**Service Workers**: SvelteKit auto-bundles `src/service-worker.js`. Access `$service-worker` module for assets, build files, version, base path. Example: cache built app and static files on install, clean old caches on activate, serve from cache with network fallback.

**Server-only Modules**: Mark with `.server` suffix or `$lib/server/` directory. SvelteKit blocks import chains from public code to server-only modules.

**Snapshots**: Preserve DOM state across navigation by exporting `snapshot` object with `capture` and `restore` methods from `+page.svelte` or `+layout.svelte`. Data stored in history stack and `sessionStorage`.

**Shallow Routing**: Create history entries without navigating using `pushState(url, state)` and `replaceState(url, state)`. Access state via `page.state`. Use `preloadData(href)` before shallow navigation.

**Observability**: Enable OpenTelemetry in `svelte.config.js` with `kit.experimental.tracing.server: true` and `kit.experimental.instrumentation.server: true`. Create `src/instrumentation.server.ts` for setup. Add custom attributes: `event.tracing.root.setAttribute('userId', user.id)`.

**Component Libraries**: Use `@sveltejs/package`. Structure: `src/lib` is public, `svelte-package` generates `dist`. Define entry points in `package.json` `exports` with `types` and `svelte` conditions. All relative imports need full paths with extensions.

## Best Practices
**Authentication**: Sessions require DB queries but revocable immediately; JWTs offer better latency but cannot be revoked. Check auth cookies in server hooks, store user info in `locals`. Lucia recommended for session-based auth.

**Performance**: Use PageSpeed Insights, WebPageTest, browser devtools. Optimize images with `@sveltejs/enhanced-img`. Compress videos to `.webm`/`.mp4`, lazy-load with `preload="none"`. Preload fonts in `handle` hook. Find large packages with `rollup-plugin-visualizer`, replace JS analytics with server-side, use dynamic `import(...)` for conditional code, run third-party scripts in web workers with Partytown. Preload links, return promises from `load` for non-essential data, use server `load` to avoid waterfalls. Colocate frontend/backend, deploy to edge, use CDN for images, require HTTP/2+.

**Icons**: Use Iconify CSS or one `.svelte` file per icon; avoid icon libraries.

**Images**: Vite auto-processes imported assets. `@sveltejs/enhanced-img` generates avif/webp, multiple sizes, intrinsic dimensions. CDN-based with `@unpic/svelte` for dynamic images. Serve via CDN, provide 2x resolution, set `fetchpriority="high"` for LCP images, add width/height to prevent layout shift, always provide alt text.

**Accessibility**: Set unique page titles in `<svelte:head>` for screen reader announcements. SvelteKit focuses `<body>` after navigation (or `autofocus` element), customize with `afterNavigate` hook or `goto` with `keepFocus`. Set `lang` attribute on `<html>` in `src/app.html`.

**SEO**: SSR enabled by default. Performance matters. Add unique `<title>` and `<meta name="description">` in `<svelte:head>`. Create dynamic sitemaps via endpoints. Set `inlineStyleThreshold: Infinity`, disable `csr`, transform HTML with `@sveltejs/amp` for AMP support.

## API Reference
**Response & Error**: `json(data)`, `text(body)`, `error(status, body)`, `redirect(status, location)`, `fail(status, data)`, `isHttpError()`, `isRedirect()`, `isActionFailure()`.

**RequestEvent**: `cookies`, `fetch`, `locals`, `params`, `url`, `setHeaders()`, `getClientAddress()`.

**LoadEvent**: Extends RequestEvent, adds `data`, `parent()`, `depends()`, `untrack()`.

**Page**: `url`, `params`, `route.id`, `status`, `error`, `data`, `state`, `form`.

**Hooks**: `handle({event, resolve})`, `handleError({error, event, status, message})`, `handleFetch({event, request, fetch})`, `reroute({url, fetch})`, `sequence` (chain middleware).

**Forms & Navigation**: `enhance` (intercept submissions), `applyAction` (update form/status), `deserialize`, `goto(url, opts)` with `replaceState`, `noScroll`, `keepFocus`, `invalidateAll`, `invalidate(resource)`, `beforeNavigate`/`afterNavigate`, `preloadData(href)`.

**Environment**: `$app/environment` exports `browser`, `building`, `dev`, `version`. `$env/static/private` (build-time private), `$env/static/public` (PUBLIC_ prefix), `$env/dynamic/private` (runtime private), `$env/dynamic/public` (PUBLIC_ prefix). `$app/state` exports `navigating`, `page`, `updated`. `$app/paths` exports `asset(file)`, `resolve(pathname, params?)`.

**Cookies**: `get(name)`, `getAll()`, `set(name, value, opts)` with required `path`, `delete(name, opts)`. `httpOnly`/`secure` default true.

**Server**: `$app/server` exports `command`, `form`, `query`, `query.batch`, `prerender`, `read`. `getRequestEvent()` accesses current RequestEvent.

**Builder**: `log`, `rimraf`, `mkdirp`, `config`, `routes`, `writeClient()`, `writeServer()`, `generateManifest()`, `compress()`.

**Node Utilities**: `createReadableStream(file)`, `getRequest({request, base, bodySizeLimit})`, `setResponse(res, response)`, `installPolyfills()`.

**Configuration** (svelte.config.js): `adapter`, `csp` (mode: 'hash'|'nonce'|'auto'), `csrf` (checkOrigin, trustedOrigins), `paths` (assets, base, relative), `prerender` (concurrency, crawl, entries, origin), `router.type` ('pathname'|'hash'), `version` (name, pollInterval).

**Types**: `$types` auto-generates `RequestHandler`, `Load`, `PageData`, `LayoutData`, `ActionData`. `$app/types` exports `RouteId`, `Pathname`, `RouteParams<'/blog/[slug]'>`, `LayoutParams`. `app.d.ts` ambient types: `Error`, `Locals`, `PageData`, `PageState`, `Platform`.

**Service Worker**: `$service-worker` exports `base`, `build`, `files`, `prerendered`, `version`.

## FAQs & Integrations
Import JSON: `import pkg from './package.json' with { type: 'json' };`. Yarn 2/3 requires `nodeLinker: 'node-modules'` in `.yarnrc.yml`.

Distribute Svelte components as uncompiled `.svelte` files with ESM-only JS using `svelte-package`. Validate with publint.dev.

View Transitions: Wrap navigation with `document.startViewTransition()` in `onNavigate` hook.

Check `browser` environment variable or use `onMount` for client-side code.

Query databases via `db.js` singleton in server routes, setup in `hooks.server.js`.

External APIs: Use `event.fetch` in server routes, proxy via `server.proxy` in dev, or create API routes in production.

Dev middleware uses Vite plugin with `configureServer`. Production uses `adapter-node` middleware.

`vitePreprocess` enables CSS preprocessing (PostCSS, SCSS, Less, Stylus, SugarSS), included by default with TypeScript. `npx sv add` installs prettier, eslint, vitest, playwright, lucia, tailwind, drizzle, paraglide, mdsvex, storybook.

VSCode Debug: `CMD/Ctrl + Shift + P` → "Debug: JavaScript Debug Terminal" → `npm run dev`. Browser DevTools: `NODE_OPTIONS="--inspect" npm run dev` → `localhost:5173` → Node.js DevTools icon.

## Migration to v2
**Breaking Changes**: `error()` and `redirect()` no longer need `throw`. Cookies require explicit `path: '/'`. Top-level promises must be explicitly `await`ed. `goto()` rejects external URLs; use `window.location.href`. Paths relative by default; `preloadCode` needs `base` prefix. `resolvePath` → `resolveRoute`. `handleError` receives `status` and `message`. Dynamic env vars blocked during prerendering. `use:enhance` callbacks: `form`/`data` → `formElement`/`formData`. File input forms need `enctype="multipart/form-data"`. TypeScript: `moduleResolution: "bundler"`, `verbatimModuleSyntax`. Node 18.13+, svelte@4, vite@5, typescript@5. `$app/stores` deprecated; migrate to `$app/state`.

## Migration from Sapper
Add `"type": "module"` to package.json. Replace `sapper` with `@sveltejs/kit` and adapter. Update scripts: `sapper build` → `vite build`, `sapper dev` → `vite dev`. Replace `webpack.config.js`/`rollup.config.js` with `svelte.config.js`.

File structure: `src/template.html` → `src/app.html`, `_layout.svelte` → `+layout.svelte`, `_error.svelte` → `+error.svelte`, `routes/about.svelte` → `routes/about/+page.svelte`.

`preload` → `load` in `+page.js`/`+layout.js` with single `event` argument. `@sapper/app` imports → `$app/navigation`, `$app/stores`. `stores()` → import `navigating`, `page` directly. No `this` object; throw `error()`, `redirect()`. Relative URLs resolve against current page, not base. `sapper:prefetch` → `data-sveltekit-preload-data`.

## Glossary
**Rendering Modes**: CSR (browser-based), SSR (server-side), Hybrid (SSR initial + CSR navigation), SPA (single HTML file, poor SEO), MPA (traditional server-rendered).

**Static Generation**: Prerendering (build-time HTML), SSG (all pages prerendered), ISR (on-demand with `adapter-vercel`).

**Other**: Hydration (server HTML enhanced with client interactivity), Routing (client-side navigation interception), Edge (CDN-based rendering), PWA (installable web app).