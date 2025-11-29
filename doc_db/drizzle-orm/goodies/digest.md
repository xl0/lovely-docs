## Type API
Extract types from table schemas for select and insert queries using type helpers:
- `typeof users.$inferSelect` / `typeof users.$inferInsert`
- `typeof users._.$inferSelect` / `typeof users._.$inferInsert`
- `InferSelectModel<typeof users>` / `InferInsertModel<typeof users>`

Works across PostgreSQL, MySQL, SQLite, and SingleStore with database-specific table creators (pgTable, mysqlTable, sqliteTable, singlestoreTable).

## Logging
Enable query logging by passing `{ logger: true }` to drizzle initialization. Customize log destination with DefaultLogger and custom LogWriter implementation, or create a custom Logger class implementing the Logger interface with logQuery(query, params) method.

## Multi-project Schema
Use table creator APIs to customize table names for keeping multiple project schemas in one database:
- `pgTableCreator((name) => \`project1_${name}\`)`
- `mysqlTableCreator((name) => \`project1_${name}\`)`
- `sqliteTableCreator((name) => \`project1_${name}\`)`
- `singlestoreTableCreator((name) => \`project1_${name}\`)`

In drizzle-kit config, use `tablesFilter: ["project1_*"]` or multiple filters like `["project1_*", "project2_*"]`.

## Printing SQL Queries
Call `.toSQL()` on query builder to get generated SQL and parameters:
```ts
const query = db.select({ id: users.id, name: users.name }).from(users).groupBy(users.id).toSQL();
// Returns: { sql: '...', params: [] }
```

## Raw SQL Queries
Execute complex parametrized queries using `db.execute()` with sql template literals:
```ts
const statement = sql\`select * from ${users} where ${users.id} = ${userId}\`;
const res = await db.execute(statement);
```
SQLite has additional methods: `db.all()`, `db.get()`, `db.values()`, `db.run()`.

## Standalone Query Builder
Build queries without database instance using QueryBuilder from database-specific core modules:
```ts
import { QueryBuilder } from 'drizzle-orm/pg-core';
const qb = new QueryBuilder();
const query = qb.select().from(users).where(eq(users.name, 'Dan'));
const { sql, params } = query.toSQL();
```

## Get Typed Table Columns
Use `getTableColumns()` to get a typed columns map for selective column queries:
```ts
const { password, role, ...rest } = getTableColumns(user);
await db.select({ ...rest }).from(users);
```

## Get Table Information
Use `getTableConfig()` to retrieve table metadata:
```ts
const { columns, indexes, foreignKeys, checks, primaryKeys, name, schema } = getTableConfig(table);
```

## Type Checking with is()
Use `is()` function instead of `instanceof` to check Drizzle types:
```ts
import { Column, is } from 'drizzle-orm';
if (is(value, Column)) { /* value is Column */ }
```

## Mock Driver
Create mock database instances for testing without actual database connection:
```ts
import { drizzle } from "drizzle-orm/node-postgres";
const db = drizzle.mock();
// or with schema for types:
const db = drizzle.mock({ schema });
```