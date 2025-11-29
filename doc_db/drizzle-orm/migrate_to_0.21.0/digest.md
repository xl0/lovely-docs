## Migration Steps

1. **Remove dialect prefixes from CLI commands**: Change `drizzle-kit push:mysql` to `drizzle-kit push`, etc.

2. **Update drizzle.config.ts**:
   - Add mandatory `dialect` field: `"postgresql"`, `"mysql"`, or `"sqlite"`
   - Add optional `driver` field only if using `aws-data-api`, `turso`, `d1-http` (WIP), or `expo`
   - Replace `connectionString` or `uri` in `dbCredentials` with `url`
   - Add optional `migrations` object to customize migration storage:
     ```ts
     migrations: {
       table: "migrations",
       schema: "public" // PostgreSQL only
     }
     ```

3. **Upgrade snapshots**: Run `drizzle-kit up` for PostgreSQL and SQLite projects to upgrade snapshots to version 6.

## Configuration Example
```ts
import { defineConfig } from "drizzle-kit"

export default defineConfig({
    dialect: "sqlite", // "postgresql" | "mysql"
    driver: "turso", // optional
    dbCredentials: {
        url: ""
    },
    migrations: {
        table: "migrations",
        schema: "public"
    }
})
```

## Driver Auto-Selection Strategy

When no `driver` is specified, Drizzle attempts to find drivers in this order:

**PostgreSQL**: `pg` → `postgres` → `@vercel/postgres` → `@neondatabase/serverless`

**MySQL**: `mysql2` → `@planetscale/database`

**SQLite**: `@libsql/client` → `better-sqlite3`

If no driver is found, an error is thrown.

## Breaking Changes

- **Snapshots upgrade**: All PostgreSQL and SQLite snapshots upgraded to version 6
- **CLI commands**: Dialect prefix removed from all commands
- **MySQL schemas**: Drizzle Kit no longer handles schema changes for additional schemas/databases

## New Features

- **Pull relations**: Drizzle now extracts foreign key information from database and generates `relations.ts` file during introspection
- **Custom migration names**: Use `drizzle-kit generate --name init_db` to name migrations
- **New migrate command**: `drizzle-kit migrate` applies generated migrations directly from CLI, storing metadata in `__drizzle_migrations` table (or custom table/schema via config)