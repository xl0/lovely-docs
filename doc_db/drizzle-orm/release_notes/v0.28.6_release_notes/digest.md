## Changes
MySQL `datetime` with `mode: 'date'` now stores and retrieves dates in UTC strings to align with MySQL behavior. Use `mode: 'string'` or custom types for different behavior.

## New Features

**LibSQL batch API support**: Execute multiple queries in a single batch call using `db.batch()`. Supports all query builders: `db.all()`, `db.get()`, `db.values()`, `db.run()`, `db.query.<table>.findMany()`, `db.query.<table>.findFirst()`, `db.select()`, `db.update()`, `db.delete()`, `db.insert()`.

Example:
```ts
const batchResponse = await db.batch([
  db.insert(usersTable).values({ id: 1, name: 'John' }).returning({ id: usersTable.id }),
  db.update(usersTable).set({ name: 'Dan' }).where(eq(usersTable.id, 1)),
  db.query.usersTable.findMany({}),
  db.select().from(usersTable).where(eq(usersTable.id, 1)),
]);
```

**JSON mode for SQLite text columns**: Store and retrieve JSON data using text columns with `mode: 'json'`:
```ts
const test = sqliteTable('test', {
  dataTyped: text('data_typed', { mode: 'json' }).$type<{ a: 1 }>().notNull(),
});
```

**`.toSQL()` for Relational Query API**: Convert relational queries to SQL:
```ts
const query = db.query.usersTable.findFirst().toSQL();
```

**PostgreSQL array operators**: New operators for array operations:
- `arrayContains(posts.tags, ['Typescript', 'ORM'])` - check if array contains values
- `arrayContained(posts.tags, ['Typescript', 'ORM'])` - check if array is contained in values
- `arrayOverlaps(posts.tags, ['Typescript', 'ORM'])` - check if arrays overlap

Supports subqueries:
```ts
db.select({ id: posts.id }).from(posts).where(
  arrayContains(posts.tags, db.select({ tags: posts.tags }).from(posts).where(eq(posts.id, 1)))
);
```

**More SQL operators in Relational Query where filters**: Operators like `inArray` are now available as parameters in the where callback:
```ts
// Before
await db.users.findFirst({ where: (table, _) => inArray(table.id, [...]) })

// After
await db.users.findFirst({ where: (table, { inArray }) => inArray(table.id, [...]) })
```

## Fixes
- Correct where in on conflict in SQLite
- Fix libsql/client type import
- Fix raw SQL query mapping on RDS
- Fix datetime mapping for MySQL
- Fix smallserial generating as serial