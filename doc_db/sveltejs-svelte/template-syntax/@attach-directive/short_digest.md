The `{@attach}` directive runs functions when elements mount or reactive state updates, with optional cleanup. Supports factories, inline definitions, component spreading, and can be controlled to avoid unnecessary re-runs using nested effects.

```svelte
function tooltip(content) {
  return (element) => {
    const tooltip = tippy(element, { content });
    return tooltip.destroy;
  };
}

<button {@attach tooltip(content)}>Hover me</button>
```