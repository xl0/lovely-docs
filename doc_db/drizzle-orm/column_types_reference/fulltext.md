

## Pages

### mysql_column_types
All MySQL column types with configuration options: integers (int, bigint with mode/unsigned), floats (real, decimal, double, float), strings (char, varchar, text with enum), binary types, date/time (datetime, timestamp with fsp), json with .$type<T>(), and modifiers (.notNull(), .default(), .$defaultFn(), .$onUpdateFn(), .primaryKey(), .autoincrement())

## MySQL Column Types Reference

### Integer Types
- **int**: Signed integer, 0-8 bytes depending on magnitude
- **tinyint**: Smallest integer type
- **smallint**: Small integer type
- **mediumint**: Medium-sized integer
- **bigint**: Large integer with `mode: 'number' | 'bigint'` and optional `unsigned: true`
  ```typescript
  bigint({ mode: 'number' })
  bigint({ mode: 'number', unsigned: true })
  ```

### Floating Point Types
- **real**: Basic floating point, optionally with `precision` and `scale`
  ```typescript
  real({ precision: 1, scale: 1 })
  ```
- **decimal**: Fixed-point decimal with `precision`, `scale`, and `mode: 'number' | 'bigint'`
  ```typescript
  decimal({ scale: 30, mode: 'number' })
  decimal({ precision: 1, scale: 1 })
  ```
- **double**: Double precision floating point with optional `precision` and `scale`
  ```typescript
  double({ precision: 1, scale: 1 })
  ```
- **float**: Single precision floating point

### Serial Type
- **serial**: Alias for `BIGINT UNSIGNED NOT NULL AUTO_INCREMENT UNIQUE`
  ```typescript
  serial()
  ```

### Binary Types
- **binary**: Fixed-length byte string (M bytes), right-padded with `0x00` on insert
- **varbinary**: Variable-length byte string with required `length` parameter
  ```typescript
  varbinary({ length: 2 })
  ```

### String Types
- **char**: Fixed-length character string
- **varchar**: Variable-length string with required `length`, optional `enum` for type inference
  ```typescript
  varchar({ length: 2 })
  varchar({ length: 6, enum: ["value1", "value2"] })
  ```
- **text**: Large text field, optional `enum` for type inference
  ```typescript
  text({ enum: ["value1", "value2"] })
  ```

### Boolean Type
- **boolean**: Boolean column

### Date/Time Types
- **date**: Date only
- **datetime**: Date and time with optional `mode: 'date' | 'string'` and `fsp: 0..6` (fractional seconds precision)
  ```typescript
  datetime({ mode: 'date', fsp: 6 })
  ```
- **time**: Time only with optional `fsp: 0..6`
  ```typescript
  time({ fsp: 6 })
  ```
- **year**: Year only
- **timestamp**: Timestamp with optional `mode: 'date' | 'string'`, `fsp: 0..6`, and `.defaultNow()`
  ```typescript
  timestamp({ mode: 'date', fsp: 6 })
  timestamp().defaultNow()
  ```

### JSON Type
- **json**: JSON column with optional `.$type<T>()` for compile-time type inference (doesn't validate runtime values)
  ```typescript
  json().$type<{ foo: string }>()
  json().$type<string[]>()
  ```

### Enum Type
- **mysqlEnum**: MySQL enum with array of string values
  ```typescript
  mysqlEnum(['unknown', 'known', 'popular'])
  ```

### Column Modifiers

**Type Customization**: Use `.$type<T>()` on any column builder for branded or unknown types
```typescript
type UserId = number & { __brand: 'user_id' };
int().$type<UserId>().primaryKey()
```

**Not Null**: `.notNull()` adds `NOT NULL` constraint

**Default Value**: `.default(value)` sets static default
```typescript
int().default(3)
```

**Runtime Defaults**: `.$defaultFn(() => value)` or `.$default(() => value)` generates defaults at runtime (doesn't affect drizzle-kit)
```typescript
varchar({ length: 128 }).$defaultFn(() => createId())
```

**Update Defaults**: `.$onUpdateFn(() => value)` or `.$onUpdate(() => value)` generates values on update (doesn't affect drizzle-kit)
```typescript
text().$type<string | null>().$onUpdate(() => null)
```

**Primary Key**: `.primaryKey()` marks column as primary key

**Auto Increment**: `.autoincrement()` adds `AUTO_INCREMENT`

### Important Notes
- Column names are generated from TypeScript keys; use database aliases with `casing` parameter if needed
- `enum` option on varchar/text and `.$type<T>()` on json are for type inference only and don't validate runtime values
- `.$defaultFn()` and `.$onUpdateFn()` are runtime-only and don't affect database schema generation

### postgresql_column_types
PostgreSQL column types: integer/smallint/bigint (with serial variants), numeric/decimal, real/double precision, boolean, text/varchar/char, json/jsonb (with .$type<T>()), time/timestamp/date/interval, point/line geometric types, enum; modifiers include .$type<T>(), .generatedAlwaysAsIdentity(), .default()/.defaultRandom(), .$defaultFn(), .$onUpdateFn(), .notNull(), .primaryKey().

## Numeric Types

**integer** (int, int4): Signed 4-byte integer. Use `serial` for auto-increment.
```typescript
integer()
integer().default(10)
```

**smallint** (int2): Signed 2-byte integer. Use `smallserial` for auto-increment.
```typescript
smallint()
smallint().default(10)
```

**bigint** (int8): Signed 8-byte integer. Use `bigserial` for auto-increment. For values between 2^31 and 2^53, use `mode: 'number'` to work with JavaScript numbers instead of bigint.
```typescript
bigint({ mode: 'number' })  // inferred as number
bigint({ mode: 'bigint' })  // inferred as bigint
```

**serial** (serial4): Auto-incrementing 4-byte integer for unique identifiers.
```typescript
serial()
```

**smallserial** (serial2): Auto-incrementing 2-byte integer.
```typescript
smallserial()
```

**bigserial** (serial8): Auto-incrementing 8-byte integer. Supports `mode: 'number'` for values between 2^31 and 2^53.
```typescript
bigserial({ mode: 'number' })
```

**numeric** (decimal): Exact numeric with selectable precision. Can store up to 131072 digits before decimal and 16383 after. Supports `precision`, `scale`, and `mode` ('number' or 'bigint').
```typescript
numeric()
numeric({ precision: 100 })
numeric({ precision: 100, scale: 20 })
numeric({ mode: 'number' })
```

**real** (float4): Single precision floating-point (4 bytes).
```typescript
real()
real().default(10.10)
```

**double precision** (float8): Double precision floating-point (8 bytes).
```typescript
doublePrecision()
doublePrecision().default(10.10)
```

## Boolean

**boolean**: Standard SQL boolean type.
```typescript
boolean()
```

## String Types

**text**: Variable-length unlimited character string. Supports `enum` config for type inference (doesn't validate at runtime).
```typescript
text()
text({ enum: ["value1", "value2"] })  // inferred as "value1" | "value2" | null
```

**varchar**: Variable-length character string up to n characters. Length parameter is optional. Supports `enum` config.
```typescript
varchar()
varchar({ length: 256 })
varchar({ enum: ["value1", "value2"] })
```

**char**: Fixed-length, blank-padded character string up to n characters. Length parameter is optional. Supports `enum` config.
```typescript
char()
char({ length: 256 })
char({ enum: ["value1", "value2"] })
```

## JSON Types

**json**: Textual JSON data per RFC 7159. Use `.$type<T>()` for compile-time type inference and protection.
```typescript
json()
json().default({ foo: "bar" })
json().$type<{ foo: string }>()
json().$type<string[]>()
```

**jsonb**: Binary JSON data, decomposed. Same `.$type<T>()` support as json.
```typescript
jsonb()
jsonb().default({ foo: "bar" })
jsonb().$type<{ foo: string }>()
```

## Date/Time Types

**time**: Time of day with or without timezone. Supports `withTimezone` and `precision` options.
```typescript
time()
time({ withTimezone: true })
time({ precision: 6 })
time({ precision: 6, withTimezone: true })
```

**timestamp**: Date and time with or without timezone. Supports `precision`, `withTimezone`, and `mode` ('date' or 'string'). Use `defaultNow()` for current timestamp.
```typescript
timestamp()
timestamp({ precision: 6, withTimezone: true })
timestamp().defaultNow()
timestamp({ mode: "date" })    // inferred as Date
timestamp({ mode: "string" })  // inferred as string, no mapping
```
Note: For `timestamp with timezone`, PostgreSQL converts to UTC using the instance timezone. For `timestamp without timezone`, timezone info is silently ignored.

**date**: Calendar date (year, month, day). Supports `mode` ('date' or 'string').
```typescript
date()
date({ mode: "date" })    // inferred as Date
date({ mode: "string" })  // inferred as string
```

**interval**: Time span. Supports `fields` ('day', 'month', etc.) and `precision`.
```typescript
interval()
interval({ fields: 'day' })
interval({ fields: 'month', precision: 6 })
```

## Geometric Types

**point**: Geometric point type. Supports `mode: 'tuple'` (default, maps to [x, y]) or `mode: 'xy'` (maps to { x, y }).
```typescript
point()
point({ mode: 'xy' })
```

**line**: Geometric line type. Supports `mode: 'tuple'` (default, maps to [a, b, c]) or `mode: 'abc'` (maps to { a, b, c } from equation Ax + By + C = 0).
```typescript
line()
line({ mode: 'abc' })
```

## Enum Type

**enum**: Enumerated types comprising a static, ordered set of values. Create with `pgEnum()`.
```typescript
import { pgEnum, pgTable } from "drizzle-orm/pg-core";

export const moodEnum = pgEnum('mood', ['sad', 'ok', 'happy']);
export const table = pgTable('table', {
  mood: moodEnum(),
});
```

## Column Modifiers

**.$type<T>()**: Customize the data type for unknown or branded types. Provides compile-time type safety.
```typescript
type UserId = number & { __brand: 'user_id' };
serial().$type<UserId>().primaryKey()
json().$type<{ foo: string }>()
```

**Identity Columns** (requires drizzle-orm@0.32.0+, drizzle-kit@0.23.0+): Automatically generate unique integer values using sequences.
- `GENERATED ALWAYS AS IDENTITY`: Database always generates; manual insertion requires OVERRIDING SYSTEM VALUE.
- `GENERATED BY DEFAULT AS IDENTITY`: Database generates by default; manual values can override.
```typescript
integer().primaryKey().generatedAlwaysAsIdentity({ startWith: 1000 })
```

**Default Values**: Specify default values using `.default()` or `.defaultRandom()`.
```typescript
integer().default(42)
integer().default(sql`'42'::integer`)
uuid().defaultRandom()
uuid().default(sql`gen_random_uuid()`)
```

**Runtime Defaults**: Use `.$defaultFn()` or `.$default()` to generate defaults at runtime (doesn't affect drizzle-kit).
```typescript
text().$defaultFn(() => createId())
```

**Update Handlers**: Use `.$onUpdateFn()` or `.$onUpdate()` to generate values on update (doesn't affect drizzle-kit).
```typescript
integer().default(sql`1`).$onUpdateFn((): SQL => sql`${table.update_counter} + 1`)
timestamp({ mode: 'date', precision: 3 }).$onUpdate(() => new Date())
```

**Not Null**: Add NOT NULL constraint.
```typescript
integer().notNull()
```

**Primary Key**: Designate column as primary key (requires unique and not null).
```typescript
serial().primaryKey()
```

## Notes

- Column names are generated from TypeScript keys by default. Use database aliases or the `casing` parameter for custom mapping.
- Custom types can be created if native support is insufficient.
- The `string` mode for timestamps/dates passes raw values without mapping; `date` mode handles JS Date object conversions.

### singlestore_column_types
SingleStore column types: numeric (int, bigint, real, decimal, serial), binary (binary, varbinary), string (char, varchar, text with enum), date/time (date, datetime, time, year, timestamp), boolean, json with .$type<T>(), enum; modifiers: .$type<T>(), .notNull(), .primaryKey(), .autoincrement(), .default(), .$defaultFn(), .$onUpdateFn()

## Numeric Types

**Integer types**: `int()`, `tinyint()`, `smallint()`, `mediumint()` - basic signed integers with varying storage sizes.

**bigint**: Supports `mode: 'number' | 'bigint'` and `unsigned: true` option.
```typescript
bigint({ mode: 'number' })
bigint({ mode: 'number', unsigned: true })
```

**Floating point**: `real()`, `double()`, `float()` - all support optional `precision` and `scale` parameters.
```typescript
real({ precision: 1, scale: 1 })
double({ precision: 1, scale: 1 })
```

**decimal**: Supports `precision`, `scale`, and `mode: 'number' | 'bigint'` for handling large decimal values.
```typescript
decimal({ precision: 1, scale: 1, mode: 'number' })
```

**serial**: Alias for `BIGINT UNSIGNED NOT NULL AUTO_INCREMENT UNIQUE`.

## Binary Types

`binary()` - fixed-length binary data
`varbinary({ length: 2 })` - variable-length binary data

## String Types

`char()` - fixed-length character data
`varchar({ length: 2 })` - variable-length with optional enum for type inference
`text()` - large text with optional enum for type inference

Both varchar and text support `enum` option for compile-time type inference (doesn't validate runtime values):
```typescript
varchar({ length: 6, enum: ["value1", "value2"] })
text({ enum: ["value1", "value2"] })
```

## Boolean & Date/Time Types

`boolean()` - boolean values
`date()` - date only
`datetime({ mode: 'date' | 'string' })` - date and time
`time()` - time only
`year()` - year only
`timestamp({ mode: 'date' | 'string' })` - timestamp with optional `.defaultNow()`

## JSON & Enum

`json()` - JSON data with optional `.$type<T>()` for compile-time type safety:
```typescript
json().$type<{ foo: string }>()
json().$type<string[]>()
```

`singlestoreEnum(['unknown', 'known', 'popular'])` - enum type

## Column Modifiers

**Type customization**: `.$type<T>()` - customize column data type for branded or unknown types
```typescript
int().$type<UserId>().primaryKey()
json().$type<Data>()
```

**Not null**: `.notNull()` - adds NOT NULL constraint

**Default values**: 
- `.default(value)` - static default
- `.$defaultFn(() => value)` or `.$defaultFn()` - runtime default (uuid, cuid, etc.), only affects runtime, not drizzle-kit

**Update values**: `.$onUpdate(() => value)` or `.$onUpdateFn()` - runtime value on update, also used on insert if no default provided

**Primary key**: `.primaryKey()` - marks as primary key

**Auto increment**: `.autoincrement()` - adds AUTO_INCREMENT

## Important Notes

- Column names are generated from TypeScript keys; use database aliases or `casing` parameter for custom mapping
- `enum` option on varchar/text and `.$type()` on json provide compile-time type inference only, they don't validate runtime values
- `$defaultFn()` and `$onUpdateFn()` don't affect drizzle-kit, only runtime behavior in drizzle-orm

### sqlite_column_types
SQLite column types: integer/real/text/blob/numeric with modes (boolean, timestamp, json, bigint); customization via .$type<T>(), notNull(), default(), $defaultFn(), $onUpdateFn()

## SQLite Column Types

SQLite has five native storage classes: NULL, INTEGER, REAL, TEXT, and BLOB. Drizzle provides native support for all of them, with additional modes and customization options.

### Integer
Signed integer stored in 0-8 bytes depending on magnitude. Supports multiple modes:
- `mode: 'number'` (default)
- `mode: 'boolean'` - stores as 0/1
- `mode: 'timestamp_ms'` - millisecond timestamps
- `mode: 'timestamp'` - Date objects

Auto-increment primary key: `integer({ mode: 'number' }).primaryKey({ autoIncrement: true })`

### Real
8-byte IEEE floating point number. Basic usage: `real()`

### Text
UTF-8/UTF-16 encoded string. Supports enum inference and JSON mode:
```typescript
text({ enum: ["value1", "value2"] }) // infers union type
text({ mode: 'json' })
text({ mode: 'json' }).$type<{ foo: string }>()
```

### Blob
Raw binary data. Modes include:
- `blob()` - default
- `blob({ mode: 'buffer' })`
- `blob({ mode: 'bigint' })` - stores BigInt as blob
- `blob({ mode: 'json' })` - JSON storage (recommended over text JSON for JSON functions)

Type inference: `blob({ mode: 'json' }).$type<{ foo: string }>()`

### Boolean
SQLite lacks native boolean type. Use `integer({ mode: 'boolean' })` to work with booleans in code while storing as 0/1 integers.

### Bigint
No native bigint in SQLite. Use `blob({ mode: 'bigint' })` to work with BigInt instances, stored as blob values.

### Numeric
Arbitrary precision numeric type with modes:
- `numeric()` - default
- `numeric({ mode: 'number' })`
- `numeric({ mode: 'bigint' })`

## Column Modifiers

### Type Customization
Use `.$type<T>()` to customize column data types for unknown or branded types:
```typescript
type UserId = number & { __brand: 'user_id' };
const users = sqliteTable('users', {
  id: integer().$type<UserId>().primaryKey(),
});
```

### Not Null
`notNull()` adds NOT NULL constraint, preventing NULL values.

### Default Values
`default()` specifies default values for INSERT operations:
```typescript
integer().default(42)
integer().default(sql`(abs(42))`)
text().default(sql`(CURRENT_TIME)`)
text().default(sql`(CURRENT_DATE)`)
text().default(sql`(CURRENT_TIMESTAMP)`)
```

`$defaultFn()` (alias: `$default()`) generates defaults at runtime, useful for uuid/cuid generation:
```typescript
text().$defaultFn(() => createId())
```

`$onUpdateFn()` (alias: `$onUpdate()`) generates values on UPDATE operations. If no default is provided, it also runs on INSERT:
```typescript
text().$type<string | null>().$onUpdate(() => null)
```

Note: Runtime default functions don't affect drizzle-kit behavior, only drizzle-orm runtime.

