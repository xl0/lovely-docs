## :global(...) modifier

Apply styles globally to single selectors:

```svelte
<style>
	:global(body) { margin: 0; }
	div :global(strong) { color: goldenrod; }
</style>
```

For keyframes, prepend `-global-`:

```svelte
@keyframes -global-my-animation-name { /* code */ }
```

## :global block

Apply styles to multiple selectors globally:

```svelte
<style>
	:global {
		div { ... }
		p { ... }
	}
</style>
```