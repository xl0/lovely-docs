## drizzle-valibot Plugin

Generate Valibot schemas from Drizzle ORM schemas for data validation.

**Installation**: Install `drizzle-valibot@0.3.0+` with Drizzle ORM v0.36.0+ and Valibot v1.0.0-beta.7+.

### Select Schema
Validates data queried from the database (API responses). Generated from table definitions, includes all columns. Supports tables, views, and enums.

```ts
const users = pgTable('users', {
  id: integer().generatedAlwaysAsIdentity().primaryKey(),
  name: text().notNull(),
  age: integer().notNull()
});

const userSelectSchema = createSelectSchema(users);
const parsed = parse(userSelectSchema, rows[0]); // Validates all fields are present
```

### Insert Schema
Validates data before inserting into the database (API requests). Auto-generated columns are excluded and required fields must be provided.

```ts
const userInsertSchema = createInsertSchema(users);
const user = { name: 'Jane', age: 30 };
const parsed = parse(userInsertSchema, user);
await db.insert(users).values(parsed);
```

### Update Schema
Validates data before updating in the database. All fields become optional, and auto-generated columns cannot be updated.

```ts
const userUpdateSchema = createUpdateSchema(users);
const user = { age: 35 };
const parsed = parse(userUpdateSchema, user);
await db.update(users).set(parsed).where(eq(users.name, 'Jane'));
```

### Refinements
Extend, modify, or overwrite field schemas using optional parameters. Callback functions extend/modify; Valibot schemas overwrite.

```ts
const userSelectSchema = createSelectSchema(users, {
  name: (schema) => pipe(schema, maxLength(20)), // Extends
  bio: (schema) => pipe(schema, maxLength(1000)), // Extends before nullable
  preferences: object({ theme: string() }) // Overwrites
});
```

### Data Type Reference
Complete mapping of Drizzle column types to Valibot schemas:

- **Boolean**: `pg.boolean()` → `boolean()`
- **Date**: `pg.date({ mode: 'date' })` → `date()`
- **String**: `pg.text()` → `string()`
- **UUID**: `pg.uuid()` → `pipe(string(), uuid())`
- **Char**: `pg.char({ length: 10 })` → `pipe(string(), length(10))`
- **Varchar**: `pg.varchar({ length: 100 })` → `pipe(string(), maxLength(100))`
- **MySQL text variants**: `tinytext` → `maxLength(255)`, `text` → `maxLength(65_535)`, `mediumtext` → `maxLength(16_777_215)`, `longtext` → `maxLength(4_294_967_295)`
- **Enum**: `pg.text({ enum: [...] })` → `enum([...])`
- **Integer types**: `pg.smallint()` → `pipe(number(), minValue(-32_768), maxValue(32_767), integer())`; `mysql.tinyint()` → `pipe(number(), minValue(-128), maxValue(127), integer())`; `mysql.tinyint({ unsigned: true })` → `pipe(number(), minValue(0), maxValue(255), integer())`; `mysql.smallint({ unsigned: true })` → `pipe(number(), minValue(0), maxValue(65_535), integer())`; `pg.integer()` → `pipe(number(), minValue(-2_147_483_648), maxValue(2_147_483_647), integer())`; `mysql.int({ unsigned: true })` → `pipe(number(), minValue(0), maxValue(4_294_967_295), integer())`
- **Float types**: `pg.real()` → `pipe(number(), minValue(-8_388_608), maxValue(8_388_607))`; `mysql.mediumint()` → `pipe(number(), minValue(-8_388_608), maxValue(8_388_607), integer())`; `mysql.float({ unsigned: true })` → `pipe(number(), minValue(0), maxValue(16_777_215))`; `mysql.mediumint({ unsigned: true })` → `pipe(number(), minValue(0), maxValue(16_777_215), integer())`; `pg.doublePrecision()` → `pipe(number(), minValue(-140_737_488_355_328), maxValue(140_737_488_355_327))`; `mysql.double({ unsigned: true })` → `pipe(number(), minValue(0), maxValue(281_474_976_710_655))`
- **BigInt (number mode)**: `pg.bigint({ mode: 'number' })` → `pipe(number(), minValue(-9_007_199_254_740_991), maxValue(9_007_199_254_740_991), integer())`; `mysql.serial()` → `pipe(number(), minValue(0), maxValue(9_007_199_254_740_991), integer())`
- **BigInt (bigint mode)**: `pg.bigint({ mode: 'bigint' })` → `pipe(bigint(), minValue(-9_223_372_036_854_775_808n), maxValue(9_223_372_036_854_775_807n))`; `mysql.bigint({ mode: 'bigint', unsigned: true })` → `pipe(bigint(), minValue(0n), maxValue(18_446_744_073_709_551_615n))`
- **Year**: `mysql.year()` → `pipe(number(), minValue(1_901), maxValue(2_155), integer())`
- **Geometry (tuple)**: `pg.point({ mode: 'tuple' })` → `tuple([number(), number()])`
- **Geometry (xy)**: `pg.point({ mode: 'xy' })` → `object({ x: number(), y: number() })`
- **Vector**: `pg.vector({ dimensions: 3 })` → `pipe(array(number()), length(3))`
- **Line (abc)**: `pg.line({ mode: 'abc' })` → `object({ a: number(), b: number(), c: number() })`
- **Line (tuple)**: `pg.line({ mode: 'tuple' })` → `tuple([number(), number(), number()])`
- **JSON**: `pg.json()` → `union([union([string(), number(), boolean(), null_()]), array(any()), record(string(), any())])`
- **Buffer**: `sqlite.blob({ mode: 'buffer' })` → `custom<Buffer>((v) => v instanceof Buffer)`
- **Arrays**: `pg.dataType().array(size)` → `pipe(array(baseDataTypeSchema), length(size))`