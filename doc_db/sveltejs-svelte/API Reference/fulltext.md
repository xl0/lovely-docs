
## Directories

### Error & Warning Reference
Complete reference of Svelte compiler and runtime errors, warnings, and common mistakes with fixes.

## Client-side Runtime Errors

**Binding**: Use `bind:checked` for checkboxes, `bind:this` for component access, mark properties with `$bindable()`.

**Component API**: Cannot call methods on instances or use `new` to instantiate components.

**State**: Cannot mutate state in `$derived()` or template expressions; use `$effect` for side-effects. Derived values cannot reference themselves.

**Effects**: Only usable during component initialization; cannot be in cleanup functions or unowned derived values.

**Other**: Keyed each blocks need unique keys, hydration can fail, snippets need null checks, runes only in `.svelte` files.

## Client-side Runtime Warnings

**assignment_value_stale**: Nullish coalescing assignment (`??=`) evaluates to RHS, not assigned property. Separate into two statements.

**binding_property_non_reactive**: Binding targets non-reactive property.

**console_log_state**: Use `$inspect()` or `$state.snapshot()` instead of logging `$state` proxies.

**event_handler_invalid**: Event handler is not a function.

**hydration_attribute_changed/hydration_html_changed**: Server/client values differ. Ensure they match or use `svelte-ignore`.

**hydration_mismatch**: DOM structure doesn't match server render.

**invalid_raw_snippet_render**: `createRawSnippet` render must return single element HTML.

**legacy_recursive_reactive_block**: Migrated `$:` block accesses and updates same value, may cause recursion.

**lifecycle_double_unmount**: Unmounting unmounted component.

**ownership_invalid_binding**: Use `bind:` in parent instead of just passing property.

**ownership_invalid_mutation**: Use `bind:` or callbacks instead of mutating unbound props, or mark as `$bindable`.

**select_multiple_invalid_value**: `<select multiple>` value must be array or null/undefined.

**state_proxy_equality_mismatch**: `$state()` proxies have different identity. Compare consistently.

**transition_slide_display**: `slide` transition requires `display: block/flex/grid`, not `inline/*` or `table/*`.

## Compile Errors

**Animation**: `animation_duplicate`, `animation_invalid_placement`, `animation_missing_key`

**Attributes**: `attribute_contenteditable_dynamic`, `attribute_duplicate`, `attribute_empty_shorthand`, `attribute_invalid_event_handler`, `attribute_invalid_multiple`, `attribute_invalid_name`, `attribute_invalid_sequence_expression`, `attribute_invalid_type`, `attribute_unquoted_sequence`

**Bindings**: `bind_group_invalid_expression`, `bind_invalid_expression`, `bind_invalid_name`, `bind_invalid_parens`, `bind_invalid_target`, `bind_invalid_value`

**Blocks**: `block_duplicate_clause`, `block_invalid_continuation_placement`, `block_invalid_elseif`, `block_invalid_placement`, `block_unclosed`, `block_unexpected_character`, `block_unexpected_close`

**CSS**: `css_empty_declaration`, `css_global_block_invalid_list` (split `:global` and scoped selectors), `css_global_invalid_placement`, `css_selector_invalid`

**Each blocks**: `each_item_invalid_assignment` — use array index: `array[i] = 4` instead of `entry = 4`

**Props/Exports**: `export_undefined`, `legacy_export_invalid` (use `$props()` instead of `export let`), `props_duplicate`, `props_invalid_placement`

**Runes**: `rune_invalid_arguments`, `rune_invalid_name`, `rune_invalid_usage`, `rune_missing_parentheses`, `rune_removed`, `rune_renamed`

**Slots**: `slot_attribute_duplicate`, `slot_attribute_invalid`, `slot_default_duplicate`, `slot_snippet_conflict` (cannot mix `<slot>` and `{@render}`)

**Snippets**: `snippet_invalid_export`, `snippet_parameter_assignment`, `snippet_shadowing_prop`

**State**: `state_field_duplicate`, `state_invalid_placement`, `state_invalid_export`

**Svelte meta tags**: `svelte_component_missing_this`, `svelte_element_missing_this`, `svelte_fragment_invalid_placement`, `svelte_options_invalid_customelement`

**Parsing**: `expected_identifier`, `js_parse_error`, `legacy_reactive_statement_invalid` (use `$derived`/`$effect` instead of `$:`), `mixed_event_handler_syntaxes`, `node_invalid_placement`, `typescript_invalid_feature`, `unexpected_eof`

## Compile Warnings

**Accessibility**: No `accesskey`, `autofocus`, or distracting elements; interactive elements need keyboard handlers and `tabindex`; labels need associated controls; media needs captions; ARIA attributes must match element roles; no redundant roles.

**Attributes**: Avoid `is` attribute; no `:` in attribute names; quoted component attributes stringify; invalid HTML attributes.

**Code Quality**: Empty blocks; lowercase component names; unused CSS (use `:global` to preserve); non-reactive state updates; deprecated syntax (`context="module"`, `<slot>`, `<svelte:component>`, `<svelte:self>`); HTML structure violations break hydration; reassigned state loses reactivity unless wrapped in function; removed/renamed compile options.

## Common Errors

- **invalid_default_snippet**: Can't mix `{@render children(...)}` with parent `let:` directives; use named snippets
- **lifecycle_outside_component**: Lifecycle methods must be called at top level of component script
- **snippet_without_render_tag**: Use `{@render snippet()}` not `{snippet}`
- **invalid_snippet_arguments**: Snippets only via `{@render ...}`
- **store_invalid_shape**: Stores need `subscribe` method
- **svelte_element_invalid_this_value**: `<svelte:element this={...}>` requires string value
- **lifecycle_function_unavailable**: Methods like `mount` unavailable on server; guard for client-only execution

## Common Warnings

- **dynamic_void_element_content**: Void elements like `<input>` cannot have content with `<svelte:element>`
- **state_snapshot_uncloneable**: `$state.snapshot` returns original value for uncloneable objects (DOM elements, `window`, etc.)



## Pages

### svelte
Main Svelte module entry point

Main `svelte` module entry point providing core framework APIs and functionality.

### action
Module for creating and using custom Svelte actions on DOM elements.

The `svelte/action` module exports utilities for creating custom actions that attach to DOM elements to add behavior and interactivity.

### animate
Module providing animation utilities for Svelte components

The `svelte/animate` module provides animation utilities for smooth transitions and state changes in Svelte components using built-in animation functions and directives.

### attachments
Module for handling attachments in Svelte applications.

The `svelte/attachments` module provides utilities for managing attachments in Svelte applications.

### compiler
API reference for the svelte/compiler module that enables programmatic compilation of Svelte components.

The `svelte/compiler` module provides programmatic access to Svelte's compiler for compiling components to JavaScript, useful for build tool integration and custom tooling.

### easing
Module providing easing functions for animations and transitions with various timing curves.

The `svelte/easing` module provides easing functions (linear, quadratic, cubic, sine, exponential, elastic, bounce, etc.) with In/Out/InOut variants for controlling animation timing curves.

Example: `import { quintOut } from 'svelte/easing'; transition:fade={{ duration: 400, easing: quintOut }}`

### events
Module providing event handling utilities for Svelte applications.

The `svelte/events` module provides event handling utilities and helpers for Svelte components.

### legacy
svelte/legacy provides deprecated migration utilities for transitioning from older Svelte versions.

The `svelte/legacy` module provides deprecated functions for migration purposes. All exports should be replaced with modern alternatives over time.

### motion
API reference for svelte/motion module providing animation utilities.

Module for creating smooth animations and value transitions with easing functions.

### reactivity-window-module
Reactive wrappers for window properties accessible via `.current` in reactive contexts.

Reactive window values via `svelte/reactivity/window` module. Access properties like `innerWidth.current` and `innerHeight.current` in templates and reactive contexts without manual bindings.

```svelte
import { innerWidth, innerHeight } from 'svelte/reactivity/window';
<p>{innerWidth.current}x{innerHeight.current}</p>
```

### reactivity
Reactive wrappers for JavaScript built-ins that integrate with Svelte's reactivity system.

The `svelte/reactivity` module exports reactive versions of Map, Set, URL and other built-ins that work like native versions but integrate with Svelte's reactivity system.

### svelte/server
Server-side rendering module for Svelte applications

The `svelte/server` module provides server-side rendering utilities for Svelte components in Node.js environments.

### store
API reference for svelte/store module providing reactive state management.

Reactive state management module with store creation and subscription utilities.

### svelte/transition
API reference for Svelte's built-in transition effects and custom transition creation.

Module providing transition directives (fade, fly, slide, scale, draw, crossfade) for animating element entry/exit/updates. Accepts duration, delay, and easing options. Custom transitions supported via transition API.

Example: `<div transition:fade={{ duration: 300 }}>Content</div>`

### compiler-errors
Complete reference of Svelte compiler error messages and their solutions.

Reference documentation for Svelte compiler errors with explanations and resolutions for each error type.

### compiler-warnings
How to suppress Svelte compiler warnings using svelte-ignore comments.

Svelte warns at compile time about potential mistakes. Suppress warnings with `<!-- svelte-ignore <code> -->` comments, supporting multiple comma-separated codes and explanatory notes.

### runtime-errors
Reference guide for runtime errors in Svelte applications organized by execution context.

Reference documentation for runtime errors in Svelte, categorized as client errors, server errors, and shared errors.

### runtime-warnings
Documentation reference for runtime warnings that can occur during Svelte application execution.

Reference for runtime warnings in Svelte, split into client-side warnings and shared warnings that apply across environments.

