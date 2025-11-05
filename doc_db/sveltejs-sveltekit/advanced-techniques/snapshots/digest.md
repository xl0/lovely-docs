Preserve ephemeral DOM state (scroll positions, form inputs, etc.) across navigation using snapshots.

Export a `snapshot` object with `capture` and `restore` methods from `+page.svelte` or `+layout.svelte`:

```svelte
<script>
	let comment = $state('');

	export const snapshot = {
		capture: () => comment,
		restore: (value) => comment = value
	};
</script>

<textarea bind:value={comment} />
```

The `capture` function is called before navigating away and its return value is stored in the browser's history stack. The `restore` function is called when navigating back, receiving the stored value.

Data must be JSON-serializable to persist to `sessionStorage`, allowing restoration on page reload or navigation back from external sites. Avoid capturing very large objects as they remain in memory for the session duration.