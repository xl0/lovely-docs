## Build Process

SvelteKit builds in two stages via `vite build`:

1. **Vite optimization**: Creates optimized production builds of server code, browser code, and service worker. Prerendering happens here if configured.
2. **Adapter tuning**: An adapter optimizes the build for your target environment.

## Preventing Code Execution During Build

Code in `+page/layout(.server).js` files is loaded during build for analysis. Use the `building` flag from `$app/environment` to prevent code execution at build time:

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

## Preview Your Build

Run `vite preview` to test the production build locally in Node. Note that this doesn't perfectly reproduce your deployed app since adapter-specific adjustments like the `platform` object don't apply to previews.