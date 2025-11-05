The `{@html ...}` tag injects raw HTML. Requires valid standalone HTML and sanitized input to prevent XSS. Injected content won't receive scoped styles—use `:global` modifier instead:

```svelte
<article>
	{@html content}
</article>

<style>
	article :global {
		a { color: hotpink }
	}
</style>
```