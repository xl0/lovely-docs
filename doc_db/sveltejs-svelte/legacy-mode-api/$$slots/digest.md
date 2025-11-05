In legacy mode, use the `$$slots` object to check which slots were provided to a component. The object's keys are the names of slots passed by the parent component.

```svelte
<div>
	<slot name="title" />
	{#if $$slots.description}
		<hr />
		<slot name="description" />
	{/if}
</div>
```

This allows conditional rendering of optional slots - the `<hr>` and description slot only render if the parent provided `slot="description"`.