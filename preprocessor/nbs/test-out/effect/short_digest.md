## $effect

Functions that run when state updates (browser-only). Track which state is accessed and re-run when it changes.

**Basic usage:**
```svelte
$effect(() => {
    // runs when accessed state changes
    context.fillStyle = color;
    context.fillRect(0, 0, size, size);
});
```

**Lifecycle:** Run after mount in microtasks, batched, can return teardown function.

**Dependencies:** Automatically track synchronously-read reactive values; asynchronous reads not tracked. Only re-run when object itself changes, not properties. Conditional code affects which values are dependencies.

**Variants:**
- `$effect.pre` - runs before DOM updates
- `$effect.tracking()` - returns whether in tracking context
- `$effect.root()` - non-tracked scope with manual cleanup

**When not to use:** Don't synchronize state with effects—use `$derived` instead. Don't link values with effects—use callbacks or function bindings. Use `untrack` if you must update state in effects to avoid infinite loops.