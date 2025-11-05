The `style:` directive provides a shorthand for setting inline styles on elements.

**Basic usage:**
```svelte
<div style:color="red">...</div>
```

**With expressions:**
```svelte
<div style:color={myColor}>...</div>
```

**Shorthand form** (uses variable name as both property and value):
```svelte
<div style:color>...</div>
```

**Multiple styles:**
```svelte
<div style:color style:width="12rem" style:background-color={darkMode ? 'black' : 'white'}>...</div>
```

**Important modifier:**
```svelte
<div style:color|important="red">...</div>
```

**Precedence:** `style:` directives take precedence over `style` attributes and `!important` properties:
```svelte
<div style:color="red" style="color: blue !important">This will still be red</div>
```