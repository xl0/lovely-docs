## Cursor-based Pagination

Cursor-based pagination uses a cursor as a pointer to a specific row, indicating the end of the previous page, to fetch the next set of rows. This approach is more efficient than offset/limit pagination because it doesn't need to scan and skip previous rows.

### Basic Implementation

Use a cursor (typically a unique, sequential column like `id`) with comparison operators:

```ts
const nextUserPage = async (cursor?: number, pageSize = 3) => {
  await db
    .select()
    .from(users)
    .where(cursor ? gt(users.id, cursor) : undefined)
    .limit(pageSize)
    .orderBy(asc(users.id));
};

await nextUserPage(3); // get rows after id 3
```

### Dynamic Order Direction

Support ascending and descending order by adjusting both the comparison operator and sort direction:

```ts
const nextUserPage = async (order: 'asc' | 'desc' = 'asc', cursor?: number, pageSize = 3) => {
  await db
    .select()
    .from(users)
    .where(cursor ? (order === 'asc' ? gt(users.id, cursor) : lt(users.id, cursor)) : undefined)
    .limit(pageSize)
    .orderBy(order === 'asc' ? asc(users.id) : desc(users.id));
};
```

### Multi-column Cursor for Non-unique Columns

When ordering by non-unique, non-sequential columns, use multiple columns in the cursor. Order by the primary column, then by a unique sequential column:

```ts
const nextUserPage = async (
  cursor?: { id: number; firstName: string },
  pageSize = 3,
) => {
  await db
    .select()
    .from(users)
    .where(
      cursor
        ? or(
            gt(users.firstName, cursor.firstName),
            and(eq(users.firstName, cursor.firstName), gt(users.id, cursor.id)),
          )
        : undefined,
    )
    .limit(pageSize)
    .orderBy(asc(users.firstName), asc(users.id));
};

await nextUserPage({ id: 2, firstName: 'Alex' });
```

### Non-sequential Primary Keys (UUIDv4)

For non-sequential primary keys, add a sequential column (like `created_at`) and use it with the primary key in the cursor:

```ts
const nextUserPage = async (
  cursor?: { id: string; createdAt: Date },
  pageSize = 3,
) => {
  await db
    .select()
    .from(users)
    .where(
      cursor
        ? or(
            gt(users.createdAt, cursor.createdAt),
            and(eq(users.createdAt, cursor.createdAt), gt(users.id, cursor.id)),
          )
        : undefined,
    )
    .limit(pageSize)
    .orderBy(asc(users.createdAt), asc(users.id));
};

await nextUserPage({
  id: '66ed00a4-c020-4dfd-a1ca-5d2e4e54d174',
  createdAt: new Date('2024-03-09T17:59:36.406Z'),
});
```

### Relational Query API

Using the relational queries API:

```ts
const nextUserPage = async (cursor?: number, pageSize = 3) => {
  await db.query.users.findMany({
    where: (users, { gt }) => (cursor ? gt(users.id, cursor) : undefined),
    orderBy: (users, { asc }) => asc(users.id),
    limit: pageSize,
  });
};

await nextUserPage(3);
```

### Indexing

Create indices on cursor columns for query efficiency:

```ts
export const users = pgTable('users', {
  // columns
}, (t) => [
  index('first_name_index').on(t.firstName).asc(),
  index('first_name_and_id_index').on(t.firstName, t.id).asc(),
]);
```

### Benefits and Drawbacks

**Benefits**: Consistent query results with no skipped or duplicated rows when data is inserted/deleted; more efficient than offset/limit pagination.

**Drawbacks**: Cannot directly navigate to a specific page; more complex implementation, especially with multiple cursor columns.

Supported on PostgreSQL, MySQL, and SQLite.