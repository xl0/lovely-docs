## Basic iteration
Iterate over arrays, array-like objects, or iterables (Map, Set) using `{#each expression as name}...{/each}`. Access the index with a second variable: `{#each items as item, i}`.

```svelte
{#each items as item, i}
	<li>{i + 1}: {item.name} x {item.qty}</li>
{/each}
```

## Keyed each blocks
Provide a key expression `{#each expression as name (key)}` to help Svelte intelligently update lists by inserting, moving, and deleting items rather than just updating state. Keys should uniquely identify each item and be strings or numbers when possible.

```svelte
{#each items as item (item.id)}
	<li>{item.name} x {item.qty}</li>
{/each}
```

## Destructuring and rest patterns
Use destructuring in each blocks to extract specific properties:

```svelte
{#each items as { id, name, qty }, i (id)}
	<li>{i + 1}: {name} x {qty}</li>
{/each}

{#each objects as { id, ...rest }}
	<li><span>{id}</span><MyComponent {...rest} /></li>
{/each}
```

## Rendering without items
Omit the `as` clause to render something n times: `{#each { length: 8 }, rank}`.

## Else blocks
Add `{:else}` to render content when the list is empty:

```svelte
{#each todos as todo}
	<p>{todo.text}</p>
{:else}
	<p>No tasks today!</p>
{/each}
```