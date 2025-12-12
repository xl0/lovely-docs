## Setup Steps

1. Add TailwindCSS: `npx sv add tailwindcss`
2. Configure path aliases in `tsconfig.json` and `tsconfig.app.json` with `$lib` pointing to `./src/lib`
3. Add alias to `vite.config.ts`: `$lib: path.resolve("./src/lib")`
4. Initialize: `npx shadcn-svelte@latest init` (configure with $lib aliases)
5. Add components: `npx shadcn-svelte@latest add button -y -o`
6. Import: `import { Button } from "$lib/components/ui/button/index.js"`