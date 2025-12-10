## Package inclusion

Check library packaging with publint.dev. Key: `exports` takes precedence; ESM files end with `.mjs` (or any extension if `"type": "module"`); CommonJS end with `.cjs`; Svelte components distributed as uncompiled `.svelte` with ESM-only JS.

## Client-side libraries

Wrap in `browser` check or `onMount`, or use `{#await}` block for dynamic imports.

## Database

Put queries in server routes. Create `db.js` singleton, setup in `hooks.server.js`.

## Backend API

Use `event.fetch` with CORS handling, or proxy `/api` to backend (Vite's `server.proxy` in dev).

## Middleware

Use Vite plugin with `configureServer` in dev; `adapter-node` provides middleware for production.

## View transitions

Call `document.startViewTransition` in `onNavigate`.

## Yarn

Yarn 2: disable Plug'n'Play with `nodeLinker: 'node-modules'`. Yarn 3: same setting for local node_modules.