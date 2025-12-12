## Manual Setup

1. Add Tailwind: `npx sv add tailwindcss`
2. Install deps: `npm i tailwind-variants clsx tailwind-merge tw-animate-css @lucide/svelte`
3. Configure path aliases in `svelte.config.js` (SvelteKit) or `tsconfig.json`/`vite.config.ts` (non-SvelteKit)
4. Add CSS variables and Tailwind config to `src/routes/layout.css` with light/dark theme colors
5. Create `src/lib/utils.ts` with `cn()` helper using clsx and twMerge
6. Import styles in `src/routes/+layout.svelte`
7. Add components: `npx shadcn-svelte@latest add button -y -o`