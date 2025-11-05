## Two-way Data Binding

The `bind:` directive enables data to flow from child to parent, complementing the default parent-to-child flow. Syntax: `bind:property={expression}` where expression is an lvalue (variable or object property). When the identifier matches the property name, you can omit the expression: `bind:value` is equivalent to `bind:value={value}`.

Most bindings are two-way (changes affect both value and element), some are readonly (changes to value have no effect on element).

### Function Bindings

Use `bind:property={get, set}` for validation and transformation:
```svelte
<input bind:value={
	() => value,
	(v) => value = v.toLowerCase()}
/>
```

For readonly bindings, set `get` to `null`:
```svelte
<div bind:clientWidth={null, redraw}></div>
```

### Input Bindings

- `bind:value` - binds input value; numeric inputs coerce to number
- `bind:checked` - for checkboxes and radio buttons
- `bind:indeterminate` - checkbox indeterminate state
- `bind:group` - groups radio inputs (mutually exclusive) or checkboxes (populate array)
- `bind:files` - FileList of selected files; use DataTransfer to update programmatically

### Select Bindings

`bind:value` on `<select>` binds to selected option's value (any type, not just strings). `<select multiple>` binds to array of selected values. Omit value attribute if it matches text content.

### Media Bindings

`<audio>` and `<video>` support two-way bindings: `currentTime`, `playbackRate`, `paused`, `volume`, `muted`. Readonly: `duration`, `buffered`, `seekable`, `seeking`, `ended`, `readyState`, `played`. `<video>` adds readonly `videoWidth` and `videoHeight`.

### Other Element Bindings

- `<img>` - readonly `naturalWidth`, `naturalHeight`
- `<details>` - `bind:open`
- Contenteditable elements - `innerHTML`, `innerText`, `textContent`
- All visible elements - readonly dimension bindings: `clientWidth`, `clientHeight`, `offsetWidth`, `offsetHeight`, `contentRect`, `contentBoxSize`, `borderBoxSize`, `devicePixelContentBoxSize`
- `bind:this` - reference to DOM node (available after mount)

### Component Bindings

Bind to component props with `bind:property={variable}`. Mark props as bindable using `$bindable()` rune. Bindable props can have fallback values that only apply when not bound.

```svelte
<script>
	let { bindableProperty = $bindable('fallback') } = $props();
</script>
```