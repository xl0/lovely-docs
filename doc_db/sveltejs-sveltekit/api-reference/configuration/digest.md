## svelte.config.js

Your project configuration lives in `svelte.config.js` at the root. This file is used by SvelteKit and other Svelte tooling.

```js
import adapter from '@sveltejs/adapter-auto';

const config = {
	kit: {
		adapter: adapter()
	}
};

export default config;
```

## Key Configuration Options

**adapter** - Determines how output is converted for different platforms when running `vite build`.

**alias** - Object mapping import aliases to file paths. Built-in `$lib` alias is controlled by `config.kit.files.lib`.

**appDir** - Directory where SvelteKit keeps static assets and internally-used routes (default: `"_app"`).

**csp** - Content Security Policy configuration with `mode` ('hash' | 'nonce' | 'auto'), `directives`, and `reportOnly` options. Use `%sveltekit.nonce%` placeholder in `src/app.html` for inline scripts.

**csrf** - CSRF protection via `checkOrigin` (default: true) and `trustedOrigins` array for cross-origin form submissions.

**embedded** - Set to true if app is embedded in a larger app; SvelteKit will attach listeners to parent of `%sveltekit.body%` instead of `window`.

**env** - Environment variable configuration with `dir` (search location), `publicPrefix` (default: "PUBLIC_"), and `privatePrefix` (default: "").

**experimental** - Unstable features including `tracing` (OpenTelemetry), `instrumentation`, and `remoteFunctions`.

**files** - Deprecated. Locations of source files, assets, hooks, lib, params, routes, service worker, and templates.

**inlineStyleThreshold** - Maximum CSS file size in UTF-16 code units to inline in `<style>` block (default: 0).

**moduleExtensions** - File extensions SvelteKit treats as modules (default: [".js", ".ts"]).

**outDir** - Directory for SvelteKit output during dev/build (default: ".svelte-kit").

**output** - Build output options:
- `preloadStrategy` - How to preload JS modules: 'modulepreload' (default), 'preload-js', or 'preload-mjs'
- `bundleStrategy` - 'split' (default, lazy load), 'single' (one bundle), or 'inline' (no server needed)

**paths** - URL configuration:
- `assets` - Absolute path for serving files (e.g., CDN URL)
- `base` - Root-relative path where app is served (e.g., `/my-app`)
- `relative` - Use relative asset paths during SSR (default: true)

**prerender** - Prerendering options:
- `concurrency` - Simultaneous pages (default: 1)
- `crawl` - Follow links from entries (default: true)
- `entries` - Pages to prerender (default: ["*"])
- `handleHttpError`, `handleMissingId`, `handleEntryGeneratorMismatch`, `handleUnseenRoutes` - Error handlers
- `origin` - URL origin during prerendering (default: "http://sveltekit-prerender")

**router** - Client-side routing:
- `type` - 'pathname' (default) or 'hash'
- `resolution` - 'client' (default, uses manifest) or 'server' (ask server for each navigation)

**serviceWorker** - Service worker configuration.

**typescript** - `config` function to modify generated `tsconfig.json`.

**version** - Version management for handling deployments:
- `name` - App version string (must be deterministic, e.g., git commit hash)
- `pollInterval` - Poll interval in ms for version changes (default: 0)

Use `updated.current` to detect new versions and force full-page navigation if needed.