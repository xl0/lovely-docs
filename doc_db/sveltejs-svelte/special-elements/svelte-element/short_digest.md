## `<svelte:element>` Component

Renders a DOM element with a runtime-determined tag name via the `this` prop.

```svelte
<svelte:element this={tag} />
```

- If `this` is nullish, nothing renders
- Only `bind:this` binding supported
- Void elements cannot have children
- Use `xmlns` attribute for SVG: `<svelte:element this={tag} xmlns="http://www.w3.org/2000/svg" />`
- `this` must be a valid DOM tag name