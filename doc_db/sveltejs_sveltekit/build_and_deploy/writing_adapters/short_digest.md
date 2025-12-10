## Adapter API

Export a function returning an `Adapter` with required `name` and `adapt(builder)` properties, plus optional `emulate()` and `supports` object.

## Adapt Method

Must clear build directory, write output via `builder.writeClient/Server/Prerendered()`, generate manifest with `builder.generateManifest()`, listen for requests, convert to standard `Request`, call `server.respond(request, { getClientAddress })`, expose platform info, shim `fetch` if needed, bundle output, and place static/JS/CSS files correctly.

## Structure

Place output under `build/` with intermediate files under `.svelte-kit/[adapter-name]`.