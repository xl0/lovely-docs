## Overview
Deploy to Cloudflare Workers or Cloudflare Pages using `@sveltejs/adapter-cloudflare`. Installed by default with `adapter-auto`. Switch to this adapter directly for local `event.platform` emulation, automatic type declarations, and Cloudflare-specific options.

## Adapter Comparison
- `adapter-cloudflare` – all SvelteKit features; builds for Cloudflare Workers Static Assets and Pages
- `adapter-cloudflare-workers` – deprecated; all features; builds for Workers Sites
- `adapter-static` – client-side only; compatible with Workers Static Assets and Pages

## Installation & Configuration
```js
// svelte.config.js
import adapter from '@sveltejs/adapter-cloudflare';

const config = {
	kit: {
		adapter: adapter({
			config: undefined,
			platformProxy: {
				configPath: undefined,
				environment: undefined,
				persist: undefined
			},
			fallback: 'plaintext',
			routes: {
				include: ['/*'],
				exclude: ['<all>']
			}
		})
	}
};
export default config;
```

## Options

**config** – Path to Wrangler configuration file (wrangler.jsonc, wrangler.json, or wrangler.toml)

**platformProxy** – Preferences for emulated `platform.env` local bindings; see Wrangler's getPlatformProxy API docs

**fallback** – `'plaintext'` (default) or `'spa'` for 404 handling. For Workers: returns null-body 404 unless `assets.not_found_handling` is `"404-page"` or `"single-page-application"`. For Pages: served when request matches `routes.exclude` but fails asset match.

**routes** – Cloudflare Pages only. Customize `_routes.json`:
- `include` – routes invoking functions (default: `['/*']`)
- `exclude` – routes NOT invoking functions (faster/cheaper for static assets):
  - `<build>` – Vite build artifacts
  - `<files>` – static directory contents
  - `<prerendered>` – prerendered pages
  - `<all>` – all of above (default)
- Max 100 combined include/exclude rules. Use manual exclude lists like `['/articles/*']` instead of individual prerendered paths to stay under limit.

## Cloudflare Workers

### Basic Configuration
```jsonc
// wrangler.jsonc
{
	"name": "<any-name>",
	"main": ".svelte-kit/cloudflare/_worker.js",
	"compatibility_date": "2025-01-01",
	"assets": {
		"binding": "ASSETS",
		"directory": ".svelte-kit/cloudflare"
	}
}
```

### Deployment
Follow Cloudflare Workers framework guide for SvelteKit.

## Cloudflare Pages

### Deployment
Follow Cloudflare Pages Get Started Guide. With Git integration, use:
- Framework preset – SvelteKit
- Build command – `npm run build` or `vite build`
- Build output directory – `.svelte-kit/cloudflare`

See Cloudflare's SvelteKit deployment guide for Pages.

### Notes
Functions in `/functions` directory are NOT included. Implement as SvelteKit server endpoints instead, compiled to single `_worker.js` file.

## Runtime APIs

Access Cloudflare bindings (KV/DO namespaces, etc.) via `platform.env`, along with `ctx`, `caches`, and `cf`:

```js
// src/app.d.ts
import { KVNamespace, DurableObjectNamespace } from '@cloudflare/workers-types';

declare global {
	namespace App {
		interface Platform {
			env: {
				YOUR_KV_NAMESPACE: KVNamespace;
				YOUR_DURABLE_OBJECT_NAMESPACE: DurableObjectNamespace;
			};
		}
	}
}
export {};
```

```js
// +server.js
export async function POST({ request, platform }) {
	const x = platform?.env.YOUR_DURABLE_OBJECT_NAMESPACE.idFromName('x');
}
```

Use SvelteKit's `$env` module for environment variables instead.

### Testing Locally
Cloudflare values in `platform` are emulated during dev/preview. Local bindings from Wrangler config populate `platform.env`. Use adapter's `platformProxy` option to customize. For build testing, use Wrangler v4: `wrangler dev .svelte-kit/cloudflare` (Workers) or `wrangler pages dev .svelte-kit/cloudflare` (Pages).

## Headers and Redirects

`_headers` and `_redirects` files in project root work for static assets only. For dynamic responses, use server endpoints or `handle` hook.

## Troubleshooting

**Node.js compatibility** – Add `nodejs_compat` flag to wrangler.jsonc:
```jsonc
{
	"compatibility_flags": ["nodejs_compat"]
}
```

**Worker size limits** – Single bundled file must not exceed Cloudflare's size limits after minification. Reduce by importing large libraries client-side only.

**File system access** – Can't use `fs` in Workers. Use `read()` from `$app/server` to fetch from deployed public assets, or prerender routes.

## Migration from Workers Sites

Replace `@sveltejs/adapter-cloudflare-workers` with `@sveltejs/adapter-cloudflare`. Remove `site` config, add `assets.directory` and `assets.binding`:

```js
// svelte.config.js
import adapter from '@sveltejs/adapter-cloudflare';
const config = { kit: { adapter: adapter() } };
export default config;
```

```jsonc
// wrangler.jsonc
{
	"assets": {
		"directory": ".cloudflare/public",
		"binding": "ASSETS"
	}
}
```