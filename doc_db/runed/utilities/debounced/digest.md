## Debounced

A wrapper over `useDebounce` that returns a debounced state. Useful for delaying state updates, commonly used for search inputs or other user interactions that shouldn't trigger immediately.

### Basic Usage

Create a debounced state by passing a getter function and delay in milliseconds:

```ts
let search = $state("");
const debounced = new Debounced(() => search, 500);
```

The debounced value is accessed via `debounced.current`. In the example above, when `search` changes, `debounced.current` will update after 500ms of inactivity.

### Methods

- `cancel()` - Cancels any pending debounced update, keeping the current debounced value unchanged
- `setImmediately(value)` - Sets a new value immediately and cancels any pending updates
- `updateImmediately()` - Runs the pending update immediately without waiting for the delay

### Example with all methods

```ts
let count = $state(0);
const debounced = new Debounced(() => count, 500);

count = 1;
debounced.cancel(); // Cancels the pending update
// debounced.current remains 0

count = 2;
debounced.setImmediately(count); // Sets to 2 immediately
// debounced.current is now 2

count = 3;
await debounced.updateImmediately(); // Runs pending update immediately
// debounced.current is now 3
```