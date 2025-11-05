The `<svelte:options>` element specifies per-component compiler options.

**Available options:**

- `runes={true|false}` — forces component into runes mode or legacy mode
- `namespace="html|svg|mathml"` — sets the namespace where the component will be used (default: "html")
- `customElement={...}` — options for compiling as a custom element; can be a string used as the tag name
- `css="injected"` — injects component styles inline as a `<style>` tag during SSR or via JavaScript during client-side rendering

**Deprecated in Svelte 5:**

- `immutable={true|false}` — enables simple referential equality checks for change detection
- `accessors={true|false}` — adds getters and setters for component props

**Example:**
```svelte
<svelte:options customElement="my-custom-element" />
```