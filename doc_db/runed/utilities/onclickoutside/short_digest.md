## onClickOutside
Detects clicks outside a specified element and executes a callback.

```svelte
onClickOutside(
	() => container,
	() => console.log("clicked outside")
);
```

Returns `start()`, `stop()`, and `enabled` property for programmatic control.

## Options
- `immediate` (default: true): Enable handler by default
- `detectIframe` (default: false): Detect iframe interactions
- `document`, `window`: Configurable globals