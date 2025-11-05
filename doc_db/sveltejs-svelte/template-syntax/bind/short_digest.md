## Two-way binding with `bind:`

Enables data flow from child to parent. Syntax: `bind:property={expression}` or `bind:property` if names match.

**Input bindings:** `bind:value` (coerces to number), `bind:checked`, `bind:indeterminate`, `bind:group` (radio/checkbox groups), `bind:files`

**Select:** `bind:value` on `<select>` or `<select multiple>`

**Media:** `<audio>`/`<video>` two-way: `currentTime`, `playbackRate`, `paused`, `volume`, `muted`; readonly: `duration`, `buffered`, `seekable`, `seeking`, `ended`, `readyState`, `played`

**Other:** `<img>` (readonly `naturalWidth`, `naturalHeight`), `<details bind:open>`, contenteditable (`innerHTML`, `innerText`, `textContent`), dimensions (readonly: `clientWidth`, `clientHeight`, `offsetWidth`, `offsetHeight`, `contentRect`, `contentBoxSize`, `borderBoxSize`, `devicePixelContentBoxSize`)

**Function bindings:** `bind:value={get, set}` for validation/transformation; use `{null, setter}` for readonly

**bind:this:** Reference DOM nodes or component instances

**Component props:** Mark with `$bindable()` rune to allow binding