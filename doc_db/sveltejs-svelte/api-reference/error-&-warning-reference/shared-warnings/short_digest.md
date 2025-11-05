## dynamic_void_element_content
Void elements like `<input>` cannot have content; children are ignored.

## state_snapshot_uncloneable
`$state.snapshot` returns original values for uncloneable objects (e.g., DOM elements):
```js
const object = $state({ property: 'cloneable', window })
const snapshot = $state.snapshot(object); // window is not cloned
```