## drizzle-arktype Plugin

A plugin for Drizzle ORM that generates Arktype schemas from Drizzle ORM schemas. Requires Drizzle ORM v0.36.0+, Arktype v2.0.0+.

### Select Schema
Validates data queried from the database (API responses). Generated from table definitions, views, and enums.

```ts
import { pgTable, text, integer } from 'drizzle-orm/pg-core';
import { createSelectSchema } from 'drizzle-arktype';

const users = pgTable('users', {
  id: integer().generatedAlwaysAsIdentity().primaryKey(),
  name: text().notNull(),
  age: integer().notNull()
});

const userSelectSchema = createSelectSchema(users);
const rows = await db.select().from(users).limit(1);
const parsed = userSelectSchema(rows[0]); // Validates: { id: number; name: string; age: number }
```

### Insert Schema
Validates data to be inserted into the database (API requests). Auto-generated columns are excluded.

```ts
import { createInsertSchema } from 'drizzle-arktype';

const userInsertSchema = createInsertSchema(users);
const user = { name: 'Jane', age: 30 };
const parsed = userInsertSchema(user); // Validates: { name: string, age: number }
await db.insert(users).values(parsed);
```

### Update Schema
Validates data to be updated in the database. All fields become optional, generated columns excluded.

```ts
import { createUpdateSchema } from 'drizzle-arktype';

const userUpdateSchema = createUpdateSchema(users);
const user = { age: 35 };
const parsed = userUpdateSchema(user); // Validates: { name?: string | undefined, age?: number | undefined }
await db.update(users).set(parsed).where(eq(users.name, 'Jane'));
```

### Refinements
Each create schema function accepts an optional parameter to extend, modify, or overwrite field schemas. Callback functions extend/modify; Arktype schemas overwrite.

```ts
import { createSelectSchema } from 'drizzle-arktype';
import { pipe, maxLength, object, string } from 'arktype';

const userSelectSchema = createSelectSchema(users, {
  name: (schema) => pipe(schema, maxLength(20)), // Extends
  bio: (schema) => pipe(schema, maxLength(1000)), // Extends before nullability
  preferences: object({ theme: string() }) // Overwrites including nullability
});
```

### Data Type Reference

**Boolean**: `pg.boolean()`, `mysql.boolean()`, `sqlite.integer({ mode: 'boolean' })` → `type.boolean`

**Date/Timestamp**: `pg.date({ mode: 'date' })`, `pg.timestamp({ mode: 'date' })`, `mysql.date({ mode: 'date' })`, `mysql.datetime({ mode: 'date' })`, `mysql.timestamp({ mode: 'date' })`, `sqlite.integer({ mode: 'timestamp' })`, `sqlite.integer({ mode: 'timestamp_ms' })` → `type.Date`

**String**: `pg.text()`, `pg.date({ mode: 'string' })`, `pg.timestamp({ mode: 'string' })`, `pg.cidr()`, `pg.inet()`, `pg.interval()`, `pg.macaddr()`, `pg.macaddr8()`, `pg.numeric()`, `pg.sparsevec()`, `pg.time()`, `mysql.binary()`, `mysql.date({ mode: 'string' })`, `mysql.datetime({ mode: 'string' })`, `mysql.decimal()`, `mysql.time()`, `mysql.timestamp({ mode: 'string' })`, `mysql.varbinary()`, `sqlite.numeric()`, `sqlite.text({ mode: 'text' })` → `type.string`

**Bit**: `pg.bit({ dimensions: ... })` → `type(/^[01]{${column.dimensions}}$/)`

**UUID**: `pg.uuid()` → `type(/^[\da-f]{8}(?:-[\da-f]{4}){3}-[\da-f]{12}$/iu)`

**Char (exact length)**: `pg.char({ length: ... })`, `mysql.char({ length: ... })` → `type.string.exactlyLength(length)`

**Varchar (max length)**: `pg.varchar({ length: ... })`, `mysql.varchar({ length: ... })`, `sqlite.text({ mode: 'text', length: ... })` → `type.string.atMostLength(length)`

**MySQL text variants**: `mysql.tinytext()` → `type.string.atMostLength(255)`, `mysql.text()` → `type.string.atMostLength(65_535)`, `mysql.mediumtext()` → `type.string.atMostLength(16_777_215)`, `mysql.longtext()` → `type.string.atMostLength(4_294_967_295)`

**Enum**: `pg.text({ enum: ... })`, `pg.char({ enum: ... })`, `pg.varchar({ enum: ... })`, `mysql.mysqlEnum(...)`, `sqlite.text({ mode: 'text', enum: ... })` → `type.enumerated(...enum)`

**MySQL tinyint**: `mysql.tinyint()` → `type.keywords.number.integer.atLeast(-128).atMost(127)`, `mysql.tinyint({ unsigned: true })` → `type.keywords.number.integer.atLeast(0).atMost(255)`

**Smallint**: `pg.smallint()`, `pg.smallserial()`, `mysql.smallint()` → `type.keywords.number.integer.atLeast(-32_768).atMost(32_767)`, `mysql.smallint({ unsigned: true })` → `type.keywords.number.integer.atLeast(0).atMost(65_535)`

**Float/Real (24-bit)**: `pg.real()`, `mysql.float()` → `type.number.atLeast(-8_388_608).atMost(8_388_607)`, `mysql.mediumint()` → `type.keywords.number.integer.atLeast(-8_388_608).atMost(8_388_607)`, `mysql.float({ unsigned: true })` → `type.number.atLeast(0).atMost(16_777_215)`, `mysql.mediumint({ unsigned: true })` → `type.keywords.number.integer.atLeast(0).atMost(16_777_215)`

**Integer (32-bit)**: `pg.integer()`, `pg.serial()`, `mysql.int()` → `type.keywords.number.integer.atLeast(-2_147_483_648).atMost(2_147_483_647)`, `mysql.int({ unsigned: true })` → `type.keywords.number.integer.atLeast(0).atMost(4_294_967_295)`

**Double precision (48-bit)**: `pg.doublePrecision()`, `mysql.double()`, `mysql.real()`, `sqlite.real()` → `type.number.atLeast(-140_737_488_355_328).atMost(140_737_488_355_327)`, `mysql.double({ unsigned: true })` → `type.number.atLeast(0).atMost(281_474_976_710_655)`

**Bigint (safe integers)**: `pg.bigint({ mode: 'number' })`, `pg.bigserial({ mode: 'number' })`, `mysql.bigint({ mode: 'number' })`, `mysql.bigserial({ mode: 'number' })`, `sqlite.integer({ mode: 'number' })` → `type.keywords.number.integer.atLeast(-9_007_199_254_740_991).atMost(9_007_199_254_740_991)`, `mysql.serial()` → `type.keywords.number.integer.atLeast(0).atMost(9_007_199_254_740_991)`

**Bigint (64-bit)**: `pg.bigint({ mode: 'bigint' })`, `pg.bigserial({ mode: 'bigint' })`, `mysql.bigint({ mode: 'bigint' })`, `sqlite.blob({ mode: 'bigint' })` → `type.bigint.narrow((value, ctx) => value < -9_223_372_036_854_775_808n ? ctx.mustBe('greater than') : value > 9_223_372_036_854_775_807n ? ctx.mustBe('less than') : true)`, `mysql.bigint({ mode: 'bigint', unsigned: true })` → `type.bigint.narrow((value, ctx) => value < 0n ? ctx.mustBe('greater than') : value > 18_446_744_073_709_551_615n ? ctx.mustBe('less than') : true)`

**Year**: `mysql.year()` → `type.keywords.number.integer.atLeast(1_901).atMost(2_155)`

**Point (tuple)**: `pg.geometry({ type: 'point', mode: 'tuple' })`, `pg.point({ mode: 'tuple' })` → `type([type.number, type.number])`

**Point (xy object)**: `pg.geometry({ type: 'point', mode: 'xy' })`, `pg.point({ mode: 'xy' })` → `type({ x: type.number, y: type.number })`

**Vector/Halfvec**: `pg.halfvec({ dimensions: ... })`, `pg.vector({ dimensions: ... })` → `type.number.array().exactlyLength(dimensions)`

**Line (abc)**: `pg.line({ mode: 'abc' })` → `type({ a: type.number, b: type.number, c: type.number })`

**Line (tuple)**: `pg.line({ mode: 'tuple' })` → `type([type.number, type.number, type.number])`

**JSON**: `pg.json()`, `pg.jsonb()`, `mysql.json()`, `sqlite.blob({ mode: 'json' })`, `sqlite.text({ mode: 'json' })` → `type('string | number | boolean | null').or(type('unknown.any[] | Record<string, unknown.any>'))`

**Buffer**: `sqlite.blob({ mode: 'buffer' })` → `type.instanceOf(Buffer)`

**Array**: `pg.dataType().array(...)` → `baseDataTypeSchema.array().exactlyLength(size)`