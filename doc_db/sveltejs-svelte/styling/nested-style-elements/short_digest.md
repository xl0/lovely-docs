Only one top-level `<style>` tag per component allowed. Nested `<style>` tags inside elements or logic blocks are inserted as-is without scoping, applying globally to matching DOM elements.

```svelte
<div>
	<style>
		div { color: red; }
	</style>
</div>
```