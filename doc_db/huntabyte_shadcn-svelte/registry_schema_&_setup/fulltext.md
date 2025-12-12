

## Pages

### registry-examples
Registry item JSON schema for styles, themes, blocks with dependencies, CSS variables, base/component/utility styles, and animations.

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

### registry-faq
Registry item structure with multiple file types, CSS variable configuration for Tailwind colors and theme overrides

## Complex Components

A registry item can include multiple file types:

```json
{
  "$schema": "https://shadcn-svelte.com/schema/registry-item.json",
  "name": "hello-world",
  "title": "Hello World",
  "type": "registry:block",
  "description": "A complex hello world component",
  "files": [
    {
      "path": "registry/hello-world/page.svelte",
      "type": "registry:page",
      "target": "src/routes/hello/+page.svelte"
    },
    {
      "path": "registry/hello-world/components/hello-world.svelte",
      "type": "registry:component"
    },
    {
      "path": "registry/hello-world/components/formatted-message.svelte",
      "type": "registry:component"
    },
    {
      "path": "registry/hello-world/hooks/use-hello.svelte.ts",
      "type": "registry:hook"
    },
    {
      "path": "registry/hello-world/lib/format-date.ts",
      "type": "registry:utils"
    },
    {
      "path": "registry/hello-world/hello.config.ts",
      "type": "registry:file",
      "target": "hello.config.ts"
    }
  ]
}
```

File types include: `registry:page`, `registry:component`, `registry:hook`, `registry:utils`, and `registry:file`. The `target` field specifies where files are installed in the project.

## Adding Tailwind Colors

Add colors to `cssVars` under `light` and `dark` keys:

```json
{
  "cssVars": {
    "light": {
      "brand-background": "20 14.3% 4.1%",
      "brand-accent": "20 14.3% 4.1%"
    },
    "dark": {
      "brand-background": "20 14.3% 4.1%",
      "brand-accent": "20 14.3% 4.1%"
    }
  }
}
```

The CLI updates the project CSS file. Colors become available as utility classes: `bg-brand`, `text-brand-accent`.

## Overriding Tailwind Theme Variables

Add or override theme variables in `cssVars.theme`:

```json
{
  "cssVars": {
    "theme": {
      "text-base": "3rem",
      "ease-in-out": "cubic-bezier(0.4, 0, 0.2, 1)",
      "font-heading": "Poppins, sans-serif"
    }
  }
}
```

### getting-started
Set up a component registry: create registry.json with items, place components in registry/[NAME]/ structure, build with CLI to generate static JSON files, serve and deploy publicly, optionally add token-based auth.

## registry.json

Create a `registry.json` file in the root of your project:

```json
{
  "$schema": "https://shadcn-svelte.com/schema/registry.json",
  "name": "acme",
  "homepage": "https://acme.com",
  "items": []
}
```

Must conform to the registry schema specification. Only required if using the shadcn-svelte CLI to build your registry.

## Add a registry item

### Create your component

Place components in `registry/[NAME]/` directory structure:

```
registry/
  hello-world/
    hello-world.svelte
```

Example component:

```svelte
<script lang="ts">
  import { Button } from "$lib/components/ui/button/index.js";
</script>
<Button>Hello World</Button>
```

If placing in a custom directory, ensure Tailwind CSS can detect it:

```css
/* src/routes/layout.css */
@source "./registry/@acmecorp/ui-lib";
```

### Add component to registry.json

```json
{
  "items": [
    {
      "name": "hello-world",
      "type": "registry:block",
      "title": "Hello World",
      "description": "A simple hello world component.",
      "files": [
        {
          "path": "./src/lib/hello-world/hello-world.svelte",
          "type": "registry:component"
        }
      ]
    }
  ]
}
```

Required properties: `name`, `type`, `title`, `description`, `files`. For each file, specify `path` (relative from project root) and `type`.

## Build your registry

Install CLI:

```bash
npm i shadcn-svelte@latest
```

Add build script to `package.json`:

```json
{
  "scripts": {
    "registry:build": "npm shadcn-svelte registry build"
  }
}
```

Run build:

```bash
npm run registry:build
```

By default generates registry JSON files in `static/r/` (e.g., `static/r/hello-world.json`). Change output directory with `--output` option.

## Serve your registry

```bash
npm run dev
```

Registry served at `http://localhost:5173/r/[NAME].json` (e.g., `http://localhost:5173/r/hello-world.json`).

## Publish your registry

Deploy project to a public URL to make registry available to other developers.

## Adding Auth

shadcn-svelte CLI does not offer built-in auth. Handle authorization on registry server. Common approach: use `token` query parameter, e.g., `http://localhost:5173/r/hello-world.json?token=[SECURE_TOKEN_HERE]`. Return 401 Unauthorized for invalid tokens. Encrypt and expire tokens.

## Guidelines

- Required block definition properties: `name`, `description`, `type`, `files`
- List all registry dependencies in `registryDependencies` (component names like `input`, `button`, or URLs to registry items)
- Ideally place files in `components`, `hooks`, or `lib` directories within registry item

## Install using CLI

```bash
npx shadcn-svelte@latest add http://localhost:5173/r/hello-world.json
```

### registry-item.json_schema
JSON schema specification for registry items with properties for name, type, files, dependencies, CSS variables, and metadata.

## registry-item.json Schema

JSON schema for defining custom registry items in shadcn-svelte.

### Complete Example

```json
{
  "$schema": "https://shadcn-svelte.com/schema/registry-item.json",
  "name": "hello-world",
  "title": "Hello World",
  "type": "registry:block",
  "description": "A simple hello world component.",
  "author": "John Doe <john@doe.com>",
  "dependencies": ["bits-ui", "zod", "@lucide/svelte", "name@1.0.2"],
  "registryDependencies": ["button", "input", "./stepper.json"],
  "files": [
    {
      "path": "registry/hello-world/hello-world.svelte",
      "type": "registry:component"
    },
    {
      "path": "registry/hello-world/use-hello-world.svelte.ts",
      "type": "registry:hook"
    },
    {
      "path": "registry/hello-world/page.svelte",
      "type": "registry:page",
      "target": "src/routes/hello/+page.svelte"
    },
    {
      "path": "registry/hello-world/.env",
      "type": "registry:file",
      "target": ".env"
    }
  ],
  "cssVars": {
    "theme": {
      "font-heading": "Poppins, sans-serif"
    },
    "light": {
      "brand": "20 14.3% 4.1%",
      "radius": "0.5rem"
    },
    "dark": {
      "brand": "20 14.3% 4.1%"
    }
  },
  "css": {
    "@layer base": {
      "body": {
        "font-size": "var(--text-base)",
        "line-height": "1.5"
      }
    },
    "@layer components": {
      "button": {
        "background-color": "var(--color-primary)",
        "color": "var(--color-white)"
      }
    },
    "@utility text-magic": {
      "font-size": "var(--text-base)",
      "line-height": "1.5"
    },
    "@keyframes wiggle": {
      "0%, 100%": {
        "transform": "rotate(-3deg)"
      },
      "50%": {
        "transform": "rotate(3deg)"
      }
    }
  },
  "docs": "Remember to add the FOO_BAR environment variable to your .env file.",
  "categories": ["sidebar", "dashboard"],
  "meta": { "foo": "bar" }
}
```

### Properties

**$schema** - URL to the registry-item.json schema for validation.

**name** - Unique identifier for the item in the registry (e.g., `"hello-world"`).

**title** - Human-readable title, short and descriptive.

**description** - Longer, detailed description of the item.

**type** - Specifies the item type:
- `registry:block` - Complex components with multiple files
- `registry:component` - Simple components
- `registry:lib` - Libraries and utilities
- `registry:hook` - Hooks
- `registry:ui` - UI components and single-file primitives
- `registry:page` - Page or file-based routes
- `registry:file` - Miscellaneous files
- `registry:style` - Registry styles (e.g., `new-york`)
- `registry:theme` - Themes

**author** - Author of the item (e.g., `"John Doe <john@doe.com>"`). Can be unique per item or shared with registry.

**dependencies** - Array of npm package dependencies. Use `@version` for specific versions (e.g., `"name@1.0.2"`).

**registryDependencies** - Array of other registry items this item depends on. Can be:
- shadcn-svelte registry items: `"button"`, `"input"`, `"select"`
- Remote URLs: `"https://example.com/r/hello-world.json"`
- Local aliases (CLI only): `"local:stepper"` converts to `"./stepper.json"` in output
- Relative paths: `"./stepper.json"`

**files** - Array of files with properties:
- `path` - Path to file in registry (used by build script)
- `type` - File type (see type section above)
- `target` - Where file should be placed in project (required for `registry:page` and `registry:file`). Use `~` for project root (e.g., `"~/foo.config.js"`). For other types, determined from `components.json`.

**cssVars** - Define CSS variables organized by theme scope:
```json
{
  "theme": { "font-heading": "Poppins, sans-serif" },
  "light": { "brand": "20 14.3% 4.1%" },
  "dark": { "brand": "20 14.3% 4.1%" }
}
```

**css** - Add CSS rules to project's CSS file. Supports `@layer base`, `@layer components`, `@utility`, `@keyframes`, etc.

**docs** - Custom documentation or message shown when installing via CLI.

**categories** - Array of category strings to organize the item (e.g., `["sidebar", "dashboard"]`).

**meta** - Object for arbitrary key/value metadata.

### registry.json
registry.json schema defines custom component registries with name, homepage, items, path aliases, and dependency overrides.

## registry.json Schema

Defines a custom component registry for shadcn-svelte.

### Structure

```json
{
  "$schema": "https://shadcn-svelte.com/schema/registry.json",
  "name": "acme",
  "homepage": "https://acme.com",
  "items": [
    {
      "name": "hello-world",
      "type": "registry:block",
      "title": "Hello World",
      "description": "A simple hello world component.",
      "files": [
        {
          "path": "src/lib/registry/blocks/hello-world/hello-world.svelte",
          "type": "registry:component"
        }
      ]
    }
  ],
  "aliases": {
    "lib": "@/lib",
    "ui": "@/lib/registry/ui",
    "components": "@/lib/registry/components",
    "utils": "@/lib/utils",
    "hooks": "@/lib/hooks"
  },
  "overrideDependencies": ["paneforge@next"]
}
```

### Properties

**$schema**: URL to the registry.json schema for validation.

**name**: Registry name used for data attributes and metadata.

**homepage**: Registry homepage URL for metadata.

**items**: Array of registry items. Each must implement the registry-item schema specification.

**aliases**: Maps internal import paths to their actual locations. When users install components, these paths are transformed according to their `components.json` configuration.

Default aliases if not specified:
- `lib`: `$lib/registry/lib` (internal library code)
- `ui`: `$lib/registry/ui` (UI components)
- `components`: `$lib/registry/components` (component-specific code)
- `utils`: `$lib/utils` (utility functions)
- `hooks`: `$lib/registry/hooks` (reactive state and logic)

Example: If your component imports `@/lib/registry/ui/button`, define `"ui": "@/lib/registry/ui"` in aliases so paths are correctly transformed during installation.

**overrideDependencies**: Forces specific version ranges for dependencies, overriding what `shadcn-svelte registry build` detects in `package.json`. Useful for pre-release versions or pinning specific versions.

Example: `"overrideDependencies": ["paneforge@next"]` forces the latest `@next` version instead of the version in package.json.

⚠️ Warning: Overriding dependencies can cause version conflicts. Use sparingly.

