## data-sveltekit-preload-data

Preload page code and data before navigation based on user interaction:

- `"hover"` - preload on mouse hover (desktop) or `touchstart` (mobile)
- `"tap"` - preload on `touchstart` or `mousedown` only

Default in template: `<body data-sveltekit-preload-data="hover">`

```html
<a data-sveltekit-preload-data="tap" href="/stonks">
	Get current stonk values
</a>
```

Preloading is skipped if `navigator.connection.saveData` is `true`.

Can be invoked programmatically via `preloadData` from `$app/navigation`.

## data-sveltekit-preload-code

Preload only page code (not data) with four eagerness levels:

- `"eager"` - preload immediately
- `"viewport"` - preload when link enters viewport
- `"hover"` - preload on hover
- `"tap"` - preload on tap/click

Only applies to links in DOM immediately after navigation. Links added later (e.g., in `{#if}` blocks) preload only on `hover`/`tap`.

Has no effect if a `data-sveltekit-preload-data` attribute specifies a more eager value. Respects `navigator.connection.saveData`.

## data-sveltekit-reload

Force full-page browser navigation instead of SvelteKit client-side navigation:

```html
<a data-sveltekit-reload href="/path">Path</a>
```

Links with `rel="external"` receive the same treatment and are ignored during prerendering.

## data-sveltekit-replacestate

Replace current history entry instead of creating new one:

```html
<a data-sveltekit-replacestate href="/path">Path</a>
```

Uses `replaceState` instead of `pushState`.

## data-sveltekit-keepfocus

Retain focus on currently focused element after navigation:

```html
<form data-sveltekit-keepfocus>
	<input type="text" name="query">
</form>
```

Useful for search forms that submit while typing. Avoid on links since focus would be on the `<a>` tag itself. Only use on elements that persist after navigation.

## data-sveltekit-noscroll

Prevent automatic scroll to top (0,0) after navigation:

```html
<a href="path" data-sveltekit-noscroll>Path</a>
```

Default behavior scrolls to top unless link has `#hash` (scrolls to matching element ID).

## Disabling options

Disable inherited options with `"false"` value:

```html
<div data-sveltekit-preload-data="hover">
	<a href="/a">preloaded</a>
	<div data-sveltekit-preload-data="false">
		<a href="/b">NOT preloaded</a>
	</div>
</div>
```

Conditionally apply attributes:

```svelte
<div data-sveltekit-preload-data={condition ? 'hover' : false}>
```

These attributes also apply to `<form method="GET">` elements.