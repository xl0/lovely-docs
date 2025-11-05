## Client-side Runtime Errors

Reference of runtime errors that can occur in Svelte 5 applications.

### Binding Errors
- `bind_invalid_checkbox_value`: Use `bind:checked` instead of `bind:value` for checkboxes
- `bind_invalid_export`: Cannot bind to exported properties; use `bind:this` to access component instance instead
- `bind_not_bindable`: Property must be marked with `$bindable()` in component props to be bindable

### Component API Changes (Svelte 5)
- `component_api_changed`: Calling methods on component instances is no longer valid
- `component_api_invalid_new`: Cannot instantiate components with `new`; set `compatibility.componentApi: 4` compiler option for v4 compatibility

### Reactive State Errors
- `derived_references_self`: Derived values cannot reference themselves recursively
- `state_unsafe_mutation`: Cannot update state inside `$derived()`, `$inspect()`, or template expressions. Use `$effect` for side-effects instead.

Example of forbidden pattern:
```svelte
let count = $state(0);
let even = $state(true);
let odd = $derived.by(() => {
  even = count % 2 === 0;  // forbidden
  return !even;
});
```

Solution - make everything derived:
```js
let even = $derived(count % 2 === 0);
let odd = $derived(!even);
```

### Effect Errors
- `effect_in_teardown`: Cannot use runes inside effect cleanup functions
- `effect_in_unowned_derived`: Effects cannot be created inside `$derived` values unless the derived itself was created inside an effect
- `effect_orphan`: Runes can only be used inside effects during component initialization
- `effect_update_depth_exceeded`: Maximum update depth exceeded; prevents infinite loops

### Other Errors
- `each_key_duplicate`: Keyed each blocks have duplicate keys
- `hydration_failed`: Application hydration failed
- `invalid_snippet`: Cannot render null/undefined snippets; use optional chaining
- `lifecycle_legacy_only`: Legacy lifecycle functions cannot be used in runes mode
- `props_invalid_value`: Cannot bind undefined when property has a fallback value
- `props_rest_readonly`: Rest element properties of `$props()` are readonly
- `rune_outside_svelte`: Runes only available in `.svelte` and `.svelte.js/ts` files
- `state_descriptors_fixed`: Property descriptors on `$state` objects must have `value` and be `enumerable`, `configurable`, `writable`
- `state_prototype_fixed`: Cannot set prototype of `$state` objects