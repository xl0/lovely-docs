## Client Errors

**Reactivity**: `async_derived_orphan` (await outside effect), `derived_references_self`, `state_unsafe_mutation` (update in derived/template)

**Effects**: `effect_orphan` (outside effect context), `effect_update_depth_exceeded` (infinite loop—use `untrack()`), `effect_in_teardown`, `effect_in_unowned_derived`

**Binding**: `bind_invalid_checkbox_value` (use `bind:checked`), `bind_invalid_export` (use `bind:this`), `bind_not_bindable` (mark with `$bindable()`)

**Components**: `component_api_invalid_new` (no `new` in Svelte 5), `set_context_after_init` (call during init)

**Other**: `each_key_duplicate`, `invalid_snippet` (null/undefined), `svelte_boundary_reset_onerror`, `hydration_failed`

## Client Warnings

**State & Reactivity**: `console_log_state` (use `$inspect()` or `$state.snapshot()`), `await_reactivity_loss` (pass values as parameters), `await_waterfall` (create promises first, then await), `state_proxy_equality_mismatch` (proxies have different identity), `state_proxy_unmount` (use `$state.raw()`)

**Binding & Props**: `binding_property_non_reactive`, `ownership_invalid_binding` (use `bind:` in all intermediate components), `ownership_invalid_mutation` (use `bind:` or `$bindable()`)

**Hydration**: `hydration_attribute_changed`, `hydration_html_changed`, `hydration_mismatch` (server/client values must match)

**UI Elements**: `select_multiple_invalid_value` (must be array), `transition_slide_display` (requires `display: block/flex/grid`)

**Other**: `event_handler_invalid`, `invalid_raw_snippet_render`, `svelte_boundary_reset_noop`

## Compile Errors

**Animation**: `animate:` must be unique, only child of keyed `{#each}`, requires key

**Bindings**: `bind:group` and `bind:` only work with Identifier/MemberExpression/`{get,set}` pairs; cannot bind to constants

**Blocks**: `{#if}`, `{#each}`, `{#await}`, `{#key}`, `{#snippet}` must be properly opened/closed; use `else if` not `elseif`

**CSS**: `:global()` for scoping; cannot mix global/scoped selectors

**Props/State**: `$props()` and `$state()` only at top-level; cannot export reassigned state; no `$$` prefix

**Runes**: Invalid usage in non-runes mode, missing parentheses, invalid arguments

**Slots**: Cannot mix `<slot>` and `{@render}` tags; slot names must be static; `default` is reserved

**Snippets**: Cannot export snippets referencing component-level variables; no rest parameters

**Svelte Meta**: `<svelte:component>`, `<svelte:element>`, `<svelte:fragment>`, `<svelte:boundary>` attribute/placement rules

**HTML Structure**: Browser HTML repair breaks Svelte assumptions (e.g., `<div>` inside `<p>` auto-closes `<p>`)

## Compile Warnings

**Accessibility**: Avoid `accesskey`, `autofocus`; non-interactive elements with `onclick` need keyboard handlers and `tabindex`; `aria-activedescendant` needs `tabindex`; alt text shouldn't say "image"; `<video>` needs `<track kind="captions">`; labels need associated controls; headings/anchors need text; `onmouseover` needs `onfocus`, `onmouseout` needs `onblur`; no positive `tabindex` values

**Code Quality**: Components start with capital letter; use `$state()` for reactive variables; declare classes at top level; use `<script module>` not `<script context="module">`; use `{@render}` not `<slot>`; use `mount()`/`hydrate()` not component classes; avoid `<div>` in `<p>`, `<div>` in `<option>`, missing `<tbody>` in `<table>`; self-closing tags on non-void elements are ambiguous

## Shared Errors

**Context**: `missing_context` (context not set in parent), `set_context_after_init` (must call during init)

**Lifecycle**: `lifecycle_outside_component` (must call at top level of component script)

**Snippets**: `invalid_default_snippet` (can't use `{@render children()}` with parent `let:` directives), `snippet_without_render_tag` (use `{@render snippet()}`)

**Other**: `store_invalid_shape` (missing `subscribe` method), `svelte_element_invalid_this_value` (requires string)

## Shared Warnings

**Void Elements**: Cannot have content; children ignored

**State Snapshots**: `$state.snapshot` returns original values for uncloneable objects (DOM elements, window)

## Server Errors

**await_invalid**: Don't use `await` in components passed to `render()`; either await `render()` itself or wrap with `<svelte:boundary pending>`

**lifecycle_function_unavailable**: Methods like `mount` unavailable on server—don't call during render

**html_deprecated**: Use `body` instead of `html` property in server render results