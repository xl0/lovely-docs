## Vite CLI

SvelteKit uses Vite as its build tool. The primary CLI commands are run via npm scripts:

- `vite dev` — start development server
- `vite build` — build production version
- `vite preview` — run production build locally

## svelte-kit sync

`svelte-kit sync` generates `tsconfig.json` and all type definitions that can be imported as `./$types` in routing files. This command is automatically run as the `prepare` npm lifecycle script when creating a new project, so manual execution is typically unnecessary.