Reactive state manager that persists to browser storage and syncs across tabs.

```ts
const count = new PersistedState("count", 0);
count.current++; // Auto-persists

// Configuration
new PersistedState("key", value, {
	storage: "session",      // 'local' or 'session'
	syncTabs: false,         // Cross-tab sync (default: true)
	connected: false,        // Start disconnected (default: true)
	serializer: { serialize, deserialize } // Custom serialization
});

// Connection control
state.connect();    // Persist to storage
state.disconnect(); // Remove from storage, keep in memory
```

Only plain structures (arrays, objects, primitives) are deeply reactive. Class instances require reassignment to persist changes.