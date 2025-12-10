## FAQ

**Package compatibility**: Check publint.dev for library packaging issues. ESM files need `.mjs` extension (or `"type": "module"` in package.json); CommonJS needs `.cjs`. The `exports` field takes precedence over `main`/`module`. Svelte components should be uncompiled `.svelte` files with ESM-only JS.

**Client-side libraries**: Wrap in `browser` check or `onMount` to avoid SSR issues. For side-effect-free libraries, static imports work (tree-shaken in server build). Use `{#await}` blocks for dynamic imports.

**Database**: Put queries in server routes, create `db.js` singleton for connections, run setup in `hooks.server.js`.

**Backend API**: Use `event.fetch` for external APIs. For CORS issues, proxy in production (rewrite `/api` paths) or dev (Vite `server.proxy`). Alternatively, create API route that forwards requests.

**Middleware**: In production use `adapter-node`. In dev, add via Vite plugin with `server.middlewares.use()`.

**View transitions**: Call `document.startViewTransition` in `onNavigate` callback.

**Yarn**: Use `nodeLinker: 'node-modules'` in `.yarnrc.yml` to avoid ESM issues with Plug'n'Play.

## Integrations

**vitePreprocess**: Enables Vite CSS flavors (PostCSS, SCSS, Less, Stylus, SugarSS). Import from `@sveltejs/vite-plugin-svelte`. TypeScript included by default; Svelte 5 supports TypeScript natively for type syntax only.

**npx sv add**: Installs common integrations: prettier, eslint, vitest, playwright, lucia, tailwind, drizzle, paraglide, mdsvex, storybook.

**svelte-preprocess**: Offers Pug, Babel, global styles support beyond vitePreprocess. May be slower; requires installing corresponding libraries (sass, less, etc).

**Vite plugins**: SvelteKit uses Vite, so any Vite plugin can enhance projects. Listed in vitejs/awesome-vite.

## Breakpoint Debugging

**VSCode Debug Terminal**: Open command palette, launch "Debug: JavaScript Debug Terminal", start `npm run dev`, set breakpoints.

**VSCode Launch Configuration**: Create `.vscode/launch.json` with `"command": "npm run dev"`, `"type": "node-terminal"`, use F5 to start.

**Browser DevTools**: Run `NODE_OPTIONS="--inspect" npm run dev`, open localhost:5173, click Node.js logo in DevTools or navigate to `chrome://inspect` / `edge://inspect`.

**Other editors**: WebStorm has built-in support; Neovim has community guides.

## SvelteKit 2 Breaking Changes

**error/redirect**: No longer thrown; call directly: `error(500, 'msg')` instead of `throw error(...)`. Use `isHttpError`/`isRedirect` to distinguish from unexpected errors.

**Cookies**: `path` now required: `cookies.set(name, value, { path: '/' })`. Use `path: '/'` for domain-wide, `''` for current path, `'.'` for current directory.

**Top-level promises**: No longer auto-awaited in load functions. Explicitly await or use `Promise.all()` to avoid waterfalls.

**goto()**: No longer accepts external URLs; use `window.location.href`. `state` object determines `$page.state` and must match `App.PageState`.

**Relative paths**: `paths.relative` defaults to `true` (was inconsistent). Makes apps portable when base path unknown.

**preloadCode**: Takes single base-prefixed argument instead of multiple.

**resolvePath → resolveRoute**: `resolveRoute('/blog/[slug]', { slug })` from `$app/paths` replaces `base + resolvePath(...)`.

**Error handling**: `handleError` receives `status` and `message`. For code errors, status is `500`, message is `Internal Error`. Message is safe to expose to users.

**Dynamic env vars**: Cannot use `$env/dynamic/*` during prerendering; use `$env/static/public`/`$env/static/private`. SvelteKit requests updated values from `/_app/env.js` on prerendered pages.

**use:enhance**: `form`/`data` removed; use `formElement`/`formData`.

**File forms**: Must have `enctype="multipart/form-data"`.

**tsconfig.json**: Stricter validation; use `alias` in `svelte.config.js` instead of `paths`/`baseUrl`.

**getRequest**: No longer throws on `Content-Length` exceeding limit; error deferred until body read.

**vitePreprocess import**: Import from `@sveltejs/vite-plugin-svelte`, not `@sveltejs/kit/vite`.

**Dependencies**: Node 18.13+, svelte@4, vite@5, typescript@5, @sveltejs/vite-plugin-svelte@3. Adapters: cloudflare@3, cloudflare-workers@2, netlify@3, node@2, static@3, vercel@4. tsconfig uses `"moduleResolution": "bundler"` and `verbatimModuleSyntax`.

**$app/stores deprecated** (2.12+): Use `$app/state` (Svelte 5 runes) instead. Replace imports and remove `$` prefixes. Run `npx sv migrate app-state` for auto-migration.

## Sapper Migration

**package.json**: Add `"type": "module"`. Replace sapper with `@sveltejs/kit` + adapter. Update scripts: `sapper build` → `vite build`, `sapper export` → `vite build` (static adapter), `sapper dev` → `vite dev`.

**Config files**: Replace webpack/rollup config with `svelte.config.js`. Move preprocessor options to `config.preprocess`. Add adapter (adapter-node ≈ sapper build, adapter-static ≈ sapper export).

**src/client.js**: No equivalent; move logic to `+layout.svelte` in `onMount`.

**src/server.js**: Use custom server with adapter-node or no equivalent for serverless.

**src/service-worker.js**: Update imports from `@sapper/service-worker` to `$service-worker`. `files` unchanged, `routes` removed, `shell` → `build`, `timestamp` → `version`.

**src/template.html → src/app.html**: Remove `%sapper.base%`, `%sapper.scripts%`, `%sapper.styles%`, `<div id="sapper">`. Replace `%sapper.head%` → `%sveltekit.head%`, `%sapper.html%` → `%sveltekit.body%`.

**src/node_modules → src/lib**: For internal libraries.

**Routes**: Rename `routes/about/index.svelte` → `routes/about/+page.svelte`, `_error.svelte` → `+error.svelte`, `_layout.svelte` → `+layout.svelte`.

**Imports**: Replace `@sapper/app` with `$app/navigation`/`$app/stores`. `goto` unchanged, `prefetch` → `preloadData`, `prefetchRoutes` → `preloadCode`, `stores` → `getStores` or import `navigating`/`page` directly (or `$app/state` in Svelte 5 + SvelteKit 2.12+).

**Preload → load**: Rename `preload` to `load`, move to `+page.js`/`+layout.js`. Single `event` argument replaces `page`/`session`. No `this` object; use `fetch` from input, throw `error()`/`redirect()`.

**Stores**: `page` still exists. `preloading` → `navigating` (with `from`/`to`). `page` has `url`/`params` (no `path`/`query`).

**Routing**: Regex routes removed; use advanced route matching. `segment` prop removed; use `$page.url.pathname`.

**URLs**: Relative URLs resolve against current page. Use root-relative URLs (starting with `/`) for context-independent meaning.

**Link attributes**: `sapper:prefetch` → `data-sveltekit-preload-data`, `sapper:noscroll` → `data-sveltekit-noscroll`.

**Endpoints**: No direct `req`/`res` access; SvelteKit is environment-agnostic. `fetch` available globally.

**HTML minifier**: Not included by default. Add as dependency and use in server hook with `transformPageChunk`.

## Glossary

**CSR** (Client-side rendering): Page generation in browser via JavaScript. Enabled by default, disable with `csr = false`.

**SSR** (Server-side rendering): Page generation on server. Enabled by default, disable with `ssr = false`. Improves performance and SEO.

**Hybrid app**: SvelteKit default. Initial HTML from server (SSR), subsequent navigations via client (CSR).

**Hydration**: SSR data transmitted to client with HTML. Components initialize with that data without re-fetching. Svelte checks DOM state and attaches listeners. Enabled by default, disable with `csr = false`.

**SPA** (Single-page app): All requests load single HTML file, client-side rendering based on URL. All navigation client-side. Serves empty shell initially (differs from hybrid). Large performance impact. Build with `adapter-static`.

**SSG** (Static Site Generation): Every page prerendered. No server maintenance. Served from CDNs. Implement with `adapter-static` or `prerender` config.

**Prerendering**: Computing page contents at build time, saving HTML. Benefits: same as SSR, avoids recomputing per visitor, scales nearly free. Tradeoff: expensive build, content updates only by rebuild/deploy. Rule: any two users hitting directly must get same content, page must not contain actions. Can prerender personalized pages if user-specific data fetched client-side.

**ISR** (Incremental Static Regeneration): Generate static pages as visitors request without redeploying. Reduces build times vs SSG. Available with `adapter-vercel`.

**Edge rendering**: Rendering in CDN near user, improving latency.

**Routing**: SvelteKit intercepts navigation (link clicks, forward/back), handles client-side by rendering new page component. Enabled by default, skip with `data-sveltekit-reload`.

**PWA** (Progressive Web App): Web app functioning like mobile/desktop app. Can be installed with shortcuts. Often uses service workers for offline.

**MPA** (Multi-page app): Traditional apps rendering each page on server, common in non-JavaScript languages.