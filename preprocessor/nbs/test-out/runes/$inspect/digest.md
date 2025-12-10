## $inspect

Development-only rune that logs values whenever they change, tracking reactive state deeply. Re-fires when nested object/array properties update via fine-grained reactivity.

```svelte
<script>
	let count = $state(0);
	let message = $state('hello');
	$inspect(count, message); // logs when either changes
</script>
<button onclick={() => count++}>Increment</button>
<input bind:value={message} />
```

### $inspect(...).with

Returns a `with` property accepting a callback invoked instead of `console.log`. Callback receives `type` ("init" or "update") as first argument, then the inspected values:

```svelte
<script>
	let count = $state(0);
	$inspect(count).with((type, count) => {
		if (type === 'update') debugger;
	});
</script>
<button onclick={() => count++}>Increment</button>
```

Pass `console.trace` to find the origin of changes:
```js
$inspect(stuff).with(console.trace);
```

### $inspect.trace()

Added in 5.14. Traces the surrounding function in development, printing to console which reactive state caused an effect or derived to re-run. Must be the first statement in a function body:

```svelte
<script>
	import { doSomeWork } from './elsewhere';
	$effect(() => {
		$inspect.trace();
		doSomeWork();
	});
</script>
```

Takes optional first argument as label.