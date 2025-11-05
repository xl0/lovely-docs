## Package.json in Application
Import JSON with: `import pkg from './package.json' with { type: 'json' };`

## Library Packaging Issues
Check library compatibility at publint.dev. Key requirements:
- `exports` field takes precedence over `main` and `module`
- ESM files should end with `.mjs` (or any extension if `"type": "module"` is set); CommonJS files should end with `.cjs`
- `main` should be defined if `exports` is not
- Svelte components should be distributed as uncompiled `.svelte` files with ESM-only JS
- Use `svelte-package` for packaging Svelte libraries

Libraries work best with Vite when distributed as ESM. CommonJS dependencies are pre-bundled by `vite-plugin-svelte` using esbuild. For issues, check Vite and library issue trackers; `optimizeDeps` and `ssr` config can be temporary workarounds.

## View Transitions API
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

## Database Setup
Query databases in server routes, not `.svelte` files. Create a `db.js` singleton for connection management. Use `hooks.server.js` for one-time setup code. The Svelte CLI can automatically set up database integrations.

## Client-side Libraries Accessing document/window
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

For side-effect-free libraries, static import works and gets tree-shaken in server build.

## Different Backend API Server
Use `event.fetch` to request from external API, but handle CORS complications. Better approach: set up a proxy. In production, rewrite paths like `/api` to the API server; in dev, use Vite's `server.proxy` option. Alternatively, create an API route:
```js
export function GET({ params, url }) {
	return fetch(`https://example.com/${params.path + url.search}`);
}
```

## Middleware
For production with `adapter-node`, build a middleware for your own server. In dev, add middleware via Vite plugin using `configureServer`:
```js
const myPlugin = {
	name: 'log-request-middleware',
	configureServer(server) {
		server.middlewares.use((req, res, next) => {
			console.log(`Got request ${req.url}`);
			next();
		});
	}
};
```

## Yarn Compatibility
Yarn 2: Plug'n'Play (pnp) is broken with ESM. Use `nodeLinker: 'node-modules'` in `.yarnrc.yml` or switch to npm/pnpm.

Yarn 3: ESM support is experimental. Enable with `yarn set version berry` and `yarn install`, then add `nodeLinker: node-modules` to `.yarnrc.yml` to avoid build failures.