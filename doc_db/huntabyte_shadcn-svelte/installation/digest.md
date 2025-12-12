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