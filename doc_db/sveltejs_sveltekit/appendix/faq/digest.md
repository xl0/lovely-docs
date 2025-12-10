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