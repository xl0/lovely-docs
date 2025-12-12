## Overview

The `components.json` file holds configuration for your project. It's used by the CLI to understand your project setup and generate customized components. **Only required if using the CLI** to add components; not needed for copy-paste method.

Create it with:
```bash
npx shadcn-svelte@latest init
```

## $schema

Reference the JSON Schema:
```json
{
  "$schema": "https://shadcn-svelte.com/schema.json"
}
```

## tailwind

Configuration for how Tailwind CSS is set up.

### tailwind.css

Path to the CSS file that imports Tailwind CSS:
```json
{
  "tailwind": {
    "css": "src/app.{p,post}css"
  }
}
```

### tailwind.baseColor

Generates the default color palette. **Cannot be changed after initialization.**
```json
{
  "tailwind": {
    "baseColor": "gray" | "neutral" | "slate" | "stone" | "zinc"
  }
}
```

## aliases

CLI uses these values with `alias` config from `svelte.config.js` to place generated components correctly. Path aliases must be set up in `svelte.config.js`.

```json
{
  "aliases": {
    "lib": "$lib",
    "utils": "$lib/utils",
    "components": "$lib/components",
    "ui": "$lib/components/ui",
    "hooks": "$lib/hooks"
  }
}
```

- **lib**: Import alias for library (components, utils, hooks, etc.)
- **utils**: Import alias for utility functions
- **components**: Import alias for components
- **ui**: Import alias for UI components
- **hooks**: Import alias for hooks (Svelte 5 reactive functions/classes, typically `.svelte.ts` or `.svelte.js`)

## typescript

Enable or disable TypeScript:
```json
{
  "typescript": true | false
}
```

Specify custom TypeScript config path:
```json
{
  "typescript": {
    "config": "path/to/tsconfig.custom.json"
  }
}
```

## registry

Registry URL for fetching shadcn-svelte components. Can pin to specific preview release or custom fork:
```json
{
  "registry": "https://shadcn-svelte.com/registry"
}
```