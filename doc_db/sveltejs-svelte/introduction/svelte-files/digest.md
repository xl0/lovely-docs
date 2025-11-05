## Structure

Svelte components are written in `.svelte` files using a superset of HTML. Each file can contain three optional sections: `<script>`, markup, and `<style>`.

## Script Blocks

**Instance-level script**: A `<script>` block contains JavaScript or TypeScript that runs when a component instance is created. Top-level variables can be referenced in markup. Use runes to declare component props and add reactivity.

**Module-level script**: A `<script module>` block runs once when the module first evaluates, not for each instance. Variables declared here can be referenced elsewhere in the component but not vice versa. You can export bindings from this block (but not `export default`).

```svelte
<script module>
	let total = 0;
</script>

<script>
	total += 1;
	console.log(`instantiated ${total} times`);
</script>
```

## Styles

CSS in a `<style>` block is scoped to that component only:

```svelte
<style>
	p {
		color: burlywood;
	}
</style>
```