## Setup with SvelteKit

The recommended way to start a new Svelte project is using SvelteKit:

```sh
npx sv create myapp
cd myapp
npm install
npm run dev
```

SvelteKit is the official application framework from the Svelte team, powered by Vite, and lets you build almost anything.

## Alternative: Vite

You can use Svelte directly with Vite without SvelteKit:

```sh
npm create vite@latest
```

Select the `svelte` option. This generates HTML, JS, and CSS files in the `dist` directory using vite-plugin-svelte. You'll likely need to add a routing library separately.

Other bundler plugins are available but Vite is recommended.

## Editor tooling

- VS Code extension maintained by the Svelte team
- Integrations available for various other editors
- Command-line checking with `sv check`

## Getting help

Ask in the Discord chatroom or search Stack Overflow with the `svelte` tag.