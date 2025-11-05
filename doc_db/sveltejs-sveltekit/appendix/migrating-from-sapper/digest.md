## package.json Changes
- Add `"type": "module"`
- Remove `polka`/`express` and middleware like `sirv`, `compression`
- Replace `sapper` with `@sveltejs/kit` and an adapter
- Update scripts: `sapper build` → `vite build`, `sapper export` → `vite build` (static adapter), `sapper dev` → `vite dev`, `node __sapper__/build` → `node build`

## Configuration
- Replace `webpack.config.js`/`rollup.config.js` with `svelte.config.js`
- Move preprocessor options to `config.preprocess`
- Add an adapter (adapter-node for `sapper build`, adapter-static for `sapper export`)
- Add Vite equivalents for custom file type plugins

## File Migrations
- `src/client.js` → move logic to `+layout.svelte` in `onMount` callback
- `src/server.js` → custom server with adapter-node, or no equivalent for serverless
- `src/service-worker.js`: `files` unchanged, `routes` removed, `shell` → `build`, `timestamp` → `version`
- `src/template.html` → `src/app.html`: replace `%sapper.base%`, `%sapper.scripts%`, `%sapper.styles%` (remove), `%sapper.head%` → `%sveltekit.head%`, `%sapper.html%` → `%sveltekit.body%`, remove `<div id="sapper">`
- `src/node_modules` internal libs → `src/lib`

## Routes & Pages
- `routes/about/index.svelte` → `routes/about/+page.svelte`
- `routes/about.svelte` → `routes/about/+page.svelte`
- `_error.svelte` → `+error.svelte`
- `_layout.svelte` → `+layout.svelte`

## API Changes
- `@sapper/app` imports: `goto`, `prefetch`, `prefetchRoutes` → `goto`, `preloadData`, `preloadCode` from `$app/navigation`
- `stores` → `getStores` or import `navigating`, `page` directly from `$app/stores`
- `preload` function → `load` in `+page.js`/`+layout.js`, single `event` argument instead of `page`, `session`
- No `this` object; use `fetch` from input, throw `error()` and `redirect()`
- `preloading` store → `navigating` store with `from`, `to` properties
- `page` store: has `url`, `params` (no `path`, `query`)
- Regex routes removed; use advanced route matching
- `segment` prop removed; use `$page.url.pathname`
- Relative URLs now resolve against current page, not base URL
- `sapper:prefetch` → `data-sveltekit-preload-data`
- `sapper:noscroll` → `data-sveltekit-noscroll`

## Endpoints
- No direct `req`/`res` access; use environment-agnostic signature
- `fetch` available globally

## HTML Minification
Add `html-minifier` as dependency and use in `handle` hook with `transformPageChunk`