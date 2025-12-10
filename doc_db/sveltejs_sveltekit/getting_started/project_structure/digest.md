## Directory structure

A typical SvelteKit project has this layout:

```
my-project/
├ src/
│ ├ lib/
│ │ ├ server/          [server-only lib files]
│ │ └ [lib files]
│ ├ params/            [param matchers]
│ ├ routes/            [routes]
│ ├ app.html
│ ├ error.html
│ ├ hooks.client.js
│ ├ hooks.server.js
│ ├ service-worker.js
│ └ tracing.server.js
├ static/              [static assets]
├ tests/               [tests]
├ package.json
├ svelte.config.js
├ tsconfig.json
└ vite.config.js
```

## src directory

The `src` directory contains the project core. Everything except `src/routes` and `src/app.html` is optional.

- **lib**: Library code (utilities, components). Imported via `$lib` alias or packaged with `svelte-package`
  - **server**: Server-only code. Imported via `$lib/server` alias. SvelteKit prevents importing in client code
- **params**: Param matchers for advanced routing
- **routes**: Application routes. Can colocate route-specific components here
- **app.html**: Page template with placeholders:
  - `%sveltekit.head%` — `<link>` and `<script>` elements, plus `<svelte:head>` content
  - `%sveltekit.body%` — rendered page markup (should be inside a `<div>` or similar, not directly in `<body>`)
  - `%sveltekit.assets%` — either `paths.assets` or relative path to `paths.base`
  - `%sveltekit.nonce%` — CSP nonce for manually included links/scripts
  - `%sveltekit.env.[NAME]%` — replaced at render time with environment variable (must start with `publicPrefix`, usually `PUBLIC_`)
  - `%sveltekit.version%` — app version from configuration
- **error.html**: Fallback error page with placeholders:
  - `%sveltekit.status%` — HTTP status
  - `%sveltekit.error.message%` — error message
- **hooks.client.js**: Client hooks
- **hooks.server.js**: Server hooks
- **service-worker.js**: Service worker
- **tracing.server.js**: Observability setup and instrumentation (requires adapter support, runs before app code)

If Vitest is added, unit tests live in `src` with `.test.js` extension.

## Other directories and files

- **static**: Static assets served as-is (robots.txt, favicon.png, etc.)
- **tests**: Playwright browser tests (if added during setup)
- **package.json**: Must include `@sveltejs/kit`, `svelte`, `vite` as devDependencies. Includes `"type": "module"` for ES modules (`.cjs` for CommonJS)
- **svelte.config.js**: Svelte and SvelteKit configuration
- **tsconfig.json** or **jsconfig.json**: TypeScript configuration. SvelteKit generates `.svelte-kit/tsconfig.json` which your config extends
- **vite.config.js**: Vite configuration using `@sveltejs/kit/vite` plugin
- **.svelte-kit**: Generated directory (configurable as `outDir`). Can be deleted anytime, regenerated on dev/build