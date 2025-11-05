## Store Creation

**writable** - Create a store with both read and write capabilities:
```js
const count = writable(0);
count.subscribe(value => console.log(value));
count.set(1);
count.update(n => n + 1);
```

**readable** - Create a read-only store with optional start/stop callbacks:
```js
const time = readable(new Date(), set => {
  const interval = setInterval(() => set(new Date()), 1000);
  return () => clearInterval(interval);
});
```

**derived** - Create a store computed from one or more source stores:
```js
const doubled = derived(count, $count => $count * 2);
// Or with async operations:
const asyncDerived = derived(source, (value, set) => {
  setTimeout(() => set(value * 2), 100);
});
```

## Store Access

**get** - Retrieve current value by subscribing and immediately unsubscribing:
```js
const currentValue = get(store);
```

**readonly** - Wrap a store to expose only its readable interface:
```js
const readOnlyStore = readonly(writableStore);
```

## Interop

**toStore** - Convert getter/setter functions into a store:
```js
const store = toStore(() => value, (v) => { value = v; });
```

**fromStore** - Convert a store into an object with reactive `current` property:
```js
const { current } = fromStore(store);
```

## Interfaces

**Readable** - Subscribe to value changes via `subscribe(run, invalidate?)` method.

**Writable** - Extends Readable with `set(value)` and `update(updater)` methods.

**StartStopNotifier** - Callback receiving `set` and `update` functions, optionally returning cleanup function.

**Subscriber** - Callback receiving updated values.

**Updater** - Function transforming current value to new value.

**Unsubscriber** - Function to stop listening to store changes.