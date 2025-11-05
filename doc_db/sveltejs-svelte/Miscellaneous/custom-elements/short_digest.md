## Custom Elements

Compile Svelte components to web components with `customElement: true` and `<svelte:options customElement="tag-name" />`. Props are exposed as DOM properties and attributes.

Advanced configuration via object in `<svelte:options>`:
- `tag` - Auto-register with this tag name
- `shadow: "none"` - Disable shadow DOM
- `props` - Configure per-property: `attribute`, `reflect`, `type`
- `extend` - Function to extend the custom element class

```svelte
<svelte:options customElement={{ tag: 'my-element', props: { name: { reflect: true } } }} />
```

Key limitations: styles are encapsulated, not SSR-friendly, slotted content renders eagerly, context doesn't cross custom element boundaries, avoid property names starting with `on`.