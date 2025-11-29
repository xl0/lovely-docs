## Limit/Offset Pagination

Limit/offset pagination skips a number of rows and returns a fixed page size. Limit is the page size, offset is `(page - 1) * pageSize`.

### Basic Usage

```ts
await db
  .select()
  .from(users)
  .orderBy(asc(users.id))
  .limit(4)
  .offset(4);
```

Generates: `select * from users order by id asc limit 4 offset 4;`

### Ordering Requirements

For consistent pagination, order by a unique column. If ordering by a non-unique column, append a unique column:

```ts
const getUsers = async (page = 1, pageSize = 3) => {
  await db
    .select()
    .from(users)
    .orderBy(asc(users.firstName), asc(users.id))
    .limit(pageSize)
    .offset((page - 1) * pageSize);
}
```

### Relational Query API

```ts
const getUsers = async (page = 1, pageSize = 3) => {
  await db.query.users.findMany({
    orderBy: (users, { asc }) => asc(users.id),
    limit: pageSize,
    offset: (page - 1) * pageSize,
  });
};
```

### Custom Pagination Function

```ts
function withPagination<T extends PgSelect>(
  qb: T,
  orderByColumn: PgColumn | SQL | SQL.Aliased,
  page = 1,
  pageSize = 3,
) {
  return qb
    .orderBy(orderByColumn)
    .limit(pageSize)
    .offset((page - 1) * pageSize);
}

const query = db.select().from(users);
await withPagination(query.$dynamic(), asc(users.id));
```

### Deferred Join Optimization

For better performance on large tables, use deferred join to paginate a subset before joining:

```ts
const getUsers = async (page = 1, pageSize = 10) => {
   const sq = db
    .select({ id: users.id })
    .from(users)
    .orderBy(users.id)
    .limit(pageSize)
    .offset((page - 1) * pageSize)
    .as('subquery');

   await db.select().from(users).innerJoin(sq, eq(users.id, sq.id)).orderBy(users.id);
};
```

### Benefits

- Simple to implement
- Pages are easily reachable; can navigate to any page without saving state

### Drawbacks

- Query performance degrades with increasing offset because the database must scan all rows before the offset to skip them
- Inconsistency due to data shifts: rows can appear on multiple pages or be skipped entirely if data is inserted/deleted between requests

Example: If a row is deleted while browsing, the next page may skip a row that was previously visible.

### When to Use

Use limit/offset for small datasets or when performance is not critical. For databases with frequent insert/delete operations or when paginating large tables, consider cursor-based pagination instead.

Supported on PostgreSQL, MySQL, and SQLite.