## StateHistory

Tracks state changes with undo/redo capabilities. Requires a getter function to read the current state and a setter function to apply state changes.

### Basic Usage

```ts
import { StateHistory } from "runed";

let count = $state(0);
const history = new StateHistory(() => count, (c) => (count = c));
history.log[0]; // { snapshot: 0, timestamp: ... }
```

### Methods

**`undo()`** - Reverts state to the previous value in history log, moving current state to redo stack.

```ts
let count = $state(0);
const history = new StateHistory(() => count, (c) => (count = c));
count = 1;
count = 2;
history.undo(); // count is now 1
history.undo(); // count is now 0
```

**`redo()`** - Restores a previously undone state from the redo stack.

```ts
history.undo(); // count is now 1
history.redo();  // count is now 2
```

**`clear()`** - Clears entire history log and redo stack.

```ts
history.clear();
console.log(history.log); // []
console.log(history.canUndo); // false
console.log(history.canRedo); // false
```

### Properties

**`log`** - Array of `LogEvent<T>` objects, each containing a `snapshot` of the state and a `timestamp`.

**`canUndo`** - Derived boolean indicating whether undo is possible (true when log has more than one item).

**`canRedo`** - Derived boolean indicating whether redo is possible (true when redo stack is not empty).

### Example in Svelte Component

```svelte
<script lang="ts">
	import { StateHistory } from "runed";
	let count = $state(0);
	const history = new StateHistory(() => count, (c) => (count = c));
</script>

<p>{count}</p>
<button onclick={() => count++}>Increment</button>
<button onclick={() => count--}>Decrement</button>
<button disabled={!history.canUndo} onclick={history.undo}>Undo</button>
<button disabled={!history.canRedo} onclick={history.redo}>Redo</button>
<button onclick={history.clear}>Clear History</button>
```