SvelteKit uses Vite for most CLI operations, accessed through npm scripts:
- `vite dev` — start development server
- `vite build` — build production version
- `vite preview` — run production build locally

SvelteKit provides its own CLI command for project initialization:

**svelte-kit sync** — generates `tsconfig.json` and all type definitions (importable as `./$types` in routing files). Runs automatically as the `prepare` npm script during project setup, so manual execution is rarely needed.