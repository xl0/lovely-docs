## SQL Select

Type-safe, composable select queries with automatic type inference.

### Selection

Select all columns or specific fields:
```typescript
const result = await db.select().from(users);
const result = await db.select({ id: users.id, name: users.name }).from(users);
```

Use expressions and computed fields:
```typescript
const result = await db.select({
  id: users.id,
  lowerName: sql<string>`lower(${users.name})`,
}).from(users);
```

Advanced selection with `getTableColumns()`:
```typescript
const { content, ...rest } = getTableColumns(posts);
await db.select({ ...rest }).from(posts);
```

Distinct selection:
```typescript
await db.selectDistinct().from(users);
await db.selectDistinctOn([users.id]).from(users); // PostgreSQL only
```

### Filters

Filter with operators or custom SQL:
```typescript
import { eq, lt, gte, ne, and, or, not } from 'drizzle-orm';

await db.select().from(users).where(eq(users.id, 42));
await db.select().from(users).where(and(eq(users.id, 42), eq(users.name, 'Dan')));
await db.select().from(users).where(sql`${users.id} < 42`);
```

All values are automatically parameterized.

### Pagination

Limit, offset, and ordering:
```typescript
import { asc, desc } from 'drizzle-orm';

await db.select().from(users).limit(10).offset(10);
await db.select().from(users).orderBy(asc(users.name));
```

Cursor-based pagination:
```typescript
const nextUserPage = async (cursor?: number, pageSize = 3) => {
  await db.select().from(users)
    .where(cursor ? gt(users.id, cursor) : undefined)
    .limit(pageSize)
    .orderBy(asc(users.id));
};
```

### WITH Clause (CTEs)

```typescript
const sq = db.$with('sq').as(db.select().from(users).where(eq(users.id, 42)));
const result = await db.with(sq).select().from(sq);
```

Use insert/update/delete in WITH and add aliases for arbitrary SQL values.

### Subqueries

```typescript
const sq = db.select().from(users).where(eq(users.id, 42)).as('sq');
const result = await db.select().from(sq);
await db.select().from(users).leftJoin(sq, eq(users.id, sq.id));
```

### Aggregations

Group and aggregate with helpers:
```typescript
import { count, countDistinct, avg, sum, max, min } from 'drizzle-orm';

await db.select({
  age: users.age,
  count: count(),
}).from(users).groupBy(users.age);

await db.select({
  age: users.age,
  count: count(),
}).from(users).groupBy(users.age).having(({ count }) => gt(count, 1));
```

### Iterator

**MySQL only** - Stream large result sets:
```typescript
const iterator = await db.select().from(users).iterator();
for await (const row of iterator) {
  console.log(row);
}
```

### Index Hints

**MySQL only** - USE INDEX, IGNORE INDEX, FORCE INDEX:
```typescript
await db.select().from(users, { useIndex: indexName }).where(...);
await db.select().from(users, { ignoreIndex: indexName }).where(...);
await db.select().from(users, { forceIndex: indexName }).where(...);
```