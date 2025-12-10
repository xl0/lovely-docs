Runes are compiler-controlled symbols with `$` prefix that form part of Svelte's syntax, functioning as keywords. They control the Svelte compiler in `.svelte` and `.svelte.js`/`.svelte.ts` files.

Key characteristics:
- Look like functions: `let message = $state('hello');`
- Don't require imports — built into the language
- Not values — cannot be assigned to variables or passed as function arguments
- Only valid in specific positions (compiler validates placement)
- Introduced in Svelte 5