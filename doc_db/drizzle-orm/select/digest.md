## SQL Select

Drizzle provides type-safe, composable SQL select queries with support for all major database dialects.

### Basic Selection

Select all rows with automatic type inference:
```typescript
const result = await db.select().from(users);
// Result type: { id: number; name: string; age: number | null }[]
```

Drizzle explicitly lists columns instead of using `SELECT *` to guarantee field order and follow best practices.

### Partial Selection

Select specific columns or use arbitrary expressions:
```typescript
const result = await db.select({
  field1: users.id,
  field2: users.name,
}).from(users);

const result = await db.select({
  id: users.id,
  lowerName: sql<string>`lower(${users.name})`,
}).from(users);
```

When using `sql<Type>`, you specify the expected return type. Drizzle cannot perform runtime type casts, so if the type is incorrect, the runtime value won't match. Use `.mapWith()` for runtime transformations.

### Conditional Selection

Build dynamic selection objects based on conditions:
```typescript
async function selectUsers(withName: boolean) {
  return db.select({
    id: users.id,
    ...(withName ? { name: users.name } : {}),
  }).from(users);
}
```

### Distinct Selection

Use `.selectDistinct()` for unique rows:
```typescript
await db.selectDistinct().from(users).orderBy(users.id, users.name);
await db.selectDistinct({ id: users.id }).from(users).orderBy(users.id);
```

PostgreSQL supports `distinct on` to specify how uniqueness is determined:
```typescript
await db.selectDistinctOn([users.id]).from(users).orderBy(users.id);
await db.selectDistinctOn([users.name], { name: users.name }).from(users).orderBy(users.name);
```

### Advanced Selection

Use `getTableColumns()` to select all columns with modifications:
```typescript
import { getTableColumns, sql } from 'drizzle-orm';

// Select all columns plus computed field
await db.select({
  ...getTableColumns(posts),
  titleLength: sql<number>`length(${posts.title})`,
}).from(posts);

// Exclude specific columns
const { content, ...rest } = getTableColumns(posts);
await db.select({ ...rest }).from(posts);
```

Alternative query API syntax:
```typescript
await db.query.posts.findMany({ columns: { title: true } });
await db.query.posts.findMany({ columns: { content: false } });
```

## Filters

Use filter operators in `.where()` clause:
```typescript
import { eq, lt, gte, ne } from 'drizzle-orm';

await db.select().from(users).where(eq(users.id, 42));
await db.select().from(users).where(lt(users.id, 42));
await db.select().from(users).where(gte(users.id, 42));
await db.select().from(users).where(ne(users.id, 42));
```

All filter operators use the `sql` function internally. Write custom filters with `sql`:
```typescript
import { sql } from 'drizzle-orm';

function equals42(col: Column) {
  return sql`${col} = 42`;
}

await db.select().from(users).where(sql`${users.id} < 42`);
await db.select().from(users).where(sql`lower(${users.name}) = 'aaron'`);
await db.select().from(users).where(equals42(users.id));
```

All values are automatically parameterized: `eq(users.id, 42)` becomes `WHERE "id" = $1; -- params: [42]`

### Inverting Conditions

Use `not()` operator:
```typescript
import { eq, not } from 'drizzle-orm';

await db.select().from(users).where(not(eq(users.id, 42)));
```

Schema changes (renaming tables/columns) are automatically reflected in queries due to template interpolation.

### Combining Filters

Use `and()` and `or()` operators:
```typescript
import { eq, and, or } from 'drizzle-orm';

await db.select().from(users).where(
  and(eq(users.id, 42), eq(users.name, 'Dan'))
);

await db.select().from(users).where(
  or(eq(users.id, 42), eq(users.name, 'Dan'))
);
```

### Advanced Filtering

Conditional filters with undefined handling:
```typescript
const searchPosts = async (term?: string) => {
  await db.select().from(posts)
    .where(term ? ilike(posts.title, term) : undefined);
};

const searchPosts = async (filters: SQL[]) => {
  await db.select().from(posts).where(and(...filters));
};
const filters: SQL[] = [];
filters.push(ilike(posts.title, 'AI'));
filters.push(inArray(posts.category, ['Tech', 'Art', 'Science']));
await searchPosts(filters);
```

## Pagination

### Limit & Offset

```typescript
await db.select().from(users).limit(10);
await db.select().from(users).limit(10).offset(10);
```

### Order By

```typescript
import { asc, desc } from 'drizzle-orm';

await db.select().from(users).orderBy(users.name);
await db.select().from(users).orderBy(desc(users.name));
await db.select().from(users).orderBy(asc(users.name), desc(users.name2));
```

### Advanced Pagination

Limit-offset pagination:
```typescript
await db.select().from(users)
  .orderBy(asc(users.id))
  .limit(4)
  .offset(4);

const getUsers = async (page = 1, pageSize = 3) => {
  await db.query.users.findMany({
    orderBy: (users, { asc }) => asc(users.id),
    limit: pageSize,
    offset: (page - 1) * pageSize,
  });
};
```

Cursor-based pagination:
```typescript
const nextUserPage = async (cursor?: number, pageSize = 3) => {
  await db.select().from(users)
    .where(cursor ? gt(users.id, cursor) : undefined)
    .limit(pageSize)
    .orderBy(asc(users.id));
};
await nextUserPage(3); // Pass cursor of last row from previous page
```

## WITH Clause (CTEs)

Simplify complex queries using Common Table Expressions:
```typescript
const sq = db.$with('sq').as(
  db.select().from(users).where(eq(users.id, 42))
);
const result = await db.with(sq).select().from(sq);
```

Use insert/update/delete in WITH:
```typescript
const sq = db.$with('sq').as(
  db.insert(users).values({ name: 'John' }).returning()
);
const result = await db.with(sq).select().from(sq);

const sq = db.$with('sq').as(
  db.update(users).set({ age: 25 }).where(eq(users.name, 'John')).returning()
);
const result = await db.with(sq).select().from(sq);

const sq = db.$with('sq').as(
  db.delete(users).where(eq(users.name, 'John')).returning()
);
const result = await db.with(sq).select().from(sq);
```

For arbitrary SQL values in CTEs, add aliases:
```typescript
const sq = db.$with('sq').as(
  db.select({ 
    name: sql<string>`upper(${users.name})`.as('name'),
  }).from(users)
);
const result = await db.with(sq).select({ name: sq.name }).from(sq);
```

Without aliases, fields become `DrizzleTypeError` and cannot be referenced.

## Subqueries

Embed queries into other queries:
```typescript
const sq = db.select().from(users).where(eq(users.id, 42)).as('sq');
const result = await db.select().from(sq);
```

Use subqueries in joins:
```typescript
const sq = db.select().from(users).where(eq(users.id, 42)).as('sq');
const result = await db.select().from(users)
  .leftJoin(sq, eq(users.id, sq.id));
```

## Aggregations

Use aggregation functions with `.groupBy()` and `.having()`:
```typescript
import { gt } from 'drizzle-orm';

await db.select({
  age: users.age,
  count: sql<number>`cast(count(${users.id}) as int)`,
})
  .from(users)
  .groupBy(users.age);

await db.select({
  age: users.age,
  count: sql<number>`cast(count(${users.id}) as int)`,
})
  .from(users)
  .groupBy(users.age)
  .having(({ count }) => gt(count, 1));
```

Note: `cast(... as int)` is necessary because `count()` returns `bigint` in PostgreSQL and `decimal` in MySQL. Alternatively use `.mapWith(Number)`.

### Aggregation Helpers

Wrapped `sql` functions for common aggregations. Remember to use `.groupBy()` when selecting aggregating functions with other columns.

**count** - Returns number of values:
```typescript
import { count } from 'drizzle-orm'

await db.select({ value: count() }).from(users);
await db.select({ value: count(users.id) }).from(users);
```

**countDistinct** - Returns number of non-duplicate values:
```typescript
import { countDistinct } from 'drizzle-orm'

await db.select({ value: countDistinct(users.id) }).from(users);
```

**avg** - Returns average of non-null values:
```typescript
import { avg } from 'drizzle-orm'

await db.select({ value: avg(users.id) }).from(users);
```

**avgDistinct** - Returns average of non-null, non-duplicate values:
```typescript
import { avgDistinct } from 'drizzle-orm'

await db.select({ value: avgDistinct(users.id) }).from(users);
```

**sum** - Returns sum of non-null values:
```typescript
import { sum } from 'drizzle-orm'

await db.select({ value: sum(users.id) }).from(users);
```

**sumDistinct** - Returns sum of non-null, non-duplicate values:
```typescript
import { sumDistinct } from 'drizzle-orm'

await db.select({ value: sumDistinct(users.id) }).from(users);
```

**max** - Returns maximum value:
```typescript
import { max } from 'drizzle-orm'

await db.select({ value: max(users.id) }).from(users);
```

**min** - Returns minimum value:
```typescript
import { min } from 'drizzle-orm'

await db.select({ value: min(users.id) }).from(users);
```

Complex aggregation example:
```typescript
db.select({
  id: orders.id,
  shippedDate: orders.shippedDate,
  shipName: orders.shipName,
  shipCity: orders.shipCity,
  shipCountry: orders.shipCountry,
  productsCount: sql<number>`cast(count(${details.productId}) as int)`,
  quantitySum: sql<number>`sum(${details.quantity})`,
  totalPrice: sql<number>`sum(${details.quantity} * ${details.unitPrice})`,
})
  .from(orders)
  .leftJoin(details, eq(orders.id, details.orderId))
  .groupBy(orders.id)
  .orderBy(asc(orders.id))
  .all();
```

### $count

Dedicated count API (see separate documentation).

## Iterator

**MySQL only** (PostgreSQL, SQLite, SingleStore: WIP)

For large result sets, use `.iterator()` to avoid loading all rows into memory:
```typescript
const iterator = await db.select().from(users).iterator();

for await (const row of iterator) {
  console.log(row);
}
```

Works with prepared statements:
```typescript
const query = await db.select().from(users).prepare();
const iterator = await query.iterator();

for await (const row of iterator) {
  console.log(row);
}
```

## Index Hints

**MySQL only** (PostgreSQL, SQLite, SingleStore: not supported)

### USE INDEX

Suggests indexes to the optimizer (not forced):
```typescript
export const users = mysqlTable('users', {
  id: int('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
}, () => [usersTableNameIndex]);

const usersTableNameIndex = index('users_name_index').on(users.name);

await db.select()
  .from(users, { useIndex: usersTableNameIndex })
  .where(eq(users.name, 'David'));

// Also works on joins
await db.select()
  .from(users)
  .leftJoin(posts, eq(posts.userId, users.id), { useIndex: usersTableNameIndex })
  .where(eq(users.name, 'David'));
```

### IGNORE INDEX

Tells optimizer to avoid specific indexes:
```typescript
await db.select()
  .from(users, { ignoreIndex: usersTableNameIndex })
  .where(eq(users.name, 'David'));

// Also works on joins
await db.select()
  .from(users)
  .leftJoin(posts, eq(posts.userId, users.id), { ignoreIndex: usersTableNameIndex })
  .where(eq(users.name, 'David'));
```

### FORCE INDEX

Forces optimizer to use specified index(es):
```typescript
await db.select()
  .from(users, { forceIndex: usersTableNameIndex })
  .where(eq(users.name, 'David'));

// Also works on joins
await db.select()
  .from(users)
  .leftJoin(posts, eq(posts.userId, users.id), { forceIndex: usersTableNameIndex })
  .where(eq(users.name, 'David'));
```