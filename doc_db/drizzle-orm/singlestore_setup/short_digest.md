## Setup
Install `drizzle-orm`, `mysql2`, `drizzle-kit`. Import from `drizzle-orm/singlestore`.

Initialize: `drizzle(process.env.DATABASE_URL)` or `drizzle({ connection: { uri: ... } })`

Pass existing connection: `drizzle({ client: connection })` or `drizzle({ client: pool })`

Use single client for migrations, either for queries.

## Limitations
Serial columns don't auto-increment, no `ORDER BY`+`LIMIT` chaining, no foreign keys, no `INTERSECT ALL`/`EXCEPT ALL`, no nested transactions, one `isolationLevel` only, no FSP in date types, no relational API.