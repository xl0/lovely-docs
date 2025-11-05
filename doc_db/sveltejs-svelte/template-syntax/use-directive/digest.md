Actions are functions called when an element is mounted, added via the `use:` directive. They typically use `$effect` for setup and teardown:

```svelte
<script>
	function myaction(node) {
		$effect(() => {
			// setup
			return () => {
				// teardown
			};
		});
	}
</script>

<div use:myaction>...</div>
```

Actions can accept arguments:

```svelte
<div use:myaction={data}>...</div>
```

Note: actions only run once during mounting (not during SSR) and won't re-run if the argument changes.

For typing, use the `Action` interface with three optional type arguments: node type, parameter type, and custom event handlers:

```svelte
/**
 * @type {import('svelte/action').Action<
 * 	HTMLDivElement,
 * 	undefined,
 * 	{
 * 		onswiperight: (e: CustomEvent) => void;
 * 		onswipeleft: (e: CustomEvent) => void;
 * 	}
 * >}
 */
function gestures(node) {
	$effect(() => {
		node.dispatchEvent(new CustomEvent('swipeleft'));
		node.dispatchEvent(new CustomEvent('swiperight'));
	});
}
```

Prior to `$effect`, actions could return an object with `update` and `destroy` methods, but effects are now preferred.