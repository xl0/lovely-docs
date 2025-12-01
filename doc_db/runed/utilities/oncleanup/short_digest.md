Registers a cleanup function called when the effect context is disposed (component destruction or root effect disposal).

```svelte
<script>
	import { onCleanup } from "runed";
	
	onCleanup(() => {
		console.log("Cleaning up!");
	});
</script>
```

Shorthand for returning a cleanup function from `$effect()`.