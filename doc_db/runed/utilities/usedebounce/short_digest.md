## useDebounce
Creates a debounced callback that delays execution until after inactivity. Takes a callback and duration function, returns object with `pending` state, `runScheduledNow()`, and `cancel()` methods.

```svelte
const logCount = useDebounce(
	() => { /* callback */ },
	() => 1000 // duration in ms
);
logCount(); // schedule execution
logCount.runScheduledNow(); // execute immediately
logCount.cancel(); // cancel pending
```