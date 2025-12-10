## Reactive State with `$state`

Create reactive state that updates the UI:
```js
let count = $state(0);
```

**Deep reactivity**: Arrays and plain objects become deeply reactive proxies. Modifying nested properties triggers updates. Destructuring breaks reactivity.

**Classes**: Use `$state` in class fields. Not proxified; use arrow functions for methods to preserve `this` binding.

**`$state.raw`**: Non-reactive state, only reassignable (not mutatable). Better performance for large immutable data.

**`$state.snapshot`**: Get static snapshot of a proxy for external libraries.

**Passing to functions**: Pass-by-value semantics—functions receive current values, not reactive references. Use proxy properties or getters for reactivity.

**Module exports**: Can't export directly reassigned `$state` (compiler transforms it). Either export an object and mutate properties, or export accessor functions.