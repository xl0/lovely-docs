The `{#await}` block branches on Promise states (pending, fulfilled, rejected). Omit `catch`, the pending block, or `then` as needed. During SSR, only pending renders; non-Promise expressions skip to `then`.

```svelte
{#await promise}
  <p>loading...</p>
{:then value}
  <p>{value}</p>
{:catch error}
  <p>{error.message}</p>
{/await}
```