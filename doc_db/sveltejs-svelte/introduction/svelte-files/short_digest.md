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