## registry-item.json Schema

JSON schema for defining custom registry items.

### Key Properties

- **name** - Unique identifier
- **title** - Human-readable name
- **type** - Item type: `registry:block`, `registry:component`, `registry:lib`, `registry:hook`, `registry:ui`, `registry:page`, `registry:file`, `registry:style`, `registry:theme`
- **description** - Detailed description
- **author** - Item author
- **dependencies** - npm packages (use `@version` for specific versions)
- **registryDependencies** - Other registry items: shadcn-svelte items (`"button"`), remote URLs (`"https://..."`), local aliases (`"local:stepper"`), or relative paths (`"./stepper.json"`)
- **files** - Array with `path`, `type`, and optional `target` (required for `registry:page` and `registry:file`; use `~` for project root)
- **cssVars** - CSS variables by theme scope (theme, light, dark)
- **css** - CSS rules (@layer, @utility, @keyframes, etc.)
- **docs** - Installation message
- **categories** - Organization tags
- **meta** - Custom metadata