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