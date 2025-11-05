## $effect

Effects run when state updates (browser-only). Automatically track synchronously-read reactive values and re-run on changes. Use for side effects like canvas drawing or network requests.

**Basic example:**
```svelte
$effect(() => {
	context.fillStyle = color;
	context.fillRect(0, 0, size, size);
});
```

**Teardown function** (runs before re-run and on destroy):
```svelte
$effect(() => {
	const interval = setInterval(() => count += 1, ms);
	return () => clearInterval(interval);
});
```

**Key rules:**
- Only synchronously read values are tracked
- Re-runs when object reference changes, not property mutations
- Asynchronously read values (after await/setTimeout) are not tracked
- Conditional code only tracks dependencies in executed branches

**Variants:**
- `$effect.pre()` - runs before DOM updates
- `$effect.tracking()` - returns true if in tracking context
- `$effect.pending()` - count of pending promises
- `$effect.root()` - manually controlled non-tracked scope

**Don't use $effect for state synchronization** — use `$derived` instead.