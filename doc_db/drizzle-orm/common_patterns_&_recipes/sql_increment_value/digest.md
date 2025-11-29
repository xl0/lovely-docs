## Incrementing Column Values

To increment a column value, use the `update().set()` method with the `sql` operator:

```ts
import { eq, sql } from 'drizzle-orm';

await db
  .update(table)
  .set({
    counter: sql`${table.counter} + 1`,
  })
  .where(eq(table.id, 1));
```

This generates: `update "table" set "counter" = "counter" + 1 where "id" = 1;`

## Custom Increment Function

Create a reusable increment helper:

```ts
import { AnyColumn } from 'drizzle-orm';

const increment = (column: AnyColumn, value = 1) => {
  return sql`${column} + ${value}`;
};

await db
  .update(table)
  .set({
    counter1: increment(table.counter1),
    counter2: increment(table.counter2, 10),
  })
  .where(eq(table.id, 1));
```

Supported databases: PostgreSQL, MySQL, SQLite