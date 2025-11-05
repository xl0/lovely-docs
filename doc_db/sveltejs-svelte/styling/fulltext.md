

## Pages

### scoped-styles
Svelte components have scoped styles by default, implemented via hash-based classes that prevent style leakage and increase selector specificity.

Svelte scopes component styles by adding a hash-based class (e.g., `svelte-123xyz`) to elements. Scoped selectors get a 0-1-0 specificity boost, overriding global styles. Subsequent scoping class additions use `:where()` to avoid further specificity increases. `@keyframes` are also scoped automatically.

### global-styles
Use :global(...) modifier or :global block to apply styles globally in Svelte components.

## :global(...) modifier

Apply styles globally to single selectors:

```svelte
<style>
	:global(body) { margin: 0; }
	div :global(strong) { color: goldenrod; }
</style>
```

For keyframes, prepend `-global-`:

```svelte
@keyframes -global-my-animation-name { /* code */ }
```

## :global block

Apply styles to multiple selectors globally:

```svelte
<style>
	:global {
		div { ... }
		p { ... }
	}
</style>
```

### custom-properties
Pass and consume CSS custom properties in Svelte components for dynamic styling.

Pass CSS custom properties to components with `--property-name` syntax. Read them inside components using `var(--property-name, fallback)`. Properties are inherited from parent elements and can be defined globally on `:root`.

### nested-style-elements
Nested style tags in Svelte components are inserted without scoping and apply globally to the DOM.

Only one top-level `<style>` tag per component allowed. Nested `<style>` tags inside elements or logic blocks are inserted as-is without scoping, applying globally to matching DOM elements.

```svelte
<div>
	<style>
		div { color: red; }
	</style>
</div>
```

