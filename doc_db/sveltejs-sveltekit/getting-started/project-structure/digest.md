## Directory Layout

A SvelteKit project has this structure:

```
my-project/
├ src/
│ ├ lib/              # Reusable code, imported via $lib alias
│ │ └ server/         # Server-only code, imported via $lib/server
│ ├ params/           # Param matchers for routing
│ ├ routes/           # Application routes
│ ├ app.html          # Page template with placeholders
│ ├ error.html        # Error page template
│ ├ hooks.client.js   # Client hooks
│ ├ hooks.server.js   # Server hooks
│ ├ service-worker.js # Service worker
│ └ tracing.server.js # Observability setup
├ static/             # Static assets (robots.txt, favicon.png, etc.)
├ tests/              # Playwright browser tests
├ package.json
├ svelte.config.js
├ tsconfig.json
└ vite.config.js
```

## Key Files

**src/app.html** - Main page template with placeholders:
- `%sveltekit.head%` - Links and scripts
- `%sveltekit.body%` - Rendered page markup (wrap in div, not directly in body)
- `%sveltekit.assets%` - Asset path
- `%sveltekit.nonce%` - CSP nonce
- `%sveltekit.env.[NAME]%` - Environment variables (PUBLIC_ prefix)
- `%sveltekit.version%` - App version

**src/error.html** - Error page with `%sveltekit.status%` and `%sveltekit.error.message%` placeholders

**package.json** - Must include `@sveltejs/kit`, `svelte`, and `vite` as devDependencies. Uses `"type": "module"` for ES modules.

**svelte.config.js** - Svelte and SvelteKit configuration

**tsconfig.json** - TypeScript config (extends generated `.svelte-kit/tsconfig.json`)

**vite.config.js** - Vite configuration using `@sveltejs/kit/vite` plugin

**.svelte-kit** - Generated directory (can be deleted, regenerates on dev/build)