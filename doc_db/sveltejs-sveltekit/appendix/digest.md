## Frequently Asked Questions

**Package Management**: Import JSON with `import pkg from './package.json' with { type: 'json' };`. Yarn 2/3 requires `nodeLinker: 'node-modules'` in `.yarnrc.yml`.

**Library Packaging**: Distribute Svelte components as uncompiled `.svelte` files with ESM-only JS. Use `svelte-package` for Svelte libraries. Validate with publint.dev.

**View Transitions**: Wrap navigation with `document.startViewTransition()`:
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

**Client-side Code**: Check `browser` environment variable or use `onMount` for dynamic imports.

**Database**: Query via `db.js` singleton in server routes, setup in `hooks.server.js`.

**External APIs**: Use `event.fetch` in server routes, proxy via `server.proxy` in dev, or create API routes in production.

**Middleware**: Dev uses Vite plugin with `configureServer`. Production uses `adapter-node` middleware.

## Integrations

**vitePreprocess**: Enables CSS preprocessing (PostCSS, SCSS, Less, Stylus, SugarSS), included by default with TypeScript.

**Add-ons**: `npx sv add` installs prettier, eslint, vitest, playwright, lucia, tailwind, drizzle, paraglide, mdsvex, storybook.

**Alternatives**: `svelte-preprocess` supports Pug, Babel, global styles. Any Vite plugin from vitejs/awesome-vite works.

## Breakpoint Debugging

VSCode Debug Terminal: `CMD/Ctrl + Shift + P` → "Debug: JavaScript Debug Terminal" → `npm run dev`. Browser DevTools: `NODE_OPTIONS="--inspect" npm run dev` → open `localhost:5173` → click Node.js DevTools icon.

## Migration to v2

**Breaking Changes**:
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

## Migration from Sapper

**Setup**: Add `"type": "module"` to package.json. Replace `sapper` with `@sveltejs/kit` and adapter. Update scripts: `sapper build` → `vite build`, `sapper dev` → `vite dev`.

**Configuration**: Replace `webpack.config.js`/`rollup.config.js` with `svelte.config.js`.

**File Structure**: `src/template.html` → `src/app.html`, `_layout.svelte` → `+layout.svelte`, `_error.svelte` → `+error.svelte`, `routes/about.svelte` → `routes/about/+page.svelte`.

**API Changes**: `preload` → `load` in `+page.js`/`+layout.js` with single `event` argument. `@sapper/app` imports → `$app/navigation`, `$app/stores`. `stores()` → import `navigating`, `page` directly. No `this` object; throw `error()`, `redirect()`. Relative URLs resolve against current page, not base. `sapper:prefetch` → `data-sveltekit-preload-data`.

## Glossary

**Rendering Modes**: CSR (browser-based, default), SSR (server-side, default), Hybrid (SSR initial + CSR navigation), SPA (single HTML file, poor SEO), MPA (traditional server-rendered).

**Static Generation**: Prerendering (build-time HTML), SSG (all pages prerendered with `adapter-static`), ISR (on-demand with `adapter-vercel`).

**Other**: Hydration (server HTML enhanced with client interactivity), Routing (client-side navigation interception, skip with `data-sveltekit-reload`), Edge (CDN-based rendering), PWA (installable web app).

## Additional Resources

FAQs: SvelteKit FAQ, Svelte FAQ, vite-plugin-svelte FAQ. Examples: Official examples (realworld blog, HackerNews clone, svelte.dev), community examples on GitHub. Support: Discord, StackOverflow.