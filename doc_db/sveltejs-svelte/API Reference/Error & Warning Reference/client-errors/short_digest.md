## Client-side Runtime Errors

Binding: Use `bind:checked` for checkboxes, `bind:this` for component access, mark properties with `$bindable()`.

Component API (Svelte 5): Cannot call methods on instances or use `new` to instantiate.

State: Cannot mutate state in `$derived()` or template expressions; use `$effect` for side-effects. Derived values cannot reference themselves.

Effects: Only usable during component initialization; cannot be in cleanup functions or unowned derived values.

Other: Keyed each blocks need unique keys, hydration can fail, snippets need null checks, runes only in `.svelte` files.