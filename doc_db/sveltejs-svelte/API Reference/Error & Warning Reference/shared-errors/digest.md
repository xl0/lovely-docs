## Error Reference

**invalid_default_snippet**
Cannot use `{@render children(...)}` if parent uses `let:` directives. Use named snippets instead.
```svelte
// Wrong: Parent uses let:
<List {items} let:entry>
    <span>{entry}</span>
</List>

// List.svelte tries to render children
{@render children(item)}
```

**invalid_snippet_arguments**
Snippets must only be instantiated via `{@render ...}`, not called directly.

**lifecycle_outside_component**
Lifecycle methods like `onMount()` can only be called at the top level of component instance scripts, not inside functions.
```svelte
<script>
    import { onMount } from 'svelte';
    
    // Wrong
    function handleClick() {
        onMount(() => {})
    }
    
    // Correct
    onMount(() => {})
</script>
```

**snippet_without_render_tag**
Snippets must be rendered with `{@render snippet()}`, not `{snippet}`. This applies both to rendering snippet props and passing snippets to child components.
```svelte
// Wrong
<script>
    let { children } = $props();
</script>
{children}

// Correct
{@render children()}
```

**store_invalid_shape**
Stores must have a `subscribe` method.

**svelte_element_invalid_this_value**
The `this` prop on `<svelte:element>` must be a string if defined.