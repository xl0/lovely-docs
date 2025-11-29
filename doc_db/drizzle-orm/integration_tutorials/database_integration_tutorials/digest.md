## Database Integrations with Drizzle ORM

Complete setup guides for integrating Drizzle ORM with various database platforms.

### Neon Postgres
- Install: `drizzle-orm`, `drizzle-kit`, `@neondatabase/serverless`, `dotenv`
- Connection via neon-http driver with environment variables
- Schema definition with type inference (`$inferInsert`, `$inferSelect`)
- Migrations: `npx drizzle-kit generate` then `npx drizzle-kit migrate`, or `npx drizzle-kit push` for prototyping
- CRUD examples: insert, select with joins/pagination, update, delete

### Nile Database (Multi-tenant)
- Multi-tenant Express app using AsyncLocalStorage for automatic tenant context scoping
- Queries automatically filtered by tenant without explicit WHERE clauses
- Tenant ID extracted from URL path, headers, or cookies
- Built-in `tenants` table; custom tables defined in schema
- API routes for tenant and todo CRUD operations

### Supabase Postgres
- Connection pooling via postgres-js driver
- Schema with foreign keys and cascading deletes
- Migrations via drizzle-kit or Supabase CLI
- Same CRUD patterns as Neon

### Turso (SQLite-compatible)
- libSQL driver with authentication token
- `turso auth signup`, `turso db create`, `turso db tokens create`
- SQLite schema definition with `sqliteTable`
- Migrations and CRUD operations similar to PostgreSQL variants

### Vercel Postgres
- Connection via `@vercel/postgres` package
- PostgreSQL schema and migrations
- CRUD operations with joins and pagination

### Xata PostgreSQL
- PostgreSQL with copy-on-write branches and zero-downtime schema changes
- Connection string format: `postgresql://postgres:<password>@<branch-id>.<region>.xata.tech/<database>?sslmode=require`
- Standard PostgreSQL schema and CRUD patterns
- Branch-based development for isolated environments

### Common Patterns Across All Platforms
```typescript
// Schema with type inference
export const usersTable = pgTable('users', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
});

export type InsertUser = typeof usersTable.$inferInsert;
export type SelectUser = typeof usersTable.$inferSelect;

// Insert
await db.insert(usersTable).values(data);

// Select with joins and pagination
db.select({
  ...getTableColumns(usersTable),
  postsCount: count(postsTable.id),
})
  .from(usersTable)
  .leftJoin(postsTable, eq(usersTable.id, postsTable.userId))
  .groupBy(usersTable.id)
  .limit(pageSize)
  .offset((page - 1) * pageSize);

// Update
await db.update(usersTable).set(data).where(eq(usersTable.id, id));

// Delete
await db.delete(usersTable).where(eq(usersTable.id, id));
```