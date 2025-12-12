# shadcn-svelte Documentation

Complete reference for a Svelte component library with 60+ composable UI components built on Bits UI, Embla Carousel, and LayerChart.

## Components (60+)

All components install via CLI:
```bash
npx shadcn-svelte@latest add <component> -y -o
```
Flags: `-y` skips confirmation, `-o` overwrites existing files.

**Core Components**: Accordion, Alert, Alert Dialog, Avatar, Badge, Breadcrumb, Button, Button Group, Calendar, Card, Carousel, Chart, Checkbox, Collapsible, Combobox, Command, Context Menu, Data Table, Date Picker, Dialog, Drawer, Dropdown Menu, Empty, Field, Form, Hover Card, Input, Input Group, Input OTP, Item, Kbd, Label, Menubar, Native Select, Navigation Menu, Pagination, Popover, Progress, Radio Group, Range Calendar, Resizable, Scroll Area, Select, Separator, Sheet, Sidebar, Skeleton, Slider, Sonner (toasts), Spinner, Switch, Table, Tabs, Textarea, Toggle, Toggle Group, Tooltip, Typography.

Each component is composable with subcomponents (e.g., Accordion has Root/Item/Trigger/Content), supports variants and sizes, integrates with sveltekit-superforms for form validation, and includes WAI-ARIA accessibility.

**Key Examples**:
- **Button**: Variants (primary, secondary, destructive, outline, ghost, link), `href` prop for links, loading state via Spinner, `buttonVariants` helper to style elements as buttons
- **Form**: Zod validation, Superforms integration, Field/Control/Label/Description/FieldErrors/Button/Fieldset/Legend subcomponents
- **Data Table**: TanStack Table v8 with pagination, sorting, filtering, column visibility, row selection, custom cell rendering via `createRawSnippet`/`renderSnippet`
- **Sidebar**: Composable with Provider/Root/Header/Content/Footer/Trigger, left/right positioning, sidebar/floating/inset variants, offcanvas/icon/none collapse modes, `useSidebar` hook, OKLch CSS variables for theming
- **Calendar**: Single/range selection, dropdown month/year navigation, popover integration, natural language parsing (chrono-node), date constraints (minValue/maxValue)
- **Combobox**: Searchable dropdown from Popover + Command, icons, form integration, keyboard navigation with refocus pattern
- **Input Group**: Container for icons, text, buttons, tooltips, dropdowns, spinners on inputs/textareas with Root/Input/Textarea/Addon/Text/Button subcomponents

## Installation

Setup guides for SvelteKit, Vite, Astro, and manual setup. All require TailwindCSS and path aliases configured in `svelte.config.js` (or `tsconfig.json` for Vite/Astro).

**SvelteKit**:
```bash
npx sv create my-app --add tailwindcss
npx shadcn-svelte@latest init
npx shadcn-svelte@latest add button -y -o
```

**Vite**: Configure TypeScript path aliases in `tsconfig.json` and `vite.config.ts`, then run init and add commands.

**Manual**: Install dependencies (tailwind-variants, clsx, tailwind-merge, tw-animate-css, @lucide/svelte), create `src/lib/utils.ts` with `cn()` utility, create `src/routes/layout.css` with Tailwind imports and CSS variables for light/dark theming using oklch color space.

**Astro**: Add Svelte and TailwindCSS integrations, configure path aliases, run init, import global CSS in pages, use components with `client:load` directive.

## Dark Mode

Install `mode-watcher`:
```bash
npm i mode-watcher
```

Add `ModeWatcher` component to root layout. API: `toggleMode()`, `setMode("light"|"dark")`, `resetMode()` for system preference.

**Simple toggle**:
```svelte
<script>
  import { toggleMode } from "mode-watcher";
  import { Button } from "$lib/components/ui/button";
</script>
<Button onclick={toggleMode} variant="outline" size="icon">
  <SunIcon class="dark:hidden" />
  <MoonIcon class="hidden dark:block" />
</Button>
```

**Dropdown with light/dark/system**:
```svelte
<DropdownMenu.Root>
  <DropdownMenu.Trigger>...</DropdownMenu.Trigger>
  <DropdownMenu.Content align="end">
    <DropdownMenu.Item onclick={() => setMode("light")}>Light</DropdownMenu.Item>
    <DropdownMenu.Item onclick={() => setMode("dark")}>Dark</DropdownMenu.Item>
    <DropdownMenu.Item onclick={() => resetMode()}>System</DropdownMenu.Item>
  </DropdownMenu.Content>
</DropdownMenu.Root>
```

For Astro, use Tailwind's `class` strategy with inline script to prevent FUOC.

## Theming

CSS variable-based theming with `background`/`foreground` naming convention. Supports light/dark modes via `.dark` class. Uses OKLCH color space.

**Default variables** (in `src/routes/layout.css`):
```css
:root {
  --radius: 0.625rem;
  --background: oklch(1 0 0);
  --foreground: oklch(0.145 0 0);
  --primary: oklch(0.205 0 0);
  --primary-foreground: oklch(0.985 0 0);
  --secondary: oklch(0.97 0 0);
  --muted: oklch(0.97 0 0);
  --accent: oklch(0.97 0 0);
  --destructive: oklch(0.577 0.245 27.325);
  --border: oklch(0.922 0 0);
  --input: oklch(0.922 0 0);
  --ring: oklch(0.708 0 0);
  --chart-1 through --chart-5: [color values];
  --sidebar: oklch(0.985 0 0);
  --sidebar-foreground: oklch(0.145 0 0);
  --sidebar-primary: oklch(0.205 0 0);
  --sidebar-primary-foreground: oklch(0.985 0 0);
  --sidebar-accent: oklch(0.97 0 0);
  --sidebar-border: oklch(0.922 0 0);
  --sidebar-ring: oklch(0.708 0 0);
}

.dark {
  --background: oklch(0.145 0 0);
  --foreground: oklch(0.985 0 0);
  [dark mode overrides...]
}
```

**Add custom colors**:
```css
:root {
  --warning: oklch(0.84 0.16 84);
  --warning-foreground: oklch(0.28 0.07 46);
}

@theme inline {
  --color-warning: var(--warning);
  --color-warning-foreground: var(--warning-foreground);
}
```

Pre-configured color presets: Neutral, Stone, Zinc, Gray, Slate (each with light/dark variants).

## CLI

**init**: Initialize project with dependencies, `cn` utility, CSS variables.
```bash
npx shadcn-svelte@latest init
```
Prompts for base color, CSS file path, import aliases.

**add**: Install components and dependencies.
```bash
npx shadcn-svelte@latest add <component> -y -o
```
Options: `-y` skip confirmation, `-o` overwrite existing files, `-a, --all` install all components, `--no-deps` skip package installation.

**registry build**: Generate registry JSON files.
```bash
npx shadcn-svelte@latest registry build [registry.json]
```
Outputs to `static/r` directory.

**Proxy**: Use HTTP proxy via environment variable:
```bash
HTTP_PROXY="<proxy-url>" npx shadcn-svelte@latest init
```

## components.json

Configuration file for CLI component generation. Create with `npx shadcn-svelte@latest init`.

**Schema reference**: `https://shadcn-svelte.com/schema.json`

**Key properties**:
- `tailwind.css`: Path to CSS file importing Tailwind
- `tailwind.baseColor`: Palette base (gray, neutral, slate, stone, zinc) - cannot change after init
- `aliases`: Path aliases for lib, utils, components, ui, hooks (must match `svelte.config.js`)
- `typescript`: Enable/disable TypeScript or specify custom config path
- `registry`: Registry URL (default: `https://shadcn-svelte.com/registry`)

## Custom Registries

Create and host custom component registries compatible with shadcn-svelte CLI.

**Registry structure** (`registry.json`):
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

**Registry item schema** (add to `items` array):
- `name`: Unique identifier
- `type`: registry:block, registry:component, registry:ui, registry:lib, registry:hook, registry:page, registry:file, registry:style, registry:theme
- `files`: Array with `path`, `type`, optional `target` (install destination)
- `dependencies`: npm packages
- `registryDependencies`: Other registry items
- `cssVars`: CSS variables by scope (theme, light, dark)
- `css`: Custom CSS rules (@layer, @utility, @keyframes)
- `docs`: Custom installation message
- `categories`: Organization tags
- `meta`: Arbitrary metadata

**Styles and themes**:
- `registry:style`: Extends shadcn-svelte or starts from scratch with custom colors
- `registry:theme`: Complete theme with light/dark variants

**Build and publish**:
```bash
npm run registry:build  # generates JSON in static/r/
npm run dev            # serves at http://localhost:5173/r/[NAME].json
```

Deploy to public URL. Users install with:
```bash
npx shadcn-svelte@latest add http://localhost:5173/r/hello-world.json -y -o
```

**Authentication**: Implement on registry server using token query parameter. Return 401 Unauthorized for invalid tokens.

## Migrations

**Svelte 4→5**: Update `components.json` with new registry and aliases. Install `tailwindcss-animate`. Update `tailwind.config.js` with plugin and sidebar colors. Update `utils.ts` with type helpers. Update dependencies (bits-ui, svelte-sonner, @lucide/svelte, paneforge, vaul-svelte, mode-watcher). Deprecated packages: cmdk-sv → Bits UI Command, svelte-headless-table → @tanstack/table-core, svelte-radix/lucide-svelte → @lucide/svelte. Migrate components with `npx shadcn-svelte@latest add <component> -y -o`.

**Tailwind v3→v4 + Svelte 5**: Follow official Tailwind v4 upgrade. Replace PostCSS with Vite: uninstall @tailwindcss/postcss, install @tailwindcss/vite. Update `vite.config.ts` to include tailwindcss plugin. Replace `tailwindcss-animate` with `tw-animate-css`. Update `app.css` with new Tailwind v4 syntax, @custom-variant for dark mode, and CSS variables. Remove `tailwind.config.ts`. Update dependencies. Update `utils.ts` with type helpers. Optionally update all components: `npm dlx shadcn-svelte@latest add --all --overwrite`. Replace `w-* h-*` with `size-*` utility.

## Changelog

**June 2025**: Calendar and RangeCalendar redesigned with dropdown month/year selectors, 30+ Calendar blocks.

**May 2025**: Tailwind v4 support, Charts (preview), custom registry support.

**March 2024**: Blocks (ready-made components), Breadcrumb, Scroll Area.

**February 2024**: Resizable (PaneForge-based), icon imports changed to deep imports for better dev server performance, Formsnap rewrite with `ids` as store (prefix with `$`), Form.Control component.

**January 2024**: Carousel (Embla-based), Drawer (vaul-svelte), Sonner (toast notifications), Pagination.

**December 2023**: Calendar, Range Calendar, Date Picker.

**November 2023**: Toggle Group.

**October 2023**: Command, Combobox.

## Component Structure

Components split into multiple files with barrel exports. Example (Accordion):
```
accordion/
  ├── accordion.svelte
  ├── accordion-content.svelte
  ├── accordion-item.svelte
  ├── accordion-trigger.svelte
  └── index.ts
```

Import approaches (both tree-shaken):
```ts
import * as Accordion from '$lib/components/ui/accordion'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '$lib/components/ui/accordion'
```

## IDE Extensions

**VSCode**: shadcn-svelte extension by @selemondev - initialize CLI, add components, navigate docs, import snippets.

**JetBrains IDEs**: shadcn/ui Components Manager by @WarningImHack3r - auto-detect components, add/remove/update, supports Svelte/React/Vue/Solid.

## JavaScript Support

Set `typescript: false` in `components.json` to use JavaScript versions. Configure `jsconfig.json` for path aliases.
