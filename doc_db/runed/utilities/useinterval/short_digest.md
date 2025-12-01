Reactive `setInterval` wrapper with pause/resume controls and tick counter.

**Basic usage:**
```svelte
const interval = useInterval(1000, {
  callback: (count) => console.log(`Tick ${count}`)
});
```

**Properties:** `counter`, `isActive`  
**Methods:** `pause()`, `resume()`, `reset()`

**Reactive delay:** Pass a function returning state instead of a number to auto-restart on changes.

**Options:** `immediate` (default true), `immediateCallback` (default false), `callback`