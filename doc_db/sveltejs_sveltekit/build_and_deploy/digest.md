## Build Process

SvelteKit builds in two stages via `vite build`:
1. **Vite optimization**: Creates optimized production builds of server, browser, and service worker code. Prerendering executes here if configured.
2. **Adapter tuning**: Adapter optimizes the build for the target deployment environment.

Code that shouldn't execute at build time must check the `building` flag from `$app/environment`:
```js
import { building } from '$app/environment';
if (!building) { setupMyDatabase(); }
```

Preview production builds locally with `vite preview` (doesn't perfectly reproduce deployed app).

## Adapters Overview

Adapters are deployment plugins configured in `svelte.config.js` that transform built SvelteKit apps into deployment-ready output.

**Official adapters**:
- `@sveltejs/adapter-cloudflare` — Cloudflare Workers/Pages
- `@sveltejs/adapter-netlify` — Netlify
- `@sveltejs/adapter-node` — Node servers
- `@sveltejs/adapter-static` — Static site generation
- `@sveltejs/adapter-vercel` — Vercel

Platform-specific context available via `RequestEvent.platform` (e.g., Cloudflare's `env` object with KV namespaces).

## adapter-auto (Zero-Config)

Default adapter that automatically detects deployment environment and uses the appropriate adapter. Supports Cloudflare Pages, Netlify, Vercel, Azure Static Web Apps, AWS via SST, Google Cloud Run. Install specific adapter for config options and CI optimization. Does not accept configuration options.

## adapter-node

Build standalone Node.js servers. Configuration via environment variables:
- `PORT`, `HOST`, `SOCKET_PATH` (default `0.0.0.0:3000`)
- `ORIGIN` or `PROTOCOL_HEADER`/`HOST_HEADER`/`PORT_HEADER` for reverse proxies
- `ADDRESS_HEADER`, `XFF_DEPTH` for client IP behind proxies
- `BODY_SIZE_LIMIT` (default 512kb, supports K/M/G suffixes)
- `SHUTDOWN_TIMEOUT` (default 30s)

Adapter options:
```js
adapter({
  out: 'build',
  precompress: true,
  envPrefix: ''
})
```

Graceful shutdown: listen to `sveltekit:shutdown` event for cleanup. Supports systemd socket activation with `IDLE_TIMEOUT`. Custom server via `handler.js` middleware for Express/Connect/Polka/Node http.

For response compression, use `@polka/compression` (not `compression` package, which doesn't support streaming).

Load `.env` files: in dev/preview SvelteKit reads automatically; in production use `node -r dotenv/config build` or Node v20.6+ `node --env-file=.env build`.

## adapter-static

Prerender entire SvelteKit site as static files. Configuration:
```js
adapter({
  pages: 'build',
  assets: 'build',
  fallback: undefined,
  precompress: false,
  strict: true
})
```

Set `trailingSlash: 'always'` if host doesn't render `/a.html` for `/a` requests.

**GitHub Pages**: Set `paths.base` to repo name, use `fallback: '404.html'`, add `.nojekyll` to `static/` if not using GitHub Actions.

## Single-Page Apps (SPA)

Configure SvelteKit as client-rendered SPA using `adapter-static` with fallback page. Disable SSR globally with `export const ssr = false` in `+layout.js`. Significant performance/SEO drawbacks: multiple network round trips before content displays, harms Core Web Vitals, fails accessibility if JS disabled. Mitigation: prerender as many pages as possible, especially homepage.

Fallback page serves any unhandled URLs. Avoid `index.html` to prevent conflicts with prerendering. Consult host docs for correct fallback filename (e.g., Surge uses `200.html`).

Re-enable `ssr` and `prerender` for specific pages to server-render them during build to static `.html` files.

Apache configuration example:
```
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^200\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /200.html [L]
</IfModule>
```

## adapter-cloudflare

Deploy to Cloudflare Workers or Pages. Configuration:
```js
adapter({
  config: undefined,
  platformProxy: { configPath, environment, persist },
  fallback: 'plaintext',
  routes: { include: ['/*'], exclude: ['<all>'] }
})
```

**Workers**: Create `wrangler.jsonc`:
```jsonc
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

**Pages**: Use Git integration with framework preset SvelteKit, build command `npm run build`, output directory `.svelte-kit/cloudflare`. Functions in `/functions` directory are NOT included; implement as SvelteKit server endpoints instead.

Access Cloudflare bindings via `platform.env`:
```js
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
export async function POST({ request, platform }) {
  const x = platform?.env.YOUR_DURABLE_OBJECT_NAMESPACE.idFromName('x');
}
```

Local emulation: Cloudflare values in `platform` are emulated during dev/preview. For build testing use Wrangler v4: `wrangler dev .svelte-kit/cloudflare` (Workers) or `wrangler pages dev .svelte-kit/cloudflare` (Pages).

Troubleshooting: Add `nodejs_compat` flag for Node.js compatibility. Can't use `fs` in Workers; use `read()` from `$app/server` or prerender routes. Single bundled file must not exceed Cloudflare size limits.

Migration from deprecated `adapter-cloudflare-workers`: Replace adapter, remove `site` config, add `assets.directory` and `assets.binding` to wrangler config.

## adapter-netlify

Deploy to Netlify. Configuration:
```js
adapter({
  edge: false,
  split: false
})
```

Requires `netlify.toml`:
```toml
[build]
  command = "npm run build"
  publish = "build"
```

Set `edge: true` for Deno-based edge functions instead of Node. Set `split: true` to deploy each route as individual function.

**Netlify Forms**: Create HTML form with hidden `form-name` input, prerender the form page (`export const prerender = true`). For custom success messages, ensure success page exists and is prerendered.

**Netlify Functions**: SvelteKit endpoints become Netlify Functions. Access Netlify context via `event.platform?.context` in hooks and server endpoints.

Place `_headers` and `_redirects` files in project root for static asset responses. Use `_redirects` instead of `[[redirects]]` in `netlify.toml` (higher priority). Don't add custom catch-all rules.

Add custom Netlify functions by creating directory and configuring in `netlify.toml`:
```toml
[functions]
  directory = "functions"
```

Troubleshooting: Can't use `fs` in edge deployments; use `read()` from `$app/server` instead (works in both edge and serverless) or prerender routes.

## adapter-vercel

Deploy to Vercel. Configuration:
```js
adapter({
  images: { sizes, formats, minimumCacheTTL, domains },
  // route-level config via export const config = { ... }
})
```

Control route deployment via `export const config` in `+server.js`, `+page(.server).js`, or `+layout(.server).js`:
```js
export const config = {
  split: true,
  runtime: 'edge' | 'nodejs20.x' | 'nodejs22.x',
  regions: ['iad1'],
  memory: 1024,
  maxDuration: 10,
  isr: { expiration, bypassToken, allowQuery }
}
```

**Incremental Static Regeneration (ISR)**: Only use on routes where all visitors see same content (no user-specific data). Generate bypass token: `crypto.randomUUID()` (≥32 chars). Set as `BYPASS_TOKEN` environment variable on Vercel. Pull locally: `vercel env pull .env.development.local`. Bypass cache via `__prerender_bypass=<token>` cookie or `x-prerender-revalidate: <token>` header.

**Skew Protection**: Vercel routes requests to original deployment via cookie with deployment ID. When user reloads, they get newest deployment. `updated.current` is exempt and reports new deployments. Enable in Advanced project settings. Caveat: multiple tabs with different versions will route older tabs to newer deployment, triggering SvelteKit's built-in skew protection.

Environment variables from `$env/static/private` and `$env/dynamic/private` accessible on Vercel. Pass to client via server load.

Troubleshooting: Can't use `fs` in edge functions. In serverless functions, use `read()` from `$app/server` instead (works in edge functions too by fetching from deployed public assets) or prerender routes. When using `read()` in edge functions with Deployment Protection enabled, must enable Protection Bypass for Automation.

## Writing Custom Adapters

Adapter packages export default function returning `Adapter` object:
```js
export default function (options) {
  return {
    name: 'adapter-package-name',
    async adapt(builder) {
      // implementation
    },
    async emulate() {
      return {
        async platform({ config, prerender }) {
          // returned object becomes event.platform during dev, build, preview
        }
      }
    },
    supports: {
      read: ({ config, route }) => true/false,
      tracing: () => true/false
    }
  }
}
```

**Adapt method requirements**:
1. Clear build directory
2. Write SvelteKit output using `builder.writeClient()`, `builder.writeServer()`, `builder.writePrerendered()`
3. Output code that:
   - Imports `Server` from `${builder.getServerDirectory()}/index.js`
   - Instantiates app with manifest from `builder.generateManifest({ relativePath })`
   - Listens for platform requests, converts to standard `Request` if needed
   - Calls `server.respond(request, { getClientAddress })` to generate `Response`
   - Exposes platform-specific information via `platform` option to `server.respond()`
   - Globally shims `fetch` if necessary (SvelteKit provides `@sveltejs/kit/node/polyfills` for undici-compatible platforms)
4. Bundle output to avoid requiring dependencies on target platform (if necessary)
5. Place user's static files and generated JS/CSS in correct location for target platform

Recommended: place adapter output under `build/` directory with intermediate output under `.svelte-kit/[adapter-name]`. Look at source code of existing adapters for similar platforms as starting point.