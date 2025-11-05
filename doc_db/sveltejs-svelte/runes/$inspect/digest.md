## $inspect

A development-only rune that logs values whenever they change, similar to `console.log` but reactive. Tracks deep changes in objects and arrays.

```svelte
<script>
	let count = $state(0);
	let message = $state('hello');
	$inspect(count, message); // logs when either changes
</script>
```

Prints stack traces on updates to help identify state change origins.

### $inspect(...).with

Returns a `with` property that accepts a callback instead of using `console.log`. The callback receives `"init"` or `"update"` as the first argument, followed by the inspected values.

```svelte
<script>
	let count = $state(0);
	$inspect(count).with((type, count) => {
		if (type === 'update') {
			debugger;
		}
	});
</script>
```

### $inspect.trace()

Added in 5.14. Traces the surrounding function in development, printing to console which reactive state caused an effect or derived to re-run. Must be the first statement in a function body. Accepts an optional label argument.

```svelte
<script>
	$effect(() => {
		$inspect.trace();
		doSomeWork();
	});
</script>
```