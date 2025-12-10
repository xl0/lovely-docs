Svelte is a compiler-based framework for building web user interfaces. It transforms declarative components written in HTML, CSS, and JavaScript into optimized JavaScript code.

Example component:
```svelte
<script>
	function greet() {
		alert('Welcome to Svelte!');
	}
</script>

<button onclick={greet}>click me</button>

<style>
	button {
		font-size: 2em;
	}
</style>
```

Use cases range from standalone components to full-stack applications (via SvelteKit companion framework). Resources: interactive tutorial, playground for online experimentation, and StackBlitz for fully-featured development environment.