## Special Elements

Built-in components for accessing browser APIs and controlling rendering behavior.

### Error Handling
**`<svelte:boundary>`** — Catches rendering, update, and effect errors in children. Requires either a `failed` snippet or `onerror` callback. The `failed` snippet receives `error` and `reset` parameters for recovery UI. Does not catch event handler or async errors.

```svelte
<svelte:boundary>
	<Component />
	{#snippet failed(error, reset)}
		<button onclick={reset}>Retry</button>
	{/snippet}
</svelte:boundary>
```

### Window & Document
**`<svelte:window>`** — Attaches event listeners to `window` with automatic cleanup. Bindable properties: `innerWidth`, `innerHeight`, `outerWidth`, `outerHeight`, `scrollX`, `scrollY`, `online`, `devicePixelRatio`.

**`<svelte:document>`** — Attaches event listeners and actions to `document`. Bindable readonly properties: `activeElement`, `fullscreenElement`, `pointerLockElement`, `visibilityState`.

**`<svelte:body>`** — Attaches event listeners and actions to `document.body`. Use for events like `mouseenter` and `mouseleave` that don't fire on `window`.

All three must be at component top level only.

```svelte
<svelte:window bind:scrollY={y} onkeydown={handleKeydown} />
<svelte:document bind:activeElement={el} onvisibilitychange={handler} />
<svelte:body onmouseenter={handleMouseenter} use:someAction />
```

### Head & DOM
**`<svelte:head>`** — Inserts elements into `document.head`. Must appear only at component top level.

```svelte
<svelte:head>
	<title>Hello world!</title>
	<meta name="description" content="SEO description" />
</svelte:head>
```

**`<svelte:element>`** — Renders a DOM element with runtime-determined tag name via the `this` prop. If `this` is nullish, nothing renders. Only `bind:this` binding works.

```svelte
<svelte:element this={tag} />
```

### Configuration
**`<svelte:options>`** — Specifies per-component compiler options:
- `runes={true|false}` — Forces runes or legacy mode
- `namespace="html|svg|mathml"` — Sets component namespace
- `customElement={...}` — Configures custom element compilation
- `css="injected"` — Injects styles inline