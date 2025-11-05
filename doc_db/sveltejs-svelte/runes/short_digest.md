## Runes

`$`-prefixed compiler keywords controlling Svelte behavior.

- **$state**: Reactive state with deep reactivity for objects/arrays. Variants: `$state.raw`, `$state.snapshot()`, `$state.eager()`
- **$derived**: Reactive derived state auto-updating on dependency changes. Use `$derived.by` for complex logic
- **$effect**: Side-effect functions with automatic dependency tracking. Variants: `$effect.pre()`, `$effect.tracking()`, `$effect.pending()`, `$effect.root()`
- **$props**: Receives component inputs with destructuring, fallbacks, and type safety. `$props.id()` generates unique IDs
- **$bindable**: Enables bidirectional prop binding between parent and child
- **$inspect**: Development-only logging of reactive value changes. `$inspect.trace()` traces re-run causes
- **$host**: Accesses host element in custom element components