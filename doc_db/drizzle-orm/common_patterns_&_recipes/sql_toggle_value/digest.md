To toggle a boolean column value, use the `update().set()` method with the `not()` operator:

```tsx
import { eq, not } from 'drizzle-orm';

await db
  .update(table)
  .set({
    isActive: not(table.isActive),
  })
  .where(eq(table.id, 1));
```

This generates SQL: `update "table" set "is_active" = not "is_active" where "id" = 1;`

Supported on PostgreSQL, MySQL, and SQLite. Note that MySQL uses `tinyint(1)` for boolean values and SQLite uses integers 0 (false) and 1 (true).