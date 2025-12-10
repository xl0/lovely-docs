**Setup**: SvelteKit (`npx sv create myapp`) recommended; alternatives: Vite (`npm create vite@latest`), Rollup, Webpack.

**.svelte files**: `<script module>` (runs once), `<script>` (per-instance), markup, `<style>` (scoped). Use runes for props/reactivity. TypeScript: add `lang="ts"`.

**.svelte.js/.ts files**: Modules with runes for reactive logic and state sharing (Svelte 5+). Can't export reassigned state.