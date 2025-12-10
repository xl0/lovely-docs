## package.json Configuration

**exports** - Entry points with conditional exports:
```json
{
  "exports": {
    ".": { "types": "./dist/index.d.ts", "svelte": "./dist/index.js" },
    "./Foo.svelte": { "types": "./dist/Foo.svelte.d.ts", "svelte": "./dist/Foo.svelte" }
  }
}
```

**files** - Publish dist folder: `{ "files": ["dist"] }`

**sideEffects** - Mark CSS as side effects for webpack: `{ "sideEffects": ["**/*.css"] }`

**license** - Required field (e.g., MIT)

**svelte** - Legacy field for backwards compatibility: `{ "svelte": "./dist/index.js" }`

## TypeScript Type Definitions

Auto-generated for all files. For non-root exports, TypeScript won't resolve `types` condition by default. Use `typesVersions` to map:
```json
{
  "exports": { "./foo": { "types": "./dist/foo.d.ts", "svelte": "./dist/foo.js" } },
  "typesVersions": { ">4.0": { "foo": ["./dist/foo.d.ts"] } }
}
```

Or require consumers to set `moduleResolution: "bundler"` (TypeScript 5+) or `"node16"`/`"nodenext"`.

## Best Practices

- Avoid `$app/*` modules; use `esm-env` instead
- Define aliases in `svelte.config.js` only
- Removing exports paths is a breaking change
- Enable declaration maps: `"declarationMap": true` in tsconfig, add `src/lib` to files array

## Caveats

- All imports must include file extensions: `'./something/index.js'`
- TypeScript imports use `.js` extension even for `.ts` files; set `"moduleResolution": "NodeNext"`