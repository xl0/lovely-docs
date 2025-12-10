## Build Process

SvelteKit builds in two stages via `vite build` (typically `npm run build`):

1. **Vite optimization**: Creates optimized production builds of server code, browser code, and service worker. Prerendering executes here if configured.
2. **Adapter tuning**: An adapter optimizes the build for the target deployment environment.

## Code Execution During Build

SvelteKit loads `+page/layout(.server).js` files and their imports during the build for analysis. Code that should not execute at build time must check the `building` flag from `$app/environment`:

```js
import { building } from '$app/environment';
import { setupMyDatabase } from '$lib/server/database';

if (!building) {
	setupMyDatabase();
}

export function load() {
	// ...
}
```

## Preview

After building, preview the production build locally with `vite preview` (via `npm run preview`). This runs in Node and doesn't perfectly reproduce the deployed app — adapter-specific features like the `platform` object don't apply to previews.