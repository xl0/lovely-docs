

## Pages

### svelte:boundary
Error boundary component that catches rendering and effect errors, with optional failed snippet and onerror callback for recovery.

## svelte:boundary

Catches rendering/update/effect errors in children and removes their contents on error.

**`failed` snippet** - Rendered on error with `error` and `reset`:
```svelte
<svelte:boundary>
	<Component />
	{#snippet failed(error, reset)}
		<button onclick={reset}>Retry</button>
	{/snippet}
</svelte:boundary>
```

**`onerror` function** - Called with `error` and `reset` for error reporting or external state management.

Does not catch event handler or async errors. Requires `failed` or `onerror`.

### svelte-window
Special element for attaching window event listeners and binding to window properties with automatic cleanup.

## `<svelte:window>`

Attaches event listeners to `window` with automatic cleanup and SSR safety.

**Event listeners:**
```svelte
<svelte:window onkeydown={handleKeydown} />
```

**Bindable properties:** `innerWidth`, `innerHeight`, `outerWidth`, `outerHeight`, `scrollX`, `scrollY`, `online`, `devicePixelRatio`

```svelte
<svelte:window bind:scrollY={y} />
```

**Constraints:** Top-level only. `scrollX`/`scrollY` binding doesn't scroll to initial value.

### svelte-document
Special element for attaching event listeners and actions to the document object, with bindable readonly properties.

## `<svelte:document>`

Attach event listeners and actions to `document`. Bind to readonly properties: `activeElement`, `fullscreenElement`, `pointerLockElement`, `visibilityState`.

```svelte
<svelte:document onvisibilitychange={handler} bind:activeElement={el} use:action />
```

Must be at component top level, never inside blocks or elements.

### svelte:body
Special element for attaching event listeners and actions to the document body.

The `<svelte:body>` element attaches event listeners and actions to `document.body`. Use it for events like `mouseenter` and `mouseleave` that don't fire on `window`. Must be at component top level.

```svelte
<svelte:body onmouseenter={handleMouseenter} onmouseleave={handleMouseleave} use:someAction />
```

### svelte:head
Insert content into document.head using the <svelte:head> special element.

`<svelte:head>` inserts elements into `document.head`. Must appear only at component top level, not nested in blocks or elements.

```svelte
<svelte:head>
	<title>Hello world!</title>
	<meta name="description" content="SEO description" />
</svelte:head>
```

### svelte:element
Render DOM elements with runtime-determined tag names using the `<svelte:element>` component.

## `<svelte:element>` Component

Renders a DOM element with a runtime-determined tag name via the `this` prop.

```svelte
<svelte:element this={tag} />
```

- If `this` is nullish, nothing renders
- Only `bind:this` binding works
- Void elements cannot have children (throws error in dev)
- Use `xmlns` attribute to explicitly set namespace for SVG/XML elements

### svelte:options
Element for specifying per-component compiler options like runes mode, namespace, custom element configuration, and CSS injection.

## `<svelte:options>` Element

Specifies per-component compiler options:
- `runes={true|false}` — Forces runes or legacy mode
- `namespace="html|svg|mathml"` — Sets component namespace
- `customElement={...}` — Configures custom element compilation
- `css="injected"` — Injects styles inline

Deprecated: `immutable` and `accessors` options (Svelte 4)

Example: `<svelte:options customElement="my-custom-element" />`

### special-elements
Overview and navigation hub for Svelte's special elements documentation.

Index page for Svelte's special elements - built-in components and directives for core functionality like conditionals, loops, animations, and lifecycle management.

