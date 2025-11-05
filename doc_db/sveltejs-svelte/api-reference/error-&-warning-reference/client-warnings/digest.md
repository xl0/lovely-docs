## Client Warnings Reference

### assignment_value_stale
Assignment to a property using the nullish coalescing assignment operator (`??=`) will evaluate to the right-hand side value, not the assigned property. This causes unexpected behavior when chaining operations:

```js
let object = $state({ array: null });
function add() {
	(object.array ??= []).push(object.array.length); // pushes to [], not the state proxy
}
```

Fix by separating into two statements:
```js
object.array ??= [];
object.array.push(object.array.length);
```

### await_reactivity_loss
State read in async functions after an `await` may not be tracked for reactivity. When `await` is visible in the expression, Svelte tracks state after it. When `await` is hidden (inside a called function), state after the await is not tracked:

```js
let a = Promise.resolve(1);
let b = 2;
async function sum() {
	return await a + b; // b is not tracked
}
let total = $derived(await sum());
```

Fix by passing values as parameters:
```js
async function sum(a, b) {
	return await a + b;
}
let total = $derived(await sum(a, b));
```

### await_waterfall
Async deriveds that are not read immediately after resolving create unnecessary waterfalls. Sequential awaits delay the second until the first resolves:

```js
let a = $derived(await one());
let b = $derived(await two()); // waits for a to resolve
```

Fix by creating promises first, then awaiting:
```js
let aPromise = $derived(one());
let bPromise = $derived(two());
let a = $derived(await aPromise);
let b = $derived(await bPromise);
```

### binding_property_non_reactive
Binding to a non-reactive property is not supported.

### console_log_state
Logging `$state` proxies shows the proxy object, not the value. Use `$inspect()` for reactive logging or `$state.snapshot()` for one-off logging.

### event_handler_invalid
Event handler must be a function.

### hydration_attribute_changed
Certain attributes (like `src` on `<img>`) won't be updated during hydration to avoid refetching. Ensure server and client render the same value, or use `svelte-ignore` comment.

### hydration_html_changed
`{@html}` block values that differ between server and client won't be updated during hydration. Ensure values match or use `svelte-ignore`.

### hydration_mismatch
The DOM structure doesn't match between server and client renders. Check for invalid HTML that the browser repairs.

### invalid_raw_snippet_render
`createRawSnippet` render function must return HTML for a single element.

### legacy_recursive_reactive_block
Migrated `$:` reactive blocks that both read and update the same value may cause recursive updates when converted to `$effect`.

### lifecycle_double_unmount
Attempted to unmount a component that wasn't mounted.

### ownership_invalid_binding
When passing a prop with `bind:` through multiple components, all intermediate components must also use `bind:`, not just pass the property.

### ownership_invalid_mutation
Mutating unbound props is discouraged. Use `bind:` in the parent or use callbacks instead:

```svelte
<!-- App.svelte -->
<Child {person} /> <!-- person is unbound -->

<!-- Child.svelte -->
<input bind:value={person.name}> <!-- mutating unbound prop -->
```

Fix with `bind:`:
```svelte
<Child bind:person />
```

Or mark as `$bindable`:
```js
let { person = $bindable() } = $props();
```

### select_multiple_invalid_value
`<select multiple>` value must be an array, not a non-array value.

### state_proxy_equality_mismatch
`$state()` creates a proxy with a different identity than the original value. Equality checks (`===`) will fail. Compare values where both or neither are created with `$state()`.

### state_proxy_unmount
Don't pass a `$state` proxy to `unmount()`. Use `$state.raw()` if the component needs to be reactive.

### svelte_boundary_reset_noop
The `reset` function from `<svelte:boundary>` onerror handler only works the first time it's called.

### transition_slide_display
The `slide` transition animates height and requires `display: block`, `flex`, or `grid`. It doesn't work with `inline`, `inline-*`, `table`, or `contents` display values.