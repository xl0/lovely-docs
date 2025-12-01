## Purpose
`useDebounce` creates a debounced version of a callback function, preventing frequent execution by delaying it until after a specified duration of inactivity.

## API
- **Function signature**: `useDebounce(callback, durationFn)` - takes a callback and a function that returns the debounce duration in milliseconds
- **Returns object with**:
  - `pending` - boolean indicating if a debounced call is scheduled
  - `runScheduledNow()` - method to execute the scheduled callback immediately
  - `cancel()` - method to cancel the pending scheduled execution

## Example
```svelte
<script lang="ts">
	import { useDebounce } from "runed";

	let count = $state(0);
	let logged = $state("");
	let debounceDuration = $state(1000);

	const logCount = useDebounce(
		() => {
			logged = `You pressed the button ${count} times!`;
			count = 0;
		},
		() => debounceDuration
	);

	function ding() {
		count++;
		logCount();
	}
</script>

<input type="number" bind:value={debounceDuration} />
<button onclick={ding}>DING DING DING</button>
<button onclick={logCount.runScheduledNow} disabled={!logCount.pending}>Run now</button>
<button onclick={logCount.cancel} disabled={!logCount.pending}>Cancel</button>
<p>{logged}</p>
```

The duration function allows dynamic debounce timing. Calling the debounced function multiple times within the duration resets the timer. Use `runScheduledNow()` to force immediate execution or `cancel()` to discard the pending call.