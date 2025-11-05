Use `$$slots` object in legacy mode to check which named slots were provided. Keys are slot names. Enables conditional rendering of optional slots:

```svelte
{#if $$slots.description}
	<slot name="description" />
{/if}
```