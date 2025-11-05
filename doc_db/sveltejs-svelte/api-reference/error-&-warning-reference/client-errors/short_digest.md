## Client Error Messages

Runtime errors in Svelte:

**Reactivity:** `async_derived_orphan` (await outside effect), `derived_references_self`, `state_unsafe_mutation` (update in derived/template)

**Effects:** `effect_orphan` (outside effect context), `effect_update_depth_exceeded` (infinite loop from reading/writing same state - use `untrack()`), `effect_in_teardown`, `effect_in_unowned_derived`

**Binding:** `bind_invalid_checkbox_value` (use `bind:checked`), `bind_invalid_export` (use `bind:this`), `bind_not_bindable` (mark with `$bindable()`)

**Components:** `component_api_invalid_new` (no `new` in Svelte 5), `set_context_after_init` (must call during init)

**Other:** `each_key_duplicate`, `invalid_snippet` (null/undefined), `svelte_boundary_reset_onerror` (await tick before reset), `hydration_failed`