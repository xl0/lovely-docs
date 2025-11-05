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