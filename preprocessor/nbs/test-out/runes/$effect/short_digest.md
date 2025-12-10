## $effect
Runs side effects when state updates. Automatically tracks reactive values accessed synchronously and reruns when they change. Runs after component mount and DOM updates, in batched microtasks.

```svelte
<script>
	let size = $state(50), color = $state('#ff3e00'), canvas;

	$effect(() => {
		const ctx = canvas.getContext('2d');
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		ctx.fillStyle = color;
		ctx.fillRect(0, 0, size, size);
	});
</script>
<canvas bind:this={canvas} width="100" height="100"></canvas>
```

Can return teardown function (runs before rerun or on destroy). Async-read values not tracked. Only reruns when object itself changes, not properties. Conditional code affects which values are dependencies.

**$effect.pre**: Runs before DOM updates.

**$effect.tracking()**: Returns true if in tracking context (effect/template).

**$effect.root()**: Creates non-tracked scope with manual cleanup, allows effects outside initialization.

**Don't use for state sync** — use $derived instead. Don't use to link values — use $derived + function bindings. Use untrack if you must read/write same state in effect.