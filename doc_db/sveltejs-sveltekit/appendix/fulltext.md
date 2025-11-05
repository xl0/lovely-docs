

## Pages

### frequently-asked-questions
Common questions about SvelteKit development covering package management, library compatibility, APIs, databases, client-side code, proxying, middleware, and package manager setup.

## Package.json
`import pkg from './package.json' with { type: 'json' };`

## Library Packaging
Check publint.dev. Svelte components as uncompiled `.svelte` files with ESM-only JS. Use `svelte-package` for Svelte libraries.

## View Transitions
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

## Database
Query in server routes via `db.js` singleton. Setup in `hooks.server.js`.

## Client-side Libraries
```js
import { browser } from '$app/environment';
if (browser) { /* code */ }
```
Or use `onMount` for dynamic imports.

## External API
Use `event.fetch` or proxy via `server.proxy` in dev. In production, rewrite paths or create API route.

## Middleware
Dev: Vite plugin with `configureServer`. Production: `adapter-node` middleware.

## Yarn
Yarn 2: Use `nodeLinker: 'node-modules'` in `.yarnrc.yml`. Yarn 3: Same, with experimental ESM support.

### integrations
Overview of preprocessing, add-on integrations, and plugin options for SvelteKit projects.

## vitePreprocess
Enables CSS preprocessing (PostCSS, SCSS, Less, Stylus, SugarSS). Included by default with TypeScript.

```js
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
const config = { preprocess: [vitePreprocess()] };
```

## Add-ons
`npx sv add` installs: prettier, eslint, vitest, playwright, lucia, tailwind, drizzle, paraglide, mdsvex, storybook.

## Alternatives
- **svelte-preprocess**: Supports Pug, Babel, global styles; requires manual setup
- **Vite plugins**: Use any plugin from vitejs/awesome-vite

### breakpoint-debugging
How to set up breakpoint debugging for Svelte and SvelteKit projects in various development environments.

Set breakpoints to debug Svelte/SvelteKit projects in VSCode (Debug Terminal or `.vscode/launch.json`), other editors, or browser DevTools. VSCode Debug Terminal: `CMD/Ctrl + Shift + P` → "Debug: JavaScript Debug Terminal" → `npm run dev`. Browser DevTools: `NODE_OPTIONS="--inspect" npm run dev` → open `localhost:5173` → click Node.js DevTools icon in browser dev tools.

### migrating-to-v2
Breaking changes and migration guide for upgrading from SvelteKit v1 to v2.

## Key v2 Changes

- `error()` and `redirect()` no longer need `throw`
- Cookies require explicit `path: '/'`
- Top-level promises must be explicitly `await`ed
- `goto()` rejects external URLs; use `window.location.href`
- Paths relative by default; `preloadCode` needs `base` prefix
- `resolvePath` → `resolveRoute` (includes `base` automatically)
- `handleError` receives `status` and `message`
- Dynamic env vars blocked during prerendering
- `use:enhance` callbacks: `form`/`data` → `formElement`/`formData`
- File input forms need `enctype="multipart/form-data"`
- TypeScript: `moduleResolution: "bundler"`, `verbatimModuleSyntax`
- Node 18.13+, svelte@4, vite@5, typescript@5
- `$app/stores` deprecated; migrate to `$app/state`

### migrating-from-sapper
Comprehensive guide to migrating a Sapper application to SvelteKit, covering package.json updates, file reorganization, routing changes, API modifications, and configuration updates.

## Key Changes
- Add `"type": "module"` to package.json
- Replace `sapper` with `@sveltejs/kit` and adapter
- Update scripts: `sapper build` → `vite build`, `sapper dev` → `vite dev`
- Replace `webpack.config.js`/`rollup.config.js` with `svelte.config.js`
- Rename files: `src/template.html` → `src/app.html`, `_layout.svelte` → `+layout.svelte`, `_error.svelte` → `+error.svelte`
- Routes: `routes/about.svelte` → `routes/about/+page.svelte`
- `preload` → `load` in `+page.js`/`+layout.js` with single `event` argument
- `@sapper/app` imports → `$app/navigation`, `$app/stores`
- `stores()` → import `navigating`, `page` directly
- No `this` object; throw `error()`, `redirect()`
- Relative URLs resolve against current page, not base
- `sapper:prefetch` → `data-sveltekit-preload-data`

### additional-resources
Collection of FAQs, example projects, and support channels for SvelteKit developers.

**FAQs**: SvelteKit FAQ, Svelte FAQ, vite-plugin-svelte FAQ

**Examples**: Official examples (realworld blog, HackerNews clone, svelte.dev); community examples on GitHub (#sveltekit, #sveltekit-template topics) and Svelte Society

**Support**: Discord, StackOverflow - search existing resources first

### glossary
Glossary of rendering modes, static generation strategies, and related concepts in SvelteKit.

## Rendering Modes
- **CSR**: Browser-based rendering, default in SvelteKit, disable with `csr = false`
- **SSR**: Server-side rendering, default in SvelteKit, disable with `ssr = false`
- **Hybrid**: SvelteKit default combining SSR (initial) + CSR (navigation)
- **SPA**: Single HTML file with client-side rendering, poor performance/SEO, use `adapter-static`
- **MPA**: Traditional server-rendered pages

## Static Generation
- **Prerendering**: Build-time HTML generation, controlled via `prerender` option
- **SSG**: All pages prerendered, use `adapter-static`
- **ISR**: On-demand static generation without redeploying, use `adapter-vercel`

## Other
- **Hydration**: Server HTML enhanced with client interactivity, data transmitted with HTML
- **Routing**: Client-side navigation interception, skip with `data-sveltekit-reload`
- **Edge**: CDN-based rendering near users
- **PWA**: Web app installable like native app, supports service workers

