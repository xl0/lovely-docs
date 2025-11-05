## lifecycle_function_unavailable

Error: `` `%name%(...)` is not available on the server ``

Certain lifecycle methods like `mount` cannot be called in a server context. These methods must not be invoked eagerly during render.

**Example:** Avoid calling `mount()` at the top level of a component that runs on the server. Instead, guard such calls or move them to client-only contexts.