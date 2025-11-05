

## Pages

### scoped-styles
Svelte automatically scopes component styles using hash-based classes, preventing style leakage and giving component styles higher specificity than global styles.

Svelte scopes component styles by adding a hash-based class (e.g., `svelte-123xyz`) to elements. Scoped selectors get a 0-1-0 specificity boost, taking precedence over global styles. Keyframes are also scoped automatically:

```svelte
<style>
	@keyframes bounce { /* ... */ }
	.bouncy { animation: bounce 10s; }
</style>
```

### global-styles
Svelte provides :global() modifier and :global blocks to apply styles globally, and -global- prefix for keyframes.

Use `:global(selector)` to apply styles globally. Use `-global-` prefix for keyframes. Use `:global {...}` block for multiple global selectors:

```svelte
<style>
	:global(body) { margin: 0; }
	@keyframes -global-my-animation { }
	:global { div { } p { } }
</style>
```

### custom-properties
Pass and consume CSS custom properties in Svelte components for dynamic styling.

Pass CSS custom properties to components with `--property-name` syntax. Read them inside components using `var(--property-name, fallback)`. Properties are inherited from parent elements and can be defined globally on `:root`.

### nested-style-elements
Nested style tags bypass component scoping and apply globally to the DOM.

Only one top-level `<style>` tag per component is allowed. Nested `<style>` tags inside elements or logic blocks are inserted as-is without scoping, so they affect the entire DOM.

```svelte
<div>
	<style>
		div { color: red; }
	</style>
</div>
```

