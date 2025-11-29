## Setup Steps

1. **Install packages**: `drizzle-orm`, `-D drizzle-kit @types/bun`

2. **Setup connection variables**: Configure `DATABASE_URL` environment variable

3. **Connect Drizzle ORM to database**: Use ConnectBun component to establish connection

4. **Create a table**: Define your database schema

5. **Setup Drizzle config file**: Configure with `dialect='postgresql'` and `DATABASE_URL` environment variable

6. **Apply changes to database**: Run migrations to sync schema

7. **Seed and Query the database**: Use bun-sql dialect with `DATABASE_URL` for database operations

8. **Run the script**: Execute with `bun src/index.ts`

## Prerequisites
- **bun**: JavaScript all-in-one toolkit
- **Bun SQL**: Native bindings for PostgreSQL databases

## Important Note
Bun version 1.2.0 has issues with concurrent statement execution that may cause errors when running multiple queries simultaneously. This is tracked in a GitHub issue and should be resolved in future versions.