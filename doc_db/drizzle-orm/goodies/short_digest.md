## Type API
Extract select/insert types: `typeof users.$inferSelect`, `InferSelectModel<typeof users>`, etc.

## Logging
Enable with `{ logger: true }`. Customize via DefaultLogger with custom LogWriter or implement custom Logger class.

## Multi-project Schema
Use table creators: `pgTableCreator((name) => \`project1_${name}\`)`. Filter in config: `tablesFilter: ["project1_*"]`.

## Printing SQL
Call `.toSQL()` on queries to get `{ sql, params }`.

## Raw SQL
Execute with `db.execute(sql\`...\`)`. SQLite: `db.all()`, `db.get()`, `db.values()`, `db.run()`.

## Standalone Query Builder
```ts
import { QueryBuilder } from 'drizzle-orm/pg-core';
const { sql, params } = new QueryBuilder().select().from(users).toSQL();
```

## Get Typed Columns
`const { password, ...rest } = getTableColumns(user);`

## Get Table Info
`getTableConfig(table)` returns columns, indexes, foreignKeys, checks, primaryKeys, name, schema.

## Type Checking
Use `is(value, Column)` instead of `instanceof`.

## Mock Driver
`drizzle.mock()` or `drizzle.mock({ schema })`