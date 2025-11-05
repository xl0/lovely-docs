The `<svelte:document>` element allows you to attach event listeners to the `document` object and use actions on it. This is useful for events that don't fire on `window`, such as `visibilitychange`.

The element must appear at the top level of your component and cannot be inside blocks or elements.

```svelte
<svelte:document onvisibilitychange={handleVisibilityChange} use:someAction />
```

You can bind to these readonly properties:
- `activeElement` - the currently focused element
- `fullscreenElement` - the element in fullscreen mode
- `pointerLockElement` - the element with pointer lock
- `visibilityState` - the visibility state of the document