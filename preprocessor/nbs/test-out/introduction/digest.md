## Project Setup

**SvelteKit (Recommended)**: Official way to start new projects.
```bash
npx sv create myapp
cd myapp
npm install
npm run dev
```

**Vite**: Use `npm create vite@latest` and select svelte option. Generates HTML, JS, CSS in `dist` directory via vite-plugin-svelte. Requires separate routing library.

**Other tools**: Rollup and Webpack plugins exist but Vite is recommended. Both Vite and SvelteKit support standalone SPA mode.

**Editor Support**: VS Code extension maintained by Svelte team, integrations for other editors, command-line checking via `sv check`.

**Getting Help**: Discord chatroom, Stack Overflow (tag: svelte).

## .svelte File Structure

Components are written in `.svelte` files using HTML superset. All sections optional:

```svelte
<script module>
	// module-level logic (runs once when module evaluates)
	let total = 0;
</script>

<script>
	// instance-level logic (runs per component instance)
	total += 1;
	console.log(`instantiated ${total} times`);
</script>

<!-- markup -->

<style>
	/* scoped CSS - only affects this component */
	p { color: burlywood; }
</style>
```

**`<script>`**: Contains JS/TS (add `lang="ts"`). Runs when component instance created. Top-level variables referenced in markup. Use runes for props and reactivity.

**`<script module>`**: Runs once at module evaluation, not per instance. Variables accessible in component but not vice versa. Can export bindings (not `export default` - that's the component). TypeScript: VS Code extension and IntelliJ plugin recognize module exports; other editors may need TypeScript plugin. Legacy Svelte 4 used `<script context="module">`.

**`<style>`**: CSS scoped to component only.

## .svelte.js/.svelte.ts Files

Module files supporting runes for reusable reactive logic and shared reactive state. Function like standard .js/.ts modules with Svelte reactive features. Restriction: reassigned state cannot be exported across modules. Introduced in Svelte 5.