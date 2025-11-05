The `{@const ...}` tag defines a local constant within block scope.

```svelte
{#each boxes as box}
	{@const area = box.width * box.height}
	{area}
{/each}
```

Only allowed as immediate child of blocks, components, or `<svelte:boundary>`.