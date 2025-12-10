## Structure

Svelte components are written in `.svelte` files using a superset of HTML. All three sections — script, styles and markup — are optional.

```svelte
<script module>
	// module-level logic (rarely used)
</script>

<script>
	// instance-level logic
</script>

<!-- markup -->

<style>
	/* scoped styles */
</style>
```

## `<script>`

Contains JavaScript or TypeScript (add `lang="ts"` attribute) that runs when a component instance is created. Top-level variables can be referenced in markup. Use runes to declare component props and add reactivity.

## `<script module>`

Runs once when the module first evaluates, not for each component instance. Variables declared here can be referenced elsewhere in the component, but not vice versa.

```svelte
<script module>
	let total = 0;
</script>

<script>
	total += 1;
	console.log(`instantiated ${total} times`);
</script>
```

You can `export` bindings from this block (they become module exports), but not `export default` since the default export is the component itself.

**TypeScript note:** When importing exports from a `module` block into a `.ts` file, ensure your editor setup recognizes them (VS Code extension and IntelliJ plugin handle this; other editors may need the TypeScript editor plugin).

**Legacy:** Svelte 4 used `<script context="module">`.

## `<style>`

CSS is scoped to the component:

```svelte
<style>
	p {
		color: burlywood; /* only affects <p> in this component */
	}
</style>
```