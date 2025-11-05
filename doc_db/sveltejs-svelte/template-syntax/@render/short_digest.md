Use `{@render ...}` to render snippets. Supports arbitrary expressions and optional chaining for undefined snippets:

```svelte
{@render sum(1, 2)}
{@render (cool ? coolSnippet : lameSnippet)()}
{@render children?.()}
```