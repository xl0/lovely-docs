The `{#await}` block handles the three states of a Promise: pending, fulfilled, and rejected.

**Syntax:**
```svelte
{#await expression}
  <!-- pending -->
{:then value}
  <!-- fulfilled -->
{:catch error}
  <!-- rejected -->
{/await}
```

**Optional branches:**
- Omit `catch` if error handling isn't needed
- Omit the initial pending block with `{#await expression then value}`
- Omit `then` block to show only errors with `{#await expression catch error}`

**Server-side rendering:** Only the pending branch renders during SSR. If the expression isn't a Promise, only the `then` branch renders.

**Lazy component loading:**
```svelte
{#await import('./Component.svelte') then { default: Component }}
  <Component />
{/await}
```