SvelteKit automatically provides a `$lib` import alias that points to files in `src/lib`. This allows you to import reusable components and utilities from anywhere in your project without relative paths.

Example: Import a component from `src/lib/Component.svelte` using `import Component from '$lib/Component.svelte'` in any route file.

The directory that `$lib` points to can be customized in the config file.