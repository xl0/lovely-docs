## Scoped Styles
Svelte automatically scopes component styles with hash-based classes, giving them higher specificity than global styles. Keyframes are also scoped.

## Global Styles
Use `:global(selector)`, `-global-` prefix for keyframes, or `:global { ... }` blocks to apply styles globally.

## CSS Custom Properties
Pass and consume CSS custom properties with `--property-name` syntax and `var(--property-name, fallback)`.

## Nested Style Elements
Nested `<style>` tags bypass scoping and apply globally to the DOM.