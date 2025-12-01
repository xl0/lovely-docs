## Throttled

A wrapper over `useThrottle` that returns a throttled state. Throttles updates to a reactive value, delaying state changes by a specified interval.

### Basic Usage

Create a throttled state by passing a getter function and throttle interval in milliseconds:

```ts
let search = $state("");
const throttled = new Throttled(() => search, 500);
```

The throttled value is accessed via `throttled.current`. Updates to the source value are delayed by the throttle interval before reflecting in the throttled state.

### Controlling Updates

Two methods control pending updates:

- `cancel()` - Cancels any pending throttled update, keeping the current throttled value unchanged
- `setImmediately(value)` - Sets a new value immediately and cancels any pending updates

### Example with Control Methods

```ts
let count = $state(0);
const throttled = new Throttled(() => count, 500);

count = 1;
throttled.cancel();
console.log(throttled.current); // Still 0

count = 2;
console.log(throttled.current); // Still 0
throttled.setImmediately(count);
console.log(throttled.current); // 2
```