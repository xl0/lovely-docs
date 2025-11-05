## svelte:boundary

Error boundary component that catches errors during rendering and effect execution, and handles pending states for async operations.

### Features

- **Pending state**: Display UI while `await` expressions resolve using the `pending` snippet
- **Error handling**: Catch and handle rendering/effect errors with `failed` snippet or `onerror` handler
- **Error isolation**: Errors outside rendering (event handlers, setTimeout, async work) are not caught

### Properties

**pending** - Snippet shown when boundary is created, remains visible until all `await` expressions resolve:
```svelte
<svelte:boundary>
	<p>{await delayed('hello!')}</p>
	{#snippet pending()}
		<p>loading...</p>
	{/snippet}
</svelte:boundary>
```

**failed** - Snippet rendered on error, receives `error` and `reset` function:
```svelte
<svelte:boundary>
	<FlakyComponent />
	{#snippet failed(error, reset)}
		<button onclick={reset}>try again</button>
	{/snippet}
</svelte:boundary>
```

**onerror** - Function called with `error` and `reset` arguments for error tracking or external state management:
```svelte
<script>
	let error = $state(null);
	let reset = $state(() => {});
	function onerror(e, r) {
		error = e;
		reset = r;
	}
</script>

<svelte:boundary {onerror}>
	<FlakyComponent />
</svelte:boundary>

{#if error}
	<button onclick={() => { error = null; reset(); }}>try again</button>
{/if}
```

When a boundary handles an error, existing content is removed. Errors in `onerror` propagate to parent boundaries.