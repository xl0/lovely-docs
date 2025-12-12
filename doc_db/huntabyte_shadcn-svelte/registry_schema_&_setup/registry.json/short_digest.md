## registry.json Schema

Defines custom component registries with name, homepage, items array, and configuration.

**Key properties:**
- `$schema`: Schema URL for validation
- `name`: Registry identifier
- `homepage`: Registry URL
- `items`: Array of registry items (see registry-item schema)
- `aliases`: Maps internal import paths to actual locations (transformed on user install)
  - Default: `lib`, `ui`, `components`, `utils`, `hooks`
- `overrideDependencies`: Forces specific dependency versions (e.g., `["paneforge@next"]`)

```json
{
  "$schema": "https://shadcn-svelte.com/schema/registry.json",
  "name": "acme",
  "homepage": "https://acme.com",
  "aliases": {
    "lib": "@/lib",
    "ui": "@/lib/registry/ui",
    "utils": "@/lib/utils"
  },
  "overrideDependencies": ["paneforge@next"],
  "items": [...]
}
```