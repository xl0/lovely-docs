## Scoped Styles (Default)

Svelte automatically scopes styles with hash-based classes. Use `:global(selector)` or `:global { ... }` blocks to apply styles globally. Prepend `-global-` to keyframe names for global animations.

## CSS Custom Properties

Pass `--property-name` to components and consume with `var(--property-name, fallback)`.

## Nested Styles

Nested `<style>` tags apply globally without scoping.
