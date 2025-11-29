PostgreSQL sequences generate unique sequential identifiers for auto-incrementing primary keys with thread-safe multi-session support.

**Core Functions**: `nextval()`, `currval()`, `setval()`, `lastval()`

**Configuration**: startWith, maxValue, minValue, cycle, cache, increment

**Key Limitations**: Gaps from aborted transactions, out-of-order values across sessions, no rollback, potential crash recovery issues

**Usage**:
```ts
import { pgSequence } from "drizzle-orm/pg-core";

export const seq = pgSequence("name", {
  startWith: 100,
  maxValue: 10000,
  minValue: 100,
  cycle: true,
  cache: 10,
  increment: 2
});
```

**Requirements**: drizzle-orm@0.32.0+, drizzle-kit@0.23.0+, PostgreSQL only