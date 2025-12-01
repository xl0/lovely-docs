## Purpose
`resource` is a utility that combines reactive state management with async data fetching. It runs after rendering by default, with a pre-render option via `resource.pre()`. Built on top of `watch`, it's designed for component-level reactive data fetching when you need more flexibility than SvelteKit's load functions.

## Core API
```svelte
const searchResource = resource(
  () => id,  // source: reactive dependency
  async (id, prevId, { data, refetching, onCleanup, signal }) => {
    // fetcher function
    const response = await fetch(`api/posts?id=${id}`, { signal });
    return response.json();
  },
  { debounce: 300 }  // options
);

// Properties
searchResource.current;    // current value
searchResource.loading;    // boolean
searchResource.error;      // Error | undefined
searchResource.mutate(value);  // direct update (optimistic updates)
searchResource.refetch();  // re-run fetcher
```

## Fetcher Parameters
- `value`: current source value
- `previousValue`: previous source value
- `data`: previous fetcher return value
- `refetching`: boolean or custom value passed to `refetch(info)`
- `onCleanup(fn)`: register cleanup before refetch
- `signal`: AbortSignal for cancelling requests

## Configuration Options
- `lazy`: skip initial fetch, only fetch on dependency changes or `refetch()`
- `once`: fetch only once, ignore subsequent dependency changes
- `initialValue`: provide initial value before first fetch completes
- `debounce`: milliseconds to debounce rapid changes (cancels pending requests, executes last one after delay)
- `throttle`: milliseconds to throttle rapid changes (spaces requests by delay, returns pending promise if called too soon)
- Note: use either debounce or throttle, not both; debounce takes precedence

## Features
- Automatic request cancellation when dependencies change
- Built-in loading and error states
- Debouncing and throttling for rate limiting
- Full TypeScript support with inferred types
- Multiple dependencies support: `resource([() => query, () => page], async ([query, page]) => ...)`
- Custom cleanup functions via `onCleanup()`
- Pre-render execution via `resource.pre()`

## Examples

**Basic usage with single dependency:**
```svelte
let id = $state(1);
const searchResource = resource(
  () => id,
  async (id, prevId, { signal }) => {
    const response = await fetch(`api/posts?id=${id}`, { signal });
    return response.json();
  },
  { debounce: 300 }
);
```

**Multiple dependencies:**
```svelte
const results = resource(
  [() => query, () => page],
  async ([query, page]) => {
    const res = await fetch(`/api/search?q=${query}&page=${page}`);
    return res.json();
  }
);
```

**Custom cleanup (e.g., EventSource):**
```svelte
const stream = resource(
  () => streamId,
  async (id, _, { signal, onCleanup }) => {
    const eventSource = new EventSource(`/api/stream/${id}`);
    onCleanup(() => eventSource.close());
    const res = await fetch(`/api/stream/${id}/init`, { signal });
    return res.json();
  }
);
```

**Pre-render execution:**
```svelte
const data = resource.pre(
  () => query,
  async (query) => {
    const res = await fetch(`/api/search?q=${query}`);
    return res.json();
  }
);
```