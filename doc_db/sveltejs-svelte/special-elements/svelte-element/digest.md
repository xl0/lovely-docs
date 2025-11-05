## `<svelte:element>` Component

Renders a DOM element whose tag name is determined at runtime via the `this` prop.

**Basic usage:**
```svelte
<script>
	let tag = $state('hr');
</script>

<svelte:element this={tag}>
	Content here
</svelte:element>
```

**Key behaviors:**
- If `this` is nullish, the element and children are not rendered
- Only `bind:this` binding is supported; other Svelte bindings don't work with generic elements
- All properties and event listeners are applied to the rendered element
- If `this` is a void element (like `br`, `hr`) and has children, a runtime error is thrown in development

**Namespace handling:**
For SVG or other XML namespaces, explicitly set the namespace:
```svelte
<svelte:element this={tag} xmlns="http://www.w3.org/2000/svg" />
```

**Constraints:**
- `this` must be a valid DOM element tag name
- Invalid values like `#text` or `svelte:head` will not work