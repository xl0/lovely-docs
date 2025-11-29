## New Features

**Custom schema support for Postgres enums:**
```ts
import { pgSchema } from 'drizzle-orm/pg-core';

const mySchema = pgSchema('mySchema');
const colors = mySchema.enum('colors', ['red', 'green', 'blue']);
```
Enums can now be created within custom schemas in Postgres.

## Fixes

**D1 migrate() function:** Changed to use batch API for better performance with Cloudflare D1.

**Postgres .onConflictDoUpdate() method:** Split `where` clause into `setWhere` and `targetWhere` to properly support both where cases in ON CONFLICT clauses:
```ts
await db.insert(employees)
  .values({ employeeId: 123, name: 'John Doe' })
  .onConflictDoUpdate({
    target: employees.employeeId,
    targetWhere: sql`name <> 'John Doe'`,
    set: { name: sql`excluded.name` }
  });

await db.insert(employees)
  .values({ employeeId: 123, name: 'John Doe' })
  .onConflictDoUpdate({
    target: employees.employeeId,
    set: { name: 'John Doe' },
    setWhere: sql`name <> 'John Doe'`
  });
```

**Postgres .onConflictDoNothing() method:** Fixed query generation for `where` clause which was being placed in wrong location.

**AWS Data API driver:** Fixed multiple issues including inserting and updating array values.