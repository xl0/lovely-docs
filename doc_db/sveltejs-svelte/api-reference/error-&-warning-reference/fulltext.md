

## Pages

### client-errors
Reference documentation for all client-side runtime errors in Svelte with explanations and solutions.

## Client Error Messages

Runtime errors in Svelte:

**Reactivity:** `async_derived_orphan` (await outside effect), `derived_references_self`, `state_unsafe_mutation` (update in derived/template)

**Effects:** `effect_orphan` (outside effect context), `effect_update_depth_exceeded` (infinite loop from reading/writing same state - use `untrack()`), `effect_in_teardown`, `effect_in_unowned_derived`

**Binding:** `bind_invalid_checkbox_value` (use `bind:checked`), `bind_invalid_export` (use `bind:this`), `bind_not_bindable` (mark with `$bindable()`)

**Components:** `component_api_invalid_new` (no `new` in Svelte 5), `set_context_after_init` (must call during init)

**Other:** `each_key_duplicate`, `invalid_snippet` (null/undefined), `svelte_boundary_reset_onerror` (await tick before reset), `hydration_failed`

### client-warnings
Reference documentation for all client-side warnings in Svelte with explanations and fixes.

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

### compile-errors
Comprehensive reference of all Svelte compiler error messages with explanations and examples.

## Compile Error Reference

Complete list of Svelte compiler errors organized by category:

**Animation**: `animate:` directive must be unique, only child of keyed `{#each}`, and requires key

**Attributes**: Validation for contenteditable, multiple, type, event handlers, sequences, and quoting

**Bindings**: `bind:group` and `bind:` only work with Identifier/MemberExpression/`{get,set}` pairs; cannot bind to constants

**Blocks**: `{#if}`, `{#each}`, `{#await}`, `{#key}`, `{#snippet}` must be properly opened/closed; use `else if` not `elseif`

**CSS**: `:global()` rules for scoping; cannot mix global/scoped selectors; nesting selectors placement

**Const Tags**: `{@const}` must be single declaration in specific block locations; scope limited to declaring block

**Each Blocks**: In runes mode, cannot reassign each argument; use `array[i]` instead of `entry`

**Props/State**: `$props()` and `$state()` only at top-level; cannot export reassigned state; no `$$` prefix

**Runes**: Invalid usage in non-runes mode, missing parentheses, invalid arguments, removed/renamed runes

**Slots**: Cannot mix `<slot>` and `{@render}` tags; slot names must be static; `default` is reserved

**Snippets**: Cannot export snippets referencing component-level variables; no rest parameters; cannot shadow props

**Svelte Meta**: `<svelte:component>`, `<svelte:element>`, `<svelte:fragment>`, `<svelte:boundary>` attribute/placement rules

**HTML Structure**: Browser HTML repair breaks Svelte assumptions (e.g., `<div>` inside `<p>` auto-closes `<p>`)

### compile-warnings
Reference of all Svelte compiler warnings covering accessibility, code quality, deprecated features, and best practices.

## Accessibility (a11y_*)
- Avoid `accesskey`, `autofocus`
- Non-interactive elements with `onclick` need keyboard handlers and `tabindex`; prefer `<button>`/`<a>`
- `aria-activedescendant` needs `tabindex`
- Reserved elements (`<meta>`, `<html>`, `<script>`, `<style>`) shouldn't have `aria-*` or `role`
- Alt text shouldn't say "image"/"picture"/"photo"
- `<video>` needs `<track kind="captions">`
- Labels need associated controls via wrapping or `for` attribute
- Headings/anchors need text content
- `onmouseover` needs `onfocus`, `onmouseout` needs `onblur`
- Don't mix interactive/non-interactive elements with wrong roles
- No positive `tabindex` values
- ARIA attributes must match role requirements

## Code Quality
- Components must start with capital letter
- Use `$state()` for reactive variables
- Declare classes at top level
- Use `<script module>` not `<script context="module">`
- Use `{@render}` not `<slot>`
- Use `mount()`/`hydrate()` not component classes
- HTML structure violations cause hydration issues: `<div>` in `<p>`, `<div>` in `<option>`, missing `<tbody>` in `<table>`
- State referenced after reassignment captures only initial value; wrap in function
- Unused CSS selectors removed; use `:global` to preserve
- Self-closing tags on non-void elements are ambiguous; use explicit closing tags

### server-errors
Common server-side rendering errors in Svelte and how to resolve them.

**await_invalid**: Don't use `await` in components passed to `render()`. Either await `render()` itself or wrap with `<svelte:boundary pending>`.

**html_deprecated**: Use `body` instead of `html` property in server render results.

**lifecycle_function_unavailable**: Methods like `mount` are unavailable on the server—don't call them during render.

### shared-errors
Reference documentation for common Svelte error messages with explanations and fixes.

## Svelte Error Reference

- **invalid_default_snippet**: Can't use `{@render children()}` with parent `let:` directives; use named snippets
- **lifecycle_outside_component**: Lifecycle methods must be called at top level of component script, not in functions
- **missing_context**: Context not set in parent; `createContext()` get throws if set wasn't called
- **snippet_without_render_tag**: Use `{@render snippet()}` not `{snippet}`
- **store_invalid_shape**: Value missing `subscribe` method
- **svelte_element_invalid_this_value**: `<svelte:element this={...}>` requires string value

### shared-warnings
Documentation of two Svelte warnings: void elements cannot have content, and $state.snapshot cannot clone certain objects like DOM elements.

## dynamic_void_element_content
Void elements like `<input>` cannot have content; children are ignored.

## state_snapshot_uncloneable
`$state.snapshot` returns original values for uncloneable objects (e.g., DOM elements):
```js
const object = $state({ property: 'cloneable', window })
const snapshot = $state.snapshot(object); // window is not cloned
```

