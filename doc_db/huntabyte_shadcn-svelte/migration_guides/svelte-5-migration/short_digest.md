## Svelte 5 Migration

Update `components.json` with new aliases (`ui`, `hooks`, `lib`) and registry. Install `tailwindcss-animate` and add sidebar colors and animations to `tailwind.config.js`. Simplify `utils.ts` to export only `cn` and utility types.

Update dependencies: `bits-ui@latest`, `svelte-sonner@latest`, `@lucide/svelte@latest`, `paneforge@next`, `vaul-svelte@next`, `mode-watcher@latest`. Replace `cmdk-sv` with Bits UI's Command, `svelte-headless-table` with `@tanstack/table-core`, and `lucide-svelte` with `@lucide/svelte`.

Optionally alias old dependency versions for gradual migration. Run `npx shadcn-svelte@latest add <component> -y -o` to migrate each component, then remove old packages.