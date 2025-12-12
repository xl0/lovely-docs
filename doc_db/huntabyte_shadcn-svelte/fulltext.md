
## Directories

### components
60+ composable UI components with subcomponents, variants, sizes, and form integration via sveltekit-superforms.

# Components

Comprehensive collection of 60+ reusable UI components built on Bits UI, Embla Carousel, LayerChart, and other libraries. Each component is installable via CLI and composable with subcomponents.

## Installation Pattern

All components install via:
```bash
npx shadcn-svelte@latest add <component> -y -o
```
Flags: `-y` skips confirmation, `-o` overwrites existing files.

## Core Components

**Accordion** - Vertically stacked interactive headings with single/multiple open items. Root/Item/Trigger/Content subcomponents. WAI-ARIA accessible.

**Alert** - Callout component with Root/Title/Description. Supports default and destructive variants.

**Alert Dialog** - Modal dialog interrupting user with important content. Root/Trigger/Content/Header/Title/Description/Footer/Cancel/Action subcomponents.

**Avatar** - Image element with fallback text. Root/Image/Fallback. Supports custom styling and grouped avatars with negative spacing.

**Badge** - Small label component with variants (default, secondary, destructive, outline). Use `badgeVariants` helper to style links as badges.

**Breadcrumb** - Hierarchical navigation path. Root/List/Item/Link/Page/Separator/Ellipsis. Supports custom separators, dropdowns, ellipsis collapse, and responsive desktop/mobile variants via MediaQuery and Drawer/DropdownMenu composition.

**Button** - Clickable action element with variants (primary, secondary, destructive, outline, ghost, link). Supports `href` prop for links, icons, and loading state via Spinner. Use `buttonVariants` helper to style elements as buttons.

**Button Group** - Container grouping related buttons with consistent styling. Supports vertical orientation, separators, nesting. Composable with Input, Select, DropdownMenu, Popover, InputGroup.

**Calendar** - Date selection component with single/range selection, dropdown month/year navigation, popover integration, natural language parsing support (chrono-node), and date constraints (minValue/maxValue).

**Card** - Container with Root/Header/Title/Description/Action/Content/Footer subcomponents. Flexible layout for displaying grouped content.

**Carousel** - Embla-based image carousel with sizing, spacing, vertical/horizontal orientation, options, API for state tracking, events, and plugin support (autoplay).

**Chart** - LayerChart-based customizable charts with composition design, CSS variable theming, and tooltip support. Define data and config separately, build charts using LayerChart components directly.

**Checkbox** - Toggle control with checked/disabled states, data-attribute styling, and sveltekit-superforms integration.

**Collapsible** - Expandable/collapsible panel with Root/Trigger/Content subcomponents.

**Combobox** - Searchable dropdown built from Popover + Command. Supports icons, form integration, keyboard navigation with refocus pattern. Example: status selector with icons, dropdown menu with combobox submenu, form integration with validation.

**Command** - Fast, composable command menu with Root/Input/List/Empty/Group/Item/Separator/Shortcut/Dialog variants. Supports grouped items, shortcuts, disabled state, auto-styled icons.

**Context Menu** - Right-click triggered menu with items, submenus, checkboxes, radio groups, separators, keyboard shortcuts.

**Data Table** - TanStack Table v8 integration with pagination, sorting, filtering, column visibility, row selection. Custom cell rendering via `createRawSnippet`/`renderSnippet`. Row actions via `renderComponent`. Complete example with all features.

**Date Picker** - Popover-based date picker combining Popover and Calendar/RangeCalendar. Supports single/range selection, presets via Select, dropdown month navigation, date constraints, form validation integration.

**Dialog** - Modal overlay with Root/Trigger/Content/Header/Title/Description/Footer subcomponents.

**Drawer** - Slide-out panel built on Vaul Svelte. Root/Trigger/Content/Header/Title/Description/Footer/Close. Responsive Dialog/Drawer switching via MediaQuery for desktop/mobile.

**Dropdown Menu** - Menu triggered by button with items, groups, checkboxes, radio groups, submenus, shortcuts, disabled states.

**Empty** - Empty state component with customizable media (icon/avatar), title, description, content sections. Supports outline/gradient styling and various content types (buttons, InputGroup, links).

**Field** - Accessible form field wrapper supporting vertical/horizontal/responsive layouts with labels, descriptions, errors, semantic grouping. Examples: input fields, textarea, select, slider, checkbox group, radio group, switch, choice cards, field groups with separators, complex payment form.

**Form** - Composable form components with Zod validation, ARIA attributes, Superforms integration. Field/Control/Label/Description/FieldErrors/Button/Fieldset/Legend subcomponents. Complete SPA and server-side examples.

**Hover Card** - Preview content on hover for sighted users. Root/Trigger/Content. Trigger accepts link attributes (href, target, rel).

**Input** - Form input field supporting email, file, disabled, invalid states, labels, helper text, buttons. Form validation with sveltekit-superforms.

**Input Group** - Container for adding icons, text, buttons, tooltips, dropdowns, spinners to inputs/textareas. Root/Input/Textarea/Addon/Text/Button. Addon alignment: inline-end (default), block-start, block-end. Examples: icons, text prefixes/suffixes, buttons, tooltips, textarea with labels, dropdowns, button groups, custom inputs via data-slot attribute.

**Input OTP** - Accessible one-time password component with configurable length, pattern validation (REGEXP_ONLY_DIGITS_AND_CHARS), separators, error states, form integration.

**Item** - Flex container for displaying content with title, description, actions. Root/Header/Media/Content/Title/Description/Actions/Footer/Group/Separator. Variants: default, outline, muted. Sizes: default, sm. Media variants: icon, avatar, image. Supports grouping, links via child snippet, dropdown integration.

**Kbd** - Keyboard input display. Root for single keys, Group for multiple keys. Examples: in buttons, tooltips, input groups.

**Label** - Accessible label associated with form controls via `for` attribute.

**Menubar** - Desktop menubar with menus, submenus, separators, shortcuts, checkboxes, radio buttons. Root/Menu/Trigger/Content/Item/Shortcut/Separator/Sub/SubTrigger/SubContent/CheckboxItem/RadioGroup/RadioItem.

**Native Select** - Styled native HTML select with grouping, disabled states, validation, accessibility. Root/Option/OptGroup. Prefer over Select for native behavior and mobile optimization.

**Navigation Menu** - Collection of links for navigating websites. Root/List/Item/Trigger/Content/Link. Supports custom layouts, icons, responsive grids. Use `navigationMenuTriggerStyle()` utility for trigger styling.

**Pagination** - Paginated content navigation with configurable items-per-page, sibling count, previous/next buttons, ellipsis support. Root/Content/Item/PrevButton/NextButton/Link/Ellipsis. Responsive-friendly with snippet-based rendering.

**Popover** - Portal popover triggered by button. Root/Trigger/Content. Displays rich content.

**Progress** - Progress bar indicator with reactive value and max props.

**Radio Group** - Set of radio buttons where only one can be checked. Root/Item. Form integration with sveltekit-superforms.

**Range Calendar** - Date range picker built on Bits UI, uses @internationalized/date.

**Resizable** - Accessible resizable panel groups with horizontal/vertical layouts, keyboard support, nested pane support via PaneForge. PaneGroup/Pane/Handle with direction, defaultSize, withHandle props.

**Scroll Area** - Custom-styled scrollable container with vertical, horizontal, or bidirectional scrolling via `orientation` prop.

**Select** - Dropdown selector with single selection, grouping, disabled items, form integration. Root/Trigger/Content/Group/Label/Item. Dynamic content with $derived for trigger text. Form validation with sveltekit-superforms.

**Separator** - Visual/semantic content divider. Horizontal (default) or vertical via `orientation` prop.

**Sheet** - Dialog-based overlay sliding from screen edges (top/right/bottom/left). Root/Trigger/Content/Header/Title/Description/Footer/Close. Customizable size via CSS classes on Content.

**Sidebar** - Composable, themeable, customizable sidebar with Provider/Root/Header/Content/Footer/Trigger. Supports left/right, sidebar/floating/inset variants, offcanvas/icon/none collapse modes. useSidebar hook for state. Menu with Button/Action/Sub/Badge/Skeleton. Collapsible groups/menus via Collapsible. OKLch CSS variables for theming. Width customization via CSS variables or constants.

**Skeleton** - Placeholder component for loading states. Styled with Tailwind classes for size, shape, spacing.

**Slider** - Range input with single/multiple thumbs, horizontal/vertical orientation, configurable step and max value.

**Sonner** - Toast notification component with success/error variants, descriptions, action buttons. Dark mode support via system preferences or theme prop. Add Toaster to root layout.

**Spinner** - Loading state indicator. Customize size/color with utility classes or replace icon. Integrates with Button, Badge, InputGroup, Empty, Item components.

**Switch** - Toggle control with form integration, disabled/readonly states, sveltekit-superforms support.

**Table** - Responsive table with Root/Caption/Header/Body/Footer/Row/Head/Cell subcomponents. Supports dynamic data rendering, colspan, Tailwind styling.

**Tabs** - Tabbed interface with Root/List/Trigger/Content subcomponents. Activate tabs by matching value props.

**Textarea** - Multi-line text input with disabled state, labels, form validation integration.

**Toggle** - Two-state button with outline/default variants, sm/default/lg sizes, disabled state, icon/text content support.

**Toggle Group** - Set of two-state buttons with single/multiple selection modes, outline variant, sm/lg sizes, disabled state.

**Tooltip** - Hover/focus popup. Root/Trigger/Content. Wrap app in Tooltip.Provider (once in root layout). Supports nested providers with custom `delayDuration`.

**Typography** - Utility-based text styles for headings (h1-h4), paragraphs (standard, lead, large, small, muted), blockquotes, lists, tables, inline code using Tailwind classes.


### dark_mode
Dark mode setup using mode-watcher with toggle components and theme control functions

## Dark Mode Setup

Install `mode-watcher`:
```bash
npm i mode-watcher
```

Add `ModeWatcher` component to your root layout to enable dark mode functionality:
```svelte
// src/routes/+layout.svelte
<script lang="ts">
  import { ModeWatcher } from "mode-watcher";
  let { children } = $props();
</script>
<ModeWatcher />
{@render children?.()}
```

## Mode Toggle Components

**Simple button toggle:**
```svelte
<script lang="ts">
  import SunIcon from "@lucide/svelte/icons/sun";
  import MoonIcon from "@lucide/svelte/icons/moon";
  import { toggleMode } from "mode-watcher";
  import { Button } from "$lib/components/ui/button/index.js";
</script>
<Button onclick={toggleMode} variant="outline" size="icon">
  <SunIcon class="transition-all! h-[1.2rem] w-[1.2rem] rotate-0 scale-100 dark:-rotate-90 dark:scale-0" />
  <MoonIcon class="transition-all! absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 dark:rotate-0 dark:scale-100" />
  <span class="sr-only">Toggle theme</span>
</Button>
```

**Dropdown menu with light/dark/system options:**
```svelte
<script lang="ts">
  import { resetMode, setMode } from "mode-watcher";
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
  import { buttonVariants } from "$lib/components/ui/button/index.js";
</script>
<DropdownMenu.Root>
  <DropdownMenu.Trigger class={buttonVariants({ variant: "outline", size: "icon" })}>
    <!-- Sun/Moon icons -->
  </DropdownMenu.Trigger>
  <DropdownMenu.Content align="end">
    <DropdownMenu.Item onclick={() => setMode("light")}>Light</DropdownMenu.Item>
    <DropdownMenu.Item onclick={() => setMode("dark")}>Dark</DropdownMenu.Item>
    <DropdownMenu.Item onclick={() => resetMode()}>System</DropdownMenu.Item>
  </DropdownMenu.Content>
</DropdownMenu.Root>
```

## API Functions

- `toggleMode()` - Toggle between light and dark
- `setMode("light" | "dark")` - Set explicit mode
- `resetMode()` - Reset to system preference

## Astro Integration

For Astro projects, use Tailwind's `class` strategy with an inline script to prevent FUOC (Flash of Unstyled Content):

```astro
<script is:inline>
  const isBrowser = typeof localStorage !== 'undefined';
  const getThemePreference = () => {
    if (isBrowser && localStorage.getItem('theme')) {
      return localStorage.getItem('theme');
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  };
  const isDark = getThemePreference() === 'dark';
  document.documentElement.classList[isDark ? 'add' : 'remove']('dark');
  if (isBrowser) {
    const observer = new MutationObserver(() => {
      const isDark = document.documentElement.classList.contains('dark');
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });
  }
</script>
```

Add `ModeWatcher` with `client:load` directive in Astro layouts to enable theme toggling.

### installation
Step-by-step installation and configuration for different project types (SvelteKit, Vite, manual, Astro)

## Installation guides for shadcn-svelte across different frameworks and setups

### SvelteKit Setup
Create project with TailwindCSS:
```bash
npx sv create my-app --add tailwindcss
npx shadcn-svelte@latest init
npx shadcn-svelte@latest add button -y -o
```
Configure path aliases in `svelte.config.js` if not using default `$lib`:
```ts
const config = {
  kit: {
    alias: {
      "@/*": "./path/to/lib/*",
    },
  },
};
```
Import components from `$lib/components/ui/`.

### Vite Setup
Add TailwindCSS and configure TypeScript path aliases in `tsconfig.json` and `tsconfig.app.json`:
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "$lib": ["./src/lib"],
      "$lib/*": ["./src/lib/*"]
    }
  }
}
```
Configure Vite in `vite.config.ts`:
```ts
import path from "path";
export default defineConfig({
  resolve: {
    alias: {
      $lib: path.resolve("./src/lib"),
    },
  },
});
```
Then run `npx shadcn-svelte@latest init` and add components.

### Manual Setup
Install dependencies: `npm i tailwind-variants clsx tailwind-merge tw-animate-css @lucide/svelte`

Create `src/lib/utils.ts` with class merging utility:
```ts
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

Create `src/routes/layout.css` with Tailwind imports and CSS variables for light/dark theming using oklch color space. Define `--radius`, `--background`, `--foreground`, `--primary`, `--secondary`, `--muted`, `--accent`, `--destructive`, `--border`, `--input`, `--ring`, `--chart-1` through `--chart-5`, and sidebar-related variables. Include `.dark` class overrides for dark mode.

Create `src/routes/+layout.svelte` to import global styles.

### Astro Setup
Create Astro project and add Svelte and TailwindCSS:
```bash
npm create astro@latest
npx astro add svelte
npx astro add tailwind
```

Configure path aliases in `tsconfig.json`:
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "$lib": ["./src/lib"],
      "$lib/*": ["./src/lib/*"]
    }
  }
}
```

Run `npx shadcn-svelte@latest init` and configure with Slate theme and `$lib`-based aliases.

Import global CSS in `src/pages/index.astro` and use components with client directives:
```astro
---
import { Button } from "$lib/components/ui/button/index.js";
import "../styles/global.css";
---
<Button>Hello World</Button>
```

### Common Configuration
All setups use the same component installation command:
```bash
npx shadcn-svelte@latest add <component> -y -o
```
Where `-y` skips confirmation prompt and `-o` overwrites existing files.

Default init configuration prompts for: base color (Slate), global CSS file location, and import aliases for lib, components, utils, hooks, and ui components.

### migration_guides
Step-by-step upgrade paths from Svelte 4→5 and Tailwind v3→v4 with configuration changes, dependency updates, and component migration commands.

## Svelte 4→5 Migration

Update `components.json` with registry and new aliases (`components`, `utils`, `ui`, `hooks`, `lib`).

Install `tailwindcss-animate`:
```bash
npm i tailwindcss-animate
```

Update `tailwind.config.js` to include the plugin and sidebar color theme:
```ts
import tailwindcssAnimate from "tailwindcss-animate";
const config: Config = {
  darkMode: ["class"],
  content: ["./src/**/*.{html,js,svelte,ts}"],
  theme: {
    extend: {
      colors: {
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      keyframes: {
        "accordion-down": { from: { height: "0" }, to: { height: "var(--bits-accordion-content-height)" } },
        "accordion-up": { from: { height: "var(--bits-accordion-content-height)" }, to: { height: "0" } },
        "caret-blink": { "0%,70%,100%": { opacity: "1" }, "20%,50%": { opacity: "0" } },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "caret-blink": "caret-blink 1.25s ease-out infinite",
      },
    },
  },
  plugins: [tailwindcssAnimate],
};
```

Replace `utils.ts` with:
```ts
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type WithoutChild<T> = T extends { child?: any } ? Omit<T, "child"> : T;
export type WithoutChildren<T> = T extends { children?: any } ? Omit<T, "children"> : T;
export type WithoutChildrenOrChild<T> = WithoutChildren<WithoutChild<T>>;
export type WithElementRef<T, U extends HTMLElement = HTMLElement> = T & { ref?: U | null };
```

Update dependencies:
```bash
npm i bits-ui@latest svelte-sonner@latest @lucide/svelte@latest paneforge@next vaul-svelte@next mode-watcher@latest
```

Deprecated packages replaced: `cmdk-sv` → Bits UI Command, `svelte-headless-table` → `@tanstack/table-core`, `svelte-radix`/`lucide-svelte` → `@lucide/svelte`.

Migrate components with:
```bash
npx shadcn-svelte@latest add <component> -y -o
```
(`-y`: skip confirmation, `-o`: overwrite existing files)

Remove old packages after migration:
```bash
npm uninstall cmdk-sv svelte-headless-table svelte-radix lucide-svelte
```

## Tailwind v3→v4 + Svelte 5 Migration

Follow official Tailwind v4 upgrade guide first.

Replace PostCSS with Vite. Delete `postcss.config.js`:
```bash
npm uninstall @tailwindcss/postcss
npm i @tailwindcss/vite -D
```

Update `vite.config.ts`:
```ts
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [tailwindcss(), sveltekit()],
});
```

Replace `tailwindcss-animate` with `tw-animate-css`:
```bash
npm uninstall tailwindcss-animate
npm i tw-animate-css -D
```

Update `app.css`:
```css
@import "tailwindcss";
@import "tw-animate-css";
@custom-variant dark (&:is(.dark *));

:root {
  --background: hsl(0 0% 100%);
  --foreground: hsl(240 10% 3.9%);
  --muted: hsl(240 4.8% 95.9%);
  --muted-foreground: hsl(240 3.8% 46.1%);
  --popover: hsl(0 0% 100%);
  --popover-foreground: hsl(240 10% 3.9%);
  --card: hsl(0 0% 100%);
  --card-foreground: hsl(240 10% 3.9%);
  --border: hsl(240 5.9% 90%);
  --input: hsl(240 5.9% 90%);
  --primary: hsl(240 5.9% 10%);
  --primary-foreground: hsl(0 0% 98%);
  --secondary: hsl(240 4.8% 95.9%);
  --secondary-foreground: hsl(240 5.9% 10%);
  --accent: hsl(240 4.8% 95.9%);
  --accent-foreground: hsl(240 5.9% 10%);
  --destructive: hsl(0 72.2% 50.6%);
  --destructive-foreground: hsl(0 0% 98%);
  --ring: hsl(240 10% 3.9%);
  --sidebar: hsl(0 0% 98%);
  --sidebar-foreground: hsl(240 5.3% 26.1%);
  --sidebar-primary: hsl(240 5.9% 10%);
  --sidebar-primary-foreground: hsl(0 0% 98%);
  --sidebar-accent: hsl(240 4.8% 95.9%);
  --sidebar-accent-foreground: hsl(240 5.9% 10%);
  --sidebar-border: hsl(220 13% 91%);
  --sidebar-ring: hsl(217.2 91.2% 59.8%);
  --radius: 0.5rem;
}

.dark {
  --background: hsl(240 10% 3.9%);
  --foreground: hsl(0 0% 98%);
  --muted: hsl(240 3.7% 15.9%);
  --muted-foreground: hsl(240 5% 64.9%);
  --popover: hsl(240 10% 3.9%);
  --popover-foreground: hsl(0 0% 98%);
  --card: hsl(240 10% 3.9%);
  --card-foreground: hsl(0 0% 98%);
  --border: hsl(240 3.7% 15.9%);
  --input: hsl(240 3.7% 15.9%);
  --primary: hsl(0 0% 98%);
  --primary-foreground: hsl(240 5.9% 10%);
  --secondary: hsl(240 3.7% 15.9%);
  --secondary-foreground: hsl(0 0% 98%);
  --accent: hsl(240 3.7% 15.9%);
  --accent-foreground: hsl(0 0% 98%);
  --destructive: hsl(0 62.8% 30.6%);
  --destructive-foreground: hsl(0 0% 98%);
  --ring: hsl(240 4.9% 83.9%);
  --sidebar: hsl(240 5.9% 10%);
  --sidebar-foreground: hsl(240 4.8% 95.9%);
  --sidebar-primary: hsl(224.3 76.3% 48%);
  --sidebar-primary-foreground: hsl(0 0% 100%);
  --sidebar-accent: hsl(240 3.7% 15.9%);
  --sidebar-accent-foreground: hsl(240 4.8% 95.9%);
  --sidebar-border: hsl(240 3.7% 15.9%);
  --sidebar-ring: hsl(217.2 91.2% 59.8%);
}

@theme inline {
  --radius-sm: calc(var(--radius) - 4px);
  --radius-md: calc(var(--radius) - 2px);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) + 4px);
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-popover: var(--popover);
  --color-popover-foreground: var(--popover-foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-destructive: var(--destructive);
  --color-destructive-foreground: var(--destructive-foreground);
  --color-ring: var(--ring);
  --color-sidebar: var(--sidebar);
  --color-sidebar-foreground: var(--sidebar-foreground);
  --color-sidebar-primary: var(--sidebar-primary);
  --color-sidebar-primary-foreground: var(--sidebar-primary-foreground);
  --color-sidebar-accent: var(--sidebar-accent);
  --color-sidebar-accent-foreground: var(--sidebar-accent-foreground);
  --color-sidebar-border: var(--sidebar-border);
  --color-sidebar-ring: var(--sidebar-ring);
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}
```

Remove `tailwind.config.ts` after verifying styles work.

Update dependencies:
```bash
npm i bits-ui@latest @lucide/svelte@latest tailwind-variants@latest tailwind-merge@latest clsx@latest svelte-sonner@latest paneforge@next vaul-svelte@next formsnap@latest
```

Update `utils.ts` to include type helpers (same as Svelte 5 migration above).

Optionally update all components with new colors:
```bash
npm dlx shadcn-svelte@latest add --all --overwrite
```

Replace `w-* h-*` with `size-*` utility.

### registry_schema_&_setup
JSON schema specification and setup guide for creating custom component registries with styles, themes, blocks, and CSS customizations.

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



## Pages

### changelog
Release history: June 2025 Calendar overhaul; May 2025 Tailwind v4, Charts, custom registries; Feb 2024 Resizable, deep icon imports, Formsnap rewrite ($ids store, Form.Control); Jan 2024 Carousel, Drawer, Sonner, Pagination; Dec 2023 Calendar/RangeCalendar/DatePicker; Nov 2023 ToggleGroup; Oct 2023 Command/Combobox.

# Changelog

## June 2025

### Calendar Components Overhaul
`Calendar` and `RangeCalendar` components completely redesigned with dropdown month/year selectors and 30+ Calendar blocks for building custom calendar components.

## May 2025

### Tailwind v4 Support
Official Tailwind v4 support released. Full migration guide available. Projects using Svelte v5 with Tailwind v3 continue to work until upgrade.

### Charts (Preview)
Charts added as preview component. Available via CLI for Svelte v5 + Tailwind v4 projects.

### Custom Registry Support
Custom/remote registries now supported, allowing publishing and sharing components via the CLI.

## March 2024

### Blocks
Ready-made, fully responsive, accessible, composable components built using same principles as core components.

### New Components
- **Breadcrumb**: Navigation component
- **Scroll Area**: Built on Bits UI, supports vertical and horizontal scrolling with consistent cross-browser experience

## February 2024

### Resizable Component
Built on PaneForge (early stage library). Allows creating resizable pane layouts.

### Icon Import Changes
Moved from unmaintained `radix-icons-svelte` to `svelte-radix` for new-york style. Changed from barrel imports to deep imports for better dev server performance:

```ts
// Before
import { Check } from "@lucide/svelte";

// After
import Check from "@lucide/svelte/icons/check";
```

Deep imports prevent Vite from optimizing entire icon collections, only optimizing used icons.

### Forms Major Update
Formsnap completely rewritten for flexibility and power. No direct migration path from old version.

**Form.Label Changes**: `ids` from `getFormField()` is now a store, prefix with `$`:
```svelte
<Label for={$ids.input} class={cn($errors && "text-destructive", className)}>
  <slot />
</Label>
```

**Form.Control**: New component wraps non-traditional form elements for accessibility:
```ts
// src/lib/ui/form/index.ts
const Control = FormPrimitive.Control;
export { Control, Control as FormControl };
```

## January 2024

### New Components
- **Carousel**: Image/content carousel with previous/next navigation
  ```svelte
  <Carousel.Root class="w-full max-w-xs">
    <Carousel.Content>
      {#each Array(5), i}
        <Carousel.Item>
          <div class="p-1">
            <Card.Root>
              <Card.Content class="flex aspect-square items-center justify-center p-6">
                <span class="text-4xl font-semibold">{i + 1}</span>
              </Card.Content>
            </Card.Root>
          </div>
        </Carousel.Item>
      {/each}
    </Carousel.Content>
    <Carousel.Previous />
    <Carousel.Next />
  </Carousel.Root>
  ```

- **Drawer**: Built on vaul-svelte (Svelte port of vaul by Emil Kowalski). Slide-out panel with header, content, and footer:
  ```svelte
  <Drawer.Root>
    <Drawer.Trigger class={buttonVariants({ variant: "outline" })}>
      Open Drawer
    </Drawer.Trigger>
    <Drawer.Content>
      <div class="mx-auto w-full max-w-sm">
        <Drawer.Header>
          <Drawer.Title>Move Goal</Drawer.Title>
          <Drawer.Description>Set your daily activity goal.</Drawer.Description>
        </Drawer.Header>
        <div class="p-4 pb-0">
          <div class="flex items-center justify-center space-x-2">
            <Button variant="outline" size="icon" class="size-8 shrink-0 rounded-full"
              onclick={() => handleClick(-10)} disabled={goal <= 200}>
              <MinusIcon />
            </Button>
            <div class="flex-1 text-center">
              <div class="text-7xl font-bold tracking-tighter">{goal}</div>
              <div class="text-muted-foreground text-[0.70rem] uppercase">Calories/day</div>
            </div>
            <Button variant="outline" size="icon" class="size-8 shrink-0 rounded-full"
              onclick={() => handleClick(10)} disabled={goal >= 400}>
              <PlusIcon />
            </Button>
          </div>
          <div class="mt-3 h-[120px]">
            <BarChart data={data.map((d, i) => ({ goal: d.goal, index: i }))} 
              y="goal" x="index" xScale={scaleBand().padding(0.25)} 
              axis={false} tooltip={false} />
          </div>
        </div>
        <Drawer.Footer>
          <Button>Submit</Button>
          <Drawer.Close class={buttonVariants({ variant: "outline" })}>Cancel</Drawer.Close>
        </Drawer.Footer>
      </div>
    </Drawer.Content>
  </Drawer.Root>
  ```

- **Sonner**: Toast notifications via svelte-sonner (Svelte port of Sonner by Emil Kowalski)
  ```svelte
  <Button variant="outline" onclick={() =>
    toast.success("Event has been created", {
      description: "Sunday, December 03, 2023 at 9:00 AM",
      action: { label: "Undo", onClick: () => console.info("Undo") }
    })}>
    Show Toast
  </Button>
  ```

- **Pagination**: Built on Bits UI pagination component

## December 2023

New components: Calendar, Range Calendar, Date Picker

## November 2023

New component: Toggle Group

## October 2023

### Command Component
Command palette component built on cmdk-sv (Svelte port of cmdk). Allows creating searchable command interfaces.

### Combobox Component
Combination of Command and Popover components. Creates searchable dropdown menu.

### Form Updates
See February 2024 Forms section above for Form.Label and Form.Control changes.

### cli
CLI commands for project initialization (init), component installation (add), and registry building (registry build) with proxy support.

# CLI

Command-line interface for managing shadcn-svelte components and project setup.

## init

Initialize a new project with dependencies, the `cn` utility, and CSS variables.

```bash
npx shadcn-svelte@latest init
```

Interactive configuration prompts:
- Base color (slate, gray, zinc, neutral, stone)
- Global CSS file path
- Import aliases for lib, components, utils, hooks, ui

Options:
- `-c, --cwd <path>` — working directory
- `-o, --overwrite` — overwrite existing files
- `--no-deps` — skip dependency installation
- `--skip-preflight` — ignore preflight checks
- `--base-color <name>` — set base color
- `--css <path>` — global CSS file path
- `--components-alias`, `--lib-alias`, `--utils-alias`, `--hooks-alias`, `--ui-alias` — configure import aliases
- `--proxy <proxy>` — use proxy for registry requests

## add

Add components and dependencies to your project.

```bash
npx shadcn-svelte@latest add <component> -y -o
```

- `-y` — skip confirmation prompt
- `-o` — overwrite existing files
- `-a, --all` — install all components
- `--no-deps` — skip package dependency installation
- `--skip-preflight` — ignore preflight checks
- `--proxy <proxy>` — use proxy for registry requests

Interactive mode presents a list of available components to select from (accordion, alert, alert-dialog, aspect-ratio, avatar, badge, button, card, checkbox, collapsible, etc.).

## registry build

Generate registry JSON files from a registry.json source.

```bash
npx shadcn-svelte@latest registry build [registry.json]
```

Reads `registry.json` and outputs generated files to `static/r` directory.

Options:
- `-c, --cwd <path>` — working directory
- `-o, --output <path>` — destination directory (default: ./static/r)

## Proxy Configuration

Use HTTP proxy for registry requests via environment variable:

```bash
HTTP_PROXY="<proxy-url>" npx shadcn-svelte@latest init
```

Respects `HTTP_PROXY` or `http_proxy` environment variables.

### components.json
Configuration file for CLI component generation with Tailwind CSS, path aliases, TypeScript, and registry settings.

## Overview

The `components.json` file holds configuration for your project. It's used by the CLI to understand your project setup and generate customized components. **Only required if using the CLI** to add components; not needed for copy-paste method.

Create it with:
```bash
npx shadcn-svelte@latest init
```

## $schema

Reference the JSON Schema:
```json
{
  "$schema": "https://shadcn-svelte.com/schema.json"
}
```

## tailwind

Configuration for how Tailwind CSS is set up.

### tailwind.css

Path to the CSS file that imports Tailwind CSS:
```json
{
  "tailwind": {
    "css": "src/app.{p,post}css"
  }
}
```

### tailwind.baseColor

Generates the default color palette. **Cannot be changed after initialization.**
```json
{
  "tailwind": {
    "baseColor": "gray" | "neutral" | "slate" | "stone" | "zinc"
  }
}
```

## aliases

CLI uses these values with `alias` config from `svelte.config.js` to place generated components correctly. Path aliases must be set up in `svelte.config.js`.

```json
{
  "aliases": {
    "lib": "$lib",
    "utils": "$lib/utils",
    "components": "$lib/components",
    "ui": "$lib/components/ui",
    "hooks": "$lib/hooks"
  }
}
```

- **lib**: Import alias for library (components, utils, hooks, etc.)
- **utils**: Import alias for utility functions
- **components**: Import alias for components
- **ui**: Import alias for UI components
- **hooks**: Import alias for hooks (Svelte 5 reactive functions/classes, typically `.svelte.ts` or `.svelte.js`)

## typescript

Enable or disable TypeScript:
```json
{
  "typescript": true | false
}
```

Specify custom TypeScript config path:
```json
{
  "typescript": {
    "config": "path/to/tsconfig.custom.json"
  }
}
```

## registry

Registry URL for fetching shadcn-svelte components. Can pin to specific preview release or custom fork:
```json
{
  "registry": "https://shadcn-svelte.com/registry"
}
```

### installation--md
Installation guides for multiple frameworks; components split into multiple files with barrel exports; VSCode and JetBrains IDE extensions available.

## Installation Guides

Setup instructions available for:
- SvelteKit
- Astro
- Vite
- Manual setup

## Component Structure & Imports

Components are split into multiple files (unlike React's shadcn/ui). Each component gets its own folder with an `index.ts` barrel export.

Example: Accordion component structure
```
accordion/
  ├── accordion.svelte
  ├── accordion-content.svelte
  ├── accordion-item.svelte
  ├── accordion-trigger.svelte
  └── index.ts
```

Import approaches (both tree-shaken by Rollup):
```ts
import * as Accordion from '$lib/components/ui/accordion'
// or
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '$lib/components/ui/accordion'
```

## IDE Extensions

**VSCode**: shadcn-svelte extension by @selemondev
- Initialize CLI
- Add components
- Navigate to component docs
- Import snippets

**JetBrains IDEs**: shadcn/ui Components Manager by @WarningImHack3r
- Auto-detect components
- Add/remove/update with one click
- Supports Svelte, React, Vue, Solid
- Search remote or existing components

### javascript
Disable TypeScript via components.json flag; configure jsconfig.json for import aliases.

## Using JavaScript Instead of TypeScript

The project and components are written in TypeScript, but JavaScript versions are available via the CLI.

### Disable TypeScript

Set `typescript: false` in `components.json`:

```json
{
  "style": "default",
  "tailwind": {
    "css": "src/routes/layout.css"
  },
  "typescript": false,
  "aliases": {
    "utils": "$lib/utils",
    "components": "$lib/components",
    "hooks": "$lib/hooks",
    "ui": "$lib/components/ui"
  },
  "registry": "https://shadcn-svelte.com/registry"
}
```

### Configure Import Aliases

Create `jsconfig.json` to set up path aliases:

```json
{
  "compilerOptions": {
    "paths": {
      "$lib/*": ["./src/lib/*"]
    }
  }
}
```

### registry
Create custom component registries with JSON-based items compatible with shadcn-svelte CLI; use provided template as starting point.

## Registry

Create and host your own component registry to distribute custom components, hooks, pages, and other files to Svelte projects. Registry items are automatically compatible with the shadcn-svelte CLI.

### Requirements

Registry items must be valid JSON files conforming to the registry-item schema specification.

### Getting Started

Clone the template project as a starting point:

```bash
npx degit huntabyte/shadcn-svelte/registry-template#next-tailwind-4
```

**Note:** This feature is experimental. Feedback and testing are welcome via GitHub discussions.

### theming
CSS variable-based theming with background/foreground convention; supports light/dark modes; OKLCH color space; pre-configured color presets (Neutral, Stone, Zinc, Gray, Slate); custom colors via @theme inline directive.

## Theming

Customize component appearance using CSS variables. This allows changing colors without updating class names.

### Convention

Uses `background` and `foreground` naming convention:
- `background` variable: component background color
- `foreground` variable: text color
- The `background` suffix is omitted in utility classes

Example:
```css
--primary: oklch(0.205 0 0);
--primary-foreground: oklch(0.985 0 0);
```

```svelte
<div class="bg-primary text-primary-foreground">Hello</div>
```

### Available Variables

Default variables in `src/routes/layout.css`:

```css
:root {
  --radius: 0.625rem;
  --background: oklch(1 0 0);
  --foreground: oklch(0.145 0 0);
  --card: oklch(1 0 0);
  --card-foreground: oklch(0.145 0 0);
  --popover: oklch(1 0 0);
  --popover-foreground: oklch(0.145 0 0);
  --primary: oklch(0.205 0 0);
  --primary-foreground: oklch(0.985 0 0);
  --secondary: oklch(0.97 0 0);
  --secondary-foreground: oklch(0.205 0 0);
  --muted: oklch(0.97 0 0);
  --muted-foreground: oklch(0.556 0 0);
  --accent: oklch(0.97 0 0);
  --accent-foreground: oklch(0.205 0 0);
  --destructive: oklch(0.577 0.245 27.325);
  --border: oklch(0.922 0 0);
  --input: oklch(0.922 0 0);
  --ring: oklch(0.708 0 0);
  --chart-1: oklch(0.646 0.222 41.116);
  --chart-2: oklch(0.6 0.118 184.704);
  --chart-3: oklch(0.398 0.07 227.392);
  --chart-4: oklch(0.828 0.189 84.429);
  --chart-5: oklch(0.769 0.188 70.08);
  --sidebar: oklch(0.985 0 0);
  --sidebar-foreground: oklch(0.145 0 0);
  --sidebar-primary: oklch(0.205 0 0);
  --sidebar-primary-foreground: oklch(0.985 0 0);
  --sidebar-accent: oklch(0.97 0 0);
  --sidebar-accent-foreground: oklch(0.205 0 0);
  --sidebar-border: oklch(0.922 0 0);
  --sidebar-ring: oklch(0.708 0 0);
}

.dark {
  --background: oklch(0.145 0 0);
  --foreground: oklch(0.985 0 0);
  --card: oklch(0.205 0 0);
  --card-foreground: oklch(0.985 0 0);
  --popover: oklch(0.269 0 0);
  --popover-foreground: oklch(0.985 0 0);
  --primary: oklch(0.922 0 0);
  --primary-foreground: oklch(0.205 0 0);
  --secondary: oklch(0.269 0 0);
  --secondary-foreground: oklch(0.985 0 0);
  --muted: oklch(0.269 0 0);
  --muted-foreground: oklch(0.708 0 0);
  --accent: oklch(0.371 0 0);
  --accent-foreground: oklch(0.985 0 0);
  --destructive: oklch(0.704 0.191 22.216);
  --border: oklch(1 0 0 / 10%);
  --input: oklch(1 0 0 / 15%);
  --ring: oklch(0.556 0 0);
  --chart-1: oklch(0.488 0.243 264.376);
  --chart-2: oklch(0.696 0.17 162.48);
  --chart-3: oklch(0.769 0.188 70.08);
  --chart-4: oklch(0.627 0.265 303.9);
  --chart-5: oklch(0.645 0.246 16.439);
  --sidebar: oklch(0.205 0 0);
  --sidebar-foreground: oklch(0.985 0 0);
  --sidebar-primary: oklch(0.488 0.243 264.376);
  --sidebar-primary-foreground: oklch(0.985 0 0);
  --sidebar-accent: oklch(0.269 0 0);
  --sidebar-accent-foreground: oklch(0.985 0 0);
  --sidebar-border: oklch(1 0 0 / 10%);
  --sidebar-ring: oklch(0.439 0 0);
}
```

### Adding Custom Colors

Add new color variables to `src/routes/layout.css`:

```css
:root {
  --warning: oklch(0.84 0.16 84);
  --warning-foreground: oklch(0.28 0.07 46);
}

.dark {
  --warning: oklch(0.41 0.11 46);
  --warning-foreground: oklch(0.99 0.02 95);
}

@theme inline {
  --color-warning: var(--warning);
  --color-warning-foreground: var(--warning-foreground);
}
```

Use in components:
```svelte
<div class="bg-warning text-warning-foreground"></div>
```

### Base Color Presets

Pre-configured color schemes available: Neutral, Stone, Zinc, Gray, Slate. Each includes light and dark mode variants with all standard variables (background, foreground, card, popover, primary, secondary, muted, accent, destructive, border, input, ring, chart colors, and sidebar colors).

Colors use OKLCH color space format.

