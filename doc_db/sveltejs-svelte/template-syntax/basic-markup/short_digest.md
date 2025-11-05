## Tags
Lowercase tags are HTML elements, capitalized/dot-notation tags are components.

## Attributes & Props
Attributes support JavaScript expressions and shorthand: `{name}` replaces `name={name}`. Boolean attributes include if truthy, exclude if falsy. Other attributes include unless nullish.

## Spread attributes
```svelte
<Widget a="b" {...things} c="d" />
```
Order matters — later values override earlier.

## Events
Event attributes use `on` prefix and are case-sensitive. Svelte delegates certain events (click, input, keydown, etc.) to the root for performance. Use `{ bubbles: true }` when manually dispatching delegated events.

## Text expressions
```svelte
<h1>Hello {name}!</h1>
{@html htmlString}
```
Null/undefined omitted, others coerced to strings. Use `{@html}` for HTML (prevent XSS).