Pass CSS custom properties to components using the `--property-name` syntax. Properties can be static or dynamic:

```svelte
<Slider
	bind:value
	min={0}
	max={100}
	--track-color="black"
	--thumb-color="rgb({r} {g} {b})"
/>
```

This desugars to a wrapper element with the custom properties in its style attribute. For regular components it uses `<svelte-css-wrapper style="display: contents">`, for SVG elements it uses `<g>`.

Inside the component, read custom properties using CSS `var()` with optional fallback values:

```svelte
<style>
	.track {
		background: var(--track-color, #aaa);
	}
</style>
```

Custom properties don't need to be specified directly on the component—they can be inherited from parent elements or defined globally on `:root` in a stylesheet.

Note: The wrapper element won't affect layout but may affect CSS selectors using the `>` combinator.