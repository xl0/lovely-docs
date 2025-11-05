## Special Elements

Built-in components for browser APIs and rendering control.

**Error handling:** `<svelte:boundary>` catches rendering/effect errors with optional `failed` snippet or `onerror` callback.

**Window/Document/Body:** `<svelte:window>`, `<svelte:document>`, `<svelte:body>` attach event listeners and bind to properties. Must be top-level.

**Head/Element:** `<svelte:head>` inserts into document head. `<svelte:element this={tag}>` renders dynamic tag names.

**Options:** `<svelte:options>` sets compiler options (runes mode, namespace, custom elements, CSS injection).