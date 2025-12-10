## Overview
SvelteKit configuration lives in `svelte.config.js` at the project root. The config object extends `vite-plugin-svelte`'s options and is used by other Svelte tooling.

```js
import adapter from '@sveltejs/adapter-auto';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter()
	}
};

export default config;
```

## Config Structure
- `kit?: KitConfig` - SvelteKit options
- `[key: string]: any` - Additional options for integrating tooling

## KitConfig Options

### adapter
Runs during `vite build`. Determines how output is converted for different platforms. Default: `undefined`

### alias
Object mapping import aliases to file paths. Automatically passed to Vite and TypeScript. Default: `{}`
```js
alias: {
	'my-file': 'path/to/my-file.js',
	'my-directory': 'path/to/my-directory',
	'my-directory/*': 'path/to/my-directory/*'
}
```
Note: `$lib` alias is controlled by `config.kit.files.lib`. Run `npm run dev` to auto-generate alias config in `jsconfig.json`/`tsconfig.json`.

### appDir
Directory where SvelteKit stores static assets and internally-used routes. Default: `"_app"`

If `paths.assets` is specified, creates two app directories: `${paths.assets}/${appDir}` and `${paths.base}/${appDir}`.

### csp
Content Security Policy configuration to protect against XSS attacks.

```js
csp: {
	directives: {
		'script-src': ['self']
	},
	reportOnly: {
		'script-src': ['self'],
		'report-uri': ['/']
	}
}
```

Options:
- `mode?: 'hash' | 'nonce' | 'auto'` - Default: `'auto'`. Use hashes for prerendered pages, nonces for dynamic pages
- `directives?: CspDirectives` - Added to `Content-Security-Policy` headers
- `reportOnly?: CspDirectives` - Added to `Content-Security-Policy-Report-Only` headers

SvelteKit augments directives with nonces/hashes for inline styles and scripts. Use `%sveltekit.nonce%` placeholder in `src/app.html` for manual script/link nonces.

For prerendered pages, CSP header is added via `<meta http-equiv>` tag (ignores `frame-ancestors`, `report-uri`, `sandbox`).

Note: Svelte transitions create inline `<style>` elements, so either leave `style-src` unspecified or add `unsafe-inline`.

### csrf
Cross-site request forgery protection.

```js
csrf: {
	checkOrigin: true,
	trustedOrigins: ['https://payment-gateway.com']
}
```

Options:
- `checkOrigin?: boolean` - Default: `true` (deprecated, use `trustedOrigins: ['*']`). Checks incoming `origin` header for POST/PUT/PATCH/DELETE form submissions
- `trustedOrigins?: string[]` - Default: `[]`. Array of origins allowed for cross-origin form submissions. Use `'*'` to trust all origins (not recommended). Only applies in production.

### embedded
Whether app is embedded inside a larger app. Default: `false`

If `true`, SvelteKit adds event listeners on parent of `%sveltekit.body%` instead of `window`, and passes `params` from server rather than inferring from `location.pathname`.

Note: Multiple embedded SvelteKit apps on same page with client-side features is not supported.

### env
Environment variable configuration.

```js
env: {
	dir: '.',
	publicPrefix: 'PUBLIC_',
	privatePrefix: ''
}
```

Options:
- `dir?: string` - Default: `"."`. Directory to search for `.env` files
- `publicPrefix?: string` - Default: `"PUBLIC_"`. Prefix for variables safe to expose to client (accessible via `$env/static/public` and `$env/dynamic/public`)
- `privatePrefix?: string` - Default: `""` (v1.21.0+). Prefix for unsafe variables (accessible via `$env/static/private` and `$env/dynamic/private`). Variables matching neither prefix are discarded.

### experimental
Experimental features (not subject to semantic versioning).

```js
experimental: {
	tracing: {
		server: false,
		serverFile: false
	},
	instrumentation: {
		server: false
	},
	remoteFunctions: false
}
```

Options:
- `tracing?: {server?: boolean, serverFile?: boolean}` - Default: `{server: false, serverFile: false}` (v2.31.0+). Enable OpenTelemetry tracing for `handle` hook, `load` functions, form actions, remote functions
- `instrumentation?: {server?: boolean}` - Default: `{server: false}` (v2.31.0+). Enable `instrumentation.server.js` for tracing/observability
- `remoteFunctions?: boolean` - Default: `false`. Enable experimental remote functions feature

### files (deprecated)
Where to find various files within project.

```js
files: {
	src: 'src',
	assets: 'static',
	hooks: {
		client: 'src/hooks.client',
		server: 'src/hooks.server',
		universal: 'src/hooks'
	},
	lib: 'src/lib',
	params: 'src/params',
	routes: 'src/routes',
	serviceWorker: 'src/service-worker',
	appTemplate: 'src/app.html',
	errorTemplate: 'src/error.html'
}
```

### inlineStyleThreshold
Inline CSS in `<style>` block at HTML head. Value is max length in UTF-16 code units. Default: `0`

Improves First Contentful Paint but generates larger HTML and reduces browser cache effectiveness.

### moduleExtensions
File extensions SvelteKit treats as modules. Default: `[".js", ".ts"]`

Files not matching `config.extensions` or `config.kit.moduleExtensions` are ignored by router.

### outDir
Directory where SvelteKit writes files during `dev` and `build`. Default: `".svelte-kit"`

Exclude from version control.

### output
Build output format options.

```js
output: {
	preloadStrategy: 'modulepreload',
	bundleStrategy: 'split'
}
```

Options:
- `preloadStrategy?: 'modulepreload' | 'preload-js' | 'preload-mjs'` - Default: `"modulepreload"` (v1.8.4+). Preload strategy for JavaScript modules:
  - `modulepreload` - Uses `<link rel="modulepreload">`. Best in Chromium, Firefox 115+, Safari 17+
  - `preload-js` - Uses `<link rel="preload">`. Prevents waterfalls in Chromium/Safari but causes double-parsing in Chromium and double requests in Firefox. Good for iOS
  - `preload-mjs` - Uses `<link rel="preload">` with `.mjs` extension. Prevents double-parsing in Chromium. Best overall performance if server serves `.mjs` with correct `Content-Type`

- `bundleStrategy?: 'split' | 'single' | 'inline'` - Default: `'split'` (v2.13.0+). How JS/CSS files are loaded:
  - `'split'` - Multiple files loaded lazily as user navigates (recommended)
  - `'single'` - One JS bundle and one CSS file for entire app
  - `'inline'` - Inline all JS/CSS into HTML (usable without server)

For `'split'`, adjust bundling via Vite's `build.rollupOptions.output.experimentalMinChunkSize` and `output.manualChunks`.

For inlining assets, set Vite's `build.assetsInlineLimit` and import assets through Vite:
```js
// vite.config.js
export default defineConfig({
	build: {
		assetsInlineLimit: Infinity
	}
});
```

```svelte
// src/routes/+layout.svelte
<script>
	import favicon from './favicon.png';
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>
```

### paths
URL path configuration.

```js
paths: {
	assets: '',
	base: '',
	relative: true
}
```

Options:
- `assets?: '' | 'http://...' | 'https://...'` - Default: `""`. Absolute path where app files are served from (useful for storage buckets)
- `base?: '' | '/${string}'` - Default: `""`. Root-relative path where app is served (e.g., `/base-path`). Must start but not end with `/`. Prepend to root-relative links using `base` from `$app/paths`: `<a href="{base}/page">Link</a>`
- `relative?: boolean` - Default: `true` (v1.9.0+). Use relative asset paths. If `true`, `base` and `assets` from `$app/paths` replaced with relative paths during SSR for portable HTML. If `false`, paths always root-relative unless `paths.assets` is external URL. Single-page app fallback pages always use absolute paths. Set to `false` if using `<base>` element to prevent incorrect asset URL resolution.

### prerender
Prerendering configuration.

```js
prerender: {
	concurrency: 1,
	crawl: true,
	entries: ['*'],
	handleHttpError: 'fail',
	handleMissingId: 'fail',
	handleEntryGeneratorMismatch: 'fail',
	handleUnseenRoutes: 'fail',
	origin: 'http://sveltekit-prerender'
}
```

Options:
- `concurrency?: number` - Default: `1`. Simultaneous pages to prerender. JS is single-threaded but useful when network-bound
- `crawl?: boolean` - Default: `true`. Find pages by following links from `entries`
- `entries?: Array<'*' | '/${string}'>` - Default: `["*"]`. Pages to prerender or start crawling from. `'*'` includes all routes with no required parameters (optional parameters empty)
- `handleHttpError?: 'fail' | 'ignore' | 'warn' | (details) => void` - Default: `'fail'` (v1.15.7+). Handle HTTP errors during prerendering. Custom handler receives `{status, path, referrer, referenceType, message}`
- `handleMissingId?: 'fail' | 'ignore' | 'warn' | (details) => void` - Default: `'fail'` (v1.15.7+). Handle hash links to missing `id` on destination. Custom handler receives `{path, id, referrers, message}`
- `handleEntryGeneratorMismatch?: 'fail' | 'ignore' | 'warn' | (details) => void` - Default: `'fail'` (v1.16.0+). Handle entry not matching generated route. Custom handler receives `{generatedFromId, entry, matchedId, message}`
- `handleUnseenRoutes?: 'fail' | 'ignore' | 'warn' | (details) => void` - Default: `'fail'` (v2.16.0+). Handle prerenderable routes not prerendered. Custom handler receives `{routes}`
- `origin?: string` - Default: `"http://sveltekit-prerender"`. Value of `url.origin` during prerendering

### router
Client-side router configuration.

```js
router: {
	type: 'pathname',
	resolution: 'client'
}
```

Options:
- `type?: 'pathname' | 'hash'` - Default: `"pathname"` (v2.14.0+). Router type:
  - `'pathname'` - URL pathname determines route (default, recommended)
  - `'hash'` - `location.hash` determines route. Disables SSR/prerendering. Only use if pathname unavailable (e.g., no server control). Requires links starting with `#/`

- `resolution?: 'client' | 'server'` - Default: `"client"` (v2.17.0+). Route determination:
  - `'client'` - Browser uses route manifest to determine components/load functions. Manifest loaded upfront
  - `'server'` - Server determines route for unvisited paths. Hides route list, enables middleware interception (A/B testing). Slightly slower for unvisited paths but mitigated by preloading. Prerendered routes have resolution prerendered too

### serviceWorker
Service worker configuration (details not provided in documentation).

### typescript
TypeScript configuration.

```js
typescript: {
	config: (config) => config
}
```

Options:
- `config?: (config: Record<string, any>) => Record<string, any> | void` - Default: `(config) => config` (v1.3.0+). Function to edit generated `tsconfig.json`. Mutate config (recommended) or return new one. Useful for extending shared `tsconfig.json` in monorepo. Paths should be relative to `.svelte-kit/tsconfig.json`

### version
Version management for client-side navigation.

```js
version: {
	name: 'commit-hash',
	pollInterval: 0
}
```

When SvelteKit detects new version deployed (using `name`), falls back to full-page navigation on load errors. If `pollInterval` non-zero, polls for new versions and sets `updated.current` to `true`.

Options:
- `name?: string` - Current app version string. Must be deterministic (e.g., commit ref, not `Math.random()`). Defaults to build timestamp. Example using git commit hash:
  ```js
  import * as child_process from 'node:child_process';
  
  export default {
  	kit: {
  		version: {
  			name: child_process.execSync('git rev-parse HEAD').toString().trim()
  		}
  	}
  };
  ```

- `pollInterval?: number` - Default: `0`. Milliseconds between version polls. `0` disables polling

Force full-page navigation on version change:
```svelte
<script>
	import { beforeNavigate } from '$app/navigation';
	import { updated } from '$app/state';

	beforeNavigate(({ willUnload, to }) => {
		if (updated.current && !willUnload && to?.url) {
			location.href = to.url.href;
		}
	});
</script>
```