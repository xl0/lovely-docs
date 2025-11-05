The `{@const ...}` tag defines a local constant within a block scope.

**Usage:**
```svelte
{#each boxes as box}
	{@const area = box.width * box.height}
	{box.width} * {box.height} = {area}
{/each}
```

**Constraints:**
- Only allowed as an immediate child of blocks (`{#if ...}`, `{#each ...}`, `{#snippet ...}`, etc.), components, or `<svelte:boundary>`
- Cannot be used at arbitrary locations in templates