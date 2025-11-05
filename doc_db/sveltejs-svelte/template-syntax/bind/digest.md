## Two-way data binding directive

The `bind:` directive enables data to flow from child to parent (opposite of normal downward flow). Syntax: `bind:property={expression}` where expression is an lvalue. Can omit expression if it matches property name: `bind:value` equals `bind:value={value}`.

Svelte creates event listeners that update bound values. Most bindings are two-way (changes affect both element and value), some are readonly (value changes don't affect element).

### Function bindings
Use `bind:property={get, set}` with getter/setter functions for validation/transformation:
```svelte
<input bind:value={() => value, (v) => value = v.toLowerCase()} />
```
For readonly bindings, set get to `null`:
```svelte
<div bind:clientWidth={null, redraw}></div>
```

### Input bindings
- `bind:value` - binds input value, coerces to number for `type="number"` or `type="range"`. Returns `undefined` if empty/invalid.
- `bind:checked` - checkbox binding
- `bind:indeterminate` - checkbox indeterminate state
- `bind:group` - groups radio inputs (mutually exclusive) or checkboxes (populate array)
- `bind:files` - file input FileList binding

### Select bindings
`bind:value` on `<select>` binds to selected option's value property (any type, not just strings). `<select multiple>` binds to array of selected values. Can omit value attribute if it matches text content.

### Media bindings
`<audio>` and `<video>` support two-way bindings: `currentTime`, `playbackRate`, `paused`, `volume`, `muted`. Readonly: `duration`, `buffered`, `seekable`, `seeking`, `ended`, `readyState`, `played`. `<video>` adds readonly `videoWidth`, `videoHeight`.

### Other element bindings
- `<img>` - readonly `naturalWidth`, `naturalHeight`
- `<details>` - `bind:open`
- Contenteditable elements - `innerHTML`, `innerText`, `textContent`
- All visible elements - readonly dimension bindings: `clientWidth`, `clientHeight`, `offsetWidth`, `offsetHeight`, `contentRect`, `contentBoxSize`, `borderBoxSize`, `devicePixelContentBoxSize`

### bind:this
Reference DOM nodes: `bind:this={dom_node}`. Value is `undefined` until mounted; read in effects/handlers, not during init. Works on components too for programmatic interaction.

### Component bindings
Bind to component props: `bind:property={variable}`. Mark props as bindable with `$bindable()` rune. Bindable props can have fallback values that only apply when not bound.