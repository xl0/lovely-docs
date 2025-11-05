## Project Setup

Create a new project with SvelteKit:
```bash
npx sv create myapp
npm install
npm run dev
```

Alternative with Vite:
```bash
npm create vite@latest  # select svelte
npm run build
```

Vite is recommended over Rollup/Webpack. VS Code extension available.

## Component Files

Svelte components use `.svelte` files with optional `<script>`, `<style>`, and markup sections:
- `<script>` runs per component instance
- `<script module>` runs once at module load
- `<style>` CSS is automatically scoped to the component

```svelte
<script module>
	let total = 0;
</script>

<script>
	total += 1;
</script>

<style>
	p { color: burlywood; }
</style>
```

## Reactive Logic Files

`.svelte.js` and `.svelte.ts` files are regular JS/TS modules that support Svelte runes for creating reusable reactive logic and sharing reactive state across your app.