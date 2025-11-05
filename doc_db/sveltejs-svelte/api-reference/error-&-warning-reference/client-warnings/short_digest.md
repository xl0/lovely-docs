## Client Warnings

**assignment_value_stale**: `??=` operator evaluates to RHS, not the assigned property. Separate into two statements.

**await_reactivity_loss**: State read after `await` in hidden async functions isn't tracked. Pass values as parameters.

**await_waterfall**: Sequential awaits create unnecessary delays. Create promises first, then await them.

**binding_property_non_reactive**: Can't bind to non-reactive properties.

**console_log_state**: Use `$inspect()` or `$state.snapshot()` instead of logging `$state` proxies.

**event_handler_invalid**: Event handler must be a function.

**hydration_attribute_changed/hydration_html_changed**: Server/client values must match for certain attributes and `{@html}` blocks.

**hydration_mismatch**: DOM structure differs between server and client.

**invalid_raw_snippet_render**: `createRawSnippet` render must return single element HTML.

**ownership_invalid_binding**: Use `bind:` in all intermediate components, not just the leaf.

**ownership_invalid_mutation**: Use `bind:` or `$bindable()` instead of mutating unbound props.

**select_multiple_invalid_value**: `<select multiple>` value must be an array.

**state_proxy_equality_mismatch**: `$state()` proxies have different identity. Compare consistently.

**state_proxy_unmount**: Don't pass `$state` proxy to `unmount()`, use `$state.raw()`.

**svelte_boundary_reset_noop**: `<svelte:boundary>` reset function only works once.

**transition_slide_display**: `slide` transition requires `display: block/flex/grid`, not `inline` or `table`.