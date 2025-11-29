## Basic Usage
Type-safe, parameterized raw SQL with automatic escaping and SQL injection prevention:
```typescript
import { sql } from 'drizzle-orm'
await db.execute(sql`select * from ${usersTable} where ${usersTable.id} = ${id}`)
// Generates: select * from "users" where "users"."id" = $1; --> [69]
```

## Type & Mapping
- `sql<T>` - Define return type (TypeScript only, no runtime effect)
- `.mapWith()` - Runtime value mapping from database driver
- `.as()` - Field aliasing

## Raw SQL
`sql.raw()` - Include unescaped SQL:
```typescript
sql.raw(`select * from users where id = ${12}`);  // No escaping
sql`select * from ${usersTable} where id = ${sql.raw(12)}`;  // Mixed
```

## Combining Chunks
- `sql.fromList(chunks)` - Concatenate array of SQL chunks
- `sql.join(chunks, separator)` - Concatenate with custom separator
- `sql.append()` - Add chunks to existing SQL
- `sql.empty()` - Start with blank SQL

## Converting to Query
Use dialect to convert to database-specific query string and params:
```typescript
new PgDialect().sqlToQuery(sql`...`);  // PostgreSQL
new MySqlDialect().sqlToQuery(sql`...`);  // MySQL
new SQLiteSyncDialect().sqlToQuery(sql`...`);  // SQLite
```

## In Query Clauses
Use `sql` in SELECT, WHERE, ORDER BY, GROUP BY, HAVING for database-specific expressions:
```typescript
await db.select({ count: sql<number>`count(*)`.mapWith(Number) }).from(usersTable)
await db.select().from(usersTable).where(sql`${usersTable.id} = ${id}`)
await db.select().from(usersTable).orderBy(sql`${usersTable.id} desc nulls first`)
```