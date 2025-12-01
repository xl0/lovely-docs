## TextareaAutosize

Automatically adjusts textarea height based on content by cloning the textarea off-screen and measuring its scroll height.

### Basic usage
```svelte
let el = $state<HTMLTextAreaElement>(null!);
let value = $state("");

new TextareaAutosize({
	element: () => el,
	input: () => value
});
```

### Key options
- `element`: target textarea (required)
- `input`: reactive input value (required)
- `styleProp`: `"height"` (resize both ways) or `"minHeight"` (grow only). Default: `"height"`
- `maxHeight`: max height in pixels before scroll
- `onResize`: callback when height updates