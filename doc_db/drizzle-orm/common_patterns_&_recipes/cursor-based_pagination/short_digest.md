## Cursor-based Pagination

Use a cursor (pointer to a row) to fetch the next page efficiently without scanning previous rows.

**Basic**: Use `gt(users.id, cursor)` with `orderBy(asc(users.id))` and `limit(pageSize)`.

**Multi-column cursor** for non-unique columns:
```ts
.where(or(
  gt(users.firstName, cursor.firstName),
  and(eq(users.firstName, cursor.firstName), gt(users.id, cursor.id))
))
.orderBy(asc(users.firstName), asc(users.id))
```

**Non-sequential primary keys**: Use `created_at` with `id` in cursor.

**Relational API**: `db.query.users.findMany({ where: (users, { gt }) => gt(users.id, cursor), ... })`

**Index cursor columns** for efficiency. Benefits: no skipped/duplicated rows, efficient. Drawbacks: can't jump to specific page, complex with multiple columns.