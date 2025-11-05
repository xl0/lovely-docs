## $$props and $$restProps (Legacy)

- **`$$props`**: All props passed to component
- **`$$restProps`**: All props except declared exports

```svelte
<script>
	export let variant;
</script>
<button {...$$restProps} class="variant-{variant}">click me</button>
```

Use only when needed due to performance penalty.