## Snapshots

Preserve ephemeral DOM state (scroll positions, form input values, etc.) across navigation by exporting a `snapshot` object from `+page.svelte` or `+layout.svelte`.

### How it works

Export a `snapshot` object with `capture` and `restore` methods:

```svelte
<script>
	let comment = $state('');

	/** @type {import('./$types').Snapshot<string>} */
	export const snapshot = {
		capture: () => comment,
		restore: (value) => comment = value
	};
</script>

<form method="POST">
	<label for="comment">Comment</label>
	<textarea id="comment" bind:value={comment} />
	<button>Post comment</button>
</form>
```

- `capture()` is called immediately before the page updates when navigating away, and its return value is stored in the browser's history stack
- `restore(value)` is called with the stored value as soon as the page updates when navigating back

### Constraints

- Data must be JSON-serializable to persist to `sessionStorage`
- State is restored on page reload or when navigating back from a different site
- Avoid returning large objects from `capture` — they remain in memory for the session duration and may exceed `sessionStorage` limits