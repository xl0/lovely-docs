Type-safe Context API wrapper for sharing data between components.

**Create:** `new Context<Type>("name")`

**Set in parent:** `myContext.set(value)` during initialization

**Read in child:** `myContext.get()` or `myContext.getOr(fallback)`

**Methods:** `exists()`, `get()`, `getOr()`, `set()` - all must be called during component initialization.