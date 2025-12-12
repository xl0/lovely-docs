# Registry Examples

Registry items use JSON with `$schema`, `name`, `type`, and optional `dependencies`, `registryDependencies`, `cssVars`, `css` fields.

## registry:style

Extend shadcn-svelte or create from scratch with `"extends": "none"`:
```json
{
  "name": "example-style",
  "type": "registry:style",
  "dependencies": ["phosphor-svelte"],
  "registryDependencies": ["login-01", "https://example.com/r/editor.json"],
  "cssVars": {
    "theme": {"font-sans": "Inter, sans-serif"},
    "light": {"brand": "oklch(0.145 0 0)"},
    "dark": {"brand": "oklch(0.145 0 0)"}
  }
}
```

## registry:theme & registry:block

Themes define color schemes; blocks are reusable UI sections with files and dependencies:
```json
{
  "name": "login-01",
  "type": "registry:block",
  "registryDependencies": ["button", "card", "input"],
  "files": [
    {"path": "blocks/login-01/page.svelte", "type": "registry:page", "target": "src/routes/login/+page.svelte"},
    {"path": "blocks/login-01/components/login-form.svelte", "type": "registry:component"}
  ]
}
```

## CSS Customization

Add custom theme variables, override Tailwind breakpoints, define base/component styles, utilities, and animations:
```json
{
  "cssVars": {
    "theme": {"font-heading": "Inter, sans-serif", "breakpoint-sm": "640px"}
  },
  "css": {
    "@layer base": {"h1": {"font-size": "var(--text-2xl)"}},
    "@layer components": {"card": {"padding": "var(--spacing-6)"}},
    "@utility content-auto": {"content-visibility": "auto"},
    "@utility scrollbar-hidden": {"scrollbar-hidden": {"&::-webkit-scrollbar": {"display": "none"}}},
    "@utility tab-*": {"tab-size": "var(--tab-size-*)"},
    "@keyframes wiggle": {"0%, 100%": {"transform": "rotate(-3deg)"}, "50%": {"transform": "rotate(3deg)"}}
  }
}
```