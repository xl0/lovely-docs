Runes are compiler-controlled symbols in Svelte files that form part of the language syntax. They are prefixed with `$` and look like function calls:

```js
let message = $state('hello');
```

Key characteristics:
- No import needed — built into the language
- Not values — cannot be assigned to variables or passed as function arguments
- Only valid in specific positions (compiler validates placement)
- Keywords, similar to JavaScript keywords

Runes were introduced in Svelte 5.