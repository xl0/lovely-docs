## $props Rune

Receive component props with destructuring:

```svelte
<script>
	let { adjective = 'happy' } = $props();
</script>
```

Supports fallback values, renaming (`{ super: trouper }`), and rest properties (`...others`). Don't mutate props unless bindable; use callbacks or `$bindable` instead.

Add type annotations for safety:

```svelte
<script lang="ts">
	let { adjective }: { adjective: string } = $props();
</script>
```

`$props.id()` generates unique per-instance IDs for linking elements.