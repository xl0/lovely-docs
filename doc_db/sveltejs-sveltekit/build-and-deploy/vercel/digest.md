## Installation
Install `@sveltejs/adapter-vercel` and add to `svelte.config.js`:
```js
import adapter from '@sveltejs/adapter-vercel';
const config = {
	kit: {
		adapter: adapter({ /* options */ })
	}
};
export default config;
```

## Deployment Configuration
Control route deployment via `export const config` in `+server.js`, `+page(.server).js`, or `+layout(.server).js`:
```js
export const config = {
	split: true  // deploy as individual function
};
```

**All functions:**
- `runtime`: `'edge'`, `'nodejs20.x'`, or `'nodejs22.x'` (deprecated)
- `regions`: array of edge regions or `'all'` for edge runtime (default `["iad1"]`)
- `split`: deploy route as individual function

**Edge functions:**
- `external`: array of dependencies to exclude from bundling

**Serverless functions:**
- `memory`: 128-3008 Mb (default 1024)
- `maxDuration`: max execution time in seconds
- `isr`: Incremental Static Regeneration config

## Image Optimization
Configure via `images` option in adapter config:
```js
adapter({
	images: {
		sizes: [640, 828, 1200, 1920, 3840],
		formats: ['image/avif', 'image/webp'],
		minimumCacheTTL: 300,
		domains: ['example-app.vercel.app']
	}
})
```

## Incremental Static Regeneration (ISR)
Enable caching with on-demand regeneration:
```js
export const config = {
	isr: {
		expiration: 60,  // required, seconds before regeneration
		bypassToken: BYPASS_TOKEN,  // min 32 chars, force revalidation
		allowQuery: ['search']  // query params for cache key
	}
};
```

Bypass token usage: `__prerender_bypass=<token>` cookie or `x-prerender-revalidate: <token>` header.

## Environment Variables
Vercel provides deployment-specific variables accessible via `$env/static/private` and `$env/dynamic/private`. Use `$env/static/private` for static replacement and dead code elimination.

## Skew Protection
Vercel feature routing requests to original deployment via cookie. Enable in project Advanced settings. When user reloads, they get newest deployment. `updated.current` always reports new deployments.

## Troubleshooting
- **File system**: Can't use `fs` in edge functions. Use `read()` from `$app/server` or prerender routes.
- **Deployment Protection**: Enable "Protection Bypass for Automation" when using `read()` in edge functions.
- **Vercel functions**: `/api/*` requests bypass SvelteKit if `api` directory exists at project root; implement as SvelteKit API routes instead.
- **Node version**: Update in project settings if using outdated version.