## Stores

Reactive values accessed via `$` prefix. Svelte 5 runes reduce necessity, but stores remain useful for async data and manual control.

- `writable(initial, startFn?)` - Mutable store with `.set()` and `.update()`
- `readable(initial, startFn)` - Immutable store
- `derived(store(s), callback, initial?)` - Computed store
- `readonly(store)` - Read-only wrapper
- `get(store)` - Get value without subscribing

Store contract: `.subscribe(fn)` returning unsubscribe function, optionally `.set()` for writable stores.

```js
const count = writable(0);
count.subscribe(v => console.log(v));
count.set(1);
```

## Context API

Pass values parent-to-child without prop-drilling using `setContext(key, value)` and `getContext(key)`. Store reactive state by mutating objects. Wrap in helpers for type safety. Context is request-isolated (safe for SSR).

```svelte
// Parent
setContext('my-context', 'value');
// Child
const value = getContext('my-context');
```

## Lifecycle Hooks

- `onMount` - Runs when component mounts to DOM, can return cleanup function, doesn't run on server
- `onDestroy` - Runs before unmount, only hook that runs on server
- `tick()` - Returns promise resolving after pending state changes apply
- Use `$effect.pre` and `$effect` runes instead of deprecated `beforeUpdate`/`afterUpdate`

```svelte
$effect.pre(() => {
	messages;
	const autoscroll = viewport?.offsetHeight + viewport?.scrollTop > viewport?.scrollHeight - 50;
	if (autoscroll) tick().then(() => viewport.scrollTo(0, viewport.scrollHeight));
});
```

## Imperative Component API

- `mount(Component, options)` - Instantiate and mount component to DOM element
- `unmount(component)` - Remove mounted component, returns Promise if `outro: true`
- `render(Component, options)` - Server-only, returns `{ body, head }`
- `hydrate(Component, options)` - Like mount but reuses server-rendered HTML