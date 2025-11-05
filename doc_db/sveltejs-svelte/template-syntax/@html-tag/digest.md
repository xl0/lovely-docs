The `{@html ...}` tag injects raw HTML into a component:

```svelte
<article>
	{@html content}
</article>
```

**Security**: Always escape the passed string or only use values under your control to prevent XSS attacks. Never render unsanitized content.

**Valid HTML requirement**: The expression must be valid standalone HTML. This fails because `</div>` alone is invalid:
```svelte
{@html '<div>'}content{@html '</div>'}
```

It also will not compile Svelte code.

**Styling limitation**: Content rendered with `{@html ...}` is invisible to Svelte and won't receive scoped styles. Scoped style rules targeting elements inside injected HTML won't work:

```svelte
<article>
	{@html content}
</article>

<style>
	article {
		a { color: hotpink }
	}
</style>
```

Use the `:global` modifier to style injected content:
```svelte
<style>
	article :global {
		a { color: hotpink }
	}
</style>
```