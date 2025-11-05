## Legacy Props Handling

In legacy mode (pre-runes), use `$$props` and `$$restProps` to work with component props:

- **`$$props`**: Object containing all props passed to the component, including undeclared ones
- **`$$restProps`**: All props except those individually declared with `export`

### Example: Button Component
```svelte
<script>
	export let variant;
</script>

<button {...$$restProps} class="variant-{variant} {$$props.class ?? ''}">
	click me
</button>
```

This passes all props to the `<button>` element except `variant`, which is handled separately.

**Note**: In Svelte 3/4, using these creates a performance penalty and should only be used when necessary. In runes mode, use the `$props` rune instead.