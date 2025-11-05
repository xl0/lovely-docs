## dynamic_void_element_content

Void elements like `<input>` cannot have content. When using `<svelte:element this="%tag%">` with a void element, any children passed will be ignored.

## state_snapshot_uncloneable

`$state.snapshot` attempts to clone values to return a reference that no longer changes. Some objects cannot be cloned (like DOM elements), so the original value is returned instead.

Example:
```js
const object = $state({ property: 'this is cloneable', window })
const snapshot = $state.snapshot(object);
// property is cloned, but window (DOM element) is not
```