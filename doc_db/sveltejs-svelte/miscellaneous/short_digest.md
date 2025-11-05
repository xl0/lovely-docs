## Testing
Vitest with `resolve: { conditions: ['browser'] }`, Storybook with `defineMeta()`, Playwright with `webServer` config.

## TypeScript
Add `lang="ts"`, configure `vitePreprocess`, set `tsconfig.json` with `target: ES2015`, `verbatimModuleSyntax: true`, `isolatedModules: true`. Type `$props()` with interfaces, use `generics` attribute, `Component`/`ComponentProps` types.

## Custom Elements
`<svelte:options customElement="my-element" />` with `customElement: true` config. Props as DOM properties/attributes. Register with `customElements.define()`. Limitations: encapsulated styles, not SSR-friendly, context doesn't cross boundaries.

## Svelte 4 Migration
Node 16+, TypeScript 5+, ESM only, stricter types, `tag` → `customElement`, `SvelteComponentTyped` → `SvelteComponent`, transitions local by default, preprocessors execute in order.

## Svelte 5 Migration
`let` → `$state()`, `$:` → `$derived()`/`$effect()`, `export let` → `let { prop } = $props()`, `on:click` → `onclick`, `<slot />` → `children` prop. Run `npx sv migrate svelte-5`.

## FAQ
Tutorial 5-10 min start, SvelteKit for routing/SSR, Tauri/Capacitor for mobile, `:global(...)` for global styles.