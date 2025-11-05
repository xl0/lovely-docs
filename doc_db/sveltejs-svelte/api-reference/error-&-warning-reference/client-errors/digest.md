## Client-side Error Reference

Comprehensive list of runtime errors that can occur in Svelte applications:

**Reactivity & State Errors:**
- `async_derived_orphan`: Cannot use `await` in `$derived` outside an effect tree. Async deriveds require an effect context.
- `derived_references_self`: Derived values cannot reference themselves recursively.
- `state_unsafe_mutation`: Cannot update state inside `$derived`, `$inspect`, or template expressions. Use `$effect` for side effects instead.
- `state_descriptors_fixed`: Property descriptors on `$state` objects must have `value` and be `enumerable`, `configurable`, and `writable`.
- `state_prototype_fixed`: Cannot set prototype of `$state` objects.

**Effect Errors:**
- `effect_orphan`: Runes like `$effect` can only be used inside effects or during component initialization.
- `effect_in_teardown`: Cannot use runes inside effect cleanup functions.
- `effect_in_unowned_derived`: Effects cannot be created inside `$derived` values that weren't themselves created inside an effect.
- `effect_update_depth_exceeded`: Maximum update depth exceeded, typically from an effect reading and writing the same state. Example: `$effect(() => { count += 1; })` creates infinite loop. Use `untrack()` to read state without adding dependency.
- `effect_pending_outside_reaction`: `$effect.pending()` only works inside effects or deriveds.
- `flush_sync_in_effect`: Cannot call `flushSync()` inside an effect (only after state changes).

**Binding Errors:**
- `bind_invalid_checkbox_value`: Use `bind:checked` instead of `bind:value` for checkboxes.
- `bind_invalid_export`: Cannot use `bind:key` on component exports. Use `bind:this` instead.
- `bind_not_bindable`: Cannot bind to non-bindable properties. Mark properties as bindable with `let { key = $bindable() } = $props()`.
- `props_invalid_value`: Cannot bind to `undefined` when property has fallback value.
- `props_rest_readonly`: Rest element properties from `$props()` are readonly.

**Component & Lifecycle Errors:**
- `component_api_changed`: Calling methods on component instances no longer valid in Svelte 5.
- `component_api_invalid_new`: Cannot instantiate components with `new`. Set `compatibility.componentApi` to `4` for legacy support.
- `lifecycle_legacy_only`: Legacy lifecycle functions cannot be used in runes mode.
- `set_context_after_init`: `setContext` must be called during component initialization, not in effects or after `await`.

**Other Errors:**
- `each_key_duplicate`: Keyed each blocks have duplicate keys at specified indexes.
- `invalid_snippet`: Cannot render snippet that is `null` or `undefined`. Use optional chaining.
- `rune_outside_svelte`: Runes only available in `.svelte` and `.svelte.js/ts` files.
- `hydration_failed`: Failed to hydrate the application.
- `svelte_boundary_reset_onerror`: `<svelte:boundary>` reset function cannot be called synchronously in onerror. Use `await tick()` first.
- `experimental_async_fork`: `fork()` requires `experimental.async` compiler option.
- `fork_discarded`: Cannot commit a fork that was already discarded.
- `fork_timing`: Cannot create fork inside effect or when state changes pending.
- `get_abort_signal_outside_reaction`: `getAbortSignal()` only works inside effects or deriveds.