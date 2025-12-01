## IsMounted

A utility class that tracks whether a component has been mounted. Returns an object with a `current` property that is `false` initially and becomes `true` after the component mounts.

### Usage

```svelte
<script lang="ts">
	import { IsMounted } from "runed";

	const isMounted = new IsMounted();
</script>
```

The `isMounted.current` property can then be used in templates or reactive code to conditionally render or execute logic only after mount.

### Equivalent implementations

Using `onMount`:
```svelte
<script lang="ts">
	import { onMount } from "svelte";

	const isMounted = $state({ current: false });

	onMount(() => {
		isMounted.current = true;
	});
</script>
```

Using `$effect` with `untrack`:
```svelte
<script lang="ts">
	import { untrack } from "svelte";

	const isMounted = $state({ current: false });

	$effect(() => {
		untrack(() => (isMounted.current = true));
	});
</script>
```

The class provides a convenient shorthand for these common patterns.