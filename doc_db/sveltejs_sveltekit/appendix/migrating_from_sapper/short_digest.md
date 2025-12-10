## package.json
Add `"type": "module"`. Remove `polka`/`express`/middleware. Replace `sapper` with `@sveltejs/kit` + adapter. Update scripts: `sapper build/export/dev` → `vite build/dev`.

## Project files
Replace webpack/rollup config with `svelte.config.js`. Add adapter. Rename `src/template.html` → `src/app.html`, update template variables. Replace `src/node_modules` with `src/lib`. Update service worker imports.

## Pages and layouts
Rename: `routes/about.svelte` → `routes/about/+page.svelte`, `_error.svelte` → `+error.svelte`, `_layout.svelte` → `+layout.svelte`. Replace `@sapper/app` imports with `$app/navigation` and `$app/stores`. Rename `preload` → `load` in `+page.js`/`+layout.js` with single `event` arg. Remove `segment` prop, use `$page.url.pathname`. Use root-relative URLs. Replace `sapper:prefetch` → `data-sveltekit-preload-data`, `sapper:noscroll` → `data-sveltekit-noscroll`.

## Endpoints
No `req`/`res` access; environment-agnostic. `fetch` globally available.

## HTML minifier
Add as dependency, use in server hook with `transformPageChunk`.