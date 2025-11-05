

## Pages

### getting-started
How to set up a new Svelte project using SvelteKit or Vite, with information on editor tooling and support resources.

**Recommended setup:**
```bash
npx sv create myapp
npm install
npm run dev
```

**Alternative with Vite:**
```bash
npm create vite@latest  # select svelte
npm run build
```

Vite is recommended over Rollup/Webpack. VS Code extension available. Get help on Discord or Stack Overflow.

### .svelte-files
Svelte components are written in .svelte files with optional script, style, and markup sections; script runs per instance while script module runs once at module load, and styles are automatically scoped.

Svelte components use `.svelte` files with optional `<script>`, `<style>`, and markup sections. `<script>` runs per instance, `<script module>` runs once at module load. CSS in `<style>` is automatically scoped to the component.

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

### .svelte.js-and-.svelte.ts-files
Svelte 5 introduces .svelte.js and .svelte.ts files that allow using runes outside components for reusable reactive logic and shared state.

`.svelte.js` and `.svelte.ts` files are regular JS/TS modules that support Svelte runes, useful for creating reusable reactive logic and sharing reactive state across your app (though reassigned state cannot be exported).

