## Stores

Reactive objects accessed via `$` prefix in components with automatic subscription/unsubscription.

```svelte
import { writable } from 'svelte/store';
const count = writable(0);
$count = 2; // calls .set()
```

**API:**
- `writable(initial, onSubscribe?)` - `.set()` and `.update()` methods
- `readable(initial, onSubscribe)` - Read-only store
- `derived(store(s), callback, initial?)` - Computed store
- `readonly(store)` - Wrap as read-only
- `get(store)` - Synchronous value retrieval

Store contract: Must have `.subscribe(fn)` returning unsubscribe function. Optionally `.set(value)` for writable stores.

## Context

Parent-to-child value passing without prop-drilling. Use `setContext(key, value)` in parent and `getContext(key)` in child. For reactive state, mutate objects rather than reassigning. Use `createContext<T>()` for type safety. Context is isolated per request.

## Lifecycle Hooks

Two phases: creation and destruction.

- `onMount()` - Client-side initialization, returns cleanup function
- `onDestroy()` - Cleanup, runs server-side
- `tick()` - Post-update logic
- `$effect.pre()` - Runs before DOM update
- `$effect()` - Runs after DOM update

```svelte
onMount(() => {
  return () => { /* cleanup */ };
});

$effect.pre(() => {
  messages; // runs before DOM update
  tick().then(() => { /* after update */ });
});
```

## Imperative Component API

- `mount(App, { target, props })` - Instantiate and mount component
- `unmount(app, { outro: true })` - Remove component with optional transitions
- `render(App, { props })` - Server-only, returns `{ body, head }` for SSR
- `hydrate(App, { target, props })` - Reuse SSR HTML and make interactive