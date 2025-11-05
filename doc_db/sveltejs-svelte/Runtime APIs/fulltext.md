

## Pages

### stores
Reactive state management through stores with a simple contract, with built-in implementations for writable, readable, derived, and readonly stores.

## Stores

Reactive values accessed via `$` prefix in components. Svelte 5 runes reduce store necessity, but stores remain useful for async data streams and manual control.

**API:**
- `writable(initial, startFn?)` - Mutable store with `.set()` and `.update()`
- `readable(initial, startFn)` - Immutable store
- `derived(store(s), callback, initial?)` - Computed store
- `readonly(store)` - Wraps store as read-only
- `get(store)` - Get value without subscribing

**Store Contract:** Must have `.subscribe(fn)` returning unsubscribe function, optionally `.set()` for writable stores.

```js
const count = writable(0);
count.subscribe(v => console.log(v)); // logs 0
count.set(1); // logs 1
```

### context
Context enables parent-to-child value passing without prop-drilling, with support for reactive state and type-safe patterns.

## Context API

Avoid prop-drilling by using `setContext(key, value)` in parent and `getContext(key)` in child components.

```svelte
// Parent
setContext('my-context', 'value');

// Child
const value = getContext('my-context');
```

Store reactive state in context by mutating objects rather than reassigning them. Wrap `setContext`/`getContext` in helper functions for type safety. Context is request-isolated (safe for SSR), unlike global module state.

### lifecycle-hooks
Svelte 5 lifecycle consists of onMount and onDestroy hooks; use $effect runes instead of deprecated beforeUpdate/afterUpdate for granular state-change reactions.

## onMount
Runs when component mounts to DOM. Can return cleanup function (must be synchronous). Doesn't run on server.

## onDestroy
Runs before component unmounts. Only lifecycle hook that runs on server.

## tick
Returns promise that resolves after pending state changes apply. Use to ensure UI updates before continuing.

## Deprecated: beforeUpdate / afterUpdate
Use `$effect.pre` and `$effect` instead. These runes offer granular control—only react to explicitly referenced state.

Example: autoscroll chat only when messages change:
```svelte
$effect.pre(() => {
	messages;
	const autoscroll = viewport?.offsetHeight + viewport?.scrollTop > viewport?.scrollHeight - 50;
	if (autoscroll) tick().then(() => viewport.scrollTo(0, viewport.scrollHeight));
});
```

### imperative-component-api
API for imperatively creating, mounting, unmounting, and server-rendering Svelte components.

## mount
Instantiates and mounts a component to a DOM element. Effects don't run during mount; use `flushSync()` if needed.

## unmount
Removes a mounted component. Returns a Promise that resolves after transitions if `outro: true`.

## render
Server-only function returning `{ body, head }` for SSR.

## hydrate
Like mount but reuses server-rendered HTML. Effects don't run during hydrate.

