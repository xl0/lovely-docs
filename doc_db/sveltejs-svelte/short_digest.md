## Core Concepts
Svelte is a compiler-based UI framework. `.svelte` files contain `<script>`, markup, and `<style>` sections with scoped CSS by default.

## Svelte 5 Runes
`$state()` - reactive state, `$derived()` - computed values, `$effect()` - side effects, `$props()` - component inputs, `$bindable()` - two-way binding, `$inspect()` - debug logging.

## Template Syntax
Control flow: `{#if}`, `{#each}`, `{#key}`, `{#await}`. Snippets: `{#snippet name()}...{/snippet}` rendered with `{@render}`. Directives: `bind:`, `use:`, `transition:`, `animate:`, `style:`, `class:`. Special elements: `<svelte:window>`, `<svelte:document>`, `<svelte:head>`, `<svelte:boundary>`.

## Runtime APIs
**Stores**: `writable()`, `readable()`, `derived()`, accessed via `$` prefix. **Context**: `setContext(key, value)`, `getContext(key)`. **Lifecycle**: `onMount()`, `onDestroy()`, `tick()`. **Imperative**: `mount()`, `unmount()`, `render()`, `hydrate()`. **Animations**: `flip()`, transitions (`fade`, `fly`, `scale`, etc.), `Spring`/`Tween` classes.

## Advanced
**TypeScript**: Add `lang="ts"`, configure `vitePreprocess`. **Custom Elements**: `customElement: true` option. **Testing**: Vitest, Storybook, Playwright. **Migration**: Svelte 5 uses `$state()` instead of `let`, `$derived()` instead of `$:`, `$props()` instead of `export let`, callback props instead of `createEventDispatcher()`.

## Legacy Mode (Svelte 3/4)
Reactive variables with `$:` statements. Props via `export let`. Events with `createEventDispatcher()`. Imperative: `new App({target, props})`, `app.$set()`, `app.$destroy()`.