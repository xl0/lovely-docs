Snippets are reusable chunks of markup declared with `{#snippet name(params)}...{/snippet}` syntax. They can have parameters with default values and destructuring, but not rest parameters.

**Scope**: Snippets can reference values from their enclosing scope (script, each blocks, etc.) and are visible to siblings and their children in the same lexical scope. They can reference themselves and each other recursively.

**Passing to components**: Snippets are values that can be passed as props to components, similar to slots in web components. Snippets declared directly inside a component implicitly become props on that component. Any content inside component tags that isn't a snippet declaration implicitly becomes the `children` snippet.

**Optional snippets**: Use optional chaining `{@render children?.()}` or `#if` blocks to handle optional snippet props with fallback content.

**Typing**: Import `Snippet` from `'svelte'` and use it as a generic type. The type argument is a tuple of parameter types: `Snippet<[ParamType]>` for single param, `Snippet<[Type1, Type2]>` for multiple.

**Exporting**: Snippets at the top level can be exported from `<script module>` if they don't reference non-module script declarations.

**Programmatic creation**: Use `createRawSnippet` API for advanced use cases.

**Deprecation**: Snippets replace slots from Svelte 4, which are now deprecated.