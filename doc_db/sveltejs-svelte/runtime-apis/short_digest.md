## Stores
Reactive objects via `$` prefix. API: `writable()`, `readable()`, `derived()`, `readonly()`, `get()`. Contract: `.subscribe(fn)` returning unsubscribe.

## Context
Parent-to-child passing: `setContext(key, value)` and `getContext(key)`. Isolated per request.

## Lifecycle
- `onMount()` - Client-side init
- `onDestroy()` - Cleanup
- `tick()` - Post-update
- `$effect.pre()` / `$effect()` - Before/after DOM update

## Imperative API
- `mount(App, { target, props })`
- `unmount(app, { outro })`
- `render(App, { props })` - SSR
- `hydrate(App, { target, props })`