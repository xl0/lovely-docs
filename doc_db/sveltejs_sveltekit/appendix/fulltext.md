

## Pages

### faq
Common questions: package compatibility (check publint.dev, use ESM), client-side libraries (browser check/onMount), database (server routes + singleton), backend API (proxy or event.fetch), middleware (Vite plugin), view transitions (onNavigate), Yarn (nodeLinker: node-modules).

## What can I make with SvelteKit?

See documentation regarding project types.

## Including package.json details

```ts
import pkg from './package.json' with { type: 'json' };
```

## Fixing package inclusion errors

Check library packaging compatibility with publint.dev. Key points:
- `exports` field takes precedence over `main` and `module`
- ESM files should end with `.mjs` unless `"type": "module"` is set; CommonJS files should end with `.cjs`
- `main` should be defined if `exports` is not
- Svelte components should be distributed as uncompiled `.svelte` files with ESM-only JS, using `svelte-package` for packaging

Libraries work best with Vite when distributing ESM. CommonJS dependencies are pre-bundled by `vite-plugin-svelte` using esbuild. For issues, check Vite and library issue trackers; `optimizeDeps` and `ssr` config can be workarounds.

## Using view transitions API

Call `document.startViewTransition` in `onNavigate`:

```js
import { onNavigate } from '$app/navigation';

onNavigate((navigation) => {
	if (!document.startViewTransition) return;
	return new Promise((resolve) => {
		document.startViewTransition(async () => {
			resolve();
			await navigation.complete;
		});
	});
});
```

## Setting up a database

Put database queries in server routes, not `.svelte` files. Create a `db.js` singleton for connections and execute one-time setup in `hooks.server.js`. Use the Svelte CLI to automatically set up database integrations.

## Using client-side libraries accessing document/window

Wrap in a `browser` check:

```js
import { browser } from '$app/environment';
if (browser) { /* client-only code */ }
```

Or use `onMount`:

```js
import { onMount } from 'svelte';
onMount(async () => {
	const { method } = await import('some-browser-only-library');
	method('hello world');
});
```

For side-effect-free libraries, static import works (tree-shaken in server build):

```js
import { onMount } from 'svelte';
import { method } from 'some-browser-only-library';
onMount(() => { method('hello world'); });
```

Or use `{#await}` block:

```svelte
<script>
	import { browser } from '$app/environment';
	const ComponentConstructor = browser ?
		import('some-browser-only-library').then((m) => m.Component) :
		new Promise(() => {});
</script>

{#await ComponentConstructor}
	<p>Loading...</p>
{:then component}
	<svelte:component this={component} />
{:catch error}
	<p>Error: {error.message}</p>
{/await}
```

## Using a different backend API server

Use `event.fetch` to request from external API, but handle CORS complications. Alternatively, set up a proxy: in production rewrite paths like `/api` to the API server; in dev use Vite's `server.proxy` option.

If rewrites unavailable, add an API route:

```js
// src/routes/api/[...path]/+server.js
export function GET({ params, url }) {
	return fetch(`https://example.com/${params.path + url.search}`);
}
```

May also need to proxy POST/PATCH and forward request.headers.

## Using middleware

`adapter-node` builds middleware for production. In dev, add middleware via Vite plugin:

```js
import { sveltekit } from '@sveltejs/kit/vite';

const myPlugin = {
	name: 'log-request-middleware',
	configureServer(server) {
		server.middlewares.use((req, res, next) => {
			console.log(`Got request ${req.url}`);
			next();
		});
	}
};

export default { plugins: [myPlugin, sveltekit()] };
```

## Using Yarn

Yarn 2 Plug'n'Play is broken with ESM; use `nodeLinker: 'node-modules'` in `.yarnrc.yml` or prefer npm/pnpm.

Yarn 3 ESM support is experimental. To use: create app with `yarn create svelte`, enable Berry with `yarn set version berry && yarn install`, then add to `.yarnrc.yml`:

```yaml
nodeLinker: node-modules
```

This downloads packages locally and avoids build failures.

### integrations
vitePreprocess enables Vite CSS flavors; npx sv add installs common integrations; svelte-preprocess offers Pug/Babel/global styles; Vite plugins supported; FAQ available.

## vitePreprocess

Include `vitePreprocess` from `@sveltejs/vite-plugin-svelte` to use CSS flavors supported by Vite: PostCSS, SCSS, Less, Stylus, SugarSS.

```js
// svelte.config.js
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

const config = {
  preprocess: [vitePreprocess()]
};

export default config;
```

TypeScript is included by default when set up with TypeScript. For Svelte 4, a preprocessor is required for TypeScript. Svelte 5 supports TypeScript natively for type syntax only; use `vitePreprocess({ script: true })` for complex TypeScript syntax.

## Add-ons

Use `npx sv add` to setup integrations:
- prettier (formatting)
- eslint (linting)
- vitest (unit testing)
- playwright (e2e testing)
- lucia (auth)
- tailwind (CSS)
- drizzle (DB)
- paraglide (i18n)
- mdsvex (markdown)
- storybook (frontend workshop)

## Packages

High-quality Svelte packages are available on the packages page. Additional libraries, templates, and resources are at sveltesociety.dev.

## svelte-preprocess

`svelte-preprocess` offers additional functionality beyond `vitePreprocess`: support for Pug, Babel, and global styles. However, `vitePreprocess` may be faster and require less configuration, so it's used by default. CoffeeScript is not supported.

Install with `npm i -D svelte-preprocess` and add to `svelte.config.js`. Often requires installing corresponding libraries like `npm i -D sass` or `npm i -D less`.

## Vite plugins

SvelteKit projects use Vite, so Vite plugins can enhance your project. Available plugins are listed in the vitejs/awesome-vite repository.

## Integration FAQs

The SvelteKit FAQ answers questions about integrating features with SvelteKit.

### breakpoint_debugging
Debug Svelte/SvelteKit with breakpoints in VSCode (debug terminal or launch.json), other editors, or browser DevTools via Node.js --inspect flag

## Visual Studio Code

**Debug Terminal:**
1. Open command palette: `CMD/Ctrl` + `Shift` + `P`
2. Launch "Debug: JavaScript Debug Terminal"
3. Start project: `npm run dev`
4. Set breakpoints in source code
5. Trigger breakpoint

**Launch Configuration:**
Create `.vscode/launch.json`:
```json
{
	"version": "0.2.0",
	"configurations": [
		{
			"command": "npm run dev",
			"name": "Run development server",
			"request": "launch",
			"type": "node-terminal"
		}
	]
}
```
Then use "Run and Debug" pane to select and start debugging with `F5`.

## Other Editors

- WebStorm: Use built-in Svelte debugging support
- Neovim: Community guides available for JavaScript framework debugging

## Browser DevTools (Chrome/Edge)

Debug Node.js applications using browser-based debugger (client-side source maps only):

1. Run: `NODE_OPTIONS="--inspect" npm run dev`
2. Open site at `localhost:5173`
3. Open browser dev tools, click "Open dedicated DevTools for Node.js" icon (Node.js logo)
4. Set breakpoints and debug

Alternative: Navigate to `chrome://inspect` (Chrome) or `edge://inspect` (Edge)

### migrating-to-sveltekit-2
SvelteKit 2 breaking changes: error/redirect no longer thrown, cookies require path, top-level promises not auto-awaited, goto rejects external URLs, paths relative by default, preloadCode takes single base-prefixed arg, resolvePath→resolveRoute, improved error handling with status/message, dynamic env vars forbidden during prerendering, use:enhance removes form/data, file forms need multipart/form-data, requires Node 18.13+/Svelte 4/Vite 5/TypeScript 5, $app/stores deprecated for $app/state.

## Breaking Changes in SvelteKit 2

### `redirect` and `error` no longer require throwing
Previously you had to `throw error(...)` and `throw redirect(...)`. Now just call them directly:
```js
// Before
throw error(500, 'something went wrong');
// After
error(500, 'something went wrong');
```
Use `isHttpError` and `isRedirect` from `@sveltejs/kit` to distinguish them from unexpected errors in try blocks.

### `path` is required when setting cookies
Browsers set cookie path to the parent resource if not specified. Now you must explicitly set `path`:
```js
cookies.set(name, value, { path: '/' });
cookies.delete(name, { path: '/' });
cookies.serialize(name, value, { path: '/' });
```
Use `path: '/'` for domain-wide cookies, `''` for current path, `'.'` for current directory.

### Top-level promises are no longer awaited
In v1, top-level promise properties in load function returns were auto-awaited. Now you must explicitly await:
```js
// Single promise
export async function load({ fetch }) {
	const response = await fetch(url).then(r => r.json());
	return { response };
}

// Multiple promises - use Promise.all to avoid waterfalls
export async function load({ fetch }) {
	const [a, b] = await Promise.all([
		fetch(url1).then(r => r.json()),
		fetch(url2).then(r => r.json()),
	]);
	return { a, b };
}
```

### `goto(...)` changes
- No longer accepts external URLs; use `window.location.href = url` instead
- `state` object now determines `$page.state` and must adhere to `App.PageState` interface

### Paths are now relative by default
`paths.relative` now defaults to `true` (was inconsistent in v1). This makes apps more portable when base path is unknown or different at runtime (e.g., Internet Archive, IPFS).

### Server fetches are not trackable anymore
Removed `dangerZone.trackServerFetches` setting due to security risk (private URLs leaking).

### `preloadCode` arguments must be prefixed with `base`
Both `preloadCode` and `preloadData` now require paths prefixed with `base` if set. Additionally, `preloadCode` now takes a single argument instead of multiple.

### `resolvePath` replaced with `resolveRoute`
```js
// Before
import { resolvePath } from '@sveltejs/kit';
import { base } from '$app/paths';
const path = base + resolvePath('/blog/[slug]', { slug });

// After
import { resolveRoute } from '$app/paths';
const path = resolveRoute('/blog/[slug]', { slug });
```

### Improved error handling
`handleError` hooks now receive `status` and `message` properties. For errors from your code, status is `500` and message is `Internal Error`. The `message` property is safe to expose to users (unlike `error.message` which may contain sensitive info).

### Dynamic environment variables cannot be used during prerendering
Use `$env/static/public` and `$env/static/private` during prerendering instead of `$env/dynamic/*`. SvelteKit will request updated dynamic values from `/_app/env.js` when landing on prerendered pages.

### `form` and `data` removed from `use:enhance` callbacks
These were deprecated in favor of `formElement` and `formData`, now removed entirely.

### Forms with file inputs must use `multipart/form-data`
SvelteKit 2 throws an error if a form with `<input type="file">` lacks `enctype="multipart/form-data"` during `use:enhance` submission.

### Generated `tsconfig.json` is more strict
Validation now warns against using `paths` or `baseUrl` in `tsconfig.json`. Use the `alias` config option in `svelte.config.js` instead.

### `getRequest` no longer throws errors
In `@sveltejs/kit/node`, `getRequest` no longer throws on `Content-Length` header exceeding size limit; error is deferred until request body is read.

### `vitePreprocess` no longer exported from `@sveltejs/kit/vite`
Import directly from `@sveltejs/vite-plugin-svelte` instead.

### Updated dependency requirements
- Node `18.13+`
- `svelte@4`
- `vite@5`
- `typescript@5`
- `@sveltejs/vite-plugin-svelte@3` (now peerDependency)
- Adapter versions: cloudflare@3, cloudflare-workers@2, netlify@3, node@2, static@3, vercel@4

Generated `tsconfig.json` now uses `"moduleResolution": "bundler"` and `verbatimModuleSyntax` (replaces `importsNotUsedAsValues` and `preserveValueImports`).

### SvelteKit 2.12: `$app/stores` deprecated
`$app/state` (based on Svelte 5 runes) replaces `$app/stores` with finer-grained reactivity. Migrate by replacing imports and removing `$` prefixes:
```svelte
// Before
import { page } from '$app/stores';
{$page.data}

// After
import { page } from '$app/state';
{page.data}
```
Use `npx sv migrate app-state` for auto-migration in `.svelte` components.

### migrating_from_sapper
Sapper to SvelteKit migration: update package.json (add "type": "module", replace sapper with @sveltejs/kit + adapter), rename config files and templates, rename route files (+page.svelte, +layout.svelte, +error.svelte), update imports (@sapper/app → $app/navigation/$app/stores), rename preload → load with event arg, remove regex routes and segment prop, use root-relative URLs, replace sapper: attributes with data-sveltekit-, remove req/res access.

## package.json

Add `"type": "module"`. Remove `polka`/`express` and middleware like `sirv`/`compression`. Replace `sapper` with `@sveltejs/kit` and an adapter.

Update scripts:
- `sapper build` → `vite build` (with Node adapter)
- `sapper export` → `vite build` (with static adapter)
- `sapper dev` → `vite dev`
- `node __sapper__/build` → `node build`

## Project files

Replace `webpack.config.js`/`rollup.config.js` with `svelte.config.js`. Move preprocessor options to `config.preprocess`. Add an adapter (adapter-node ≈ `sapper build`, adapter-static ≈ `sapper export`). Add Vite plugins for unhandled filetypes.

**src/client.js**: No equivalent. Move custom logic to `+layout.svelte` in `onMount`.

**src/server.js**: Use custom server with adapter-node, or no equivalent for serverless.

**src/service-worker.js**: Update imports from `@sapper/service-worker` to `$service-worker`:
- `files` unchanged
- `routes` removed
- `shell` → `build`
- `timestamp` → `version`

**src/template.html**: Rename to `src/app.html`. Replace:
- Remove `%sapper.base%`, `%sapper.scripts%`, `%sapper.styles%`
- `%sapper.head%` → `%sveltekit.head%`
- `%sapper.html%` → `%sveltekit.body%`
- Remove `<div id="sapper">`

**src/node_modules**: Replace with `src/lib` for internal libraries.

## Pages and layouts

**Renamed files**:
- `routes/about/index.svelte` → `routes/about/+page.svelte`
- `routes/about.svelte` → `routes/about/+page.svelte`
- `_error.svelte` → `+error.svelte`
- `_layout.svelte` → `+layout.svelte`

**Imports**: Replace `@sapper/app` imports:
- `goto` → `goto` from `$app/navigation`
- `prefetch` → `preloadData` from `$app/navigation`
- `prefetchRoutes` → `preloadCode` from `$app/navigation`
- `stores` → use `getStores` or import `navigating`/`page` from `$app/stores` (or `$app/state` in Svelte 5 + SvelteKit 2.12+)
- `src/node_modules` imports → `$lib` imports

**Preload**: Rename `preload` to `load`, move to `+page.js`/`+layout.js`. Single `event` argument replaces `page` and `session`. No `this` object; use `fetch` from input, throw `error()` and `redirect()`.

**Stores**: `page` still exists. `preloading` → `navigating` (with `from`/`to`). `page` has `url`/`params` (no `path`/`query`). Import directly from `$app/stores` instead of calling `stores()`.

**Routing**: Regex routes removed; use advanced route matching.

**Segments**: `segment` prop removed; use `$page.url.pathname`.

**URLs**: Relative URLs now resolve against current page, not base URL. Use root-relative URLs (starting with `/`) for context-independent meaning.

**&lt;a&gt; attributes**:
- `sapper:prefetch` → `data-sveltekit-preload-data`
- `sapper:noscroll` → `data-sveltekit-noscroll`

## Endpoints

No direct `req`/`res` access. SvelteKit is environment-agnostic (Node, serverless, Cloudflare Workers). `fetch` available globally.

## Integrations

**HTML minifier**: Sapper includes it by default; SvelteKit doesn't. Add as dependency and use in server hook:

```js
import { minify } from 'html-minifier';
import { building } from '$app/environment';

const minification_options = {
	collapseBooleanAttributes: true,
	collapseWhitespace: true,
	conservativeCollapse: true,
	decodeEntities: true,
	html5: true,
	ignoreCustomComments: [/^#/],
	minifyCSS: true,
	minifyJS: false,
	removeAttributeQuotes: true,
	removeComments: false,
	removeOptionalTags: true,
	removeRedundantAttributes: true,
	removeScriptTypeAttributes: true,
	removeStyleLinkTypeAttributes: true,
	sortAttributes: true,
	sortClassName: true
};

export async function handle({ event, resolve }) {
	let page = '';
	return resolve(event, {
		transformPageChunk: ({ html, done }) => {
			page += html;
			if (done) return building ? minify(page, minification_options) : page;
		}
	});
}
```

Note: `prerendering` is `false` in `vite preview`, inspect built HTML directly to verify minification.

### glossary
Glossary of SvelteKit rendering terms: CSR, SSR, hybrid apps, SPA, SSG, prerendering, hydration, ISR, edge rendering, routing, PWA, MPA with configuration options and use cases.

## CSR
Client-side rendering (CSR) is the generation of page contents in the web browser using JavaScript. Enabled by default in SvelteKit, can be disabled with `csr = false` page option.

## Edge
Rendering on the edge refers to rendering an application in a content delivery network (CDN) near the user, improving latency by reducing request/response distance.

## Hybrid app
SvelteKit's default rendering mode: loads initial HTML from the server (SSR), then updates page contents on subsequent navigations via client-side rendering (CSR).

## Hydration
When fetching data during SSR, SvelteKit stores this data and transmits it to the client along with server-rendered HTML. Components initialize on the client with that data without calling API endpoints again. Svelte checks that the DOM is in the expected state and attaches event listeners in a process called hydration. Once fully hydrated, components react to property changes like any newly created Svelte component. Enabled by default, can be disabled with `csr = false` page option.

## ISR
Incremental static regeneration (ISR) allows generating static pages as visitors request them without redeploying, reducing build times compared to SSG sites with many pages. Available with `adapter-vercel`.

## MPA
Multi-page apps (MPA) are traditional applications that render each page view on the server, common in non-JavaScript languages.

## Prerendering
Computing page contents at build time and saving the HTML for display. Benefits: same as traditional server-rendered pages, avoids recomputing for each visitor, scales nearly for free. Tradeoff: expensive build process, content only updates by rebuilding and deploying.

Prerenderable content rule: any two users hitting it directly must get the same content from the server, and the page must not contain actions. Can prerender content loaded based on page parameters as long as all users see the same prerendered content.

Pre-rendered pages aren't limited to static content. Can build personalized pages if user-specific data is fetched and rendered client-side, but experiences downsides of not doing SSR for that content.

Control prerendering with `prerender` page option and `prerender` config in `svelte.config.js`.

## PWA
Progressive web app (PWA) is an app built using web APIs and technologies but functions like a mobile or desktop app. PWAs can be installed, allowing shortcuts on launcher, home screen, or start menu. Many utilize service workers for offline capabilities.

## Routing
By default, SvelteKit intercepts navigation (link clicks, browser forward/back) and handles it on the client by rendering the component for the new page, which makes calls to necessary API endpoints. This client-side routing updates the page without server requests.

Enabled by default, can be skipped with `data-sveltekit-reload` attribute.

## SPA
Single-page app (SPA) is an application where all requests load a single HTML file which then does client-side rendering based on the requested URL. All navigation is client-side routing with per-page contents updating and common layout elements remaining unchanged.

SPA serves an empty shell on initial request (differs from hybrid app which serves HTML). Large performance impact by forcing two network round trips before rendering begins. Recommended only in limited circumstances such as when wrapped in a mobile app.

Build SPAs with `adapter-static`.

## SSG
Static Site Generation (SSG) is a site where every page is prerendered. Benefits: no need to maintain or pay for servers to perform SSR, can be served from CDNs for great "time to first byte" performance. This delivery model is often called JAMstack.

Implement with `adapter-static` or by configuring every page to be prerendered using `prerender` page option or `prerender` config in `svelte.config.js`.

## SSR
Server-side rendering (SSR) is the generation of page contents on the server. Highly preferred for performance and SEO: significantly improves performance by avoiding extra round trips necessary in SPA, makes app accessible if JavaScript fails or is disabled. While some search engines can index client-side dynamically generated content, it takes longer.

Enabled by default in SvelteKit, can be disabled with `ssr` page option.

