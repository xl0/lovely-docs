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