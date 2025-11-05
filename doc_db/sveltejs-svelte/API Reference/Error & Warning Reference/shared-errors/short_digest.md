## Common Svelte Errors

- **invalid_default_snippet**: Can't mix `{@render children(...)}` with parent `let:` directives; use named snippets
- **lifecycle_outside_component**: Lifecycle methods must be called at top level of component script, not in functions
- **snippet_without_render_tag**: Use `{@render snippet()}` not `{snippet}`; applies to snippet props and child components
- **invalid_snippet_arguments**: Snippets only via `{@render ...}`
- **store_invalid_shape**: Stores need `subscribe` method
- **svelte_element_invalid_this_value**: `<svelte:element this={...}>` requires string value