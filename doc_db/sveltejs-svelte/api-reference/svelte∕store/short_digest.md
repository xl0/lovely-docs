## Core Stores

**writable(initial)** - Read/write store with `set()` and `update()` methods.

**readable(initial, start)** - Read-only store with optional start/stop callback.

**derived(sources, fn)** - Computed store from one or more source stores, supports async via `set` callback.

## Utilities

**get(store)** - Get current value synchronously.

**readonly(store)** - Make a writable store read-only.

**toStore(getter, setter?)** - Convert functions to a store.

**fromStore(store)** - Convert store to reactive `{ current }` object.