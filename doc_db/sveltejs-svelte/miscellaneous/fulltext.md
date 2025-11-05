

## Pages

### testing
Testing strategies for Svelte: unit/component tests with Vitest, component documentation with Storybook, and end-to-end tests with Playwright.

## Vitest Unit & Component Tests

Configure `vite.config.js` with `resolve: { conditions: ['browser'] }` when `VITEST` env var is set. Name test files `.svelte.test.js` to use runes. Use `$effect.root()` and `flushSync()` for effect testing.

Mount components with `mount(Component, { target, props })`. Use `@testing-library/svelte` for less brittle tests.

## Storybook

Create stories with `defineMeta()` and test interactions via the `play` function.

## Playwright E2E

Configure `playwright.config.js` with `webServer` to start your app. Write tests using page locators and assertions.

### typescript
How to use TypeScript in Svelte components, configure preprocessors, type props and state, and work with component types.

## TypeScript in Svelte

Add `lang="ts"` to script tags for type-only features. For full TypeScript support, configure `vitePreprocess` in `svelte.config.js`.

Set `tsconfig.json`: `target: ES2015`, `verbatimModuleSyntax: true`, `isolatedModules: true`.

Type `$props()` with interfaces, use `generics` attribute for generic components, and `Component`/`ComponentProps` types for component typing.

Augment `svelte/elements` module to add custom attributes or experimental features.

### custom-elements
How to compile Svelte components as web components and configure their behavior, properties, and lifecycle.

## Custom Elements

Compile Svelte components to web components with `customElement: true`. Specify tag name in `<svelte:options customElement="my-element" />`. Props are exposed as DOM properties and attributes.

```svelte
<svelte:options customElement="my-element" />
<script>
	let { name = 'world' } = $props();
</script>
<h1>Hello {name}!</h1>
```

Register with `customElements.define('my-element', MyElement.element)`.

## Configuration

Use object syntax for advanced options:
- `tag` - Auto-register with this name
- `shadow: "none"` - Disable shadow DOM
- `props` - Configure per-property: `attribute`, `reflect`, `type`
- `extend` - Function to customize the class

## Key Limitations

- Styles are encapsulated; global styles don't apply
- Not SSR-friendly
- Slotted content renders eagerly
- Context doesn't cross custom element boundaries
- Avoid property names starting with `on`

### svelte-4-migration-guide
Breaking changes and migration steps for upgrading from Svelte 3 to Svelte 4, including minimum version requirements, stricter types, API changes, and configuration updates.

## Key Changes
- **Requirements**: Node 16+, TypeScript 5+, updated build tools
- **Bundlers**: Must specify `browser` condition
- **CJS Removed**: ESM only
- **Stricter Types**: `createEventDispatcher`, `Action`, `ActionReturn`, `onMount` have stricter typing
- **Custom Elements**: `tag` → `customElement` option
- **SvelteComponentTyped**: Deprecated, use `SvelteComponent`
- **Transitions**: Local by default, use `|global` for old behavior
- **Slot Bindings**: Default and named slots no longer share bindings
- **Preprocessors**: Execute in order (markup, script, style per preprocessor); MDsveX must come first
- **ESLint**: Migrate from `eslint-plugin-svelte3` to `eslint-plugin-svelte`
- **Other**: `inert` on outroing elements, `classList.toggle`/`CustomEvent` may need polyfills, `svelte.JSX` → `svelteHTML`

### svelte-5-migration-guide
Svelte 5 replaces implicit reactivity with explicit runes ($state, $derived, $effect), changes event handling from directives to properties, replaces slots with snippets, converts components from classes to functions, and requires modern browser features.

## Key Changes

**Reactivity**: `let` → `$state()`, `$:` → `$derived()` or `$effect()`

**Props**: `export let` → `let { prop } = $props()`

**Events**: `on:click` → `onclick`, `createEventDispatcher` → callback props

**Slots**: `<slot />` → `children` prop with `{@render children?.()}`

**Components**: `new Component()` → `mount(Component, { target })`

**Migration**: Run `npx sv migrate svelte-5` for automatic conversion

### frequently-asked-questions
Common questions about learning Svelte, getting support, tooling, testing strategies, routing, mobile development, styling, and hot module reloading.

**Getting Started**: Interactive tutorial (5-10 min to start, 1.5 hrs full).

**Support**: Reference docs for syntax, Stack Overflow for code questions, Discord/Reddit for discussions.

**Tooling**: Official VS Code extension, prettier-plugin-svelte for formatting, `@component` comments for documentation.

**Testing**: Unit tests (Vitest), Component tests (jsdom/Playwright/Cypress), E2E tests (Playwright).

**Routing**: SvelteKit is official (filesystem router, SSR, HMR).

**Mobile**: Use Tauri or Capacitor with SvelteKit SPA. Svelte Native not supported in Svelte 5.

**Styling**: Unused styles removed automatically. Use `:global(...)` for global styles.

**HMR**: SvelteKit supports out of the box via Vite and svelte-hmr.

