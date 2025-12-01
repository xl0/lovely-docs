## onCleanup

Registers a cleanup function that executes when the current effect context is disposed (component destruction or root effect disposal).

**Purpose**: Provides a shorthand for cleanup logic that would otherwise require returning a function from `$effect()`.

**Equivalent to**:
```ts
$effect(() => {
	return () => {
		// cleanup
	};
});
```

**Usage Examples**:

As a replacement for `onDestroy`:
```svelte
<script lang="ts">
	import { onCleanup } from "runed";

	onCleanup(() => {
		console.log("Component is being cleaned up!");
	});
</script>
```

Within a root effect:
```ts
$effect.root(() => {
	onCleanup(() => {
		console.log("Root effect is being cleaned up!");
	});
});
```

**Type Signature**:
```ts
function onCleanup(cb: () => void): void;
```

The callback receives no arguments and returns void.