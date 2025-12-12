

## Pages

### svelte-5-migration
Migrate to Svelte 5: update components.json aliases/registry, add tailwindcss-animate with sidebar/animation config, simplify utils.ts, update bits-ui/svelte-sonner/@lucide/svelte/paneforge/vaul-svelte/mode-watcher, replace cmdk-sv/svelte-headless-table/lucide-svelte, run `npx shadcn-svelte@latest add <component> -y -o` per component.

## Svelte 4 to Svelte 5 Migration

Migrate from Svelte 4 with Tailwind 3 to Svelte 5 with Tailwind 3. This guide covers shadcn-svelte migration only; see Bits UI's migration guide for bits-ui changes.

### Prerequisites

1. Read Svelte's v5 migration guide
2. Commit pending changes
3. Identify components with custom behavior/styles for reimplementation
4. Use `sv-migrate` CLI tool to help with migration

### Update `components.json`

Add `registry` to root and new aliases:

```json
{
  "$schema": "https://shadcn-svelte.com/schema.json",
  "style": "default",
  "tailwind": {
    "css": "src/routes/layout.css",
    "baseColor": "slate"
  },
  "aliases": {
    "components": "$lib/components",
    "utils": "$lib/utils",
    "ui": "$lib/components/ui",
    "hooks": "$lib/hooks",
    "lib": "$lib"
  },
  "typescript": true,
  "registry": "https://shadcn-svelte.com/registry"
}
```

### Update `tailwind.config.js`

Install and add `tailwindcss-animate` plugin:

```bash
npm i tailwindcss-animate
```

```ts
import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

const config: Config = {
  darkMode: ["class"],
  content: ["./src/**/*.{html,js,svelte,ts}"],
  safelist: ["dark"],
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
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--bits-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--bits-accordion-content-height)" },
          to: { height: "0" },
        },
        "caret-blink": {
          "0%,70%,100%": { opacity: "1" },
          "20%,50%": { opacity: "0" },
        },
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
export default config;
```

### Update `utils.ts`

Replace with new version exporting only `cn` function and utility types:

```ts
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type WithoutChild<T> = T extends { child?: any } ? Omit<T, "child"> : T;
export type WithoutChildren<T> = T extends { children?: any } ? Omit<T, "children"> : T;
export type WithoutChildrenOrChild<T> = WithoutChildren<WithoutChild<T>>;
export type WithElementRef<T, U extends HTMLElement = HTMLElement> = T & {
  ref?: U | null;
};
```

Note: Some components may rely on the removed `flyAndScale` function; update those after updating components.

### Upgrade Components

#### Optional: Alias Old Dependencies

For gradual migration, alias old dependency versions in `package.json`:

```json
{
  "devDependencies": {
    "bits-ui-old": "npm:bits-ui@0.22.0"
  }
}
```

Update imports to use `bits-ui-old` while migrating.

#### Update Dependencies

```bash
npm i bits-ui@latest svelte-sonner@latest @lucide/svelte@latest paneforge@next vaul-svelte@next mode-watcher@latest -D
```

Updated packages:
- `bits-ui` → `^1.0.0`
- `svelte-sonner` → `^1.0.0`
- `@lucide/svelte` → `^0.482.0`
- `paneforge` → `^1.0.0-next.5`
- `vaul-svelte` → `^1.0.0-next.7`
- `mode-watcher` → `^1.0.0`

Deprecated/replaced:
- `cmdk-sv` → use Bits UI's `Command` component
- `svelte-headless-table` → use `@tanstack/table-core`
- `svelte-radix` → use `@lucide/svelte`
- `lucide-svelte` → use `@lucide/svelte`

#### Migrate Components

Commit changes, then run CLI to replace components:

```bash
git add .
git commit -m 'before migration'
npx shadcn-svelte@latest add dialog -y -o
```

The `-y` flag skips confirmation, `-o` overwrites existing files. Review diffs and repeat for each component.

### Remove Unused Dependencies

After migrating all components, remove old packages:

```bash
npm uninstall cmdk-sv svelte-headless-table svelte-radix lucide-svelte
```

### tailwind_v4_migration
Upgrade shadcn-svelte from Tailwind v3→v4 and Svelte 4→v5: replace PostCSS with Vite, migrate to CSS-based config with `@theme inline`, update `app.css` with HSL variables, replace `tailwindcss-animate` with `tw-animate-css`, update dependencies, optionally update components and colors via CLI.

## Overview
Guide for upgrading shadcn-svelte projects from Tailwind v3 to v4 and Svelte 4 to v5. New projects can use `@latest` CLI to initialize with Tailwind v4 and Svelte 5 directly.

## Key Changes in v4
- New `@theme` directive and `@theme inline` option for CSS-based configuration
- All components updated; every element now has `data-slot` attribute for styling
- Buttons use default cursor instead of pointer
- `default` style deprecated; new projects use `new-york`
- HSL colors converted to OKLCH (non-breaking: existing Tailwind v3 apps continue working)
- Vite replaces PostCSS as the recommended build tool

## Prerequisites
- Already on Svelte 5 and Tailwind v3
- If on Svelte 4, first follow the Svelte 4→5 migration guide
- Read Tailwind v4 Compatibility Docs to ensure browser support

## Upgrade Steps

### 1. Upgrade Tailwind v4
Follow the official Tailwind v4 upgrade guide and run the codemod to remove deprecated utilities and update config.

### 2. Replace PostCSS with Vite

Delete `postcss.config.js`:
```js
// Remove entire file
```

Uninstall and install:
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

Verify: `npm run dev`

### 3. Update `app.css`

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

### 4. Update Dependencies
```bash
npm i bits-ui@latest @lucide/svelte@latest tailwind-variants@latest tailwind-merge@latest clsx@latest svelte-sonner@latest paneforge@next vaul-svelte@next formsnap@latest
```

### 5. Update `utils.ts` (Optional)
Add type helpers previously from bits-ui:
```ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type WithoutChild<T> = T extends { child?: any } ? Omit<T, "child"> : T;
export type WithoutChildren<T> = T extends { children?: any } ? Omit<T, "children"> : T;
export type WithoutChildrenOrChild<T> = WithoutChildren<WithoutChild<T>>;
export type WithElementRef<T, U extends HTMLElement = HTMLElement> = T & { ref?: U | null };
```

Update imports in components:
```ts
// Before
import type { WithElementRef } from "bits-ui";
// After
import type { WithElementRef } from "$lib/utils.js";
```

### 6. Update Colors (Optional)
Commit changes, then update all components with new dark mode colors:
```bash
git add .
git commit -m "..."
npm dlx shadcn-svelte@latest add --all --overwrite
```

Update dark mode colors in `app.css` to new OKLCH values (see Base Colors reference).

Review git diffs and re-apply any custom changes.

### 7. Use New `size-*` Utility
Replace `w-* h-*` with `size-*`:
```diff
- w-4 h-4
+ size-4
```

## New Project Setup
Use `@latest` CLI for new projects with Tailwind v4 and Svelte 5:
```bash
npm create svelte@latest my-app
npx shadcn-svelte@latest init
```

See installation docs for SvelteKit, Astro, Vite, or Manual setup.

