## svelte.config.js Structure
```js
import adapter from '@sveltejs/adapter-auto';

const config = {
	kit: {
		adapter: adapter(),
		alias: { 'my-file': 'path/to/my-file.js' },
		appDir: '_app',
		csp: { directives: { 'script-src': ['self'] } },
		csrf: { checkOrigin: true, trustedOrigins: [] },
		embedded: false,
		env: { dir: '.', publicPrefix: 'PUBLIC_', privatePrefix: '' },
		experimental: { tracing: {}, instrumentation: {}, remoteFunctions: false },
		inlineStyleThreshold: 0,
		moduleExtensions: ['.js', '.ts'],
		outDir: '.svelte-kit',
		output: { preloadStrategy: 'modulepreload', bundleStrategy: 'split' },
		paths: { assets: '', base: '', relative: true },
		prerender: { concurrency: 1, crawl: true, entries: ['*'], origin: 'http://sveltekit-prerender' },
		router: { type: 'pathname', resolution: 'client' },
		typescript: { config: (cfg) => cfg },
		version: { name: 'timestamp', pollInterval: 0 }
	}
};

export default config;
```

## Key Options

**adapter** - Converts build output for target platform

**alias** - Import path aliases (auto-passed to Vite/TypeScript)

**csp** - Content Security Policy with `mode: 'hash'|'nonce'|'auto'`, `directives`, `reportOnly`

**csrf** - CSRF protection: `checkOrigin` (deprecated), `trustedOrigins` array

**env** - Environment variables: `dir`, `publicPrefix` (PUBLIC_), `privatePrefix`

**output** - `preloadStrategy` (modulepreload/preload-js/preload-mjs), `bundleStrategy` (split/single/inline)

**paths** - `assets` (CDN URL), `base` (root path), `relative` (use relative paths in SSR)

**prerender** - `concurrency`, `crawl`, `entries`, error handlers (`handleHttpError`, `handleMissingId`, `handleEntryGeneratorMismatch`, `handleUnseenRoutes`), `origin`

**router** - `type` (pathname/hash), `resolution` (client/server)

**version** - `name` (deterministic version string), `pollInterval` (ms) for detecting deployments