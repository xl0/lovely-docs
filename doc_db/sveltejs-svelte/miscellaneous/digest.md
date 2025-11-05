## Testing

**Vitest**: Configure `vite.config.js` with `resolve: { conditions: ['browser'] }` when `VITEST` env var is set. Name test files `.svelte.test.js` to use runes. Use `$effect.root()` and `flushSync()` for effect testing. Mount components with `mount(Component, { target, props })`. Use `@testing-library/svelte` for less brittle tests.

**Storybook**: Create stories with `defineMeta()` and test interactions via the `play` function.

**Playwright**: Configure `playwright.config.js` with `webServer` to start your app. Write tests using page locators and assertions.

## TypeScript

Add `lang="ts"` to script tags. For full support, configure `vitePreprocess` in `svelte.config.js`. Set `tsconfig.json`: `target: ES2015`, `verbatimModuleSyntax: true`, `isolatedModules: true`. Type `$props()` with interfaces, use `generics` attribute for generic components, and `Component`/`ComponentProps` types for component typing. Augment `svelte/elements` module for custom attributes.

## Custom Elements

Compile to web components with `customElement: true` in config. Specify tag name: `<svelte:options customElement="my-element" />`. Props exposed as DOM properties and attributes. Register with `customElements.define('my-element', MyElement.element)`.

Advanced options via object syntax: `tag` (auto-register), `shadow: "none"` (disable shadow DOM), `props` (per-property config), `extend` (customize class).

Limitations: styles encapsulated, not SSR-friendly, slotted content renders eagerly, context doesn't cross boundaries, avoid property names starting with `on`.

## Svelte 4 Migration

**Requirements**: Node 16+, TypeScript 5+. **Bundlers**: specify `browser` condition. **ESM only**: CJS removed. **Stricter types**: `createEventDispatcher`, `Action`, `ActionReturn`, `onMount`. **Custom elements**: `tag` → `customElement`. **Deprecated**: `SvelteComponentTyped` → `SvelteComponent`. **Transitions**: local by default, use `|global` for old behavior. **Slot bindings**: default and named slots no longer share bindings. **Preprocessors**: execute in order (markup, script, style per preprocessor); MDsveX must come first. **ESLint**: `eslint-plugin-svelte3` → `eslint-plugin-svelte`. **Other**: `inert` on outroing elements, `classList.toggle`/`CustomEvent` may need polyfills, `svelte.JSX` → `svelteHTML`.

## Svelte 5 Migration

**Reactivity**: `let` → `$state()`, `$:` → `$derived()` or `$effect()`. **Props**: `export let` → `let { prop } = $props()`. **Events**: `on:click` → `onclick`, `createEventDispatcher` → callback props. **Slots**: `<slot />` → `children` prop with `{@render children?.()}`. **Components**: `new Component()` → `mount(Component, { target })`. Run `npx sv migrate svelte-5` for automatic conversion.

## FAQ

**Getting Started**: Interactive tutorial (5-10 min to start, 1.5 hrs full). **Support**: Reference docs for syntax, Stack Overflow for code questions, Discord/Reddit for discussions. **Tooling**: Official VS Code extension, prettier-plugin-svelte, `@component` comments for documentation. **Routing**: SvelteKit is official (filesystem router, SSR, HMR). **Mobile**: Tauri or Capacitor with SvelteKit SPA. **Styling**: Unused styles removed automatically, use `:global(...)` for global styles. **HMR**: SvelteKit supports via Vite and svelte-hmr.