## Overview

Adapters are plugins that transform a built SvelteKit app into deployment-ready output for specific platforms.

## Official Adapters

- `@sveltejs/adapter-cloudflare` — Cloudflare Workers and Cloudflare Pages
- `@sveltejs/adapter-netlify` — Netlify
- `@sveltejs/adapter-node` — Node servers
- `@sveltejs/adapter-static` — Static site generation (SSG)
- `@sveltejs/adapter-vercel` — Vercel

Community adapters available for additional platforms.

## Configuration

Adapters are configured in `svelte.config.js`:

```js
import adapter from 'svelte-adapter-foo';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter({
			// adapter options go here
		})
	}
};

export default config;
```

## Platform-Specific Context

Some adapters provide access to platform-specific information (e.g., Cloudflare Workers' `env` object with KV namespaces). This is passed to `RequestEvent` in hooks and server routes via the `platform` property. Consult adapter documentation for details.