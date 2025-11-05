## Stores
Reactive values with `writable()`, `readable()`, `derived()`, `readonly()`, and `get()`. Contract: `.subscribe(fn)` returning unsubscribe.

## Context API
`setContext(key, value)` and `getContext(key)` for parent-to-child value passing without prop-drilling. Request-isolated for SSR.

## Lifecycle
`onMount`, `onDestroy`, `tick()`. Use `$effect.pre`/`$effect` instead of deprecated `beforeUpdate`/`afterUpdate`.

## Imperative API
`mount()`, `unmount()`, `render()` (server), `hydrate()` for component instantiation and rendering.