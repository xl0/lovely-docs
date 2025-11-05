# Each Block

Iterate over arrays and iterables:

```svelte
{#each items as item}
  <li>{item.name}</li>
{/each}
```

With index: `{#each items as item, i}`

**Keyed blocks** for intelligent list updates:

```svelte
{#each items as item (item.id)}
  <li>{item.name}</li>
{/each}
```

Supports destructuring, rendering n times without items, and else blocks for empty lists.