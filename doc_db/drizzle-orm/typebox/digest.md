## Overview
`drizzle-typebox` is a plugin for Drizzle ORM that generates Typebox schemas from Drizzle ORM schemas. Requires Drizzle ORM v0.36.0+, Typebox v0.34.8+, and drizzle-typebox@0.2.0+.

## Select Schema
Generates schemas for data queried from the database, useful for validating API responses. Supports tables, views, and enums.

```ts
import { pgTable, text, integer } from 'drizzle-orm/pg-core';
import { createSelectSchema } from 'drizzle-typebox';
import { Value } from '@sinclair/typebox/value';

const users = pgTable('users', {
  id: integer().generatedAlwaysAsIdentity().primaryKey(),
  name: text().notNull(),
  age: integer().notNull()
});

const userSelectSchema = createSelectSchema(users);
const rows = await db.select().from(users).limit(1);
const parsed = Value.Parse(userSelectSchema, rows[0]);
```

## Insert Schema
Generates schemas for data to be inserted into the database, useful for validating API requests. Generated columns are excluded.

```ts
const userInsertSchema = createInsertSchema(users);
const user = { name: 'Jane', age: 30 };
const parsed = Value.Parse(userInsertSchema, user);
await db.insert(users).values(parsed);
```

## Update Schema
Generates schemas for data to be updated in the database. All fields become optional and generated columns are excluded.

```ts
const userUpdateSchema = createUpdateSchema(users);
const user = { age: 35 };
const parsed = Value.Parse(userUpdateSchema, user);
await db.update(users).set(parsed).where(eq(users.name, 'Jane'));
```

## Refinements
Each create schema function accepts an optional parameter to extend, modify, or overwrite field schemas. Pass a callback function to extend/modify or a Typebox schema to overwrite.

```ts
const userSelectSchema = createSelectSchema(users, {
  name: (schema) => Type.String({ ...schema, maxLength: 20 }),
  bio: (schema) => Type.String({ ...schema, maxLength: 1000 }),
  preferences: Type.Object({ theme: Type.String() })
});
```

## Factory Functions
Use `createSchemaFactory` for advanced use cases like using an extended Typebox instance.

```ts
import { createSchemaFactory } from 'drizzle-typebox';
import { t } from 'elysia';

const { createInsertSchema } = createSchemaFactory({ typeboxInstance: t });
const userInsertSchema = createInsertSchema(users, {
  name: (schema) => t.Number({ ...schema }, { error: '`name` must be a string' })
});
```

## Data Type Reference
Comprehensive mapping of Drizzle ORM column types to Typebox schemas:

- **Boolean**: `pg.boolean()`, `mysql.boolean()`, `sqlite.integer({ mode: 'boolean' })` → `Type.Boolean()`
- **Date**: `pg.date({ mode: 'date' })`, `pg.timestamp({ mode: 'date' })`, etc. → `Type.Date()`
- **String**: `pg.text()`, `pg.varchar()`, `mysql.binary()`, etc. → `Type.String()`
- **UUID**: `pg.uuid()` → `Type.String({ format: 'uuid' })`
- **Char**: `pg.char({ length: 10 })` → `Type.String({ minLength: 10, maxLength: 10 })`
- **Varchar**: `pg.varchar({ length: 100 })` → `Type.String({ maxLength: 100 })`
- **MySQL Text Variants**: `mysql.tinytext()` → `Type.String({ maxLength: 255 })`, `mysql.text()` → `Type.String({ maxLength: 65_535 })`, `mysql.mediumtext()` → `Type.String({ maxLength: 16_777_215 })`, `mysql.longtext()` → `Type.String({ maxLength: 4_294_967_295 })`
- **Enum**: `pg.text({ enum: [...] })`, `mysql.mysqlEnum(...)` → `Type.Enum(enum)`
- **Integer Types**: 
  - `mysql.tinyint()` → `Type.Integer({ minimum: -128, maximum: 127 })`
  - `mysql.tinyint({ unsigned: true })` → `Type.Integer({ minimum: 0, maximum: 255 })`
  - `pg.smallint()` → `Type.Integer({ minimum: -32_768, maximum: 32_767 })`
  - `mysql.smallint({ unsigned: true })` → `Type.Integer({ minimum: 0, maximum: 65_535 })`
  - `pg.integer()` → `Type.Integer({ minimum: -2_147_483_648, maximum: 2_147_483_647 })`
  - `mysql.int({ unsigned: true })` → `Type.Integer({ minimum: 0, maximum: 4_294_967_295 })`
- **Float/Double**: `pg.real()`, `mysql.float()` → `Type.Number()` with appropriate bounds
- **BigInt**: `pg.bigint({ mode: 'bigint' })` → `Type.BigInt({ minimum: -9_223_372_036_854_775_808n, maximum: 9_223_372_036_854_775_807n })`
- **Year**: `mysql.year()` → `Type.Integer({ minimum: 1_901, maximum: 2_155 })`
- **Geometry**: `pg.point({ mode: 'tuple' })` → `Type.Tuple([Type.Number(), Type.Number()])`, `pg.point({ mode: 'xy' })` → `Type.Object({ x: Type.Number(), y: Type.Number() })`
- **Vectors**: `pg.vector({ dimensions: 3 })` → `Type.Array(Type.Number(), { minItems: 3, maxItems: 3 })`
- **Line**: `pg.line({ mode: 'abc' })` → `Type.Object({ a: Type.Number(), b: Type.Number(), c: Type.Number() })`, `pg.line({ mode: 'tuple' })` → `Type.Tuple([Type.Number(), Type.Number(), Type.Number()])`
- **JSON**: `pg.json()`, `pg.jsonb()`, `mysql.json()` → `Type.Recursive((self) => Type.Union([Type.Union([Type.String(), Type.Number(), Type.Boolean(), Type.Null()]), Type.Array(self), Type.Record(Type.String(), self)]))`
- **Arrays**: `pg.text().array(3)` → `Type.Array(Type.String(), { minItems: 3, maxItems: 3 })`