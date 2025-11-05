## Client Warnings

**assignment_value_stale**: Assignment operators like `??=` evaluate to the right-hand side value, not the assigned property. Separate into two statements to fix:
```js
object.array ??= [];
object.array.push(object.array.length);
```

**await_reactivity_loss**: State read in async functions after `await` may not be tracked. Pass values as function parameters instead of reading them inside:
```js
async function sum(a, b) {
  return await a + b;
}
let total = $derived(await sum(a, b));
```

**await_waterfall**: Multiple `$derived(await ...)` create unnecessary waterfalls. Create promises first, then await them:
```js
let aPromise = $derived(one());
let bPromise = $derived(two());
let a = $derived(await aPromise);
let b = $derived(await bPromise);
```

**binding_property_non_reactive**: Binding to non-reactive properties.

**console_log_state**: Use `$inspect()` or `$state.snapshot()` instead of logging `$state` proxies directly.

**event_handler_invalid**: Event handler must be a function.

**hydration_attribute_changed**: Server and client render different attribute values. Use `svelte-ignore` or ensure values match. Force update with `$effect` if needed.

**hydration_html_changed**: `{@html}` block value differs between server and client. Use `svelte-ignore` or ensure values match.

**hydration_mismatch**: Initial UI structure doesn't match server render. Check for invalid HTML that the DOM repairs.

**invalid_raw_snippet_render**: `createRawSnippet` render function must return HTML for a single element.

**legacy_recursive_reactive_block**: Migrated `$:` blocks that access and update the same value may cause recursive updates as `$effect`.

**lifecycle_double_unmount**: Attempted to unmount a component that wasn't mounted.

**ownership_invalid_binding**: Use `bind:` instead of passing properties when forwarding bindings between components.

**ownership_invalid_mutation**: Don't mutate unbound props. Use `bind:` or callbacks instead, or mark props as `$bindable`.

**select_multiple_invalid_value**: `<select multiple>` value must be an array, null, or undefined.

**state_proxy_equality_mismatch**: `$state()` creates proxies with different identity than original values. Comparisons with `===` will fail. Compare values created the same way.

**state_proxy_unmount**: Don't pass `$state` proxies to `unmount()`. Use `$state.raw()` if reactivity is needed.

**svelte_boundary_reset_noop**: `<svelte:boundary>` reset function only works once.

**transition_slide_display**: `slide` transition requires `display: block`, `flex`, or `grid`. Doesn't work with `inline`, `table`, or `contents`.

## Shared Warnings

**dynamic_void_element_content**: Void elements like `<input>` cannot have content.

**state_snapshot_uncloneable**: `$state.snapshot()` cannot clone certain objects (DOM elements, etc.). Original value is returned for uncloneable properties.