## Svelte Error Reference

- **invalid_default_snippet**: Can't use `{@render children()}` with parent `let:` directives; use named snippets
- **lifecycle_outside_component**: Lifecycle methods must be called at top level of component script, not in functions
- **missing_context**: Context not set in parent; `createContext()` get throws if set wasn't called
- **snippet_without_render_tag**: Use `{@render snippet()}` not `{snippet}`
- **store_invalid_shape**: Value missing `subscribe` method
- **svelte_element_invalid_this_value**: `<svelte:element this={...}>` requires string value