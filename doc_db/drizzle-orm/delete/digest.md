## Delete Operations

Delete all rows from a table:
```typescript
await db.delete(users);
```

Delete with WHERE conditions:
```typescript
await db.delete(users).where(eq(users.name, 'Dan'));
```

### Limit
Supported in MySQL, SQLite, SingleStore (not PostgreSQL). Add a limit clause to restrict the number of deleted rows:
```typescript
await db.delete(users).where(eq(users.name, 'Dan')).limit(2);
```

### Order By
Sort deleted rows by specified fields before deletion. Supports ascending (asc) and descending (desc) order, and multiple fields:
```typescript
import { asc, desc } from 'drizzle-orm';

await db.delete(users).where(eq(users.name, 'Dan')).orderBy(users.name);
await db.delete(users).where(eq(users.name, 'Dan')).orderBy(desc(users.name));
await db.delete(users).where(eq(users.name, 'Dan')).orderBy(users.name, users.name2);
await db.delete(users).where(eq(users.name, 'Dan')).orderBy(asc(users.name), desc(users.name2));
```

### Delete with Return
Supported in PostgreSQL and SQLite (not MySQL or SingleStore). Retrieve deleted rows:
```typescript
const deletedUser = await db.delete(users)
  .where(eq(users.name, 'Dan'))
  .returning();

// Partial return - select specific fields
const deletedUserIds = await db.delete(users)
  .where(eq(users.name, 'Dan'))
  .returning({ deletedId: users.id });
```

### WITH DELETE Clause
Use Common Table Expressions (CTEs) to simplify complex delete queries:
```typescript
const averageAmount = db.$with('average_amount').as(
  db.select({ value: sql`avg(${orders.amount})`.as('value') }).from(orders)
);

const result = await db
	.with(averageAmount)
	.delete(orders)
	.where(gt(orders.amount, sql`(select * from ${averageAmount})`))
	.returning({ id: orders.id });
```