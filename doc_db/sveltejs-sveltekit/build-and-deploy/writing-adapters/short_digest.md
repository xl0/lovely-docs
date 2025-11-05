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