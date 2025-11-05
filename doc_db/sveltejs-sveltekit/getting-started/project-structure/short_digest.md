## Directory Structure

```
src/
├ lib/              # Reusable code ($lib alias)
│ └ server/         # Server-only code ($lib/server)
├ params/           # Param matchers
├ routes/           # Routes
├ app.html          # Page template
├ error.html        # Error page
├ hooks.client.js   # Client hooks
├ hooks.server.js   # Server hooks
├ service-worker.js # Service worker
└ tracing.server.js # Observability
static/             # Static assets
tests/              # Tests
```

**app.html placeholders**: `%sveltekit.head%`, `%sveltekit.body%`, `%sveltekit.assets%`, `%sveltekit.nonce%`, `%sveltekit.env.[NAME]%`, `%sveltekit.version%`

**error.html placeholders**: `%sveltekit.status%`, `%sveltekit.error.message%`

**package.json** requires `@sveltejs/kit`, `svelte`, `vite` as devDependencies with `"type": "module"`