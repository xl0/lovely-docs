## Declaring Views

Three declaration methods:
1. **Inline query builder**: `.as((qb) => qb.select().from(table))`
2. **Standalone query builder**: Create `QueryBuilder` instance, pass to `.as()`
3. **Raw SQL**: Use `sql` operator with explicit column schema

Column schemas auto-inferred for query builders, must be explicit for raw SQL.

### Examples

Inline query builder:
```ts
export const userView = pgView("user_view").as((qb) => qb.select().from(user));
export const customersView = pgView("customers_view").as((qb) => 
  qb.select().from(user).where(eq(user.role, "customer"))
);
```

Specific columns:
```ts
export const customersView = pgView("customers_view").as((qb) => 
  qb.select({ id: user.id, name: user.name, email: user.email }).from(user)
);
```

Raw SQL:
```ts
const newYorkers = pgView('new_yorkers', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  cityId: integer('city_id').notNull(),
}).as(sql`select * from ${users} where ${eq(users.cityId, 1)}`);
```

Existing views (read-only):
```ts
export const trimmedUser = pgView("trimmed_user", {
  id: serial("id"),
  name: text("name"),
  email: text("email"),
}).existing();
```

**Materialized views (PostgreSQL only)**:
```ts
const newYorkers = pgMaterializedView('new_yorkers').as((qb) => 
  qb.select().from(users).where(eq(users.cityId, 1))
);

await db.refreshMaterializedView(newYorkers);
await db.refreshMaterializedView(newYorkers).concurrently();
await db.refreshMaterializedView(newYorkers).withNoData();
```

Advanced options for regular views: `checkOption`, `securityBarrier`, `securityInvoker`.
Advanced options for materialized views: `.using()`, `.with()`, `.tablespace()`, `.withNoData()`.