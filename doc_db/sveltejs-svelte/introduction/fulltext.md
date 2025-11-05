

## Pages

### overview
Svelte is a compiler-based web UI framework that converts declarative components into optimized JavaScript.

Svelte is a compiler-based UI framework that transforms HTML, CSS, and JavaScript components into optimized code. Supports everything from components to full-stack apps with SvelteKit.

Example:
```svelte
<script>
	function greet() {
		alert('Welcome to Svelte!');
	}
</script>
<button onclick={greet}>click me</button>
<style>
	button { font-size: 2em; }
</style>
```

### getting-started
Instructions for setting up a new Svelte project using SvelteKit or Vite, with editor tooling and support resources.

Create a new project with `npx sv create myapp` using SvelteKit (recommended) or `npm create vite@latest` with Svelte option. Use VS Code extension for editor support or `sv check` from command line. Get help on Discord or Stack Overflow.

### svelte-files
Svelte components are written in .svelte files with optional script, markup, and style sections; scripts can be instance-level or module-level with different execution timing.

## Structure

`.svelte` files contain optional `<script>`, markup, and `<style>` sections.

## Scripts

- **`<script>`**: Instance-level code running per component creation. Use runes for props and reactivity.
- **`<script module>`**: Module-level code running once on module load. Can export bindings (not `export default`).

```svelte
<script module>
	let total = 0;
</script>

<script>
	total += 1;
</script>
```

## Styles

CSS in `<style>` blocks is scoped to the component.

### .svelte.js-and-.svelte.ts-files
Svelte modules (.svelte.js/.svelte.ts) enable reactive logic reuse through runes while maintaining module semantics.

.svelte.js and .svelte.ts files are modules that support runes for creating reusable reactive logic and sharing reactive state. Introduced in Svelte 5.

