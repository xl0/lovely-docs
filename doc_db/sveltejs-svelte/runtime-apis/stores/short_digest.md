## Stores

Reactive objects accessed via `$` prefix in components. Automatically subscribe/unsubscribe.

```svelte
<script>
	import { writable } from 'svelte/store';
	const count = writable(0);
	$count = 2; // calls .set()
</script>
```

**When to use:** Complex async data streams or manual control over updates. For simple shared state, prefer `$state` objects in `.svelte.js` files.

**API:**
- `writable(initial, onSubscribe?)` - `.set()` and `.update()` methods
- `readable(initial, onSubscribe)` - Read-only store
- `derived(store(s), callback, initial?)` - Computed store
- `readonly(store)` - Wrap as read-only
- `get(store)` - Synchronous value retrieval

**Store contract:** Must have `.subscribe(fn)` returning unsubscribe function. Optionally `.set(value)` for writable stores.