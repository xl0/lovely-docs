The `Previous` utility creates a reactive wrapper that maintains the previous value of a getter function, enabling state change comparisons and transition effects.

**Type Definition:**
```ts
class Previous<T> {
	constructor(getter: () => T);
	readonly current: T | undefined; // Previous value
}
```

**Usage:**
```svelte
<script lang="ts">
	import { Previous } from "runed";

	let count = $state(0);
	const previous = new Previous(() => count);
</script>

<div>
	<button onclick={() => count++}>Count: {count}</button>
	<pre>Previous: {`${previous.current}`}</pre>
</div>
```

The constructor accepts a getter function that returns the value to track. The `current` property provides access to the previous value, which is `undefined` until the tracked value changes at least once.