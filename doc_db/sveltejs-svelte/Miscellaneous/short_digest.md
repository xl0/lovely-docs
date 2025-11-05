## Testing
Vitest with `$effect.root()` and `flushSync()`, `mount()` API for components, Playwright for E2E.

## TypeScript
Add `lang="ts"`, configure `vitePreprocess`. Type props with `$props()`, state with `$state()`. Extend DOM types via `svelteHTML` namespace.

## Custom Elements
Compile with `customElement: true`. Configure via `<svelte:options customElement={{ tag, props, shadow, extend }} />`. Styles encapsulated, context doesn't cross boundaries.

## Svelte 4 Migration
Node 16+, TypeScript 5+. Bundlers must specify `browser` condition. No CommonJS. Stricter types. Transitions local by default. ESLint: `eslint-plugin-svelte3` → `eslint-plugin-svelte`.

## Svelte 5 Migration
`let` → `$state`, `$:` → `$derived`/`$effect`, `export let` → `$props()`. Events: `on:click` → `onclick`. Slots → snippets. Components are functions. Modern browsers only.

## FAQ
Support via docs, Stack Overflow, Discord. Routing: SvelteKit or alternatives. Mobile: Tauri/Capacitor. Use `:global(...)` for global styles.