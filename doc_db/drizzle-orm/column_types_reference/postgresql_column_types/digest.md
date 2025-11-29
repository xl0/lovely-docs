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