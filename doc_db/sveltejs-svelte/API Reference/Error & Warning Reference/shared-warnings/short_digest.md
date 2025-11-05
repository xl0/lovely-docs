## dynamic_void_element_content
Void elements like `<input>` cannot have content when used with `<svelte:element>`.

## state_snapshot_uncloneable
`$state.snapshot` returns the original value for uncloneable objects (DOM elements, `window`, etc.):
```js
const object = $state({ property: 'cloneable', window })
const snapshot = $state.snapshot(object); // window is not cloned
```