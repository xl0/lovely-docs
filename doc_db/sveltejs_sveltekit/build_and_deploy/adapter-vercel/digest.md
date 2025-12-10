## Installation

Install with `npm i -D @sveltejs/adapter-vercel` and add to `svelte.config.js`:

```js
import adapter from '@sveltejs/adapter-vercel';

const config = {
	kit: {
		adapter: adapter({
			// options here
		})
	}
};

export default config;
```

## Deployment Configuration

Control route deployment via `export const config` in `+server.js`, `+page(.server).js`, or `+layout(.server).js`:

```js
export const config = {
	split: true
};
```

### All Functions Options

- `runtime`: `'edge'`, `'nodejs20.x'`, or `'nodejs22.x'` (deprecated, will use Vercel project config)
- `regions`: array of edge network regions (default `["iad1"]` for serverless, `'all'` for edge), multiple regions only on Enterprise
- `split`: if `true`, deploy route as individual function; at adapter level applies to all routes

### Edge Functions Options

- `external`: array of dependencies esbuild should treat as external (for optional dependencies)

### Serverless Functions Options

- `memory`: 128-3008 Mb (default 1024), increases in 64 Mb increments
- `maxDuration`: max execution time in seconds (default 10 for Hobby, 15 for Pro, 900 for Enterprise)
- `isr`: Incremental Static Regeneration config

Configuration in layouts applies to nested routes unless overridden.

## Image Optimization

Set `images` config in adapter options:

```js
adapter({
	images: {
		sizes: [640, 828, 1200, 1920, 3840],
		formats: ['image/avif', 'image/webp'],
		minimumCacheTTL: 300,
		domains: ['example-app.vercel.app'],
	}
})
```

## Incremental Static Regeneration (ISR)

Only use on routes where all visitors see the same content (no user-specific data like session cookies).

```js
import { BYPASS_TOKEN } from '$env/static/private';

export const config = {
	isr: {
		expiration: 60,
		bypassToken: BYPASS_TOKEN,
		allowQuery: ['search']
	}
};
```

- `expiration` (required): seconds before cached asset regenerates, or `false` for never
- `bypassToken`: random token (≥32 chars) to bypass cache via `__prerender_bypass=<token>` cookie or `x-prerender-revalidate: <token>` header
- `allowQuery`: list of query params that contribute to cache key; others ignored

Generate token: `crypto.randomUUID()`. Set as `BYPASS_TOKEN` environment variable on Vercel. Pull locally: `vercel env pull .env.development.local`

Note: prerendered routes ignore ISR config.

## Environment Variables

Vercel provides deployment-specific environment variables accessible from `$env/static/private` and `$env/dynamic/private`. Pass to client via server load:

```js
// +layout.server.js
import { VERCEL_COMMIT_REF } from '$env/static/private';

export function load() {
	return { deploymentGitBranch: VERCEL_COMMIT_REF };
}
```

Use `$env/static/private` for static replacement and dead code elimination.

## Skew Protection

Vercel's skew protection routes requests to original deployment via cookie with deployment ID. When user reloads, they get newest deployment. `updated.current` is exempt and reports new deployments. Enable in Advanced project settings.

Caveat: multiple tabs with different versions will route older tabs to newer deployment, triggering SvelteKit's built-in skew protection.

## Notes

- Vercel functions in `api` directory at project root won't be handled by SvelteKit; use SvelteKit API routes instead unless non-JavaScript is needed
- Older projects may default to old Node version; change in project settings

## Troubleshooting

### File System Access

- Can't use `fs` in edge functions
- In serverless functions, use `read()` from `$app/server` instead (works in edge functions too by fetching from deployed public assets)
- Alternatively, prerender routes

### Deployment Protection

When using `read()` in edge functions with Deployment Protection enabled, must enable Protection Bypass for Automation to avoid 401 errors.