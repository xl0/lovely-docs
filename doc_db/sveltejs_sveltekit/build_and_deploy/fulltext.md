

## Pages

### building_your_app
Two-stage build process: Vite optimizes code and runs prerendering, then adapter tunes for deployment; skip build-time code execution with `building` flag from `$app/environment`; preview with `vite preview`.

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

### adapters
Adapters are deployment plugins configured in svelte.config.js; official ones support Cloudflare, Netlify, Node, static sites, and Vercel; platform-specific context available via RequestEvent.platform.

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

### zero-config_deployments
adapter-auto automatically selects the correct deployment adapter (Cloudflare, Netlify, Vercel, Azure, AWS SST, Google Cloud Run) based on environment; install specific adapter for config options and CI optimization.

## Overview

`adapter-auto` is the default adapter installed with new SvelteKit projects. It automatically detects the deployment environment and uses the appropriate adapter without requiring manual configuration.

## Supported Environments

- **Cloudflare Pages**: `@sveltejs/adapter-cloudflare`
- **Netlify**: `@sveltejs/adapter-netlify`
- **Vercel**: `@sveltejs/adapter-vercel`
- **Azure Static Web Apps**: `svelte-adapter-azure-swa`
- **AWS via SST**: `svelte-kit-sst`
- **Google Cloud Run**: `@sveltejs/adapter-node`

## Installation

While `adapter-auto` is installed by default, it's recommended to install the specific adapter for your target environment as a `devDependency` once chosen. This adds the adapter to your lockfile and improves CI install times.

## Configuration

`adapter-auto` does not accept configuration options. To use environment-specific options (e.g., `{ edge: true }` for Vercel or Netlify), you must install and configure the underlying adapter directly instead of relying on `adapter-auto`.

## Community Adapters

Additional adapters can be added to `adapter-auto`'s zero-config support by editing the `adapters.js` file in the adapter-auto package and submitting a pull request to the SvelteKit repository.

### adapter-node
Node.js adapter for SvelteKit: build standalone servers, configure via environment variables (ORIGIN, PORT, HOST, PROTOCOL_HEADER, ADDRESS_HEADER, etc.), graceful shutdown with sveltekit:shutdown event, systemd socket activation support, custom server via handler.js middleware.

## Installation

Install with `npm i -D @sveltejs/adapter-node` and add to `svelte.config.js`:

```js
import adapter from '@sveltejs/adapter-node';

const config = {
	kit: {
		adapter: adapter()
	}
};

export default config;
```

## Building and Deploying

Build with `npm run build` (outputs to `build` by default). To run:

```sh
node build
```

You need: the output directory, `package.json`, and production dependencies. Generate production dependencies with `npm ci --omit dev`.

Development dependencies are bundled via Rollup. Control bundling by placing packages in `devDependencies` (bundled) or `dependencies` (external).

## Compression

For response compression, use `@polka/compression` instead of the popular `compression` package, as SvelteKit streams responses and `compression` doesn't support streaming.

## Environment Variables

### Loading .env files

In `dev` and `preview`, SvelteKit reads from `.env` (or `.env.local`, `.env.[mode]`). In production, install and invoke `dotenv`:

```sh
npm install dotenv
node -r dotenv/config build
```

Or with Node.js v20.6+:

```sh
node --env-file=.env build
```

### PORT, HOST, SOCKET_PATH

Default: `0.0.0.0:3000`. Customize with environment variables:

```sh
HOST=127.0.0.1 PORT=4000 node build
SOCKET_PATH=/tmp/socket node build
```

### ORIGIN, PROTOCOL_HEADER, HOST_HEADER, PORT_HEADER

Set `ORIGIN` to tell SvelteKit the deployment URL:

```sh
ORIGIN=https://my.site node build
```

Or use headers from a reverse proxy:

```sh
PROTOCOL_HEADER=x-forwarded-proto HOST_HEADER=x-forwarded-host node build
PROTOCOL_HEADER=x-forwarded-proto HOST_HEADER=x-forwarded-host PORT_HEADER=x-forwarded-port node build
```

Only set these if behind a trusted reverse proxy to prevent header spoofing.

### ADDRESS_HEADER, XFF_DEPTH

For `event.getClientAddress()` behind proxies, specify the header containing the client IP:

```sh
ADDRESS_HEADER=True-Client-IP node build
```

For `X-Forwarded-For` (comma-separated IPs), use `XFF_DEPTH` to specify trusted proxy count. Reads from the right to prevent spoofing:

```sh
ADDRESS_HEADER=X-Forwarded-For XFF_DEPTH=3 node build
```

### BODY_SIZE_LIMIT

Maximum request body size in bytes (default: 512kb). Supports unit suffixes: `K`, `M`, `G`:

```sh
BODY_SIZE_LIMIT=1M node build
```

Set to `Infinity` to disable and implement custom checks in `handle` hook.

### SHUTDOWN_TIMEOUT

Seconds to wait before forcefully closing connections after `SIGTERM`/`SIGINT` (default: 30).

### IDLE_TIMEOUT

With systemd socket activation, seconds before auto-sleep when idle. See Socket activation section.

## Adapter Options

```js
adapter({
	out: 'build',           // output directory
	precompress: true,      // gzip/brotli precompression for assets
	envPrefix: ''           // prefix for env vars (e.g., 'MY_CUSTOM_')
})
```

With `envPrefix: 'MY_CUSTOM_'`, use `MY_CUSTOM_HOST`, `MY_CUSTOM_PORT`, `MY_CUSTOM_ORIGIN`, etc.

## Graceful Shutdown

On `SIGTERM`/`SIGINT`, the adapter:
1. Rejects new requests
2. Waits for in-flight requests to finish
3. Closes remaining connections after `SHUTDOWN_TIMEOUT` seconds

Listen to `sveltekit:shutdown` event for cleanup:

```js
process.on('sveltekit:shutdown', async (reason) => {
  await jobs.stop();
  await db.close();
});
```

`reason` is one of: `SIGINT`, `SIGTERM`, `IDLE`.

## Socket Activation

Configure systemd socket activation for on-demand app scaling. The adapter listens on file descriptor 3.

1. Create systemd service with `IDLE_TIMEOUT`:

```ini
[Service]
Environment=NODE_ENV=production IDLE_TIMEOUT=60
ExecStart=/usr/bin/node /usr/bin/myapp/build
```

2. Create socket unit:

```ini
[Socket]
ListenStream=3000

[Install]
WantedBy=sockets.target
```

3. Enable: `sudo systemctl daemon-reload && sudo systemctl enable --now myapp.socket`

App auto-starts on first request.

## Custom Server

The build outputs `index.js` (standalone server) and `handler.js` (middleware). Import `handler.js` for Express, Connect, Polka, or Node's `http.createServer`:

```js
import { handler } from './build/handler.js';
import express from 'express';

const app = express();

app.get('/healthcheck', (req, res) => {
	res.end('ok');
});

app.use(handler);

app.listen(3000, () => {
	console.log('listening on port 3000');
});
```

SvelteKit handles prerendered pages and static assets.

### adapter-static
Static site generator adapter for SvelteKit; prerender entire site with `adapter-static`, configure output directories, fallback page for SPA mode, compression, and strict checking; GitHub Pages support with base path configuration and automated Actions workflow.

## Static Site Generation with adapter-static

Use `@sveltejs/adapter-static` to prerender your entire SvelteKit site as static files. For partial prerendering with dynamic server-rendering, use a different adapter with the `prerender` option.

### Installation and Setup

```js
// svelte.config.js
import adapter from '@sveltejs/adapter-static';

const config = {
	kit: {
		adapter: adapter({
			pages: 'build',
			assets: 'build',
			fallback: undefined,
			precompress: false,
			strict: true
		})
	}
};
export default config;
```

```js
// src/routes/+layout.js
export const prerender = true;
```

### Configuration Options

**pages** - Directory for prerendered pages (default: `build`)

**assets** - Directory for static assets and generated JS/CSS (default: same as `pages`)

**fallback** - Fallback page for single-page app (SPA) mode. Commonly `200.html` or `404.html`. Avoid `index.html` to prevent conflicts with prerendered homepage. Has significant negative performance and SEO impacts; only recommended for specific cases like mobile app wrapping.

**precompress** - If `true`, generates `.br` (brotli) and `.gz` (gzip) compressed files

**strict** - By default checks that all pages/endpoints are prerendered or `fallback` is set. Set to `false` to disable this check if some pages are conditionally inaccessible.

### Important Configuration Notes

Set `trailingSlash` appropriately: if your host doesn't render `/a.html` for requests to `/a`, use `trailingSlash: 'always'` to create `/a/index.html` instead.

### Zero-Config Support

Vercel has zero-config support. Omit adapter options to let `adapter-static` provide optimal configuration:

```js
const config = {
	kit: {
		adapter: adapter()
	}
};
```

### GitHub Pages Deployment

Update `config.kit.paths.base` to match your repo name (site serves from `https://your-username.github.io/your-repo-name`):

```js
import adapter from '@sveltejs/adapter-static';

const config = {
	kit: {
		adapter: adapter({
			fallback: '404.html'
		}),
		paths: {
			base: process.argv.includes('dev') ? '' : process.env.BASE_PATH
		}
	}
};
export default config;
```

Generate a custom `404.html` fallback to replace GitHub Pages' default 404 page.

### GitHub Actions Deployment Workflow

```yaml
name: Deploy to GitHub Pages
on:
  push:
    branches: 'main'

jobs:
  build_site:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm i
      - run: npm run build
        env:
          BASE_PATH: '/${{ github.event.repository.name }}'
      - uses: actions/upload-pages-artifact@v3
        with:
          path: 'build/'

  deploy:
    needs: build_site
    runs-on: ubuntu-latest
    permissions:
      pages: write
      id-token: write
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - uses: actions/deploy-pages@v4
```

If not using GitHub Actions, add an empty `.nojekyll` file in `static/` to prevent Jekyll interference.

### single-page_apps
Configure SvelteKit as a client-rendered SPA using adapter-static with fallback page; disable SSR globally, selectively prerender pages, understand performance/SEO tradeoffs, configure host-specific routing (Apache .htaccess example).

## Overview

Turn a SvelteKit app into a fully client-rendered single-page app (SPA) by specifying a fallback page that serves any URLs not handled by other means (prerendered pages, etc).

## Performance and SEO Warnings

SPA mode has significant drawbacks:
- Multiple network round trips required (HTML, JavaScript, data) before content displays
- Delays startup, especially on mobile with high latency
- Harms SEO: sites often downranked for performance, fails Core Web Vitals, excluded from search engines that don't render JS
- Makes app inaccessible if JavaScript fails or is disabled

Mitigation: prerender as many pages as possible (especially homepage). If all pages can be prerendered, use static site generation instead. Otherwise, use an adapter supporting server-side rendering.

## Basic Setup

Disable SSR for pages to serve via fallback:

```js
/// file: src/routes/+layout.js
export const ssr = false;
```

For apps without server-side logic, use `adapter-static`:

```js
/// file: svelte.config.js
import adapter from '@sveltejs/adapter-static';

const config = {
	kit: {
		adapter: adapter({
			fallback: '200.html' // host-specific, e.g., Surge uses 200.html
		})
	}
};

export default config;
```

The fallback page is an HTML file created from your page template (e.g., `app.html`) that loads your app and navigates to the correct route. Consult your host's documentation for the correct fallback filename. Avoid `index.html` to prevent conflicts with prerendering.

Note: Fallback pages always use absolute asset paths (starting with `/`) regardless of `paths.relative` configuration.

## Prerendering Individual Pages

Re-enable `ssr` and `prerender` for specific pages:

```js
/// file: src/routes/my-prerendered-page/+page.js
export const prerender = true;
export const ssr = true;
```

These pages are server-rendered during build to output static `.html` files deployable on any static host without requiring a Node server.

## Apache Configuration

Add `static/.htaccess` to route requests to the fallback page:

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

### adapter-cloudflare
Adapter for deploying SvelteKit to Cloudflare Workers/Pages with configuration options, runtime API access to bindings, local emulation, and migration guide from deprecated Workers Sites.

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

### cloudflare_workers_adapter
Deprecated adapter for deploying SvelteKit to Cloudflare Workers with Workers Sites; configure via wrangler.jsonc, access bindings through platform.env, prerender for file system access.

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

### adapter_netlify
Deploy SvelteKit to Netlify with adapter supporting Edge Functions, form handling, custom functions, and Netlify Identity context access.

## Installation

Install with `npm i -D @sveltejs/adapter-netlify` and add to `svelte.config.js`:

```js
import adapter from '@sveltejs/adapter-netlify';

const config = {
	kit: {
		adapter: adapter({
			edge: false,      // use Netlify Edge Functions (Deno-based) instead of Node
			split: false      // split app into multiple functions instead of single one
		})
	}
};

export default config;
```

Requires `netlify.toml` in project root:

```toml
[build]
	command = "npm run build"
	publish = "build"
```

If missing, defaults to `"build"` directory. Node LTS is used by default for new projects.

## Netlify Edge Functions

Set `edge: true` to deploy server-side rendering to Deno-based edge functions deployed close to visitors, instead of Node-based Netlify Functions.

## Netlify-Specific Features

### `_headers` and `_redirects`

Place Netlify-specific `_headers` and `_redirects` files in project root for static asset responses. Redirect rules are automatically appended during compilation.

**Important**: Use `_redirects` file instead of `[[redirects]]` in `netlify.toml` (higher priority). Don't add custom catch-all rules like `/* /foobar/:splat` as they prevent auto-appended rules from matching.

### Netlify Forms

1. Create HTML form in route (e.g., `/routes/contact/+page.svelte`) with hidden `form-name` input
2. Prerender the form page: add `export const prerender = true` or set `kit.prerender.force: true`
3. For custom success messages like `<form netlify ... action="/success">`, ensure `/routes/success/+page.svelte` exists and is prerendered

### Netlify Functions

SvelteKit endpoints become Netlify Functions. Access Netlify context (including Identity info) via `event.platform.context` in hooks and server endpoints:

```js
export const load = async (event) => {
	const context = event.platform?.context;
	console.log(context);
};
```

Add custom Netlify functions by creating a directory and configuring in `netlify.toml`:

```toml
[build]
	command = "npm run build"
	publish = "build"

[functions]
	directory = "functions"
```

## Troubleshooting

**File system access**: Can't use `fs` in edge deployments. In serverless deployments, use `read()` from `$app/server` instead (works in both edge and serverless). Alternatively, prerender routes.

### adapter-vercel
Vercel adapter for SvelteKit with config for runtime, regions, memory, ISR, image optimization, and file access via $app/server.

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

### writing_adapters
Adapter API: export function returning object with name, adapt(builder), optional emulate() and supports; adapt() must write output, generate manifest, handle requests via server.respond(), shim fetch, bundle, and place files correctly.

## Adapter API

Adapter packages implement an API that exports a default function returning an `Adapter` object:

```js
export default function (options) {
	const adapter = {
		name: 'adapter-package-name',
		async adapt(builder) {
			// adapter implementation
		},
		async emulate() {
			return {
				async platform({ config, prerender }) {
					// returned object becomes `event.platform` during dev, build, preview
					// shape matches `App.Platform`
				}
			}
		},
		supports: {
			read: ({ config, route }) => {
				// Return true if route can use `read` from `$app/server` in production
				// Return false or throw descriptive error if it can't
			},
			tracing: () => {
				// Return true if adapter supports loading `tracing.server.js`
				// Return false or throw descriptive error if it can't
			}
		}
	};
	return adapter;
}
```

Required properties: `name`, `adapt`. Optional: `emulate`, `supports`.

## Adapt Method Requirements

The `adapt` method must:

1. Clear the build directory
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

## Directory Structure

Recommended: place adapter output under `build/` directory with intermediate output under `.svelte-kit/[adapter-name]`.

## Getting Started

Look at source code of existing adapters for similar platforms as a starting point.

