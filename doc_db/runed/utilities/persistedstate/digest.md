## PersistedState

A reactive state manager that automatically persists data to browser storage (localStorage or sessionStorage) and optionally synchronizes changes across browser tabs in real-time.

### Basic Usage

```ts
import { PersistedState } from "runed";

const count = new PersistedState("count", 0);
count.current++; // Automatically persists
```

### Complex Objects

Only plain structures are deeply reactive: arrays, plain objects, and primitive values. Class instances require reassignment to persist:

```ts
const persistedArray = new PersistedState("foo", ["a", "b"]);
persistedArray.current.push("c"); // Persists

const persistedObject = new PersistedState("bar", { name: "Bob" });
persistedObject.current.name = "JG"; // Persists

class Person {
	name: string;
	constructor(name: string) { this.name = name; }
}
const persistedComplexObject = new PersistedState("baz", new Person("Bob"));
persistedComplexObject.current.name = "JG"; // Does NOT persist
persistedComplexObject.current = new Person("JG"); // Persists
```

### Configuration Options

```ts
const state = new PersistedState("key", initialValue, {
	storage: "session",      // 'local' (default) or 'session'
	syncTabs: false,         // Cross-tab sync (default: true)
	connected: false,        // Start disconnected (default: true)
	serializer: {            // Custom serialization
		serialize: superjson.stringify,
		deserialize: superjson.parse
	}
});
```

### Connection Control

Control when state connects to storage:

```ts
const state = new PersistedState("temp-data", initialValue, { connected: false });
state.current = "new value"; // Kept in memory only
state.connect();             // Persists to storage
console.log(state.connected); // true
state.disconnect();          // Removes from storage, keeps in memory
```

When disconnected: state changes are in-memory only, storage changes don't reflect in state, and cross-tab sync is disabled. `disconnect()` removes from storage but preserves the value in memory. `connect()` immediately persists the current in-memory value to storage.

### Storage Options

- `'local'`: Data persists until explicitly cleared
- `'session'`: Data persists until browser session ends

### Cross-Tab Synchronization

When `syncTabs` is enabled (default), changes automatically synchronize across all browser tabs using storage events.

### Custom Serialization

Handle complex data types like Dates:

```ts
import superjson from "superjson";

const lastAccessed = new PersistedState("last-accessed", new Date(), {
	serializer: {
		serialize: superjson.stringify,
		deserialize: superjson.parse
	}
});
```