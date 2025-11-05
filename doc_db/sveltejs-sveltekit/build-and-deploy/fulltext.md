

## Pages

### building-your-app
How to build a SvelteKit app, prevent code execution during build, and preview the production build.

SvelteKit builds in two stages: Vite optimizes your code, then an adapter tunes it for your target environment. Prevent build-time code execution using the `building` flag from `$app/environment`. Preview your build with `vite preview`, though it won't include adapter-specific adjustments.

### adapters
Adapters are deployment plugins configured in svelte.config.js that prepare SvelteKit apps for specific platforms.

Adapters transform built SvelteKit apps for deployment. Configure in `svelte.config.js` with `kit.adapter`. Official adapters exist for Cloudflare, Netlify, Node, static sites, and Vercel. Platform-specific context is available via `RequestEvent.platform`.

### zero-config-deployments
adapter-auto automatically detects and uses the correct deployment adapter for supported platforms, with option to install specific adapters for configuration.

**adapter-auto** automatically selects the correct adapter for Cloudflare Pages, Netlify, Vercel, Azure Static Web Apps, AWS (via SST), or Google Cloud Run. For configuration options, install the specific adapter directly since adapter-auto takes no options.

### node-servers
Deploy SvelteKit apps as standalone Node servers using adapter-node with environment variable configuration for proxies, ports, and graceful shutdown.

## Setup
Install `@sveltejs/adapter-node` and add to `svelte.config.js`. Build with `npm run build`, deploy `build/`, `package.json`, and `node_modules/`. Start with `node build`.

## Environment Variables
- `PORT` (3000), `HOST` (0.0.0.0), `SOCKET_PATH`
- `ORIGIN=https://my.site` or `PROTOCOL_HEADER=x-forwarded-proto HOST_HEADER=x-forwarded-host`
- `ADDRESS_HEADER` and `XFF_DEPTH` for client IP behind proxies
- `BODY_SIZE_LIMIT` (512kb), `SHUTDOWN_TIMEOUT` (30s), `IDLE_TIMEOUT`
- Custom prefix: `adapter({ envPrefix: 'MY_CUSTOM_' })`

## Loading .env
```sh
node -r dotenv/config build
# or Node v20.6+
node --env-file=.env build
```

## Graceful Shutdown
Listens to `sveltekit:shutdown` event for cleanup:
```js
process.on('sveltekit:shutdown', async (reason) => {
	await db.close();
});
```

## Custom Server
```js
import { handler } from './build/handler.js';
import express from 'express';
const app = express();
app.use(handler);
app.listen(3000);
```

### static-site-generation
Configure SvelteKit to prerender your entire site as static files using adapter-static.

Install `@sveltejs/adapter-static` and add to `svelte.config.js` with `export const prerender = true;` in root layout. Key options: `pages` (output dir), `fallback` (for SPA), `precompress`, `strict`. Set `trailingSlash: 'always'` if needed. For GitHub Pages, update `paths.base` to repo name and generate `404.html` fallback.

### single-page-apps
Configure SvelteKit to serve a fully client-rendered single-page app with a fallback page, with guidance on prerendering specific pages and performance tradeoffs.

## Creating an SPA

Use `adapter-static` with `fallback` option and disable SSR in root layout:

```js
export const ssr = false;
```

```js
import adapter from '@sveltejs/adapter-static';
const config = {
	kit: { adapter: adapter({ fallback: '200.html' }) }
};
```

## Prerendering specific pages

```js
export const prerender = true;
export const ssr = true;
```

## Caveats

SPA mode has poor performance impact: multiple network round trips, SEO penalties, Core Web Vitals failures, and breaks without JavaScript. Prerender as many pages as possible or use static site generation instead.

### cloudflare
Deploy SvelteKit to Cloudflare Workers or Pages using adapter-cloudflare with configuration options for routing, fallback handling, and runtime API access.

## Setup

```js
import adapter from '@sveltejs/adapter-cloudflare';
const config = { kit: { adapter: adapter() } };
export default config;
```

## Key Options

- **fallback**: plaintext or spa for 404 handling
- **routes**: Customize `_routes.json` with include/exclude patterns (max 100 rules)

## Cloudflare Workers

Requires `wrangler.jsonc` with `assets.binding` and `assets.directory`.

## Cloudflare Pages

Build command: `npm run build`, output: `.svelte-kit/cloudflare`. Use server endpoints instead of `/functions` directory.

## Runtime APIs

Access bindings via `platform.env` after installing `@cloudflare/workers-types` and declaring in `src/app.d.ts`.

## Common Issues

- Use `read()` from `$app/server` instead of `fs`
- Add `nodejs_compat` flag for Node.js compatibility
- Reduce worker size by importing large libraries client-side

### cloudflare-workers-adapter
Deprecated adapter for deploying SvelteKit to Cloudflare Workers with Workers Sites; use adapter-cloudflare instead.

**Deprecated** in favor of `adapter-cloudflare`. Install `@sveltejs/adapter-cloudflare-workers`, configure Wrangler with `wrangler.jsonc`, access Cloudflare bindings via `platform.env`. Deploy with `wrangler deploy`. Enable Node.js compat if needed, prerender for file system access.

### netlify-adapter
Deploy SvelteKit apps to Netlify using adapter-netlify with options for edge functions, function splitting, and access to Netlify-specific features.

Install `@sveltejs/adapter-netlify` and configure in `svelte.config.js` with `edge` and `split` options. Requires `netlify.toml` with build settings. Access Netlify context via `event.platform?.context`. Use `read()` from `$app/server` instead of `fs` for file access. Supports `_headers`, `_redirects`, Forms, and custom Functions.

### vercel
Deploy SvelteKit to Vercel using adapter-vercel with configuration for functions, ISR, images, and environment variables.

## Setup
```js
import adapter from '@sveltejs/adapter-vercel';
const config = { kit: { adapter: adapter() } };
```

## Route Configuration
```js
export const config = {
	split: true,  // individual function
	runtime: 'edge',  // or 'nodejs20.x'
	regions: ['iad1'],
	memory: 1024,  // serverless only
	isr: { expiration: 60, bypassToken: TOKEN, allowQuery: ['search'] }
};
```

## Image Optimization
```js
adapter({ images: { sizes: [640, 1920], formats: ['image/webp'] } })
```

## Key Points
- Use `$env/static/private` for Vercel environment variables
- Enable Skew Protection in project settings to route to original deployment
- Use `read()` from `$app/server` instead of `fs` in edge functions
- Implement API routes in SvelteKit, not in `/api` directory

### writing-adapters
How to implement a custom SvelteKit adapter by exporting a function that returns an Adapter object with required name and adapt method, plus optional emulate and supports methods.

## Adapter API

Export a function returning an `Adapter` object with required `name` and `adapt(builder)` properties, plus optional `emulate()` and `supports` methods.

## Adapt Implementation

The `adapt` method must:
- Clear build directory
- Write output via `builder.writeClient/Server/Prerendered()`
- Generate code that imports `Server`, creates app with `builder.generateManifest()`, converts platform requests to `Request`, calls `server.respond()`, and returns `Response`
- Expose platform info via `platform` option
- Shim `fetch` globally if needed
- Bundle output and place static/generated files appropriately

