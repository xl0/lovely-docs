## Purpose
Effects run when state updates and are used for side effects like calling third-party libraries, drawing on canvas, or making network requests. They only run in the browser, not during SSR. Generally avoid updating state inside effects as it leads to convoluted code and infinite loops.

## Basic Usage
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

Svelte automatically tracks which state/derived values are accessed and reruns the effect when they change.

## Lifecycle
- Effects run after component mounts and in a microtask after state changes
- Reruns are batched (multiple state changes in same moment = one rerun)
- Happen after DOM updates are applied
- Can be used anywhere, not just top-level, as long as called while parent effect is running

## Teardown Functions
Effects can return a teardown function that runs:
- Immediately before the effect reruns
- When the component is destroyed
- When the parent effect reruns

```svelte
<script>
	let count = $state(0);
	let milliseconds = $state(1000);

	$effect(() => {
		const interval = setInterval(() => {
			count += 1;
		}, milliseconds);

		return () => clearInterval(interval);
	});
</script>

<h1>{count}</h1>
<button onclick={() => (milliseconds *= 2)}>slower</button>
<button onclick={() => (milliseconds /= 2)}>faster</button>
```

## Dependency Tracking
- Automatically picks up reactive values ($state, $derived, $props) read synchronously in the function body
- Values read asynchronously (after await, inside setTimeout) are NOT tracked
- Only reruns when the object itself changes, not when properties inside it change
- Only depends on values read in the last run (conditional code affects dependencies)

```svelte
<script>
	let state = $state({ value: 0 });
	let derived = $derived({ value: state.value * 2 });

	// runs once - state never reassigned
	$effect(() => { state; });

	// reruns when state.value changes
	$effect(() => { state.value; });

	// reruns when derived changes (new object each time)
	$effect(() => { derived; });
</script>

<button onclick={() => (state.value += 1)}>{state.value}</button>
<p>{state.value} doubled is {derived.value}</p>
```

Async example - canvas repaints on color change but not size change:
```ts
$effect(() => {
	const context = canvas.getContext('2d');
	context.clearRect(0, 0, canvas.width, canvas.height);
	context.fillStyle = color;
	
	setTimeout(() => {
		context.fillRect(0, 0, size, size); // size not tracked
	}, 0);
});
```

Conditional dependencies - if condition is true, color is a dependency; if false, only condition is:
```ts
let condition = $state(true);
let color = $state('#ff3e00');

$effect(() => {
	if (condition) {
		confetti({ colors: [color] });
	} else {
		confetti();
	}
});
```

## $effect.pre
Runs code before DOM updates. Works exactly like $effect otherwise.

```svelte
<script>
	import { tick } from 'svelte';
	let div = $state();
	let messages = $state([]);

	$effect.pre(() => {
		if (!div) return;
		messages.length; // rerun when length changes
		
		if (div.offsetHeight + div.scrollTop > div.scrollHeight - 20) {
			tick().then(() => {
				div.scrollTo(0, div.scrollHeight);
			});
		}
	});
</script>

<div bind:this={div}>
	{#each messages as message}
		<p>{message}</p>
	{/each}
</div>
```

## $effect.tracking
Advanced rune that returns true if code is running inside a tracking context (effect or template), false otherwise. Used to implement abstractions like createSubscriber that only create listeners if values are being tracked.

```svelte
<script>
	console.log('setup:', $effect.tracking()); // false
	$effect(() => {
		console.log('in effect:', $effect.tracking()); // true
	});
</script>

<p>in template: {$effect.tracking()}</p> <!-- true -->
```

## $effect.root
Advanced rune that creates a non-tracked scope without auto-cleanup. Useful for nested effects you want to manually control, and allows creating effects outside component initialization.

```js
const destroy = $effect.root(() => {
	$effect(() => {
		// setup
	});

	return () => {
		// cleanup
	};
});

destroy(); // later
```

## When NOT to Use $effect
Don't use effects to synchronize state. Instead of:
```svelte
<script>
	let count = $state(0);
	let doubled = $state();
	$effect(() => { doubled = count * 2; }); // bad
</script>
```

Use $derived:
```svelte
<script>
	let count = $state(0);
	let doubled = $derived(count * 2); // good
</script>
```

For complex expressions, use $derived.by. Deriveds can be directly overridden as of Svelte 5.25.

Don't use effects to link values together. Instead of two effects updating each other:
```svelte
<script>
	const total = 100;
	let spent = $state(0);
	let left = $state(total);

	$effect(() => { left = total - spent; }); // bad
	$effect(() => { spent = total - left; }); // bad
</script>
```

Use $derived with function bindings:
```svelte
<script>
	const total = 100;
	let spent = $state(0);
	let left = $derived(total - spent);

	function updateLeft(newLeft) {
		spent = total - newLeft;
	}
</script>

<input bind:value={() => left, updateLeft} max={total} />
```

If you must update $state in an effect and hit infinite loops from reading/writing the same state, use untrack.