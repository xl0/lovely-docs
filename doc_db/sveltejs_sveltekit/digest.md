# SvelteKit Complete Documentation

## Getting Started
Initialize with `npx sv create my-app`. Project structure: `src/routes/` for pages, `src/lib/` for utilities, `src/lib/server/` for server-only code, `static/` for assets. Every page is a Svelte component, server-rendered on first visit then client-side app takes over.

Rendering modes: Default hybrid (SSR initial, CSR navigation), static site generation with `adapter-static`, single-page app with exclusive CSR, multi-page app without JavaScript (`csr = false`), serverless with `adapter-auto`, own server with `adapter-node`, library with `@sveltejs/package`, PWA with service workers, mobile/desktop with Tauri/Capacitor/Electron, browser extensions, embedded devices.

Standard web APIs available: `fetch` (special version in load functions invokes endpoints directly during SSR), `Request`/`Response`, `Headers`, `FormData`, streams, URL APIs, Web Crypto.

## Core Concepts
Filesystem routing with `+` prefix: `+page.svelte` (component), `+page.js` (universal load), `+page.server.js` (server load), `+layout.svelte/js/server.js` (layouts), `+error.svelte` (error boundary), `+server.js` (API routes).

Load functions return data to components. Universal loads run on server during SSR and browser during navigation. Server loads run server-only, must return serializable data. Receive `params`, `url`, `route`, `fetch`, `setHeaders`, `parent()`, `depends()`, `untrack()`. Throw `error(status, message)` or `redirect(status, location)`. Streaming: return promises that resolve on client. Rerun on param/url changes or `invalidate(url)`/`invalidateAll()`.

Form actions: export `actions` from `+page.server.js` to handle POST. Default or named actions via query parameter. Return data available as `form` prop. Use `fail(status, data)` for validation errors, `redirect()` to redirect. Progressive enhancement with `use:enhance` directive.

Page options (export from `+page.js`, `+page.server.js`, `+layout.js`, `+layout.server.js`): `prerender` (true/false/'auto'), `ssr` (false for client-only), `csr` (false for no JavaScript), `trailingSlash` ('never'/'always'/'ignore'), `config` (adapter-specific).

State management: Never store shared state in server variables. Use context API with `setContext`/`getContext` per-request. Component state preserved on navigation—use `$derived` for reactivity, `afterNavigate`/`beforeNavigate` for code that must rerun, `{#key}` to destroy/remount. Store URL-affecting state in search parameters. Use snapshots for ephemeral UI state.

Remote functions (type-safe client-server communication via `.remote.js`/`.remote.ts`): `query(schema?, fn)` for read (returns Promise-like with `loading`, `error`, `current`, `.refresh()`, `.batch()`), `form(schema, fn)` for write (returns object with `method`, `action`, `.enhance()`, `.validate()`, `.fields`, `.buttonProps`), `command(schema, fn)` for write from anywhere (not tied to elements), `prerender(schema?, fn, options)` for build-time static data. Validate with Standard Schema (Zod, Valibot). Sensitive fields use leading underscore. Use `getRequestEvent()` for cookies/auth.

## Build and Deployment
Build in two stages: Vite optimization (creates production builds, executes prerendering), adapter tuning (optimizes for target environment). Check `building` flag from `$app/environment` to prevent build-time execution.

Official adapters: `adapter-cloudflare` (Cloudflare Workers/Pages), `adapter-netlify` (Netlify), `adapter-node` (Node servers), `adapter-static` (static sites), `adapter-vercel` (Vercel). `adapter-auto` auto-detects environment.

**adapter-node**: Build standalone Node.js servers. Config via environment: `PORT`, `HOST`, `SOCKET_PATH` (default 0.0.0.0:3000), `ORIGIN`/`PROTOCOL_HEADER`/`HOST_HEADER`/`PORT_HEADER` for reverse proxies, `ADDRESS_HEADER`/`XFF_DEPTH` for client IP, `BODY_SIZE_LIMIT` (default 512kb), `SHUTDOWN_TIMEOUT` (default 30s). Adapter options: `out`, `precompress`, `envPrefix`. Graceful shutdown via `sveltekit:shutdown` event. Custom server via `handler.js` middleware.

**adapter-static**: Prerender entire site. Config: `pages`, `assets`, `fallback`, `precompress`, `strict`. Set `trailingSlash: 'always'` if host doesn't render `/a.html` for `/a`. GitHub Pages: set `paths.base` to repo name, use `fallback: '404.html'`, add `.nojekyll`.

**Single-Page Apps**: Use `adapter-static` with fallback page, disable SSR globally with `export const ssr = false`. Significant performance/SEO drawbacks. Mitigation: prerender as many pages as possible.

**adapter-cloudflare**: Deploy to Cloudflare Workers or Pages. Create `wrangler.jsonc` with `main: ".svelte-kit/cloudflare/_worker.js"`, `assets: { binding: "ASSETS", directory: ".svelte-kit/cloudflare" }`. Pages: use Git integration with framework preset, build command `npm run build`, output `.svelte-kit/cloudflare`. Access bindings via `platform.env`. Local emulation: `wrangler dev .svelte-kit/cloudflare` (Workers) or `wrangler pages dev .svelte-kit/cloudflare` (Pages). Add `nodejs_compat` flag for Node.js compatibility.

**adapter-netlify**: Deploy to Netlify. Config: `edge` (true for Deno edge functions), `split` (true to deploy each route as individual function). Requires `netlify.toml` with build command and publish directory. Netlify Forms: create HTML form with hidden `form-name`, prerender page. Access context via `event.platform?.context`.

**adapter-vercel**: Deploy to Vercel. Config: `images` (sizes, formats, minimumCacheTTL, domains). Route-level config via `export const config` in `+server.js`, `+page(.server).js`, `+layout(.server).js`: `split`, `runtime` ('edge'/'nodejs20.x'/'nodejs22.x'), `regions`, `memory`, `maxDuration`, `isr` (expiration, bypassToken, allowQuery). ISR: only use where all visitors see same content. Skew Protection: routes requests to original deployment via cookie.

**Custom Adapters**: Export default function returning `Adapter` object with `name`, `adapt(builder)`, `emulate()`, `supports`. Adapt method: clear build directory, write output using `builder.writeClient/Server/Prerendered()`, output code that imports Server, instantiates with manifest, listens for requests, calls `server.respond(request, {getClientAddress})`, exposes platform info.

## Advanced Features
**Rest Parameters**: `[...file]` matches variable segments. **Optional Parameters**: `[[lang]]/home` matches both `home` and `en/home`. **Matchers**: `src/params/fruit.js` exports `match(param)` function, use in routes `[page=fruit]`. **Route Sorting**: static > dynamic > matchers > optional/rest, alphabetical tiebreaker. **Encoding**: filesystem/URL-reserved characters use hex escapes `[x+nn]`, Unicode `[u+nnnn]` or literal emoji. **Route Groups**: parenthesized directories `(app)`, `(marketing)` don't affect URL. **Layout Reset**: `@` suffix breaks out of hierarchy.

**Hooks**: `handle` (every request, modify response, transform HTML), `locals` (populate `event.locals`), `handleFetch` (intercept `event.fetch`), `handleValidationError` (remote function validation), `handleError` (unexpected errors), `init` (startup), `reroute` (change URL-to-route mapping), `transport` (custom type serialization).

**Errors**: Expected errors from `error(404, message)` caught by SvelteKit, render nearest `+error.svelte`. Unexpected errors pass through `handleError` hook. Declare `App.Error` interface for custom shape. Customize `src/error.html` with `%sveltekit.status%`, `%sveltekit.error.message%`.

**Link Options**: `data-sveltekit-preload-data` ('hover'/'tap'), `data-sveltekit-preload-code` ('eager'/'viewport'/'hover'/'tap'), `data-sveltekit-reload` (full-page), `data-sveltekit-replacestate` (replaceState), `data-sveltekit-keepfocus` (retain focus), `data-sveltekit-noscroll` (prevent scroll). Set to "false" to disable.

**Service Workers**: Auto-registered if `src/service-worker.js` exists. Access `build`, `files`, `version`, `base` from `$service-worker`. Cache-first for assets, network-first for dynamic. Only works in browsers supporting ES modules.

**Server-only Modules**: `$env/static/private`, `$env/dynamic/private`, `$app/server` only importable in server code. Add `.server` suffix or place in `$lib/server/`. SvelteKit prevents importing into browser code.

**Snapshots**: Export `snapshot` object from `+page.svelte`/`+layout.svelte` with `capture()` and `restore(value)` methods. Data must be JSON-serializable, persists to `sessionStorage`.

**Shallow Routing**: `pushState('', {showModal: true})` creates history entry without navigation, accessible via `page.state`. Use `preloadData(href)` to load route data. Requires JavaScript.

**Observability**: OpenTelemetry tracing for server-side spans. Set `experimental: {tracing: {server: true}, instrumentation: {server: true}}` in config. Access `event.tracing.root` and `event.tracing.current` spans. Create `src/instrumentation.server.js` with NodeSDK config.

**Packaging**: Use `@sveltejs/package` to build component libraries. `src/lib` is public, `src/routes` optional. `svelte-package` generates `dist` with preprocessed components, transpiled TypeScript, auto-generated types. package.json: `exports` field for entry points, `sideEffects` for tree-shaking. Avoid SvelteKit-specific modules; use `esm-env` instead. All relative imports must have extensions.

## Best Practices
**Authentication**: Session IDs stored in database (immediately revocable, DB query per request). JWTs not checked against datastore (cannot revoke immediately, better latency). Check auth in server hooks, store user in `locals`.

**Performance**: Built-in: code-splitting, asset preloading, file hashing, request coalescing, parallel loading, data inlining, conservative invalidation, prerendering, link preloading. Diagnose with PageSpeed Insights, WebPageTest, browser devtools. Test in preview mode. Images: use `@sveltejs/enhanced-img`. Videos: compress to `.webm`/`.mp4`, lazy-load with `preload="none"`. Fonts: call `resolve` with `preload` filter in `handle` hook. Code reduction: use latest Svelte, identify large packages with `rollup-plugin-visualizer`, minimize third-party scripts, use dynamic `import()`. Navigation: return promises from `load` for slow data, use server `load` for backend requests (avoids round trips), use database joins instead of sequential queries.

**Icons**: CSS-based via Iconify (works with Tailwind/UnoCSS plugins). Avoid Svelte libraries with one file per icon (severely slow Vite).

**Images**: Vite auto-processes imported assets with hashing/inlining. `@sveltejs/enhanced-img`: generates smaller formats (avif/webp), sets intrinsic width/height, creates multiple sizes, strips EXIF. Setup: add `enhancedImages()` plugin. Usage: `<enhanced:img src="./image.jpg" alt="text" />`. Dynamic selection via `import.meta.glob` with `{enhanced: true}`. For dynamic images (CMS, backend), use CDN with Svelte support: `@unpic/svelte`, Cloudinary, Contentful, Storyblok, Contentstack.

**Accessibility**: Route announcements via `<title>` element (SvelteKit injects live region). Focus management: SvelteKit focuses `<body>` after navigation unless `autofocus` present, customize with `afterNavigate`. Set `lang` on `<html>` for assistive technology.

**SEO**: SSR enabled by default (keep on). Every page needs unique `<title>` and `<meta name="description">`. Return SEO data from page `load`, use in root layout's `<svelte:head>`. Sitemaps: create dynamic via endpoints. AMP: set `inlineStyleThreshold: Infinity`, disable CSR in root `+layout.server.js`, add `amp` attribute to `<html>`, transform HTML in `hooks.server.js` with `@sveltejs/amp`.

## API Reference
**Response Helpers**: `error(status, body)`, `fail(status, data?)`, `invalid(...issues)`, `json(data, init?)`, `text(body, init?)`, `redirect(status, location)`, `normalizeUrl(url)`.

**RequestEvent**: `cookies`, `fetch`, `getClientAddress()`, `locals`, `params`, `platform`, `request`, `route`, `setHeaders()`, `url`, `isDataRequest`, `isSubRequest`, `isRemoteRequest`, `tracing`.

**Cookies**: `get(name, opts?)`, `getAll(opts?)`, `set(name, value, opts)`, `delete(name, opts)`, `serialize()`. httpOnly/secure default true (except localhost). sameSite defaults lax. Must specify path.

**Navigation**: `afterNavigate()`, `beforeNavigate()`, `disableScrollHandling()`, `goto(url, opts?)`, `invalidate(url)`, `invalidateAll()`, `onNavigate()`, `preloadCode()`, `preloadData()`, `pushState()`, `replaceState()`, `refreshAll()`.

**Page Store**: `url`, `params`, `route`, `status`, `error`, `data`, `state`, `form`.

**Hooks**: `handle`, `handleFetch`, `handleServerError`, `handleClientError`, `handleValidationError`, `reroute`, `transport`, `clientInit`, `serverInit`.

**Adapters**: `Adapter` interface with `name`, `adapt(builder)`, `supports`, `emulate()`. Builder: `log`, `rimraf`, `mkdirp`, `config`, `prerendered`, `routes`, `createEntries`, `findServerAssets`, `generateFallback`, `generateEnvModule`, `generateManifest`, `getBuildDirectory`, `getClientDirectory`, `getServerDirectory`, `getAppPath`, `writeClient`, `writePrerendered`, `writeServer`, `copy`, `hasServerInstrumentationFile`, `instrument`, `compress`.

**Remote Functions**: `RemoteCommand` (single value with `pending`, `updates()`), `RemoteQuery` (reactive with `set()`, `refresh()`, `withOverride()`), `RemoteForm` (with `enhance()`, `for()`, `preflight()`, `validate()`, `fields`, `buttonProps`), `RemoteResource` (base with `error`, `loading`, `current`, `ready`).

**Error Types**: `HttpError` (from `error()`), `Redirect` (from `redirect()`), `ValidationError` (from `invalid()`).

**Environment Modules**: `$app/environment` (browser, building, dev, version), `$app/forms` (applyAction, deserialize, enhance), `$app/navigation` (navigation functions), `$app/paths` (asset(), resolve()), `$app/server` (command, form, getRequestEvent, prerender, query, read), `$app/state` (navigating, page, updated), `$app/stores` (deprecated), `$app/types` (auto-generated), `$env/dynamic/private`, `$env/dynamic/public`, `$env/static/private`, `$env/static/public`, `$lib`, `$service-worker`.

**Configuration** (svelte.config.js): `adapter`, `alias`, `appDir`, `csp`, `csrf`, `embedded`, `env`, `experimental`, `inlineStyleThreshold`, `moduleExtensions`, `outDir`, `output`, `paths`, `prerender`, `router`, `typescript`, `version`.

**CLI**: `vite dev`, `vite build`, `vite preview`, `svelte-kit sync`.

**App Namespace** (app.d.ts): `App.Error`, `App.Locals`, `App.PageData`, `App.PageState`, `App.Platform`.

## Migration Guides
**SvelteKit 2 Breaking Changes**: `error`/`redirect` no longer thrown, call directly. Cookies require `path`. Top-level promises not auto-awaited. `goto()` doesn't accept external URLs. `paths.relative` defaults true. `preloadCode` takes single argument. `resolvePath` → `resolveRoute`. `handleError` receives `status`/`message`. `use:enhance` removes `form`/`data`. File forms require `enctype="multipart/form-data"`. tsconfig stricter. Node 18.13+, svelte@4, vite@5, typescript@5.

**Sapper Migration**: Add `"type": "module"`. Replace sapper with `@sveltejs/kit` + adapter. Update scripts. Replace webpack/rollup with `svelte.config.js`. Move preprocessor options. Rename routes: `index.svelte` → `+page.svelte`, `_error.svelte` → `+error.svelte`, `_layout.svelte` → `+layout.svelte`. Replace imports: `@sapper/app` → `$app/navigation`/`$app/stores`. `preload` → `load` in `+page.js`/`+layout.js`. Single `event` argument. Throw `error()`/`redirect()`. `page` still exists, `preloading` → `navigating`, `page.url`/`params` (no `path`/`query`). Regex routes removed. `sapper:prefetch` → `data-sveltekit-preload-data`, `sapper:noscroll` → `data-sveltekit-noscroll`.

## Glossary
**CSR** (Client-side rendering): Page generation in browser via JavaScript. **SSR** (Server-side rendering): Page generation on server. **Hybrid app**: SvelteKit default (SSR initial, CSR navigation). **Hydration**: SSR data transmitted with HTML, components initialize without re-fetching. **SPA** (Single-page app): All requests load single HTML, client-side rendering. **SSG** (Static Site Generation): Every page prerendered. **Prerendering**: Computing page contents at build time. **ISR** (Incremental Static Regeneration): Generate static pages as visitors request. **Edge rendering**: Rendering in CDN near user. **Routing**: SvelteKit intercepts navigation, handles client-side. **PWA** (Progressive Web App): Web app functioning like mobile/desktop app. **MPA** (Multi-page app): Traditional apps rendering each page on server.