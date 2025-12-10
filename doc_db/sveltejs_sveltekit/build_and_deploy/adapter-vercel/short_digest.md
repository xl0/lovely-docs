## Setup

```js
import adapter from '@sveltejs/adapter-vercel';
const config = { kit: { adapter: adapter({ /* options */ }) } };
```

## Configuration

Set `export const config` in routes to control deployment:

```js
export const config = {
	runtime: 'nodejs22.x',
	regions: ['iad1'],
	split: true,
	memory: 1024,
	maxDuration: 15,
	isr: { expiration: 60, bypassToken: TOKEN, allowQuery: ['search'] }
};
```

- `runtime`: `'edge'` or `'nodejs20.x'`/`'nodejs22.x'` (deprecated)
- `regions`: edge network regions (default `["iad1"]`)
- `split`: deploy as individual function
- `memory`: 128-3008 Mb (serverless only)
- `maxDuration`: max execution seconds (serverless only)
- `isr`: cache with optional bypass token and query allowlist

## Image Optimization

```js
adapter({ images: { sizes: [640, 1920], formats: ['image/webp'], domains: ['example.com'] } })
```

## ISR (Incremental Static Regeneration)

```js
export const config = {
	isr: {
		expiration: 60,
		bypassToken: BYPASS_TOKEN,
		allowQuery: ['search']
	}
};
```

Bypass cache: `__prerender_bypass=<token>` cookie or `x-prerender-revalidate: <token>` header. Generate token with `crypto.randomUUID()` (≥32 chars).

## Environment Variables

Access Vercel deployment vars via `$env/static/private`:

```js
import { VERCEL_COMMIT_REF } from '$env/static/private';
export function load() { return { branch: VERCEL_COMMIT_REF }; }
```

## Skew Protection

Enable in project settings to route requests to original deployment via cookie.

## Troubleshooting

- Edge functions: can't use `fs`, use `read()` from `$app/server`
- Serverless: use `read()` instead of `fs` (files not copied to deployment)
- Deployment Protection: enable Protection Bypass for Automation when using `read()` in edge functions