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