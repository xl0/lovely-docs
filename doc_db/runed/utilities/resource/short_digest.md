## Overview
`resource` combines reactive state with async data fetching. Watches dependencies and runs fetcher function, with automatic request cancellation, loading/error states, and debounce/throttle support.

## API
```svelte
const res = resource(
  () => dependency,
  async (value, prevValue, { data, refetching, onCleanup, signal }) => {
    return await fetch(..., { signal });
  },
  { debounce: 300, lazy: false, once: false, initialValue: null, throttle: 0 }
);

res.current;      // value
res.loading;      // boolean
res.error;        // Error | undefined
res.mutate(val);  // direct update
res.refetch();    // re-run
```

## Key Features
- Multiple dependencies: `resource([() => a, () => b], async ([a, b]) => ...)`
- Automatic AbortSignal cancellation on dependency change
- Custom cleanup: `onCleanup(() => cleanup())`
- Pre-render: `resource.pre(() => dep, async (val) => ...)`
- Debounce/throttle (use one, not both; debounce takes precedence)