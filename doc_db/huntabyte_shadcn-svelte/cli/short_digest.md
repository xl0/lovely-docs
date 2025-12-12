# CLI

Initialize projects and manage components via command line.

**init** — Set up project with dependencies and CSS variables:
```bash
npx shadcn-svelte@latest init
```
Options: `-c`, `-o`, `--no-deps`, `--skip-preflight`, `--base-color`, `--css`, `--*-alias`, `--proxy`

**add** — Install components:
```bash
npx shadcn-svelte@latest add <component> -y -o
```
Options: `-a` (all), `--no-deps`, `--skip-preflight`, `--proxy`

**registry build** — Generate registry JSON files:
```bash
npx shadcn-svelte@latest registry build [registry.json]
```
Options: `-c`, `-o` (output directory)

**Proxy** — Set via `HTTP_PROXY` environment variable for all commands.