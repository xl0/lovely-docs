## Deprecation Notice
`adapter-cloudflare-workers` is deprecated in favor of `adapter-cloudflare` with Static Assets. Use the newer adapter for Cloudflare Workers deployments.

## Installation & Setup
Install with `npm i -D @sveltejs/adapter-cloudflare-workers` and add to `svelte.config.js`:

```js
import adapter from '@sveltejs/adapter-cloudflare-workers';

const config = {
	kit: {
		adapter: adapter({
			// options here
		})
	}
};

export default config;
```

## Configuration Options

**config**: Path to Wrangler configuration file (defaults to `wrangler.jsonc`, `wrangler.json`, or `wrangler.toml`)

**platformProxy**: Preferences for emulated `platform.env` local bindings (see Wrangler's getPlatformProxy API docs)

## Wrangler Configuration
Create `wrangler.jsonc` in project root:

```jsonc
{
	"name": "<your-service-name>",
	"account_id": "<your-account-id>",
	"main": "./.cloudflare/worker.js",
	"site": {
		"bucket": "./.cloudflare/public"
	},
	"build": {
		"command": "npm run build"
	},
	"compatibility_date": "2021-11-12"
}
```

Find `account_id` via `wrangler whoami` or from Cloudflare dashboard URL: `https://dash.cloudflare.com/<your-account-id>/home`

Add `.cloudflare` and `.wrangler` directories to `.gitignore`.

Install Wrangler and login:
```sh
npm i -D wrangler
wrangler login
```

Build and deploy:
```sh
wrangler deploy
```

## Runtime APIs
The `platform` property contains `env` (bindings like KV/Durable Objects), `ctx`, `caches`, and `cf`. Access in hooks and endpoints:

```js
// src/app.d.ts
import { KVNamespace, DurableObjectNamespace } from '@cloudflare/workers-types';

declare global {
	namespace App {
		interface Platform {
			env?: {
				YOUR_KV_NAMESPACE: KVNamespace;
				YOUR_DURABLE_OBJECT_NAMESPACE: DurableObjectNamespace;
			};
		}
	}
}
```

```js
// +server.js
export async function POST({ request, platform }) {
	const x = platform?.env.YOUR_DURABLE_OBJECT_NAMESPACE.idFromName('x');
}
```

Prefer SvelteKit's `$env` module for environment variables.

## Local Testing
Cloudflare-specific values in `platform` are emulated during dev/preview. Local bindings from Wrangler config populate `platform.env`. Use adapter's `platformProxy` option to customize binding preferences. For build testing, use Wrangler v4 and run `wrangler dev`.

## Troubleshooting

**Node.js compatibility**: Add `nodejs_compat` flag to Wrangler config:
```jsonc
{
	"compatibility_flags": ["nodejs_compat"]
}
```

**Worker size limits**: If bundled worker exceeds size limits, reduce by importing large libraries client-side only.

**File system access**: Can't use `fs` in Cloudflare Workers—prerender affected routes instead.