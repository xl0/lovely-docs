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