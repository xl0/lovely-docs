# Svelte Documentation

**Setup**: SvelteKit (`npx sv create myapp`) or Vite recommended.

**Runes**: `$state` (reactive), `$derived` (computed), `$effect` (side-effects), `$props()` (inputs), `$bindable()` (two-way), `$inspect()` (logging), `$host()` (custom elements).

**Template**: Expressions `{expr}`, conditionals `{#if}...{/if}`, loops `{#each items as item}...{/each}`, snippets `{#snippet name()}...{/snippet}`, directives: `bind:`, `use:`, `style:`, `class:`, `transition:`, `animate:`.

**Styling**: Auto-scoped, use `:global()` for global styles, CSS custom properties inherited.

**Special Elements**: `<svelte:boundary>` (error handling), `<svelte:window>` (window listeners), `<svelte:head>` (document head), `<svelte:element this={tag} />` (dynamic tags), `<svelte:options>` (compiler config).

**State**: Stores (`writable`, `readable`, `derived`), Context API (`setContext`/`getContext`).

**Lifecycle**: `onMount`, `onDestroy`, `tick()`, `mount()`, `unmount()`.

**TypeScript**: Add `lang="ts"`, configure `vitePreprocess`, use generics.

**Custom Elements**: `<svelte:options customElement="tag-name" />`.

**Svelte 5**: `let` → `$state`, `$:` → `$derived`/`$effect`, `export let` → `$props()`, `on:click` → `onclick`, `<slot />` → `children` prop.