## Create project

Use the SvelteKit CLI to create a new project with TailwindCSS:

```bash
npx sv create my-app --add tailwindcss
```

## Setup path aliases

If not using the default `$lib` alias, update `svelte.config.js`:

```ts
const config = {
  kit: {
    alias: {
      "@/*": "./path/to/lib/*",
    },
  },
};
```

## Run the CLI

```bash
npx shadcn-svelte@latest init
```

## Configure components.json

The CLI will prompt for configuration:

```txt
Which base color would you like to use?  Slate
Where is your global CSS file?  src/routes/layout.css
Configure the import alias for lib:  $lib
Configure the import alias for components:  $lib/components
Configure the import alias for utils:  $lib/utils
Configure the import alias for hooks:  $lib/hooks
Configure the import alias for ui:  $lib/components/ui
```

## Add components

```bash
npx shadcn-svelte@latest add button -y -o
```

Options: `-y` skips confirmation prompt, `-o` overwrites existing files.

Import and use:

```svelte
<script lang="ts">
  import { Button } from "$lib/components/ui/button/index.js";
</script>
<Button>Click me</Button>
```