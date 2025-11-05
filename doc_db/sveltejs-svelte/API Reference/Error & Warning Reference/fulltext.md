

## Pages

### client-errors
Reference of runtime errors in Svelte 5 with guidance on binding, component API changes, reactive state constraints, and effect usage.

## Client-side Runtime Errors

Binding: Use `bind:checked` for checkboxes, `bind:this` for component access, mark properties with `$bindable()`.

Component API (Svelte 5): Cannot call methods on instances or use `new` to instantiate.

State: Cannot mutate state in `$derived()` or template expressions; use `$effect` for side-effects. Derived values cannot reference themselves.

Effects: Only usable during component initialization; cannot be in cleanup functions or unowned derived values.

Other: Keyed each blocks need unique keys, hydration can fail, snippets need null checks, runes only in `.svelte` files.

### client-warnings
Reference guide for Svelte client-side runtime warnings with explanations and fixes.

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

### compile-errors
Reference of all Svelte compiler error codes with messages and explanations.

## Compile Errors Reference

Complete list of Svelte compiler error codes organized by category:

**Animation**: `animation_duplicate`, `animation_invalid_placement`, `animation_missing_key`

**Attributes**: `attribute_contenteditable_dynamic`, `attribute_duplicate`, `attribute_empty_shorthand`, `attribute_invalid_event_handler`, `attribute_invalid_multiple`, `attribute_invalid_name`, `attribute_invalid_sequence_expression`, `attribute_invalid_type`, `attribute_unquoted_sequence`

**Bindings**: `bind_group_invalid_expression`, `bind_invalid_expression`, `bind_invalid_name`, `bind_invalid_parens`, `bind_invalid_target`, `bind_invalid_value`

**Blocks**: `block_duplicate_clause`, `block_invalid_continuation_placement`, `block_invalid_elseif`, `block_invalid_placement`, `block_unclosed`, `block_unexpected_character`, `block_unexpected_close`

**CSS**: `css_empty_declaration`, `css_global_block_invalid_list` (split `:global` and scoped selectors), `css_global_invalid_placement`, `css_selector_invalid`

**Each blocks**: `each_item_invalid_assignment` — in runes mode use array index: `array[i] = 4` instead of `entry = 4`

**Props/Exports**: `export_undefined`, `legacy_export_invalid` (use `$props()` instead of `export let`), `props_duplicate`, `props_invalid_placement`

**Runes**: `rune_invalid_arguments`, `rune_invalid_name`, `rune_invalid_usage`, `rune_missing_parentheses`, `rune_removed`, `rune_renamed`

**Slots**: `slot_attribute_duplicate`, `slot_attribute_invalid`, `slot_default_duplicate`, `slot_snippet_conflict` (cannot mix `<slot>` and `{@render}`)

**Snippets**: `snippet_invalid_export`, `snippet_parameter_assignment`, `snippet_shadowing_prop`

**State**: `state_field_duplicate`, `state_invalid_placement`, `state_invalid_export`

**Svelte meta tags**: `svelte_component_missing_this`, `svelte_element_missing_this`, `svelte_fragment_invalid_placement`, `svelte_options_invalid_customelement`

**Parsing**: `expected_identifier`, `js_parse_error`, `legacy_reactive_statement_invalid` (use `$derived`/`$effect` instead of `$:`), `mixed_event_handler_syntaxes`, `node_invalid_placement`, `typescript_invalid_feature`, `unexpected_eof`

### compile-warnings
Comprehensive reference of Svelte compiler warnings covering accessibility rules, attribute validation, and code quality checks.

## Accessibility (a11y_*)
Enforce accessible patterns: no `accesskey`, `autofocus`, or distracting elements; interactive elements need keyboard handlers and `tabindex`; labels need associated controls; media needs captions; ARIA attributes must match element roles and have correct types; no redundant roles.

## Attributes
Avoid `is` attribute; no `:` in attribute names; quoted component attributes will stringify; invalid HTML attributes.

## Code Quality
Empty blocks; lowercase component names; unused CSS (use `:global` to preserve); non-reactive state updates; deprecated syntax (`context="module"`, `<slot>`, `<svelte:component>`, `<svelte:self>`); HTML structure violations break hydration; reassigned state loses reactivity unless wrapped in function; removed/renamed compile options.

### server-errors
Certain lifecycle methods like mount cannot be invoked in server contexts and must be avoided during render.

## lifecycle_function_unavailable

Methods like `mount` are unavailable on the server. Don't call them during render—guard them for client-only execution.

### shared-errors
Reference documentation for common Svelte error messages with explanations and code examples.

## Common Svelte Errors

- **invalid_default_snippet**: Can't mix `{@render children(...)}` with parent `let:` directives; use named snippets
- **lifecycle_outside_component**: Lifecycle methods must be called at top level of component script, not in functions
- **snippet_without_render_tag**: Use `{@render snippet()}` not `{snippet}`; applies to snippet props and child components
- **invalid_snippet_arguments**: Snippets only via `{@render ...}`
- **store_invalid_shape**: Stores need `subscribe` method
- **svelte_element_invalid_this_value**: `<svelte:element this={...}>` requires string value

### shared-warnings
Documentation of two runtime warnings: void elements cannot have content, and $state.snapshot cannot clone certain objects.

## dynamic_void_element_content
Void elements like `<input>` cannot have content when used with `<svelte:element>`.

## state_snapshot_uncloneable
`$state.snapshot` returns the original value for uncloneable objects (DOM elements, `window`, etc.):
```js
const object = $state({ property: 'cloneable', window })
const snapshot = $state.snapshot(object); // window is not cloned
```

