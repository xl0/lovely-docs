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