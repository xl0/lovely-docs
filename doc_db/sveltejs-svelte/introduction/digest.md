## Overview

Svelte is a compiler-based UI framework that transforms HTML, CSS, and JavaScript components into optimized code. Supports everything from components to full-stack apps with SvelteKit.

## Getting Started

Create a new project with `npx sv create myapp` (SvelteKit recommended) or `npm create vite@latest` with Svelte option. Use VS Code extension for editor support or `sv check` from command line.

## Svelte Files

`.svelte` files contain optional `<script>`, markup, and `<style>` sections.

**Instance-level scripts** (`<script>`) run per component creation and use runes for props and reactivity.

**Module-level scripts** (`<script module>`) run once on module load and can export bindings.

CSS in `<style>` blocks is scoped to the component.

```svelte
<script module>
	let total = 0;
</script>

<script>
	total += 1;
</script>

<button onclick={() => alert('Welcome!')}>click me</button>

<style>
	button { font-size: 2em; }
</style>
```

## Svelte Modules

`.svelte.js` and `.svelte.ts` files support runes for creating reusable reactive logic and sharing reactive state.