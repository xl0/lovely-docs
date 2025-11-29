## Limit/Offset Pagination

Limit is page size, offset is `(page - 1) * pageSize`. Always order by a unique column or append one for consistency.

```ts
await db.select().from(users)
  .orderBy(asc(users.id))
  .limit(pageSize)
  .offset((page - 1) * pageSize);
```

**Relational API:**
```ts
await db.query.users.findMany({
  orderBy: (users, { asc }) => asc(users.id),
  limit: pageSize,
  offset: (page - 1) * pageSize,
});
```

**Deferred join optimization** for large tables:
```ts
const sq = db.select({ id: users.id }).from(users)
  .orderBy(users.id).limit(pageSize).offset((page - 1) * pageSize).as('subquery');
await db.select().from(users).innerJoin(sq, eq(users.id, sq.id));
```

**Benefits:** Simple, any page reachable without state. **Drawbacks:** Performance degrades with large offsets, inconsistent results if data changes between requests. Use cursor-based pagination for high-frequency inserts/deletes or large tables.