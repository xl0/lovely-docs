## Setup with SvelteKit (Recommended)

The official way to start a new project:

```bash
npx sv create myapp
cd myapp
npm install
npm run dev
```

You can learn Svelte features later; SvelteKit provides many conveniences on top.

## Alternatives

**Vite (Direct)**: Use `npm create vite@latest` and select the `svelte` option. This generates HTML, JS, and CSS in the `dist` directory via vite-plugin-svelte. You'll likely need to add a routing library separately.

**Other build tools**: Rollup and Webpack plugins exist, but Vite is recommended.

Vite can build single page apps (SPAs) in standalone mode, which SvelteKit also supports.

## Editor Support

- VS Code extension maintained by Svelte team
- Integrations available for other editors
- Command-line checking via `sv check`

## Getting Help

- Discord chatroom
- Stack Overflow (tag: svelte)