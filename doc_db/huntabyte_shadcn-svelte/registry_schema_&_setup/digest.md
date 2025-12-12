## Registry System

Complete specification for creating and publishing custom component registries in shadcn-svelte.

### Registry Structure

Create `registry.json` at project root:
```json
{
  "$schema": "https://shadcn-svelte.com/schema/registry.json",
  "name": "acme",
  "homepage": "https://acme.com",
  "items": [],
  "aliases": {
    "lib": "@/lib",
    "ui": "@/lib/registry/ui",
    "components": "@/lib/registry/components",
    "utils": "@/lib/utils",
    "hooks": "@/lib/registry/hooks"
  },
  "overrideDependencies": ["paneforge@next"]
}
```

Place components in `registry/[NAME]/` directory structure. Add to `registry.json` items array with required properties: `name`, `type`, `title`, `description`, `files`.

### Registry Item Schema

Registry items use JSON schema with core properties:

**name** - Unique identifier (e.g., `"hello-world"`)

**type** - Item type:
- `registry:block` - Complex components with multiple files
- `registry:component` - Simple components
- `registry:ui` - UI components and primitives
- `registry:lib` - Libraries and utilities
- `registry:hook` - Hooks
- `registry:page` - Routes
- `registry:file` - Miscellaneous files
- `registry:style` - Styles (e.g., `new-york`)
- `registry:theme` - Themes

**files** - Array with `path` (relative from project root), `type`, and optional `target` (where to install):
```json
{
  "files": [
    {"path": "registry/hello-world/hello-world.svelte", "type": "registry:component"},
    {"path": "registry/hello-world/page.svelte", "type": "registry:page", "target": "src/routes/hello/+page.svelte"},
    {"path": "registry/hello-world/config.ts", "type": "registry:file", "target": "~/config.ts"}
  ]
}
```

**dependencies** - npm packages: `["bits-ui", "zod", "name@1.0.2"]`

**registryDependencies** - Other registry items: `["button", "input", "https://example.com/r/editor.json", "./stepper.json"]`

**cssVars** - CSS variables by scope:
```json
{
  "cssVars": {
    "theme": {"font-heading": "Poppins, sans-serif"},
    "light": {"brand": "20 14.3% 4.1%", "radius": "0.5rem"},
    "dark": {"brand": "20 14.3% 4.1%"}
  }
}
```

**css** - Custom CSS rules:
```json
{
  "css": {
    "@layer base": {"h1": {"font-size": "var(--text-2xl)"}},
    "@layer components": {"card": {"background-color": "var(--color-white)"}},
    "@utility content-auto": {"content-visibility": "auto"},
    "@keyframes wiggle": {"0%, 100%": {"transform": "rotate(-3deg)"}, "50%": {"transform": "rotate(3deg)"}}
  }
}
```

**docs** - Custom installation message

**categories** - Organization tags: `["sidebar", "dashboard"]`

**meta** - Arbitrary metadata object

### Registry Styles & Themes

**registry:style** - Extends shadcn-svelte or starts from scratch:
```json
{
  "name": "example-style",
  "type": "registry:style",
  "extends": "none",
  "dependencies": ["tailwind-merge", "clsx"],
  "registryDependencies": ["utils", "button"],
  "cssVars": {
    "theme": {"font-sans": "Inter, sans-serif"},
    "light": {"main": "#88aaee", "bg": "#dfe5f2"},
    "dark": {"main": "#88aaee", "bg": "#272933"}
  }
}
```

**registry:theme** - Define complete theme with light/dark variants:
```json
{
  "name": "custom-theme",
  "type": "registry:theme",
  "cssVars": {
    "light": {
      "background": "oklch(1 0 0)",
      "foreground": "oklch(0.141 0.005 285.823)",
      "primary": "oklch(0.546 0.245 262.881)",
      "sidebar-primary": "oklch(0.546 0.245 262.881)"
    },
    "dark": {
      "background": "oklch(1 0 0)",
      "primary": "oklch(0.707 0.165 254.624)"
    }
  }
}
```

### Building & Publishing

Install CLI: `npm i shadcn-svelte@latest`

Add to `package.json`: `"registry:build": "shadcn-svelte registry build"`

Run: `npm run registry:build` - generates JSON files in `static/r/` (e.g., `static/r/hello-world.json`)

Serve locally: `npm run dev` - registry at `http://localhost:5173/r/[NAME].json`

Deploy to public URL to make available to other developers.

### Authentication

shadcn-svelte CLI has no built-in auth. Implement on registry server using token query parameter: `http://localhost:5173/r/hello-world.json?token=[SECURE_TOKEN_HERE]`. Return 401 Unauthorized for invalid tokens.

### Installation

Users install with: `npx shadcn-svelte@latest add http://localhost:5173/r/hello-world.json -y -o`

Flags: `-y` skips confirmation prompt, `-o` overwrites existing files