## Special Elements

**Error Handling:** `<svelte:boundary>` catches rendering errors and pending async states with optional error callbacks and UI snippets.

**Browser APIs:** `<svelte:window>`, `<svelte:document>`, `<svelte:body>` attach event listeners and bind to browser properties with automatic cleanup.

**Head & Dynamic:** `<svelte:head>` inserts into document.head. `<svelte:element this={tag}>` renders runtime-determined tag names.

**Config:** `<svelte:options>` sets per-component compiler options.