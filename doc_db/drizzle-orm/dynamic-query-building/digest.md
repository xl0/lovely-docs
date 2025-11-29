## Dynamic Query Building

By default, Drizzle query builders enforce SQL semantics where most methods can only be invoked once. For example, you cannot call `.where()` multiple times on a SELECT statement:

```ts
const query = db
	.select()
	.from(users)
	.where(eq(users.id, 1))
	.where(eq(users.name, 'John')); // ❌ Type error
```

This restriction is useful for conventional query building but becomes problematic when building queries dynamically, such as in shared functions that enhance query builders.

### Enabling Dynamic Mode

Call `.$dynamic()` on a query builder to enable dynamic mode, which removes the restriction of invoking methods only once:

```ts
function withPagination<T extends PgSelect>(
	qb: T,
	page: number = 1,
	pageSize: number = 10,
) {
	return qb.limit(pageSize).offset((page - 1) * pageSize);
}

const query = db.select().from(users).where(eq(users.id, 1));
withPagination(query, 1); // ❌ Type error - not in dynamic mode

const dynamicQuery = query.$dynamic();
withPagination(dynamicQuery, 1); // ✅ OK
```

### Generic Query Builder Types

Dynamic query building uses generic types that can be used as type parameters to modify query builders. These types are specifically designed for dynamic mode and only work in that context:

**Postgres**: `PgSelect`, `PgSelectQueryBuilder`, `PgInsert`, `PgUpdate`, `PgDelete`

**MySQL**: `MySqlSelect`, `MySqlSelectQueryBuilder`, `MySqlInsert`, `MySqlUpdate`, `MySqlDelete`

**SQLite**: `SQLiteSelect`, `SQLiteSelectQueryBuilder`, `SQLiteInsert`, `SQLiteUpdate`, `SQLiteDelete`

Example with generic enhancement:

```ts
function withFriends<T extends PgSelect>(qb: T) {
	return qb.leftJoin(friends, eq(friends.userId, users.id));
}

let query = db.select().from(users).where(eq(users.id, 1)).$dynamic();
query = withFriends(query);
```

The `...QueryBuilder` types are for standalone query builder instances (created with `new QueryBuilder()`), but DB query builders are subclasses of them, so both can be used interchangeably.