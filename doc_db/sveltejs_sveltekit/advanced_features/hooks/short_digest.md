## Hooks Overview
Three optional hook files: `src/hooks.server.js`, `src/hooks.client.js`, `src/hooks.js` (universal). Run at startup.

## Server Hooks
- **handle**: Runs on every request. Modify response, bypass SvelteKit, or transform HTML chunks.
- **locals**: Add custom data to `event.locals` for `+server.js` and server `load` functions.
- **handleFetch**: Modify `event.fetch` results (e.g., redirect API URLs for SSR).
- **handleValidationError**: Handle remote function validation failures.

## Shared Hooks (server & client)
- **handleError**: Log errors and generate safe user-facing error representations. Customize via `App.Error` interface.
- **init**: Async initialization (database connections) at startup.

## Universal Hooks
- **reroute**: Change URL-to-route translation before `handle`. Can be async. Must be pure/idempotent.
- **transport**: Encode/decode custom types across server/client boundary.