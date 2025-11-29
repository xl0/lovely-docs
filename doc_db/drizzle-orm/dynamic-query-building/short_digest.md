## Dynamic Query Building

By default, query builder methods can only be invoked once to conform to SQL semantics. Enable dynamic mode with `.$dynamic()` to remove this restriction and allow multiple invocations:

```ts
const dynamicQuery = db.select().from(users).$dynamic();
dynamicQuery.where(eq(users.id, 1)).where(eq(users.name, 'John')); // ✅ OK
```

Use generic types (`PgSelect`, `MySqlSelect`, `SQLiteSelect`, etc.) as type parameters in functions to build queries dynamically:

```ts
function withPagination<T extends PgSelect>(qb: T, page: number = 1, pageSize: number = 10) {
	return qb.limit(pageSize).offset((page - 1) * pageSize);
}

let query = db.select().from(users).$dynamic();
query = withPagination(query, 1);
```