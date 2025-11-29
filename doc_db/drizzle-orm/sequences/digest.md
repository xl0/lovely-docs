## Sequences

PostgreSQL sequences are special single-row tables that generate unique sequential identifiers, commonly used for auto-incrementing primary keys. They provide thread-safe value generation across multiple sessions.

### Key Features

**Creation and Initialization**
- Use `pgSequence()` to create sequences with customizable parameters: start value, increment, min/max values, and cache size
- Default behavior: increments by 1, starts at 1

**Manipulation Functions**
- `nextval('sequence_name')`: Advances sequence and returns next value
- `currval('sequence_name')`: Returns current value for current session
- `setval('sequence_name', value)`: Sets sequence's current value
- `lastval()`: Returns last value from nextval in current session

**Ownership and Lifecycle**
- Sequences can be linked to table columns using OWNED BY clause
- Dropping table or column automatically drops associated sequence

**Cycling and Caching**
- CYCLE option allows sequences to restart at min value after reaching max (default: NO CYCLE)
- CACHE option preallocates values for performance improvement

### Limitations

- **Gaps**: Aborted transactions or crashes create gaps in sequence values
- **Concurrency**: Values are unique but may be out of order across sessions
- **No Rollback**: Sequence changes persist even if transaction fails, ensuring uniqueness but creating gaps
- **Crash Recovery**: Unlogged sequences may not restore properly after crashes

### Usage Examples

```ts
import { pgSchema, pgSequence } from "drizzle-orm/pg-core";

// Basic sequence with defaults
export const customSequence = pgSequence("name");

// Sequence with custom parameters
export const customSequence = pgSequence("name", {
  startWith: 100,
  maxValue: 10000,
  minValue: 100,
  cycle: true,
  cache: 10,
  increment: 2
});

// Sequence in custom schema
export const customSchema = pgSchema('custom_schema');
export const customSequence = customSchema.sequence("name");
```

**Requirements**: drizzle-orm@0.32.0+ and drizzle-kit@0.23.0+
**Database Support**: PostgreSQL only