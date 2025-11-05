## $derived

Declares derived state that automatically updates when dependencies change:

```svelte
let count = $state(0);
let doubled = $derived(count * 2);
```

Use `$derived.by` for complex derivations with function bodies. Derived values can be temporarily reassigned for optimistic UI. Unlike `$state`, derived values are not deeply reactive proxies. Svelte uses push-pull reactivity: changes notify dependents immediately but derived values only re-evaluate when read.