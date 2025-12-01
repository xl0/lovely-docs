## Debounced

Wrapper over `useDebounce` that returns a debounced state with a delay in milliseconds.

```ts
let search = $state("");
const debounced = new Debounced(() => search, 500);
```

Access the debounced value via `debounced.current`. Methods: `cancel()` to cancel pending updates, `setImmediately(value)` to set immediately, `updateImmediately()` to run pending update now.