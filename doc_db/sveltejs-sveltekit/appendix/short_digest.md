**FAQ**: Import JSON with type assertion. Distribute Svelte libraries as uncompiled `.svelte` files. Use `onNavigate` for view transitions. Check `browser` for client-side code. Query databases via `db.js` singleton. Use `event.fetch` for external APIs.

**Integrations**: vitePreprocess enables CSS preprocessing. `npx sv add` installs common tools.

**Debugging**: VSCode Debug Terminal or `NODE_OPTIONS="--inspect"` for browser DevTools.

**v2 Migration**: `error()`/`redirect()` no longer need `throw`. Cookies require `path: '/'`. `$app/stores` → `$app/state`. Requires Node 18.13+, svelte@4, vite@5, typescript@5.

**Sapper Migration**: `_layout.svelte` → `+layout.svelte`. `preload` → `load`. `@sapper/app` → `$app/navigation`/`$app/stores`.

**Glossary**: CSR/SSR/Hybrid rendering modes. Prerendering, SSG, ISR static generation strategies.