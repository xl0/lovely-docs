## Purpose
Throttles function execution to limit how often it runs within a time interval.

## API
`useThrottle(callback, durationFn)` returns a throttled function that executes the callback at most once per duration.

## Example
```svelte
const throttledUpdate = useThrottle(
	() => { throttledSearch = search; },
	() => 1000
);
```
Throttles search updates to once per second when called repeatedly.