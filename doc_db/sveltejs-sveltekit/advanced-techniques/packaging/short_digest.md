## Building Component Libraries with @sveltejs/package

Structure: `src/lib` is public-facing, `package.json` used for publishing. `svelte-package` generates `dist` with preprocessed components and auto-generated type definitions.

**Key package.json fields:**
- `exports` - Define entry points with `types` and `svelte` conditions
- `files` - Specify what npm publishes (typically `["dist"]`)
- `sideEffects` - Mark CSS as having side effects: `["**/*.css"]`
- `svelte` - Legacy field pointing to root entry

**TypeScript:** Type definitions auto-generated. For non-root exports, use `typesVersions` to map types or require consumers to use `"moduleResolution": "bundler"`.

**Best practices:** Avoid SvelteKit-specific modules, define aliases in `svelte.config.js`, follow semantic versioning (removing exports is breaking), use declaration maps for source navigation.

**Important:** All relative imports need full paths with extensions: `import { x } from './something/index.js'`