## $derived

Declares derived state that automatically updates when dependencies change. The expression must be side-effect free.

```svelte
let count = $state(0);
let doubled = $derived(count * 2);
```

Can be used on class fields. Without `$derived`, values don't reactively update when dependencies change.

### $derived.by

For complex derivations, use `$derived.by` with a function body:

```svelte
let numbers = $state([1, 2, 3]);
let total = $derived.by(() => {
	let total = 0;
	for (const n of numbers) total += n;
	return total;
});
```

`$derived(expr)` is equivalent to `$derived.by(() => expr)`.

### Dependencies

Anything read synchronously inside the expression is a dependency. When dependencies change, the derived is marked dirty and recalculated on next read. Use `untrack` to exempt state from being a dependency.

### Overriding derived values

Can temporarily reassign derived values (unless declared with `const`) for optimistic UI:

```svelte
let { post, like } = $props();
let likes = $derived(post.likes);

async function onclick() {
	likes += 1;  // immediate feedback
	try {
		await like();
	} catch {
		likes -= 1;  // rollback
	}
}
```

Prior to Svelte 5.25, deriveds were read-only.

### Reactivity behavior

Unlike `$state`, `$derived` values are not converted to deeply reactive proxies. However, if a derived returns an object/array from a reactive source, mutating its properties affects the underlying source:

```svelte
let items = $state([...]);
let index = $state(0);
let selected = $derived(items[index]);
// mutating selected affects items
```

### Update propagation

Uses push-pull reactivity: state changes immediately notify dependents (push), but derived values only re-evaluate when read (pull). If a derived's new value is referentially identical to the previous value, downstream updates are skipped:

```svelte
let count = $state(0);
let large = $derived(count > 10);
// button only updates when large changes, not when count changes
```