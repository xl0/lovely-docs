# CLI

Command-line interface for managing shadcn-svelte components and project setup.

## init

Initialize a new project with dependencies, the `cn` utility, and CSS variables.

```bash
npx shadcn-svelte@latest init
```

Interactive configuration prompts:
- Base color (slate, gray, zinc, neutral, stone)
- Global CSS file path
- Import aliases for lib, components, utils, hooks, ui

Options:
- `-c, --cwd <path>` — working directory
- `-o, --overwrite` — overwrite existing files
- `--no-deps` — skip dependency installation
- `--skip-preflight` — ignore preflight checks
- `--base-color <name>` — set base color
- `--css <path>` — global CSS file path
- `--components-alias`, `--lib-alias`, `--utils-alias`, `--hooks-alias`, `--ui-alias` — configure import aliases
- `--proxy <proxy>` — use proxy for registry requests

## add

Add components and dependencies to your project.

```bash
npx shadcn-svelte@latest add <component> -y -o
```

- `-y` — skip confirmation prompt
- `-o` — overwrite existing files
- `-a, --all` — install all components
- `--no-deps` — skip package dependency installation
- `--skip-preflight` — ignore preflight checks
- `--proxy <proxy>` — use proxy for registry requests

Interactive mode presents a list of available components to select from (accordion, alert, alert-dialog, aspect-ratio, avatar, badge, button, card, checkbox, collapsible, etc.).

## registry build

Generate registry JSON files from a registry.json source.

```bash
npx shadcn-svelte@latest registry build [registry.json]
```

Reads `registry.json` and outputs generated files to `static/r` directory.

Options:
- `-c, --cwd <path>` — working directory
- `-o, --output <path>` — destination directory (default: ./static/r)

## Proxy Configuration

Use HTTP proxy for registry requests via environment variable:

```bash
HTTP_PROXY="<proxy-url>" npx shadcn-svelte@latest init
```

Respects `HTTP_PROXY` or `http_proxy` environment variables.