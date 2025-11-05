## Client Errors & Warnings
- Binding: use `bind:checked`, `bind:this`, `$bindable()`
- State: no mutations in `$derived()` or templates; use `$effect` for side-effects
- Effects: only during initialization
- Hydration: server/client values must match
- Proxies: `$state()` proxies have different identity; use `$inspect()` or `$state.snapshot()` for logging

## Compile Errors
- Each blocks: use array index `array[i] = 4` not `entry = 4`
- Props: use `$props()` not `export let`
- Reactive: use `$derived`/`$effect` not `$:`
- Slots: cannot mix `<slot>` and `{@render}`
- Snippets: use `{@render snippet()}` not `{snippet}`

## Compile Warnings
- Accessibility: interactive elements need keyboard handlers, labels need controls, media needs captions
- Code quality: lowercase component names, unused CSS, deprecated syntax (`context="module"`, `<slot>`, `<svelte:component>`)

## Server
- Lifecycle methods like `mount` unavailable on server; guard for client-only execution