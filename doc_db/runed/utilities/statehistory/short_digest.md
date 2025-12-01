## StateHistory

Tracks state changes with undo/redo capabilities using a getter and setter function.

**Methods:** `undo()` reverts to previous state, `redo()` restores undone state, `clear()` resets history.

**Properties:** `log` (array of snapshots with timestamps), `canUndo` (boolean), `canRedo` (boolean).

```ts
let count = $state(0);
const history = new StateHistory(() => count, (c) => (count = c));
count = 1;
count = 2;
history.undo(); // count is now 1
history.redo();  // count is now 2
```