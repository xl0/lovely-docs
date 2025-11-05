# Svelte Documentation

## Project Setup
Create projects with SvelteKit (`npx sv create myapp`) or Vite. Vite is recommended over Rollup/Webpack.

## Component Structure
`.svelte` files contain optional `<script>`, `<style>`, and markup sections. `<script module>` runs once at module load; regular `<script>` runs per instance. Styles are automatically scoped with hash-based classes.

## Runes (Reactivity System)
`$state` creates reactive variables (arrays/objects become deep proxies). `$derived` declares computed state that auto-updates. `$effect` runs side-effect functions with automatic dependency tracking and teardown support. `$props()` receives component inputs with destructuring. `$bindable()` marks props for two-way binding. `$inspect()` provides reactive logging. `$host()` accesses custom element host.

## Template Syntax
- **Markup**: Lowercase tags are HTML; capitalized/dot-notation are components. Spread attributes: `<Widget {...things} />`
- **Expressions**: `{expression}` for values, `{@html}` for raw HTML
- **Conditionals**: `{#if}...{:else if}...{:else}...{/if}`
- **Loops**: `{#each items as item (item.id)}...{:else}...{/each}` with optional keying
- **Async**: `{#await promise}...{:then value}...{:catch error}...{/await}`
- **Snippets**: `{#snippet name(params)}...{/snippet}` reusable markup, rendered with `{@render name()}`
- **Directives**:
  - `bind:` two-way binding (value, checked, group, files, media properties, dimensions)
  - `use:` actions on mount with setup/teardown
  - `style:` inline styles with modifiers like `|important`
  - `class:` conditional classes
  - `transition:` bidirectional animations (fade, fly, slide, scale, draw, crossfade)
  - `in:/out:` non-bidirectional transitions
  - `animate:` reordering animations in keyed blocks
  - `{@const}` local constants, `{@debug}` logging, `{@attach}` reactive functions

## Styling
Styles are automatically scoped. Use `:global(selector)` for global styles. CSS custom properties inherit from parents. Nested `<style>` tags bypass scoping and apply globally.

## Special Elements
- `<svelte:boundary>` catches rendering/update/effect errors with `failed` snippet or `onerror`
- `<svelte:window>` attaches listeners to window with bindable properties (innerWidth, scrollY, online, etc.)
- `<svelte:document>` attaches to document with bindable readonly properties (activeElement, visibilityState)
- `<svelte:body>` attaches to document.body
- `<svelte:head>` inserts into document.head
- `<svelte:element this={tag} />` renders runtime-determined tag names
- `<svelte:options>` specifies compiler options (runes, namespace, customElement, css)

## State Management
**Stores**: `writable(initial)`, `readable(initial, startFn)`, `derived(stores, callback)`, `readonly(store)`, `get(store)`. Access via `$` prefix. Store contract: `.subscribe(fn)` returning unsubscribe, optionally `.set()`.

**Context API**: `setContext(key, value)` parent-to-child, `getContext(key)` child access. Request-isolated for SSR safety.

## Lifecycle & Imperative APIs
- `onMount` runs on DOM mount, returns cleanup function, doesn't run on server
- `onDestroy` runs before unmount, only hook running on server
- `tick()` returns promise after pending state changes apply
- `mount(Component, options)` instantiates and mounts component
- `unmount(component)` removes mounted component
- `render(Component, options)` server-only, returns `{ body, head }`
- `hydrate(Component, options)` reuses server-rendered HTML

## TypeScript
Add `lang="ts"` to script tags. Configure `vitePreprocess` in `svelte.config.js`. Use generics: `<script lang="ts" generics="Item extends { text: string }">`. Extend DOM types in `.d.ts` via `svelteHTML` namespace.

## Custom Elements
Compile to web components with `<svelte:options customElement="tag-name" />`. Props exposed as DOM properties and attributes. Configure per-property: `attribute`, `reflect`, `type`.

## Testing
**Vitest**: Wrap effect tests in `$effect.root()`, use `flushSync()` for sync execution. **Component Testing**: Use `mount()` API or `@testing-library/svelte`. **Playwright E2E**: Configure `playwright.config.js`.

## Svelte 5 Migration
- Reactivity: `let` → `$state`, `$:` → `$derived`/`$effect`, `export let` → `$props()`
- Events: `on:click` → `onclick`, `createEventDispatcher` → callback props
- Slots: `<slot />` → `children` prop with `{@render}`, named slots → props, `let:` → snippets
- Components: Functions not classes; use `mount(App, {target})` instead of `new App({target})`
- Runes mode: No export bindings, `$bindable()` required for two-way binding, stricter HTML/attributes

## Core Modules
`svelte` (main), `svelte/action` (custom actions), `svelte/animate` (animations), `svelte/compiler` (programmatic compilation), `svelte/easing` (easing functions), `svelte/motion` (smooth animations), `svelte/reactivity` (reactive Map/Set/URL), `svelte/server` (SSR), `svelte/store` (state management), `svelte/transition` (transitions)

## Error Handling
Suppress warnings with `<!-- svelte-ignore <code> -->` comments supporting multiple comma-separated codes.