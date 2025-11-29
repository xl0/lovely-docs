## Schema Declaration

Define TypeScript schemas that serve as source of truth for queries and migrations. Export all models for Drizzle-Kit.

**Organization**: Single `schema.ts` file or multiple files in a `schema/` folder (Drizzle recursively finds tables).

**Tables**: Use dialect-specific functions (pgTable, mysqlTable, sqliteTable) with at least 1 column:
```ts
export const users = pgTable('users', {
  id: integer(),
  firstName: varchar('first_name')  // alias for DB column name
})
```

**Camel to snake_case**: Use `casing: 'snake_case'` in DB initialization to auto-map TypeScript names.

**Reusable columns**: Define common columns (timestamps, etc.) and spread across tables.

**PostgreSQL schemas**: Use `pgSchema()` to create namespace containers.

**MySQL schemas**: Equivalent to databases; can be used in queries but not in migrations.

**SQLite**: No schema support - single file context only.