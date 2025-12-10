## Deprecation
`adapter-cloudflare-workers` is deprecated; use `adapter-cloudflare` instead.

## Setup
```js
import adapter from '@sveltejs/adapter-cloudflare-workers';
export default { kit: { adapter: adapter() } };
```

Configure `wrangler.jsonc`:
```jsonc
{
	"name": "<service-name>",
	"account_id": "<account-id>",
	"main": "./.cloudflare/worker.js",
	"site": { "bucket": "./.cloudflare/public" },
	"build": { "command": "npm run build" },
	"compatibility_date": "2021-11-12"
}
```

Deploy: `wrangler deploy`

## Runtime APIs
Access bindings via `platform.env`:
```js
// src/app.d.ts
import { KVNamespace, DurableObjectNamespace } from '@cloudflare/workers-types';
declare global {
	namespace App {
		interface Platform {
			env?: { YOUR_KV_NAMESPACE: KVNamespace; YOUR_DURABLE_OBJECT_NAMESPACE: DurableObjectNamespace; };
		}
	}
}

// +server.js
export async function POST({ platform }) {
	const x = platform?.env.YOUR_DURABLE_OBJECT_NAMESPACE.idFromName('x');
}
```

## Troubleshooting
- Enable Node.js: add `"compatibility_flags": ["nodejs_compat"]` to wrangler config
- Size limits: import large libraries client-side only
- File system: prerender routes instead of using `fs`