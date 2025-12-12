## Using JavaScript Instead of TypeScript

The project and components are written in TypeScript, but JavaScript versions are available via the CLI.

### Disable TypeScript

Set `typescript: false` in `components.json`:

```json
{
  "style": "default",
  "tailwind": {
    "css": "src/routes/layout.css"
  },
  "typescript": false,
  "aliases": {
    "utils": "$lib/utils",
    "components": "$lib/components",
    "hooks": "$lib/hooks",
    "ui": "$lib/components/ui"
  },
  "registry": "https://shadcn-svelte.com/registry"
}
```

### Configure Import Aliases

Create `jsconfig.json` to set up path aliases:

```json
{
  "compilerOptions": {
    "paths": {
      "$lib/*": ["./src/lib/*"]
    }
  }
}
```