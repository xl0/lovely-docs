## Directory structure

```
src/
├ lib/              [utilities, components; $lib alias]
│ └ server/        [server-only code; $lib/server alias]
├ params/          [param matchers]
├ routes/          [routes]
├ app.html         [page template with %sveltekit.* placeholders]
├ error.html       [error page]
├ hooks.client.js  [client hooks]
├ hooks.server.js  [server hooks]
├ service-worker.js
└ tracing.server.js [observability setup]
static/            [static assets]
tests/             [Playwright tests]
package.json       [requires @sveltejs/kit, svelte, vite; "type": "module"]
svelte.config.js   [Svelte/SvelteKit config]
tsconfig.json      [extends .svelte-kit/tsconfig.json]
vite.config.js     [uses @sveltejs/kit/vite plugin]
.svelte-kit/       [generated; can be deleted]
```

**app.html placeholders**: `%sveltekit.head%`, `%sveltekit.body%`, `%sveltekit.assets%`, `%sveltekit.nonce%`, `%sveltekit.env.[NAME]%`, `%sveltekit.version%`

**error.html placeholders**: `%sveltekit.status%`, `%sveltekit.error.message%`