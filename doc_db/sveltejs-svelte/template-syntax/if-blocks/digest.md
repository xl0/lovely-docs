Svelte's `{#if}` block conditionally renders content based on expressions.

Basic syntax:
```svelte
{#if expression}
  content
{/if}
```

Add alternative branches with `{:else if}` and `{:else}`:
```svelte
{#if porridge.temperature > 100}
  <p>too hot!</p>
{:else if 80 > porridge.temperature}
  <p>too cold!</p>
{:else}
  <p>just right!</p>
{/if}
```

Blocks can wrap elements or text within elements.