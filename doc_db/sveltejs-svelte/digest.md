## Introduction
Svelte is a compiler-based UI framework transforming HTML, CSS, and JavaScript into optimized code. Create projects with `npx sv create myapp` (SvelteKit) or `npm create vite@latest`. `.svelte` files contain optional `<script>`, markup, and `<style>` sections. Instance scripts run per component creation; module scripts run once on load. CSS is scoped by default.

## Runes (Svelte 5)
`$`-prefixed compiler keywords for reactivity:
- `$state(value)` - Reactive state with deep reactivity for objects/arrays
- `$derived(expr)` - Auto-updating derived values
- `$effect(() => {})` - Side effects with automatic dependency tracking
- `$props()` - Receive component inputs with destructuring
- `$bindable()` - Enable bidirectional prop binding
- `$inspect(value)` - Development logging of value changes
- `$host()` - Access host element in custom elements

## Template Syntax
Lowercase tags are HTML; capitalized/dot-notation tags are components. Attributes support expressions with shorthand `{name}`. Events use `on:` prefix. Control flow: `{#if}`, `{#each}`, `{#key}`, `{#await}`. Snippets are reusable markup blocks: `{#snippet name(params)}...{/snippet}`, rendered with `{@render snippet()}`. Directives: `bind:` (two-way), `use:` (actions), `transition:`, `in:`/`out:`, `animate:`, `style:`, `class:`. Special tags: `{@const}`, `{@debug}`, `{@attach}`, `{@html}`.

## Styling
Component styles are scoped by default using hash-based classes. Use `:global(...)` for global styles or `:global` blocks. CSS custom properties inherit from parents: `--property-name` syntax with `var(--property-name, fallback)`. Only one top-level `<style>` per component; nested `<style>` tags apply globally.

## Special Elements
- `<svelte:boundary>` - Error handling with pending/failed snippets
- `<svelte:window>` - Window event listeners and property bindings (innerWidth, scrollY, etc.)
- `<svelte:document>` - Document listeners and readonly bindings
- `<svelte:body>` - Body event listeners
- `<svelte:head>` - Insert elements into document.head
- `<svelte:element this={tag}>` - Runtime-determined tag names
- `<svelte:options>` - Per-component compiler options

## Runtime APIs
**Stores**: `writable(initial)`, `readable(initial, start)`, `derived(sources, fn)`, `get(store)`. Access via `$` prefix in components.

**Context**: `setContext(key, value)` in parent, `getContext(key)` in child. Use `createContext<T>()` for type safety.

**Lifecycle**: `onMount(fn)`, `onDestroy(fn)`, `tick()`, `$effect.pre()`, `$effect()`.

**Imperative**: `mount(App, {target, props})`, `unmount(app, {outro: true})`, `render(App, {props})` (SSR), `hydrate(App, {target, props})`.

**Animations**: `flip()` for FLIP animations; `blur`, `fade`, `fly`, `scale`, `slide`, `draw`, `crossfade` transitions. `Spring` and `Tween` classes for motion.

**Reactive Built-ins**: `SvelteMap`, `SvelteSet`, `SvelteDate`, `SvelteURL`, `SvelteURLSearchParams`, `MediaQuery`.

## Advanced Topics
**Testing**: Vitest with `resolve: { conditions: ['browser'] }`, Storybook with `defineMeta()`, Playwright with `webServer` config.

**TypeScript**: Add `lang="ts"` to scripts. Configure `vitePreprocess` in `svelte.config.js`. Set `tsconfig.json`: `target: ES2015`, `verbatimModuleSyntax: true`, `isolatedModules: true`. Type `$props()` with interfaces, use `generics` attribute for generic components.

**Custom Elements**: Compile with `customElement: true`. Specify tag: `<svelte:options customElement="my-element" />`. Register with `customElements.define()`.

**Svelte 4 Migration**: Node 16+, TypeScript 5+. Specify `browser` condition in bundlers. ESM only. Stricter types. Transitions local by default (use `|global`). Slot bindings no longer shared. Preprocessors execute in order.

**Svelte 5 Migration**: `let` → `$state()`, `$:` → `$derived()`/`$effect()`, `export let` → `let { prop } = $props()`, `on:click` → `onclick`, `<slot />` → `children` prop, `new Component()` → `mount()`. Run `npx sv migrate svelte-5`.

## Compiler & Error Handling
**Compiler API**: `compile(source, options)`, `compileModule()`, `parse()`, `preprocess()`, `migrate()`. Options: `name`, `customElement`, `generate`, `dev`, `runes`, `css`, `namespace`.

**Error Reference**: Client errors (async_derived_orphan, state_unsafe_mutation, hydration_failed), compile errors (binding restrictions, rune placement), warnings (accessibility, code quality). Suppress with `<!-- svelte-ignore rule1, rule2 -->`.

## Legacy Mode (Svelte 3/4)
Top-level variables are reactive; use `$:` for reactive statements. Props declared with `export`. Access all props with `$$props`, non-declared with `$$restProps`. Check slots with `$$slots`. Events via `createEventDispatcher()`. Dynamic components with `<svelte:component this={MyComponent} />`. Imperative API: `new App({target, props})`, `app.$set()`, `app.$on()`, `app.$destroy()`. Server rendering: `App.render({props})` returns `{head, html, css}`.