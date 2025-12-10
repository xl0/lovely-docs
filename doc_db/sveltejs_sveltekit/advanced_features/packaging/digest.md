## Overview

Use `@sveltejs/package` to build component libraries with SvelteKit. Structure: `src/lib` is public-facing (library code), `src/routes` is optional documentation/demo site. Running `svelte-package` generates a `dist` directory with preprocessed Svelte components, transpiled TypeScript, and auto-generated type definitions.

## package.json Configuration

### Essential Fields

**name** - Package name for npm installation
```json
{ "name": "your-library" }
```

**license** - Specify usage rights (e.g., MIT)
```json
{ "license": "MIT" }
```

**files** - Files to publish (npm always includes package.json, README, LICENSE)
```json
{ "files": ["dist"] }
```
Use `.npmignore` to exclude unnecessary files (tests, src/routes imports).

**exports** - Entry points for the package. Default single export:
```json
{
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "svelte": "./dist/index.js"
    }
  }
}
```

The `types` condition points to type definitions; `svelte` condition indicates Svelte component library. For non-Svelte libraries, use `default` instead of `svelte`.

Multiple entry points example:
```json
{
  "exports": {
    ".": { "types": "./dist/index.d.ts", "svelte": "./dist/index.js" },
    "./Foo.svelte": { "types": "./dist/Foo.svelte.d.ts", "svelte": "./dist/Foo.svelte" }
  }
}
```

Consumers import as: `import Foo from 'your-library/Foo.svelte'`

**svelte** - Legacy field for backwards compatibility with outdated tooling
```json
{ "svelte": "./dist/index.js" }
```

**sideEffects** - Helps bundlers with tree-shaking. Mark CSS files as having side effects for webpack compatibility:
```json
{ "sideEffects": ["**/*.css"] }
```

If scripts have side effects, list them:
```json
{ "sideEffects": ["**/*.css", "./dist/sideEffectfulFile.js"] }
```

## TypeScript & Type Definitions

Auto-generated for JavaScript, TypeScript, and Svelte files. Ensure `types` condition in exports points to correct files.

**Problem**: TypeScript doesn't resolve `types` condition for non-root exports like `./foo` by default. It searches for `foo.d.ts` at package root instead of `dist/foo.d.ts`.

**Solution 1** (recommended): Require consumers to set `moduleResolution` to `bundler` (TypeScript 5+), `node16`, or `nodenext` in their `tsconfig.json`.

**Solution 2**: Use `typesVersions` field to map types:
```json
{
  "exports": {
    "./foo": { "types": "./dist/foo.d.ts", "svelte": "./dist/foo.js" }
  },
  "typesVersions": {
    ">4.0": { "foo": ["./dist/foo.d.ts"] }
  }
}
```

The `>4.0` applies to TypeScript versions > 4. Use `*` wildcard for multiple mappings. Must declare all type imports through `typesVersions` if used, including root (`"index.d.ts": [..]`).

## Best Practices

- Avoid SvelteKit-specific modules (`$app/environment`, `$app/state`, `$app/navigation`) unless library is SvelteKit-only. Use `esm-env` instead: `import { BROWSER } from 'esm-env'`
- Pass context (URL, navigation) as props rather than importing from `$app`
- Define aliases in `svelte.config.js` (not `vite.config.js` or `tsconfig.json`) so `svelte-package` processes them
- Semantic versioning: removing `exports` paths or export conditions is a breaking change; adding new paths is not

## Source Maps

Enable declaration maps for editor "Go to Definition" support:
```json
{
  "tsconfig.json": { "declarationMap": true },
  "package.json": {
    "files": [
      "dist",
      "!dist/**/*.test.*",
      "!dist/**/*.spec.*",
      "src/lib",
      "!src/lib/**/*.test.*",
      "!src/lib/**/*.spec.*"
    ]
  }
}
```

## svelte-package Options

- `-w`/`--watch` — watch `src/lib` for changes
- `-i`/`--input` — input directory (default: `src/lib`)
- `-o`/`--output` — output directory (default: `dist`)
- `-p`/`--preserve-output` — skip deleting output directory before packaging
- `-t`/`--types` — generate type definitions (default: `true`, strongly recommended)
- `--tsconfig` — path to tsconfig/jsconfig

## Publishing

```sh
npm publish
```

## Caveats

- All relative imports must be fully specified with extensions per Node ESM: `import { x } from './something/index.js'`
- TypeScript imports: use `.js` extension even for `.ts` files. Set `"moduleResolution": "NodeNext"` in tsconfig
- Non-Svelte/TypeScript files copied as-is; Svelte files preprocessed, TypeScript transpiled to JavaScript