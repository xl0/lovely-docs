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