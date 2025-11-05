## $effect

Effects are functions that run when state updates, executing only in the browser (not during SSR). Use them for third-party library calls, canvas drawing, or network requests.

**Basic usage:**
```svelte
<script>
	let size = $state(50);
	let color = $state('#ff3e00');
	let canvas;

	$effect(() => {
		const context = canvas.getContext('2d');
		context.clearRect(0, 0, canvas.width, canvas.height);
		context.fillStyle = color;
		context.fillRect(0, 0, size, size);
	});
</script>

<canvas bind:this={canvas} width="100" height="100"></canvas>
```

Effects automatically track reactive values ($state, $derived, $props) accessed synchronously and re-run when dependencies change. Values read asynchronously (after await or setTimeout) are not tracked.

**Teardown functions** run before re-runs and on component destruction:
```svelte
$effect(() => {
	const interval = setInterval(() => count += 1, milliseconds);
	return () => clearInterval(interval);
});
```

**Dependency tracking rules:**
- Only synchronously read values are tracked
- Effects re-run when the object reference changes, not when properties inside it change
- Conditional code means dependencies are only tracked if that branch executes
- Direct usage of $state/$derived during creation (e.g., reactive classes) are not treated as dependencies

**$effect.pre** runs before DOM updates:
```svelte
$effect.pre(() => {
	if (!div) return;
	messages.length; // track for re-runs
	if (div.offsetHeight + div.scrollTop > div.scrollHeight - 20) {
		tick().then(() => div.scrollTo(0, div.scrollHeight));
	}
});
```

**$effect.tracking()** returns true if code runs inside a tracking context (effect or template).

**$effect.pending()** returns the count of pending promises in the current boundary.

**$effect.root()** creates a non-tracked scope for manually controlled nested effects:
```js
const destroy = $effect.root(() => {
	$effect(() => { /* setup */ });
	return () => { /* cleanup */ };
});
destroy();
```

**Avoid using $effect for:**
- Synchronizing state: use $derived instead
- Linking values: use function bindings or $derived
- Updating state that causes infinite loops: use untrack() if necessary

Effects run after component mount and in a microtask after state changes, with re-runs batched after DOM updates.