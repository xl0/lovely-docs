## Common Svelte Errors

**invalid_default_snippet**: Cannot use `{@render children(...)}` if parent uses `let:` directives. Use named snippets instead.

```svelte
// Wrong: Parent uses let:, List uses {@render children()}
<List {items} let:entry><span>{entry}</span></List>

// List.svelte tries to render with {@render children(item)}
```

**invalid_snippet_arguments**: Snippets passed invalid arguments. Snippets should only be instantiated via `{@render ...}`.

**lifecycle_outside_component**: Lifecycle methods like `onMount()` can only be called at the top level of component instance scripts, not inside functions.

```svelte
// Wrong
function handleClick() { onMount(() => {}) }

// Correct
onMount(() => {})
```

**missing_context**: Context was not set in a parent component. The `get` function from `createContext()` throws if `set` wasn't called in a parent.

**snippet_without_render_tag**: Attempted to render a snippet without `{@render}`. Use `{@render snippet()}` instead of `{snippet}`.

```svelte
// Wrong
let { children } = $props();
{children}

// Correct
{@render children()}
```

**store_invalid_shape**: Value is not a store with a `subscribe` method.

**svelte_element_invalid_this_value**: The `this` prop on `<svelte:element>` must be a string if defined.