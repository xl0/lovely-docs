## $derived

Declares derived state that automatically updates when dependencies change:

```svelte
<script>
	let count = $state(0);
	let doubled = $derived(count * 2);
</script>

<button onclick={() => count++}>{doubled}</button>
```

Expressions must be side-effect free. Svelte prevents state mutations inside derived expressions.

### $derived.by

For complex derivations, use `$derived.by` with a function:

```svelte
<script>
	let numbers = $state([1, 2, 3]);
	let total = $derived.by(() => {
		let total = 0;
		for (const n of numbers) total += n;
		return total;
	});
</script>
```

### Dependencies

Anything read synchronously inside the derived expression is a dependency. When dependencies change, the derived is marked dirty and recalculated on next read. Use `untrack` to exempt state from being treated as a dependency.

### Overriding derived values

Derived values can be temporarily reassigned (unless declared with `const`), useful for optimistic UI:

```svelte
<script>
	let { post, like } = $props();
	let likes = $derived(post.likes);
	
	async function onclick() {
		likes += 1;
		try {
			await like();
		} catch {
			likes -= 1;
		}
	}
</script>

<button {onclick}>🧡 {likes}</button>
```

### Reactivity

Unlike `$state`, `$derived` values are not converted to deeply reactive proxies. Derived values can be used with destructuring, where each destructured variable becomes reactive.

### Update propagation

Svelte uses push-pull reactivity: state changes immediately notify dependents (push), but derived values only re-evaluate when read (pull). If a derived's new value is referentially identical to its previous value, downstream updates are skipped.