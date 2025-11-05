## Building

SvelteKit builds in two stages: Vite optimizes code, then an adapter tunes it for the target environment. Prevent build-time code execution using the `building` flag from `$app/environment`. Preview with `vite preview`.

## Adapters

Adapters are deployment plugins configured in `svelte.config.js` that transform built apps for specific platforms. Official adapters: Cloudflare, Netlify, Node, static sites, and Vercel. Access platform-specific context via `RequestEvent.platform`.

## Deployment Options

**adapter-auto** automatically detects and uses the correct adapter for Cloudflare Pages, Netlify, Vercel, Azure Static Web Apps, AWS (via SST), or Google Cloud Run.

**Node.js**: Install `@sveltejs/adapter-node`. Configure via environment variables: `PORT` (3000), `HOST` (0.0.0.0), `ORIGIN`, `PROTOCOL_HEADER`, `HOST_HEADER`, `ADDRESS_HEADER`, `XFF_DEPTH`, `BODY_SIZE_LIMIT` (512kb), `SHUTDOWN_TIMEOUT` (30s). Listen to `sitelkit:shutdown` event for graceful cleanup. Custom server example:
```js
import { handler } from './build/handler.js';
import express from 'express';
const app = express();
app.use(handler);
app.listen(3000);
```

**Static Site Generation**: Use `adapter-static` with `export const prerender = true;` in root layout. Options: `pages` (output dir), `fallback` (for SPA), `precompress`, `strict`, `trailingSlash`.

**Single-Page Apps**: Use `adapter-static` with `fallback` option and `export const ssr = false;` in root layout. Optionally prerender specific pages with `export const prerender = true;`. Note: poor performance, SEO penalties, requires JavaScript.

**Cloudflare**: Use `adapter-cloudflare`. Options: `fallback` (plaintext or spa), `routes` (customize `_routes.json`). Access bindings via `platform.env`. Use `read()` from `$app/server` instead of `fs`. Enable `nodejs_compat` flag if needed.

**Netlify**: Use `adapter-netlify` with `edge` and `split` options. Requires `netlify.toml`. Access context via `event.platform?.context`. Supports `_headers`, `_redirects`, Forms, and custom Functions.

**Vercel**: Use `adapter-vercel`. Route configuration:
```js
export const config = {
	split: true,
	runtime: 'edge',  // or 'nodejs20.x'
	regions: ['iad1'],
	memory: 1024,
	isr: { expiration: 60, bypassToken: TOKEN, allowQuery: ['search'] }
};
```
Image optimization: `adapter({ images: { sizes: [640, 1920], formats: ['image/webp'] } })`. Use `$env/static/private` for environment variables.

## Custom Adapters

Export a function returning an `Adapter` object with required `name` and `adapt(builder)` properties. The `adapt` method must clear build directory, write output via `builder.writeClient/Server/Prerendered()`, generate code that imports `Server`, creates app with `builder.generateManifest()`, converts platform requests to `Request`, calls `server.respond()`, and returns `Response`. Expose platform info via `platform` option and shim `fetch` globally if needed.