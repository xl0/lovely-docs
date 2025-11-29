## Key Changes for 0.21.0

1. Remove `:dialect` from CLI commands (e.g., `drizzle-kit push:mysql` → `drizzle-kit push`)
2. Update `drizzle.config.ts`:
   - Add mandatory `dialect`: `"postgresql"` | `"mysql"` | `"sqlite"`
   - Add optional `driver` for `aws-data-api`, `turso`, `d1-http`, or `expo`
   - Replace `connectionString`/`uri` with `url`
   - Add optional `migrations` object for custom table/schema

```ts
export default defineConfig({
    dialect: "sqlite",
    driver: "turso",
    dbCredentials: { url: "" },
    migrations: { table: "migrations", schema: "public" }
})
```

3. Run `drizzle-kit up` to upgrade PostgreSQL/SQLite snapshots to v6

## Driver Auto-Selection
PostgreSQL: `pg` → `postgres` → `@vercel/postgres` → `@neondatabase/serverless`
MySQL: `mysql2` → `@planetscale/database`
SQLite: `@libsql/client` → `better-sqlite3`

## New Features
- Relations extraction from database foreign keys
- Custom migration names: `drizzle-kit generate --name init_db`
- Direct migration application: `drizzle-kit migrate`