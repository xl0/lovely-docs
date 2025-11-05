## svelte.config.js Structure

```js
import adapter from '@sveltejs/adapter-auto';

const config = {
	kit: {
		adapter: adapter()
	}
};

export default config;
```

## Essential Options

**adapter** - Platform output converter (required for build)

**alias** - Import path aliases

**appDir** - Static assets directory (default: "_app")

**csp** - Content Security Policy with mode ('hash'|'nonce'|'auto'), directives, reportOnly

**csrf** - CSRF protection: checkOrigin (default: true), trustedOrigins array

**env** - Environment variables: dir, publicPrefix ("PUBLIC_"), privatePrefix ("")

**inlineStyleThreshold** - Max CSS size to inline (default: 0)

**outDir** - Build output directory (default: ".svelte-kit")

**output.bundleStrategy** - 'split' (lazy), 'single', or 'inline' (no server)

**output.preloadStrategy** - 'modulepreload' (default), 'preload-js', 'preload-mjs'

**paths** - URL config: assets (CDN), base (/path), relative (default: true)

**prerender** - concurrency, crawl, entries, error handlers, origin

**router.type** - 'pathname' (default) or 'hash'

**router.resolution** - 'client' (manifest) or 'server' (per-navigation)

**version** - name (deterministic string), pollInterval (ms)