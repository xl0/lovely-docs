# Astro

How to setup shadcn-svelte in an Astro project.

### Create project

Start by creating a new Astro project:

```bash
pnpm create astro@latest
```

```bash
npm create astro@latest
```

```bash
bun create astro@latest
```

### Configure your Astro project

You will be asked a few questions to configure your project:

```bash
- Where should we create your new project?
./your-app-name
- How would you like to start your new project?
Choose a starter template (or Empty)
- Install dependencies?
Yes
- Initialize a new git repository? (optional)
Yes/No
```

### Add Svelte to your project

Install Svelte using the Astro CLI:

```bash
pnpm dlx astro add svelte
```

```bash
npx astro add svelte
```

```bash
bun x astro add svelte
```

Answer `Yes` to all the question prompted by the CLI when installing Svelte.

### Add TailwindCSS to your project

Add Tailwind CSS using the Astro CLI:

```bash
pnpm dlx astro add tailwind
```

```bash
npx astro add tailwind
```

```bash
bun x astro add tailwind
```

Answer `Yes` to all the question prompted by the CLI when installing TailwindCSS.

### Import the global CSS file

Import the `global.css` file in the `src/pages/index.astro` file:

src/pages/index.astro

```astro
---
import "../styles/global.css";
---
```

### Setup path aliases

Add the following code to the `tsconfig.json` file to resolve paths:

tsconfig.json

```json
{
  "compilerOptions": {
    // ...
    "baseUrl": ".",
    "paths": {
      "$lib": ["./src/lib"],
      "$lib/*": ["./src/lib/*"]
    }
    // ...
  }
}
```

If needed, adapt the path aliases to your specific needs ([learn more about it](https://docs.astro.build/en/guides/aliases/)).

### Run the CLI

Run the `shadcn-svelte` init command to setup your project:

```bash
pnpm dlx shadcn-svelte@latest init
```

```bash
npx shadcn-svelte@latest init
```

```bash
bun x shadcn-svelte@latest init
```

### Configure components.json

You will be asked a few questions to configure `components.json`:

```txt
Which base color would you like to use?  Slate
Where is your global CSS file? (this file will be overwritten)  src/styles/global.css
Configure the import alias for lib:  $lib
Configure the import alias for components:  $lib/components
Configure the import alias for utils:  $lib/utils
Configure the import alias for hooks:  $lib/hooks
Configure the import alias for ui:  $lib/components/ui
```

### That's it

You can now start adding components to your project.

```bash
pnpm dlx shadcn-svelte@latest add button
```

```bash
npx shadcn-svelte@latest add button
```

```bash
bun x shadcn-svelte@latest add button
```

The command above will add the `Button` component to your project. You can then import it like this:

index.astro

```astro
---
import { Button } from "$lib/components/ui/button/index.js";
---
<html lang="en">
 <head>
  <title>Astro</title>
 </head>
 <body>
  <Button>Hello World</Button>
 </body>
</html>
```

Remember to use the `client` directives inside `.astro` files when dealing with interactive components ([learn more about it](https://docs.astro.build/en/reference/directives-reference/#client-directives)).