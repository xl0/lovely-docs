

## Pages

### svelte-boundary
Error boundary component for handling rendering errors and pending async states with optional error callbacks and UI snippets.

## svelte:boundary

Error boundary for catching rendering/effect errors and handling pending async states (added in 5.3.0).

**pending** - Show UI while `await` expressions resolve:
```svelte
<svelte:boundary>
	<p>{await delayed('hello!')}</p>
	{#snippet pending()}<p>loading...</p>{/snippet}
</svelte:boundary>
```

**failed** - Handle errors with `error` and `reset`:
```svelte
<svelte:boundary>
	<FlakyComponent />
	{#snippet failed(error, reset)}
		<button onclick={reset}>try again</button>
	{/snippet}
</svelte:boundary>
```

**onerror** - Function for error tracking or external state:
```svelte
<svelte:boundary onerror={(e, r) => { error = e; reset = r; }}>
	<FlakyComponent />
</svelte:boundary>
```

Note: Errors outside rendering (event handlers, setTimeout) are not caught.

### svelte-window
Special element for safely attaching window event listeners and binding to window properties with automatic cleanup.

`<svelte:window>` attaches event listeners and binds to window properties with automatic cleanup.

**Usage:**
```svelte
<svelte:window onkeydown={handleKeydown} bind:scrollY={y} />
```

**Bindable properties:** innerWidth, innerHeight, outerWidth, outerHeight, scrollX, scrollY, online, devicePixelRatio (only scrollX/scrollY are writable)

### svelte-document
Special element for attaching event listeners and actions to the document object.

The `<svelte:document>` element attaches event listeners and actions to the `document` object. Must be at component top level.

```svelte
<svelte:document onvisibilitychange={handleVisibilityChange} use:someAction />
```

Bindable readonly properties: `activeElement`, `fullscreenElement`, `pointerLockElement`, `visibilityState`

### svelte:body
Special element for attaching event listeners and actions to the document body.

The `<svelte:body>` element attaches event listeners to `document.body` for events like `mouseenter` and `mouseleave`, and supports actions:

```svelte
<svelte:body onmouseenter={handleMouseenter} onmouseleave={handleMouseleave} use:someAction />
```

Must be at the top level of your component.

### svelte:head
Insert elements into document.head using the <svelte:head> special element.

`<svelte:head>` inserts elements into `document.head`. Top-level only, cannot be nested.

```svelte
<svelte:head>
	<title>Hello world!</title>
	<meta name="description" content="SEO description" />
</svelte:head>
```

### svelte-element
Render a DOM element with a tag name determined at runtime.

## `<svelte:element>` Component

Renders a DOM element with a runtime-determined tag name via the `this` prop.

```svelte
<svelte:element this={tag} />
```

- If `this` is nullish, nothing renders
- Only `bind:this` binding supported
- Void elements cannot have children
- Use `xmlns` attribute for SVG: `<svelte:element this={tag} xmlns="http://www.w3.org/2000/svg" />`
- `this` must be a valid DOM tag name

### svelte-options
Configure per-component compiler options using the <svelte:options> element.

The `<svelte:options>` element sets per-component compiler options like `runes`, `namespace`, `customElement`, and `css="injected"`. Deprecated options include `immutable` and `accessors`.

```svelte
<svelte:options customElement="my-custom-element" />
```

