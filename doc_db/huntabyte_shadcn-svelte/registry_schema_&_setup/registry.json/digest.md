## registry.json Schema

Defines a custom component registry for shadcn-svelte.

### Structure

```json
{
  "$schema": "https://shadcn-svelte.com/schema/registry.json",
  "name": "acme",
  "homepage": "https://acme.com",
  "items": [
    {
      "name": "hello-world",
      "type": "registry:block",
      "title": "Hello World",
      "description": "A simple hello world component.",
      "files": [
        {
          "path": "src/lib/registry/blocks/hello-world/hello-world.svelte",
          "type": "registry:component"
        }
      ]
    }
  ],
  "aliases": {
    "lib": "@/lib",
    "ui": "@/lib/registry/ui",
    "components": "@/lib/registry/components",
    "utils": "@/lib/utils",
    "hooks": "@/lib/hooks"
  },
  "overrideDependencies": ["paneforge@next"]
}
```

### Properties

**$schema**: URL to the registry.json schema for validation.

**name**: Registry name used for data attributes and metadata.

**homepage**: Registry homepage URL for metadata.

**items**: Array of registry items. Each must implement the registry-item schema specification.

**aliases**: Maps internal import paths to their actual locations. When users install components, these paths are transformed according to their `components.json` configuration.

Default aliases if not specified:
- `lib`: `$lib/registry/lib` (internal library code)
- `ui`: `$lib/registry/ui` (UI components)
- `components`: `$lib/registry/components` (component-specific code)
- `utils`: `$lib/utils` (utility functions)
- `hooks`: `$lib/registry/hooks` (reactive state and logic)

Example: If your component imports `@/lib/registry/ui/button`, define `"ui": "@/lib/registry/ui"` in aliases so paths are correctly transformed during installation.

**overrideDependencies**: Forces specific version ranges for dependencies, overriding what `shadcn-svelte registry build` detects in `package.json`. Useful for pre-release versions or pinning specific versions.

Example: `"overrideDependencies": ["paneforge@next"]` forces the latest `@next` version instead of the version in package.json.

⚠️ Warning: Overriding dependencies can cause version conflicts. Use sparingly.