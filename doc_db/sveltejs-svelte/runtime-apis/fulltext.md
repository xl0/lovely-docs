

## Pages

### stores
Reactive stores for managing shared state and async data streams in Svelte, with built-in implementations (writable, readable, derived) and a customizable contract.

## Stores

Reactive objects accessed via `$` prefix in components. Automatically subscribe/unsubscribe.

```svelte
<script>
	import { writable } from 'svelte/store';
	const count = writable(0);
	$count = 2; // calls .set()
</script>
```

**When to use:** Complex async data streams or manual control over updates. For simple shared state, prefer `$state` objects in `.svelte.js` files.

**API:**
- `writable(initial, onSubscribe?)` - `.set()` and `.update()` methods
- `readable(initial, onSubscribe)` - Read-only store
- `derived(store(s), callback, initial?)` - Computed store
- `readonly(store)` - Wrap as read-only
- `get(store)` - Synchronous value retrieval

**Store contract:** Must have `.subscribe(fn)` returning unsubscribe function. Optionally `.set(value)` for writable stores.

### context
Context enables parent-to-child value passing without prop-drilling and provides request-isolated state management.

Context allows child components to access parent values without prop-drilling. Use `setContext(key, value)` in parent and `getContext(key)` in child. For reactive state, mutate objects rather than reassigning. Use `createContext<T>()` for type safety. Context is isolated per request, unlike global module state.

### lifecycle-hooks
Svelte 5 lifecycle hooks: onMount (client-side init), onDestroy (cleanup), tick (post-update), with $effect.pre/$effect replacing deprecated beforeUpdate/afterUpdate.

## Lifecycle Hooks

Svelte 5 has two lifecycle phases: creation and destruction. Use `onMount` for initialization (runs client-side only), `onDestroy` for cleanup (runs server-side), and `tick()` for post-update logic.

Deprecated `beforeUpdate`/`afterUpdate` are replaced by `$effect.pre` and `$effect` for more granular control:

```svelte
import { onMount, onDestroy, tick } from 'svelte';

onMount(() => {
  return () => { /* cleanup */ };
});

onDestroy(() => { /* cleanup */ });

$effect.pre(() => {
  messages; // runs before DOM update when messages change
  tick().then(() => { /* after update */ });
});
```

### imperative-component-api
Functions for imperatively creating, mounting, rendering, and hydrating Svelte components.

## mount
```js
const app = mount(App, { target: element, props: {...} });
```
Instantiates and mounts a component. Effects don't run; use `flushSync()` if needed.

## unmount
```js
unmount(app, { outro: true });
```
Removes a component, optionally playing transitions.

## render
```js
const { body, head } = render(App, { props: {...} });
```
Server-only. Returns HTML for SSR.

## hydrate
```js
const app = hydrate(App, { target: element, props: {...} });
```
Reuses SSR HTML and makes it interactive.

