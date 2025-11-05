The `style:` directive sets inline styles with shorthand syntax. Supports expressions, multiple styles, and `|important` modifier. Takes precedence over `style` attributes and `!important`.

```svelte
<div style:color="red" style:width={w} style:background-color|important={bg}>...</div>
```