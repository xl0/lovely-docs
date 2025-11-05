## Custom Elements

Compile Svelte components to web components with `customElement: true`. Specify tag name in `<svelte:options customElement="my-element" />`. Props are exposed as DOM properties and attributes.

```svelte
<svelte:options customElement="my-element" />
<script>
	let { name = 'world' } = $props();
</script>
<h1>Hello {name}!</h1>
```

Register with `customElements.define('my-element', MyElement.element)`.

## Configuration

Use object syntax for advanced options:
- `tag` - Auto-register with this name
- `shadow: "none"` - Disable shadow DOM
- `props` - Configure per-property: `attribute`, `reflect`, `type`
- `extend` - Function to customize the class

## Key Limitations

- Styles are encapsulated; global styles don't apply
- Not SSR-friendly
- Slotted content renders eagerly
- Context doesn't cross custom element boundaries
- Avoid property names starting with `on`