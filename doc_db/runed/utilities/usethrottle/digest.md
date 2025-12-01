## Purpose
A higher-order function that throttles function execution, ensuring a function is called at most once within a specified time interval.

## API
`useThrottle(callback, durationFn)` - Takes a callback function and a duration function that returns milliseconds. Returns a throttled function that can be called repeatedly but will only execute the callback at most once per duration interval.

## Example
```svelte
<script lang="ts">
	import { useThrottle } from "runed";

	let search = $state("");
	let throttledSearch = $state("");
	let durationMs = $state(1000);

	const throttledUpdate = useThrottle(
		() => {
			throttledSearch = search;
		},
		() => durationMs
	);
</script>

<div>
	<input
		bind:value={
			() => search,
			(v) => {
				search = v;
				throttledUpdate();
			}
		} />
	<p>You searched for: <b>{throttledSearch}</b></p>
</div>
```

In this example, the search input is throttled to update at most once per second (1000ms), preventing excessive updates while the user types.