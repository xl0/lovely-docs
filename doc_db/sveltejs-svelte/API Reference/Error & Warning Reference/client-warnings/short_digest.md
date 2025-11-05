## Client Warnings

**assignment_value_stale**: Nullish coalescing assignment (`??=`) evaluates to the RHS, not the assigned property. Separate into two statements.

**binding_property_non_reactive**: Binding targets non-reactive property.

**console_log_state**: Use `$inspect()` or `$state.snapshot()` instead of logging `$state` proxies.

**event_handler_invalid**: Event handler is not a function.

**hydration_attribute_changed/hydration_html_changed**: Server/client values differ. Ensure they match or use `svelte-ignore`. Force update by unsetting and resetting in `$effect`.

**hydration_mismatch**: DOM structure doesn't match server render.

**invalid_raw_snippet_render**: `createRawSnippet` render must return single element HTML.

**legacy_recursive_reactive_block**: Migrated `$:` block accesses and updates same value, may cause recursion.

**lifecycle_double_unmount**: Unmounting unmounted component.

**ownership_invalid_binding**: Use `bind:` in parent instead of just passing property.

**ownership_invalid_mutation**: Use `bind:` or callbacks instead of mutating unbound props, or mark as `$bindable`.

**select_multiple_invalid_value**: `<select multiple>` value must be array or null/undefined.

**state_proxy_equality_mismatch**: `$state()` proxies have different identity. Compare consistently.

**transition_slide_display**: `slide` transition requires `display: block/flex/grid`, not `inline/*` or `table/*`.