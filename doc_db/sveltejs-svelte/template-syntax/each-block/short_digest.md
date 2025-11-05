Iterate with `{#each expression as name, index (key)}`. Use keys for intelligent list updates. Supports destructuring, rendering n times with `{#each { length: n }}`, and `{:else}` for empty lists.

```svelte
{#each items as { id, name }, i (id)}
	<li>{i + 1}: {name}</li>
{/each}

{#each todos as todo}
	<p>{todo.text}</p>
{:else}
	<p>No tasks!</p>
{/each}
```