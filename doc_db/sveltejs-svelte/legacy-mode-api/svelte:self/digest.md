The `<svelte:self>` element enables a component to recursively include itself. It must be placed inside conditional blocks (if/each) or passed to a component slot to prevent infinite loops.

Example:
```svelte
<script>
	export let count;
</script>

{#if count > 0}
	<p>counting down... {count}</p>
	<svelte:self count={count - 1} />
{:else}
	<p>lift-off!</p>
{/if}
```

**Note:** This feature is legacy. Modern Svelte allows components to import themselves directly instead of using `<svelte:self>`.