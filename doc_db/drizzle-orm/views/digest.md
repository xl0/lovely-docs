## Declaring Views

Views can be declared in three ways:
1. **Inline query builder**: Pass a callback to `.as()` that receives the query builder
2. **Standalone query builder**: Create a `QueryBuilder` instance and pass queries to `.as()`
3. **Raw SQL**: Use the `sql` operator when query builder syntax is insufficient

When using inline or standalone query builders, column schemas are automatically inferred. With raw SQL, you must explicitly declare the view columns schema.

### Basic Declaration (Inline Query Builder)

PostgreSQL example:
```ts
export const userView = pgView("user_view").as((qb) => qb.select().from(user));
export const customersView = pgView("customers_view").as((qb) => 
  qb.select().from(user).where(eq(user.role, "customer"))
);
```

MySQL and SQLite use `mysqlView` and `sqliteView` respectively with identical syntax.

### Selecting Specific Columns

```ts
export const customersView = pgView("customers_view").as((qb) => {
  return qb
    .select({
      id: user.id,
      name: user.name,
      email: user.email,
    })
    .from(user);
});
```

### Standalone Query Builder

```ts
import { QueryBuilder } from "drizzle-orm/pg-core";

const qb = new QueryBuilder();
export const userView = pgView("user_view").as(qb.select().from(user));
export const customersView = pgView("customers_view").as(
  qb.select().from(user).where(eq(user.role, "customer"))
);
```

### Raw SQL Declaration

When query builder doesn't support needed syntax, explicitly define columns:
```ts
const newYorkers = pgView('new_yorkers', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  cityId: integer('city_id').notNull(),
}).as(sql`select * from ${users} where ${eq(users.cityId, 1)}`);
```

Parameters in raw SQL are inlined rather than replaced with `$1`, `$2`, etc.

### Existing Views

For read-only access to existing database views, use `.existing()` so drizzle-kit won't generate a `CREATE VIEW` statement:
```ts
export const trimmedUser = pgView("trimmed_user", {
  id: serial("id"),
  name: text("name"),
  email: text("email"),
}).existing();
```

### Materialized Views (PostgreSQL Only)

PostgreSQL supports materialized views that persist results in table-like form:

```ts
const newYorkers = pgMaterializedView('new_yorkers').as((qb) => 
  qb.select().from(users).where(eq(users.cityId, 1))
);
```

Refresh materialized views at runtime:
```ts
await db.refreshMaterializedView(newYorkers);
await db.refreshMaterializedView(newYorkers).concurrently();
await db.refreshMaterializedView(newYorkers).withNoData();
```

### Advanced Configuration

Regular views support options like `checkOption`, `securityBarrier`, `securityInvoker`:
```ts
const newYorkers = pgView('new_yorkers')
  .with({
    checkOption: 'cascaded',
    securityBarrier: true,
    securityInvoker: true,
  })
  .as((qb) => { /* query */ });
```

Materialized views support index method, storage parameters, tablespace, and `withNoData()`:
```ts
const newYorkers = pgMaterializedView('new_yorkers')
  .using('btree')
  .with({
    fillfactor: 90,
    toast_tuple_target: 0.5,
    autovacuum_enabled: true,
  })
  .tablespace('custom_tablespace')
  .withNoData()
  .as((qb) => { /* query */ });
```

Supported databases: PostgreSQL, MySQL, SQLite (materialized views PostgreSQL only).