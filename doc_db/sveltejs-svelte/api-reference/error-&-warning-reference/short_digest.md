## Client Errors & Warnings

**Reactivity**: `async_derived_orphan`, `state_unsafe_mutation`, `effect_update_depth_exceeded` (use `untrack()`)

**Binding**: `bind_not_bindable` (mark with `$bindable()`), `ownership_invalid_binding` (use `bind:` in all intermediate components)

**State**: `console_log_state` (use `$inspect()` or `$state.snapshot()`), `state_proxy_equality_mismatch`, `state_proxy_unmount` (use `$state.raw()`)

**Hydration**: `hydration_mismatch`, `hydration_attribute_changed`, `hydration_html_changed`

## Compile Errors & Warnings

**Blocks**: `{#if}`, `{#each}`, `{#await}`, `{#key}`, `{#snippet}` must be properly opened/closed; use `else if` not `elseif`

**Bindings**: `bind:` only works with Identifier/MemberExpression/`{get,set}` pairs; cannot bind to constants

**Props/State**: `$props()` and `$state()` only at top-level; cannot export reassigned state

**Slots**: Cannot mix `<slot>` and `{@render}` tags; slot names must be static

**Accessibility**: Avoid `accesskey`, `autofocus`; non-interactive elements with `onclick` need keyboard handlers; `<video>` needs `<track kind="captions">`

**HTML Structure**: Avoid `<div>` in `<p>`, `<div>` in `<option>`, missing `<tbody>` in `<table>`

## Shared Errors

**Context**: `missing_context`, `set_context_after_init` (call during init)

**Lifecycle**: `lifecycle_outside_component` (call at top level)

**Snippets**: `invalid_default_snippet` (can't use `{@render children()}` with parent `let:`), `snippet_without_render_tag` (use `{@render snippet()}`)

## Server Errors

**await_invalid**: Don't use `await` in components passed to `render()`; wrap with `<svelte:boundary pending>`

**lifecycle_function_unavailable**: Don't call `mount` during server render