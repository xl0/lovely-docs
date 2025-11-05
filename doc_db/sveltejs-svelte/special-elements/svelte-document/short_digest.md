The `<svelte:document>` element attaches event listeners and actions to the `document` object. Must be at component top level.

```svelte
<svelte:document onvisibilitychange={handleVisibilityChange} use:someAction />
```

Bindable readonly properties: `activeElement`, `fullscreenElement`, `pointerLockElement`, `visibilityState`