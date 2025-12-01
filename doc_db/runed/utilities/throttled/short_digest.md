## Throttled

Wrapper over `useThrottle` that returns a throttled state. Pass a getter function and interval in milliseconds. Access throttled value via `throttled.current`. Use `cancel()` to discard pending updates or `setImmediately(value)` to apply changes immediately and cancel pending updates.

```ts
const throttled = new Throttled(() => search, 500);
throttled.cancel();
throttled.setImmediately(newValue);
```