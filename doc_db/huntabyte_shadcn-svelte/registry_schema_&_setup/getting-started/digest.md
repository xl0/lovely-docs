## registry.json

Create a `registry.json` file in the root of your project:

```json
{
  "$schema": "https://shadcn-svelte.com/schema/registry.json",
  "name": "acme",
  "homepage": "https://acme.com",
  "items": []
}
```

Must conform to the registry schema specification. Only required if using the shadcn-svelte CLI to build your registry.

## Add a registry item

### Create your component

Place components in `registry/[NAME]/` directory structure:

```
registry/
  hello-world/
    hello-world.svelte
```

Example component:

```svelte
<script lang="ts">
  import { Button } from "$lib/components/ui/button/index.js";
</script>
<Button>Hello World</Button>
```

If placing in a custom directory, ensure Tailwind CSS can detect it:

```css
/* src/routes/layout.css */
@source "./registry/@acmecorp/ui-lib";
```

### Add component to registry.json

```json
{
  "items": [
    {
      "name": "hello-world",
      "type": "registry:block",
      "title": "Hello World",
      "description": "A simple hello world component.",
      "files": [
        {
          "path": "./src/lib/hello-world/hello-world.svelte",
          "type": "registry:component"
        }
      ]
    }
  ]
}
```

Required properties: `name`, `type`, `title`, `description`, `files`. For each file, specify `path` (relative from project root) and `type`.

## Build your registry

Install CLI:

```bash
npm i shadcn-svelte@latest
```

Add build script to `package.json`:

```json
{
  "scripts": {
    "registry:build": "npm shadcn-svelte registry build"
  }
}
```

Run build:

```bash
npm run registry:build
```

By default generates registry JSON files in `static/r/` (e.g., `static/r/hello-world.json`). Change output directory with `--output` option.

## Serve your registry

```bash
npm run dev
```

Registry served at `http://localhost:5173/r/[NAME].json` (e.g., `http://localhost:5173/r/hello-world.json`).

## Publish your registry

Deploy project to a public URL to make registry available to other developers.

## Adding Auth

shadcn-svelte CLI does not offer built-in auth. Handle authorization on registry server. Common approach: use `token` query parameter, e.g., `http://localhost:5173/r/hello-world.json?token=[SECURE_TOKEN_HERE]`. Return 401 Unauthorized for invalid tokens. Encrypt and expire tokens.

## Guidelines

- Required block definition properties: `name`, `description`, `type`, `files`
- List all registry dependencies in `registryDependencies` (component names like `input`, `button`, or URLs to registry items)
- Ideally place files in `components`, `hooks`, or `lib` directories within registry item

## Install using CLI

```bash
npx shadcn-svelte@latest add http://localhost:5173/r/hello-world.json
```