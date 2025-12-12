# Registry Examples

Registry items define styles, components, themes, blocks, and CSS customizations for shadcn-svelte projects.

## Registry Item Structure

All registry items use a JSON schema with `$schema`, `name`, `type`, and optional `dependencies`, `registryDependencies`, `cssVars`, and `css` fields.

## registry:style

**Extending shadcn-svelte:**
```json
{
  "$schema": "https://shadcn-svelte.com/schema/registry-item.json",
  "name": "example-style",
  "type": "registry:style",
  "dependencies": ["phosphor-svelte"],
  "registryDependencies": ["login-01", "calendar", "https://example.com/r/editor.json"],
  "cssVars": {
    "theme": {"font-sans": "Inter, sans-serif"},
    "light": {"brand": "oklch(0.145 0 0)"},
    "dark": {"brand": "oklch(0.145 0 0)"}
  }
}
```

**From scratch (no shadcn-svelte base):**
```json
{
  "$schema": "https://shadcn-svelte.com/schema/registry-item.json",
  "extends": "none",
  "name": "new-style",
  "type": "registry:style",
  "dependencies": ["tailwind-merge", "clsx"],
  "registryDependencies": ["utils", "https://example.com/r/button.json"],
  "cssVars": {
    "theme": {"font-sans": "Inter, sans-serif"},
    "light": {"main": "#88aaee", "bg": "#dfe5f2", "border": "#000", "text": "#000", "ring": "#000"},
    "dark": {"main": "#88aaee", "bg": "#272933", "border": "#000", "text": "#e6e6e6", "ring": "#fff"}
  }
}
```

## registry:theme

```json
{
  "$schema": "https://shadcn-svelte.com/schema/registry-item.json",
  "name": "custom-theme",
  "type": "registry:theme",
  "cssVars": {
    "light": {
      "background": "oklch(1 0 0)",
      "foreground": "oklch(0.141 0.005 285.823)",
      "primary": "oklch(0.546 0.245 262.881)",
      "primary-foreground": "oklch(0.97 0.014 254.604)",
      "ring": "oklch(0.746 0.16 232.661)",
      "sidebar-primary": "oklch(0.546 0.245 262.881)",
      "sidebar-primary-foreground": "oklch(0.97 0.014 254.604)",
      "sidebar-ring": "oklch(0.746 0.16 232.661)"
    },
    "dark": {
      "background": "oklch(1 0 0)",
      "foreground": "oklch(0.141 0.005 285.823)",
      "primary": "oklch(0.707 0.165 254.624)",
      "primary-foreground": "oklch(0.97 0.014 254.604)",
      "ring": "oklch(0.707 0.165 254.624)",
      "sidebar-primary": "oklch(0.707 0.165 254.624)",
      "sidebar-primary-foreground": "oklch(0.97 0.014 254.604)",
      "sidebar-ring": "oklch(0.707 0.165 254.624)"
    }
  }
}
```

Add custom colors to existing theme:
```json
{
  "name": "custom-style",
  "type": "registry:style",
  "cssVars": {
    "light": {"brand": "oklch(0.99 0.00 0)"},
    "dark": {"brand": "oklch(0.14 0.00 286)"}
  }
}
```

## registry:block

```json
{
  "$schema": "https://shadcn-svelte.com/schema/registry-item.json",
  "name": "login-01",
  "type": "registry:block",
  "description": "A simple login form.",
  "registryDependencies": ["button", "card", "input", "label"],
  "files": [
    {
      "path": "blocks/login-01/page.svelte",
      "content": "...",
      "type": "registry:page",
      "target": "src/routes/login/+page.svelte"
    },
    {
      "path": "blocks/login-01/components/login-form.svelte",
      "content": "...",
      "type": "registry:component"
    }
  ]
}
```

Override primitives when installing a block:
```json
{
  "name": "custom-login",
  "type": "registry:block",
  "registryDependencies": [
    "login-01",
    "https://example.com/r/button.json",
    "https://example.com/r/input.json",
    "https://example.com/r/label.json"
  ]
}
```

## CSS Variables

**Custom theme variables:**
```json
{
  "name": "custom-theme",
  "type": "registry:theme",
  "cssVars": {
    "theme": {
      "font-heading": "Inter, sans-serif",
      "shadow-card": "0 0 0 1px rgba(0, 0, 0, 0.1)"
    }
  }
}
```

**Override Tailwind CSS variables:**
```json
{
  "cssVars": {
    "theme": {
      "spacing": "0.2rem",
      "breakpoint-sm": "640px",
      "breakpoint-md": "768px",
      "breakpoint-lg": "1024px",
      "breakpoint-xl": "1280px",
      "breakpoint-2xl": "1536px"
    }
  }
}
```

## Custom CSS

**Base styles:**
```json
{
  "name": "custom-style",
  "type": "registry:style",
  "css": {
    "@layer base": {
      "h1": {"font-size": "var(--text-2xl)"},
      "h2": {"font-size": "var(--text-xl)"}
    }
  }
}
```

**Component styles:**
```json
{
  "name": "custom-card",
  "type": "registry:component",
  "css": {
    "@layer components": {
      "card": {
        "background-color": "var(--color-white)",
        "border-radius": "var(--rounded-lg)",
        "padding": "var(--spacing-6)",
        "box-shadow": "var(--shadow-xl)"
      }
    }
  }
}
```

## Custom Utilities

**Simple utility:**
```json
{
  "css": {
    "@utility content-auto": {
      "content-visibility": "auto"
    }
  }
}
```

**Complex utility with pseudo-selectors:**
```json
{
  "css": {
    "@utility scrollbar-hidden": {
      "scrollbar-hidden": {
        "&::-webkit-scrollbar": {"display": "none"}
      }
    }
  }
}
```

**Functional utilities with wildcards:**
```json
{
  "css": {
    "@utility tab-*": {
      "tab-size": "var(--tab-size-*)"
    }
  }
}
```

## Custom Animations

Define both `@keyframes` in css and animation in cssVars:
```json
{
  "name": "custom-component",
  "type": "registry:component",
  "cssVars": {
    "theme": {
      "--animate-wiggle": "wiggle 1s ease-in-out infinite"
    }
  },
  "css": {
    "@keyframes wiggle": {
      "0%, 100%": {"transform": "rotate(-3deg)"},
      "50%": {"transform": "rotate(3deg)"}
    }
  }
}
```