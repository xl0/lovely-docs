## Overview
The `sql` template is a type-safe, parameterized way to write raw SQL queries and fragments within Drizzle. It prevents SQL injection by automatically escaping table/column names and converting dynamic parameters to placeholders.

## Basic Usage
```typescript
import { sql } from 'drizzle-orm'
const id = 69;
await db.execute(sql`select * from ${usersTable} where ${usersTable.id} = ${id}`)
// Generates: select * from "users" where "users"."id" = $1; --> [69]
```
Tables and columns are automatically escaped, dynamic values become parameterized placeholders ($1, $2, etc.).

## Type Definition with `sql<T>`
Define custom return types for fields (purely a TypeScript helper, no runtime mapping):
```typescript
const response: { lowerName: string }[] = await db.select({
    lowerName: sql<string>`lower(${usersTable.name})`
}).from(usersTable);
```
Without `sql<T>`, the type would be `unknown`.

## Runtime Value Mapping with `.mapWith()`
Map database driver values at runtime:
```typescript
sql`...`.mapWith(usersTable.name);  // Replicates column's mapping strategy
sql`...`.mapWith({ mapFromDriverValue: (value: any) => { /* custom logic */ } });
sql`...`.mapWith(Number);
```

## Field Aliasing with `.as()`
Explicitly name custom fields:
```typescript
sql`lower(usersTable.name)`.as('lower_name')
// Generates: ... "usersTable"."name" as lower_name ...
```

## Raw SQL with `sql.raw()`
Include unescaped SQL without parameterization:
```typescript
sql.raw(`select * from users where id = ${12}`);
// Generates: select * from users where id = 12;

// vs parameterized:
sql`select * from users where id = ${12}`;
// Generates: select * from users where id = $1; --> [12]
```
Use `sql.raw()` inside `sql` to include unescaped strings:
```typescript
sql`select * from ${usersTable} where id = ${sql.raw(12)}`;
// Generates: select * from "users" where id = 12;
```

## Combining SQL Chunks
**`sql.fromList()`** - Concatenate multiple SQL chunks into one:
```typescript
const sqlChunks: SQL[] = [sql`select * from users`, sql` where `];
for (let i = 0; i < 5; i++) {
    sqlChunks.push(sql`id = ${i}`);
    if (i < 4) sqlChunks.push(sql` or `);
}
const finalSql: SQL = sql.fromList(sqlChunks)
// Generates: select * from users where id = $1 or id = $2 or id = $3 or id = $4 or id = $5; --> [0, 1, 2, 3, 4]
```

**`sql.join()`** - Like `fromList()` but with custom separators:
```typescript
const sqlChunks: SQL[] = [sql`select * from users`, sql`where`, sql`id = ${0}`, sql`or`, sql`id = ${1}`];
const finalSql: SQL = sql.join(sqlChunks, sql.raw(' '));
// Generates: select * from users where id = $1 or id = $2; --> [0, 1]
```

**`sql.append()`** - Dynamically add chunks to existing SQL:
```typescript
const finalSql = sql`select * from users`;
finalSql.append(sql` where `);
for (let i = 0; i < 5; i++) {
    finalSql.append(sql`id = ${i}`);
    if (i < 4) finalSql.append(sql` or `);
}
// Generates: select * from users where id = $1 or id = $2 or id = $3 or id = $4 or id = $5; --> [0, 1, 2, 3, 4]
```

**`sql.empty()`** - Start with blank SQL and build incrementally:
```typescript
const finalSql = sql.empty();
finalSql.append(sql`select * from users`);
finalSql.append(sql` where `);
// ... append more chunks
```

## Converting to Query String and Parameters
Specify database dialect to convert SQL template to query string and params:
```typescript
import { PgDialect } from 'drizzle-orm/pg-core';
const pgDialect = new PgDialect();
pgDialect.sqlToQuery(sql`select * from ${usersTable} where ${usersTable.id} = ${12}`);
// PostgreSQL: select * from "users" where "users"."id" = $1; --> [ 12 ]

import { MySqlDialect } from 'drizzle-orm/mysql-core';
const mysqlDialect = new MySqlDialect();
mysqlDialect.sqlToQuery(sql`select * from ${usersTable} where ${usersTable.id} = ${12}`);
// MySQL: select * from `users` where `users`.`id` = ?; --> [ 12 ]

import { SQLiteSyncDialect } from 'drizzle-orm/sqlite-core';
const sqliteDialect = new SQLiteSyncDialect();
sqliteDialect.sqlToQuery(sql`select * from ${usersTable} where ${usersTable.id} = ${12}`);
// SQLite: select * from "users" where "users"."id" = ?; --> [ 12 ]
```

## Using `sql` in Query Clauses

**SELECT** - Select custom fields with type safety:
```typescript
await db.select({
    id: usersTable.id,
    lowerName: sql<string>`lower(${usersTable.name})`,
    aliasedName: sql<string>`lower(${usersTable.name})`.as('aliased_column'),
    count: sql<number>`count(*)`.mapWith(Number) 
}).from(usersTable)
// Generates: select `id`, lower(`name`), lower(`name`) as `aliased_column`, count(*) from `users`;
```

**WHERE** - Use database-specific expressions not natively supported by Drizzle:
```typescript
const id = 77;
await db.select().from(usersTable).where(sql`${usersTable.id} = ${id}`)
// Generates: select * from "users" where "users"."id" = $1; --> [ 77 ]

// Advanced fulltext search:
const searchParam = "Ale";
await db.select().from(usersTable)
    .where(sql`to_tsvector('simple', ${usersTable.name}) @@ to_tsquery('simple', ${searchParam})`)
// Generates: select * from "users" where to_tsvector('simple', "users"."name") @@ to_tsquery('simple', '$1'); --> [ "Ale" ]
```

**ORDER BY** - Custom ordering logic:
```typescript
await db.select().from(usersTable).orderBy(sql`${usersTable.id} desc nulls first`)
// Generates: select * from "users" order by "users"."id" desc nulls first;
```

**GROUP BY and HAVING** - Custom grouping and filtering:
```typescript
await db.select({ 
    projectId: usersTable.projectId,
    count: sql<number>`count(${usersTable.id})`.mapWith(Number)
}).from(usersTable)
    .groupBy(sql`${usersTable.projectId}`)
    .having(sql`count(${usersTable.id}) > 300`)
// Generates: select "project_id", count("users"."id") from users group by "users"."project_id" having count("users"."id") > 300;
```