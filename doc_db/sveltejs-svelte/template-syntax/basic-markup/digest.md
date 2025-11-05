## Tags
Lowercase tags like `<div>` are HTML elements. Capitalized tags or dot notation like `<Widget>` or `<my.stuff>` are components.

## Element attributes
Attributes work like HTML. Values can be unquoted, contain JavaScript expressions, or be pure expressions:
```svelte
<a href="page/{p}">page {p}</a>
<button disabled={!clickable}>...</button>
```

Boolean attributes are included if truthy, excluded if falsy. All other attributes are included unless nullish (null or undefined):
```svelte
<input required={false} placeholder="..." />
<div title={null}>no title attribute</div>
```

Shorthand: `{name}` replaces `name={name}`:
```svelte
<button {disabled}>...</button>
```

## Component props
Pass values to components as props. Use the same `{name}` shorthand as attributes.

## Spread attributes
Multiple attributes/props can be spread at once. Order matters — later values override earlier ones:
```svelte
<Widget a="b" {...things} c="d" />
```

## Events
Listen to DOM events with `on` prefix attributes. Event attributes are case-sensitive:
```svelte
<button onclick={() => console.log('clicked')}>click me</button>
```

Event attributes support shorthand and spreading like regular attributes. Event handlers fire after bindings. Touch events (`ontouchstart`, `ontouchmove`) are passive for performance.

Svelte delegates certain events (click, input, keydown, etc.) to the application root for performance. When dispatching delegated events manually, set `{ bubbles: true }`. Avoid `stopPropagation` with delegated events or use the `on` function from `svelte/events` instead of `addEventListener`.

## Text expressions
JavaScript expressions in curly braces render as text. Null/undefined are omitted, others are coerced to strings:
```svelte
<h1>Hello {name}!</h1>
<p>{a} + {b} = {a + b}.</p>
```

Use `{@html}` to render HTML (ensure the string is escaped or controlled to prevent XSS):
```svelte
{@html potentiallyUnsafeHtmlString}
```

## Comments
HTML comments work normally. `svelte-ignore` prefix disables warnings for the next block. `@component` comments show on hover in other files.