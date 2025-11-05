## Rendering Snippets

Use the `{@render ...}` tag to render a snippet:

```svelte
{#snippet sum(a, b)}
	<p>{a} + {b} = {a + b}</p>
{/snippet}

{@render sum(1, 2)}
{@render sum(3, 4)}
```

The expression can be an identifier or any JavaScript expression:

```svelte
{@render (cool ? coolSnippet : lameSnippet)()}
```

## Optional Snippets

For potentially undefined snippets (e.g., from props), use optional chaining:

```svelte
{@render children?.()}
```

Or use an `{#if ...}` block with `:else` for fallback content:

```svelte
{#if children}
	{@render children()}
{:else}
	<p>fallback content</p>
{/if}
```