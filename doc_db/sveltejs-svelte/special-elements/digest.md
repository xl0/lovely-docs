## Special Elements

Svelte provides special elements for handling errors, accessing browser APIs, and rendering dynamic content.

### Error Handling
`<svelte:boundary>` catches rendering and effect errors, handles pending async states, and provides error recovery:
```svelte
<svelte:boundary onerror={(e, r) => { error = e; reset = r; }}>
	<p>{await delayed('hello!')}</p>
	{#snippet pending()}<p>loading...</p>{/snippet}
	{#snippet failed(error, reset)}<button onclick={reset}>try again</button>{/snippet}
</svelte:boundary>
```
Note: Does not catch errors in event handlers or setTimeout.

### Window & Document Access
`<svelte:window>` attaches event listeners and binds to window properties (innerWidth, innerHeight, scrollX, scrollY, online, devicePixelRatio):
```svelte
<svelte:window onkeydown={handleKeydown} bind:scrollY={y} />
```

`<svelte:document>` attaches listeners and actions to document, with readonly bindings for activeElement, fullscreenElement, pointerLockElement, visibilityState:
```svelte
<svelte:document onvisibilitychange={handleVisibilityChange} use:someAction />
```

`<svelte:body>` attaches listeners to document.body for events like mouseenter/mouseleave.

### Head & Dynamic Elements
`<svelte:head>` inserts elements into document.head:
```svelte
<svelte:head>
	<title>Hello world!</title>
	<meta name="description" content="SEO description" />
</svelte:head>
```

`<svelte:element>` renders a DOM element with runtime-determined tag name via the `this` prop. Only `bind:this` binding is supported. Use `xmlns` attribute for SVG.

### Configuration
`<svelte:options>` sets per-component compiler options: `runes`, `namespace`, `customElement`, `css="injected"`.