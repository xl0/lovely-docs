## Client Warnings

- **assignment_value_stale**: `??=` evaluates to RHS, not assigned property. Separate into two statements.
- **await_reactivity_loss**: State after `await` in async functions not tracked. Pass as parameters.
- **await_waterfall**: Multiple `$derived(await)` create unnecessary waterfalls. Create promises first, await separately.
- **binding_property_non_reactive**: Binding to non-reactive properties.
- **console_log_state**: Use `$inspect()` or `$state.snapshot()` instead of logging `$state` proxies.
- **event_handler_invalid**: Handler must be a function.
- **hydration_attribute_changed**: Server/client attribute mismatch. Use `svelte-ignore` or ensure values match.
- **hydration_html_changed**: `{@html}` value differs server/client. Use `svelte-ignore` or match values.
- **hydration_mismatch**: UI structure doesn't match server render.
- **invalid_raw_snippet_render**: `createRawSnippet` must return single element HTML.
- **legacy_recursive_reactive_block**: Migrated `$:` accessing/updating same value may recurse as `$effect`.
- **lifecycle_double_unmount**: Unmounting unmounted component.
- **ownership_invalid_binding**: Use `bind:` when forwarding bindings between components.
- **ownership_invalid_mutation**: Don't mutate unbound props. Use `bind:`, callbacks, or `$bindable`.
- **select_multiple_invalid_value**: `<select multiple>` value must be array, null, or undefined.
- **state_proxy_equality_mismatch**: `$state()` proxies have different identity. `===` comparisons fail.
- **state_proxy_unmount**: Don't pass `$state` proxies to `unmount()`. Use `$state.raw()` if needed.
- **svelte_boundary_reset_noop**: `<svelte:boundary>` reset only works once.
- **transition_slide_display**: `slide` transition requires `display: block/flex/grid`.

## Shared Warnings

- **dynamic_void_element_content**: Void elements cannot have content.
- **state_snapshot_uncloneable**: `$state.snapshot()` can't clone some objects; returns original.