**Deprecated**: `adapter-cloudflare-workers` is deprecated in favor of `adapter-cloudflare` with Static Assets.

**Installation & Setup**:
```js
import adapter from '@sveltejs/adapter-cloudflare-workers';
const config = {
  kit: { adapter: adapter() }
};
export default config;
```

**Wrangler Configuration** (`wrangler.jsonc`):
```jsonc
{
  "name": "<your-service-name>",
  "account_id": "<your-account-id>",
  "main": "./.cloudflare/worker.js",
  "site": { "bucket": "./.cloudflare/public" },
  "build": { "command": "npm run build" },
  "compatibility_date": "2021-11-12"
}
```

**Options**:
- `config`: Path to Wrangler configuration file (defaults to `wrangler.jsonc`, `wrangler.json`, or `wrangler.toml`)
- `platformProxy`: Preferences for emulated `platform.env` local bindings

**Runtime APIs**: Access Cloudflare bindings (KV, Durable Objects) via `platform.env` in hooks and endpoints:
```js
export async function POST({ request, platform }) {
  const x = platform?.env.YOUR_DURABLE_OBJECT_NAMESPACE.idFromName('x');
}
```

Type bindings in `src/app.d.ts` using `@cloudflare/workers-types`.

**Local Testing**: Bindings are emulated during dev/preview. Use Wrangler v4 and run `wrangler dev` after building.

**Troubleshooting**:
- Enable Node.js compatibility with `"compatibility_flags": ["nodejs_compat"]`
- Worker size limits: reduce by importing large libraries client-side only
- Can't use `fs` — prerender routes instead