The `$host` rune accesses the host element in custom element components, enabling custom event dispatch:

```svelte
$host().dispatchEvent(new CustomEvent(type))
```