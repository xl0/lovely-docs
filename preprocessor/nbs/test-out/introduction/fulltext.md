

## Pages

### getting-started
Project setup via SvelteKit (recommended: `npx sv create myapp`) or Vite/Rollup/Webpack; editor support and help resources.

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

### svelte_files
.svelte file structure: optional `<script module>` (module-level, runs once), `<script>` (instance-level), markup, and `<style>` (scoped CSS); use runes for props and reactivity.

## Structure

Svelte components are written in `.svelte` files using a superset of HTML. All three sections — script, styles and markup — are optional.

```svelte
<script module>
	// module-level logic (rarely used)
</script>

<script>
	// instance-level logic
</script>

<!-- markup -->

<style>
	/* scoped styles */
</style>
```

## `<script>`

Contains JavaScript or TypeScript (add `lang="ts"` attribute) that runs when a component instance is created. Top-level variables can be referenced in markup. Use runes to declare component props and add reactivity.

## `<script module>`

Runs once when the module first evaluates, not for each component instance. Variables declared here can be referenced elsewhere in the component, but not vice versa.

```svelte
<script module>
	let total = 0;
</script>

<script>
	total += 1;
	console.log(`instantiated ${total} times`);
</script>
```

You can `export` bindings from this block (they become module exports), but not `export default` since the default export is the component itself.

**TypeScript note:** When importing exports from a `module` block into a `.ts` file, ensure your editor setup recognizes them (VS Code extension and IntelliJ plugin handle this; other editors may need the TypeScript editor plugin).

**Legacy:** Svelte 4 used `<script context="module">`.

## `<style>`

CSS is scoped to the component:

```svelte
<style>
	p {
		color: burlywood; /* only affects <p> in this component */
	}
</style>
```

### reactive_logic_files
.svelte.js/.ts files enable runes in modules for reusable reactive logic and state sharing, with restrictions on exporting reassigned state.

.svelte.js and .svelte.ts files are module files that support runes, enabling reusable reactive logic and shared reactive state across applications. They function like standard .js or .ts modules but with the added capability to use Svelte's reactive features. Note that reassigned state cannot be exported across modules. This feature was introduced in Svelte 5.

