## Adapter API Structure

An adapter package must export a default function that returns an `Adapter` object with:

**Required properties:**
- `name`: string identifier for the adapter
- `adapt(builder)`: async function implementing the adapter logic

**Optional properties:**
- `emulate()`: returns platform-specific context for `event.platform` during dev/build/preview
- `supports`: object with methods to declare feature support:
  - `read({ config, route })`: returns boolean if route can use `$app/server` read in production
  - `tracing()`: returns boolean if adapter supports loading `tracing.server.js`

## Adapt Method Implementation

The `adapt` method should:

1. Clear the build directory
2. Write SvelteKit output using `builder.writeClient()`, `builder.writeServer()`, `builder.writePrerendered()`
3. Generate output code that:
   - Imports `Server` from `${builder.getServerDirectory()}/index.js`
   - Creates app instance with manifest from `builder.generateManifest({ relativePath })`
   - Listens for platform requests, converts to standard `Request` objects
   - Calls `server.respond(request, { getClientAddress })` to generate `Response`
   - Passes platform-specific info via `platform` option to `server.respond()`
   - Shims `fetch` globally if needed (use `@sveltejs/kit/node/polyfills` for Node-compatible platforms)
4. Bundle output to avoid runtime dependency installation if necessary
5. Place static files and generated JS/CSS in platform-appropriate locations

**Directory structure:** Place adapter output in `build/` with intermediate files in `.svelte-kit/[adapter-name]/`

**Starting point:** Copy an existing adapter from the SvelteKit repository for a similar platform.