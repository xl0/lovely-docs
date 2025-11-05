## dynamic_void_element_content

`<svelte:element this="%tag%">` is a void element — it cannot have content. Elements such as `<input>` cannot have content; any children passed to these elements will be ignored.

## state_snapshot_uncloneable

Value cannot be cloned with `$state.snapshot` — the original value is returned instead.

`$state.snapshot` attempts to clone a value to return a reference that no longer changes. Some objects cannot be cloned (e.g., DOM elements, `window`), so the original value is returned for those properties:

```js
const object = $state({ property: 'this is cloneable', window })
const snapshot = $state.snapshot(object); // property is cloned, window is not
```