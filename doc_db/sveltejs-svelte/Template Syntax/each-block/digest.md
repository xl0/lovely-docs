# Each Block

Iterate over arrays, array-like objects, or iterables (Map, Set, etc.) using the each block.

## Basic Syntax

```svelte
{#each items as item}
  <li>{item.name}</li>
{/each}
```

Access the index with a second variable:

```svelte
{#each items as item, i}
  <li>{i + 1}: {item.name}</li>
{/each}
```

## Keyed Each Blocks

Provide a unique key expression to intelligently update lists when data changes (insert, move, delete) rather than just appending/removing:

```svelte
{#each items as item (item.id)}
  <li>{item.name}</li>
{/each}
```

Keys should be strings or numbers for identity persistence. Works with index too:

```svelte
{#each items as item, i (item.id)}
  <li>{i + 1}: {item.name}</li>
{/each}
```

## Destructuring

Use destructuring and rest patterns:

```svelte
{#each items as { id, name, qty }, i (id)}
  <li>{i + 1}: {name} x {qty}</li>
{/each}

{#each objects as { id, ...rest }}
  <li><MyComponent {...rest} /></li>
{/each}
```

## Rendering Without Items

Omit the `as` clause to render n times:

```svelte
{#each { length: 8 }, rank}
  {#each { length: 8 }, file}
    <div></div>
  {/each}
{/each}
```

## Else Block

Render fallback content when the list is empty:

```svelte
{#each todos as todo}
  <p>{todo.text}</p>
{:else}
  <p>No tasks today!</p>
{/each}
```