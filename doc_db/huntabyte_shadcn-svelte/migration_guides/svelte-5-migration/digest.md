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