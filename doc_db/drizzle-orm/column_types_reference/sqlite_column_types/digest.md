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