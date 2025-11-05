## Client Errors
- **async_derived_orphan**: Async deriveds must be created inside effects
- **bind_invalid_checkbox_value**: Use `bind:checked` not `bind:value` for checkboxes
- **bind_invalid_export**: Use `bind:this` then access property, not `bind:key`
- **bind_not_bindable**: Mark properties bindable with `let { key = $bindable() } = $props()`
- **component_api_changed/invalid_new**: Components are no longer classes in Svelte 5
- **derived_references_self**: Deriveds cannot reference themselves
- **each_key_duplicate**: Keyed each blocks need unique keys
- **effect_update_depth_exceeded**: Effect reads and writes same state. Solution: don't use `$state` for the value, or use `untrack()`. Example: `$effect(() => { count += 1; })` loops infinitely
- **flush_sync_in_effect**: Cannot use `flushSync()` inside effects
- **invalid_snippet**: Cannot render null/undefined snippets, use `{@render snippet?.()}`
- **props_invalid_value**: Cannot bind `undefined` to props with fallback values
- **rune_outside_svelte**: Runes only work in `.svelte` and `.svelte.js/ts` files
- **set_context_after_init**: `setContext` must be called during initialization, not in effects
- **state_unsafe_mutation**: Cannot update state in `$derived(...)` or templates. Solution: make everything derived: `let even = $derived(count % 2 === 0); let odd = $derived(!even);`
- **svelte_boundary_reset_onerror**: Don't call reset synchronously in onerror, use `await tick()` first

## Server Errors
- **await_invalid**: Async work in sync render. Await `render()` or wrap in `<svelte:boundary>`
- **html_deprecated**: Use `body` instead of `html` property

## Shared Errors
- **invalid_default_snippet**: Cannot use `{@render children(...)}` with `let:` directives
- **lifecycle_outside_component**: Lifecycle methods only work at top level of instance script
- **missing_context**: Context not set in parent with `set()`
- **snippet_without_render_tag**: Use `{@render snippet()}` not `{snippet}`
- **store_invalid_shape**: Value must have `subscribe` method