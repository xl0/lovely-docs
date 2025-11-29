## SQLite Column Types

Five native storage classes: NULL, INTEGER, REAL, TEXT, BLOB. Drizzle supports all with additional modes.

**Integer**: `integer()` with modes - `'number'`, `'boolean'`, `'timestamp'`, `'timestamp_ms'`. Auto-increment: `integer().primaryKey({ autoIncrement: true })`

**Real**: `real()` - 8-byte IEEE float

**Text**: `text()` with enum inference and JSON mode - `text({ enum: ["v1", "v2"] })`, `text({ mode: 'json' }).$type<T>()`

**Blob**: `blob()` with modes - `'buffer'`, `'bigint'`, `'json'`. Type: `blob({ mode: 'json' }).$type<T>()`

**Boolean**: `integer({ mode: 'boolean' })` - stores as 0/1

**Bigint**: `blob({ mode: 'bigint' })` - stores BigInt as blob

**Numeric**: `numeric()` with modes - `'number'`, `'bigint'`

**Type customization**: `.$type<T>()` for branded/unknown types

**Constraints**: `notNull()`, `default(value)`, `default(sql\`...\`)`, `$defaultFn(fn)`, `$onUpdateFn(fn)`