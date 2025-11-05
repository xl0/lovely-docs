## TypeScript in Svelte

Add `lang="ts"` to script tags for type-only features. For full TypeScript support, configure `vitePreprocess` in `svelte.config.js`.

Set `tsconfig.json`: `target: ES2015`, `verbatimModuleSyntax: true`, `isolatedModules: true`.

Type `$props()` with interfaces, use `generics` attribute for generic components, and `Component`/`ComponentProps` types for component typing.

Augment `svelte/elements` module to add custom attributes or experimental features.