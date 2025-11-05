## Client-side Warnings Reference

### assignment_value_stale
Assignment to a property using nullish coalescing assignment (`??=`) evaluates to the right-hand side value, not the assigned property. This causes mutations on the temporary value to be lost.

```js
// Problem: push happens on [], not object.array
(object.array ??= []).push(object.array.length);

// Fix: separate into two statements
object.array ??= [];
object.array.push(object.array.length);
```

### binding_property_non_reactive
A binding targets a non-reactive property.

### console_log_state
Logging `$state` proxies shows the proxy object, not the value. Use `$inspect()` or `$state.snapshot()` instead.

### event_handler_invalid
Event handler is not a function.

### hydration_attribute_changed
An attribute value differs between server and client renders. The server value is kept during hydration. Fix by ensuring values match or use `svelte-ignore`. To force an update, unset the attribute and reset it in an `$effect`.

### hydration_html_changed
An `{@html}` block value differs between server and client renders. The server value is kept. Fix by ensuring values match or use `svelte-ignore`. To force an update, unset the value and reset it in an `$effect`.

### hydration_mismatch
The DOM structure doesn't match what was rendered on the server. Usually caused by invalid HTML that the browser repaired.

### invalid_raw_snippet_render
The `render` function in `createRawSnippet` must return HTML for a single element.

### legacy_recursive_reactive_block
A migrated `$:` reactive block accesses and updates the same reactive value, which may cause recursive updates when converted to `$effect`.

### lifecycle_double_unmount
Attempted to unmount a component that wasn't mounted.

### ownership_invalid_binding
A parent component passed a property with `bind:` to a child, but the grandparent didn't declare it as a binding. Use `bind:` in the parent instead of just passing the property.

### ownership_invalid_mutation
Mutating unbound props is discouraged. Use `bind:` in the parent or callbacks instead, or mark the prop as `$bindable`.

### select_multiple_invalid_value
A `<select multiple>` element received a non-array value. Ensure `value` is an array or `null`/`undefined`.

### state_proxy_equality_mismatch
`$state()` creates a proxy with a different identity than the original value, so equality checks fail. Compare values where both or neither are created with `$state()`.

### transition_slide_display
The `slide` transition animates height and requires `display: block`, `flex`, or `grid`. It doesn't work with `inline`, `inline-*`, `table`, `table-*`, or `contents`.