

## Pages

### astro-setup
Step-by-step Astro project setup: create project, add Svelte/TailwindCSS, configure tsconfig path aliases, init shadcn-svelte with Slate theme and $lib aliases, add components with -y -o flags, use in .astro files with client directives.

## Setup shadcn-svelte in Astro

### Create and configure Astro project

```bash
npm create astro@latest
```

When prompted, choose a starter template (or Empty), install dependencies, and optionally initialize git.

### Add Svelte and TailwindCSS

```bash
npx astro add svelte
npx astro add tailwind
```

Answer `Yes` to all prompts.

### Import global CSS

In `src/pages/index.astro`:

```astro
---
import "../styles/global.css";
---
```

### Setup path aliases

In `tsconfig.json`:

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

### Initialize shadcn-svelte

```bash
npx shadcn-svelte@latest init
```

When prompted, configure:
- Base color: `Slate`
- Global CSS file: `src/styles/global.css`
- Import aliases: `$lib`, `$lib/components`, `$lib/utils`, `$lib/hooks`, `$lib/components/ui`

### Add components

```bash
npx shadcn-svelte@latest add button -y -o
```

Use `-y` to skip confirmation and `-o` to overwrite existing files.

### Use components in Astro

In `.astro` files, import and use components with client directives for interactivity:

```astro
---
import { Button } from "$lib/components/ui/button/index.js";
---
<html lang="en">
 <head>
  <title>Astro</title>
 </head>
 <body>
  <Button>Hello World</Button>
 </body>
</html>
```

See Astro client directives documentation for interactive component handling.

### manual-setup
Manual setup: Tailwind + dependencies + path aliases + CSS variables (light/dark theme) + utils helper + layout import + component installation

## Manual Installation Steps

### Add Tailwind CSS
```bash
npx sv add tailwindcss
```

### Add Dependencies
```bash
npm i tailwind-variants clsx tailwind-merge tw-animate-css @lucide/svelte
```

### Configure Path Aliases

**SvelteKit** - Update `svelte.config.js`:
```ts
const config = {
  kit: {
    alias: {
      "@/*": "./path/to/lib/*",
    },
  },
};
```

**Non-SvelteKit** - Update `tsconfig.json`:
```json
{
  "compilerOptions": {
    "paths": {
      "$lib": ["./src/lib"],
      "$lib/*": ["./src/lib/*"]
    }
  }
}
```

And `vite.config.ts`:
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

### Configure Global Styles

Create `src/routes/layout.css` with Tailwind imports and CSS variables for theming:
```css
@import "tailwindcss";
@import "tw-animate-css";
@custom-variant dark (&:is(.dark *));

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

@theme inline {
  --radius-sm: calc(var(--radius) - 4px);
  --radius-md: calc(var(--radius) - 2px);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) + 4px);
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-popover: var(--popover);
  --color-popover-foreground: var(--popover-foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-destructive: var(--destructive);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);
  --color-chart-1: var(--chart-1);
  --color-chart-2: var(--chart-2);
  --color-chart-3: var(--chart-3);
  --color-chart-4: var(--chart-4);
  --color-chart-5: var(--chart-5);
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
    @apply border-border outline-ring/50;
  }
  body {
    @apply bg-background text-foreground;
  }
}
```

### Create Utils Helper

Create `src/lib/utils.ts` with a `cn` function for merging Tailwind classes:
```ts
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

### Import Styles in App

Create `src/routes/+layout.svelte`:
```svelte
<script lang="ts">
  import "../app.css";
  let { children } = $props();
</script>

{@render children?.()}
```

### Add Components

```bash
npx shadcn-svelte@latest add button -y -o
```

Use `-y` to skip confirmation prompt and `-o` to overwrite existing files.

### sveltekit-setup
SvelteKit setup: create project with sv CLI + tailwindcss, run shadcn-svelte init, configure path aliases in svelte.config.js if needed, add components with `npx shadcn-svelte@latest add <component> -y -o`, import from $lib/components/ui/

## Create project

Use the SvelteKit CLI to create a new project with TailwindCSS:

```bash
npx sv create my-app --add tailwindcss
```

## Setup path aliases

If not using the default `$lib` alias, update `svelte.config.js`:

```ts
const config = {
  kit: {
    alias: {
      "@/*": "./path/to/lib/*",
    },
  },
};
```

## Run the CLI

```bash
npx shadcn-svelte@latest init
```

## Configure components.json

The CLI will prompt for configuration:

```txt
Which base color would you like to use?  Slate
Where is your global CSS file?  src/routes/layout.css
Configure the import alias for lib:  $lib
Configure the import alias for components:  $lib/components
Configure the import alias for utils:  $lib/utils
Configure the import alias for hooks:  $lib/hooks
Configure the import alias for ui:  $lib/components/ui
```

## Add components

```bash
npx shadcn-svelte@latest add button -y -o
```

Options: `-y` skips confirmation prompt, `-o` overwrites existing files.

Import and use:

```svelte
<script lang="ts">
  import { Button } from "$lib/components/ui/button/index.js";
</script>
<Button>Click me</Button>
```

### vite_setup
Install TailwindCSS, configure TypeScript/Vite path aliases for $lib, run shadcn-svelte init with $lib-based import paths, add components with -y -o flags, import from $lib/components/ui

## Add TailwindCSS

```bash
npx sv add tailwindcss
```

## Configure TypeScript

Edit `tsconfig.json`:
```json
{
  "files": [],
  "references": [
    { "path": "./tsconfig.app.json" },
    { "path": "./tsconfig.node.json" }
  ],
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "$lib": ["./src/lib"],
      "$lib/*": ["./src/lib/*"]
    }
  }
}
```

Edit `tsconfig.app.json`:
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

## Configure Vite

Edit `vite.config.ts`:
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

## Initialize shadcn-svelte

```bash
npx shadcn-svelte@latest init
```

Answer the configuration prompts:
- Base color: Slate
- Global CSS file: src/routes/layout.css
- Import alias for lib: $lib
- Import alias for components: $lib/components
- Import alias for utils: $lib/utils
- Import alias for hooks: $lib/hooks
- Import alias for ui: $lib/components/ui

## Add Components

```bash
npx shadcn-svelte@latest add button -y -o
```

Use `-y` to skip confirmation prompt and `-o` to overwrite existing files.

Import and use:
```svelte
<script lang="ts">
  import { Button } from "$lib/components/ui/button/index.js";
</script>
<Button>Click me</Button>
```

