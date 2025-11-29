## PostgreSQL

Set empty array defaults using `sql` operator with `'{}'` or `ARRAY[]` syntax:

```ts
import { sql } from 'drizzle-orm';
import { pgTable, serial, text } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  tags1: text('tags1').array().notNull().default(sql`'{}'::text[]`),
  tags2: text('tags2').array().notNull().default(sql`ARRAY[]::text[]`),
});
```

## MySQL

MySQL lacks native array type; use `json` type instead. Set empty array defaults with `JSON_ARRAY()` function or `sql` operator with `('[]')` syntax:

```ts
import { sql } from 'drizzle-orm';
import { json, mysqlTable, serial, varchar } from 'drizzle-orm/mysql-core';

export const users = mysqlTable('users', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  tags1: json('tags1').$type<string[]>().notNull().default([]),
  tags2: json('tags2').$type<string[]>().notNull().default(sql`('[]')`),
  tags3: json('tags3').$type<string[]>().notNull().default(sql`(JSON_ARRAY())`),
});
```

Use `.$type<..>()` for compile-time type inference on json columns; it provides type safety for default values, insert and select schemas without runtime checks.

## SQLite

SQLite lacks native array type; use `text` type with `mode: 'json'` instead. Set empty array defaults with `json_array()` function or `sql` operator with `'[]'` syntax:

```ts
import { sql } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
  id: integer('id').primaryKey(),
  tags1: text('tags1', { mode: 'json' }).notNull().$type<string[]>().default(sql`(json_array())`),
  tags2: text('tags2', { mode: 'json' }).notNull().$type<string[]>().default(sql`'[]'`),
});
```

The `mode: 'json'` option treats values as JSON object literals in the application. Use `.$type<..>()` for compile-time type inference providing type safety for default values, insert and select schemas.