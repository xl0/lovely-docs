## Scoped Styles

Svelte scopes component styles by default using hash-based classes (e.g., `svelte-123xyz`). Scoped selectors receive a 0-1-0 specificity boost to override global styles. Subsequent scoping uses `:where()` to prevent further specificity increases. `@keyframes` are automatically scoped.

## Global Styles

Use `:global(...)` modifier for single selectors or `:global` block for multiple selectors:

```svelte
<style>
	:global(body) { margin: 0; }
	:global {
		div { color: red; }
		p { font-size: 14px; }
	}
</style>
```

For keyframes, prepend `-global-`:

```svelte
@keyframes -global-my-animation { /* code */ }
```

## CSS Custom Properties

Pass CSS custom properties to components using `--property-name` syntax and consume them with `var(--property-name, fallback)`. Properties inherit from parent elements and can be defined globally on `:root`.

## Nested Style Elements

Only one top-level `<style>` tag per component is allowed. Nested `<style>` tags inside elements or logic blocks are inserted without scoping and apply globally to the DOM.
