## Stores Overview

A store is an object providing reactive access to a value via a store contract. Access store values in components using the `$` prefix, which automatically subscribes/unsubscribes.

```svelte
<script>
	import { writable } from 'svelte/store';
	const count = writable(0);
	$count = 2; // assignment calls .set()
</script>
```

Store must be declared at component top level, not inside conditionals or functions.

## When to Use Stores

With Svelte 5 runes, stores are less necessary:
- For extracting logic: use runes in `.svelte.js`/`.svelte.ts` files instead
- For shared state: use `$state` objects

Stores remain useful for complex async data streams or when you need manual control over updates and subscriptions.

## svelte/store API

**writable(initialValue, onSubscribe?)** - Creates a store with `.set(value)` and `.update(callback)` methods. Optional second argument receives `set`/`update` functions and must return a stop function.

```js
const count = writable(0);
count.set(1);
count.update(n => n + 1);
```

**readable(initialValue, onSubscribe)** - Store whose value cannot be set externally. Second argument works like writable's.

```ts
const time = readable(new Date(), (set) => {
	const interval = setInterval(() => set(new Date()), 1000);
	return () => clearInterval(interval);
});
```

**derived(store(s), callback, initialValue?)** - Derives a store from one or more stores. Callback receives store value(s) and optional `set`/`update` functions for async operations.

```ts
const doubled = derived(a, ($a) => $a * 2);
const summed = derived([a, b], ([$a, $b]) => $a + $b);
```

**readonly(store)** - Wraps a store as read-only, preventing `.set()` calls while maintaining subscriptions.

**get(store)** - Retrieves store value synchronously by subscribing, reading, and unsubscribing. Not recommended in hot code paths.

## Store Contract

Implement custom stores by providing:
1. `.subscribe(subscription)` - Must synchronously call subscription with current value and whenever value changes. Must return unsubscribe function.
2. `.set(value)` (optional) - For writable stores, synchronously calls all subscriptions with new value.

Compatible with RxJS Observables if `.subscribe` returns object with `.unsubscribe` method.