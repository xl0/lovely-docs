## Numeric Types
- Integer: `int()`, `tinyint()`, `smallint()`, `mediumint()`, `bigint({ mode: 'number' | 'bigint', unsigned: true })`
- Float: `real()`, `double()`, `float()` with optional `precision` and `scale`
- Decimal: `decimal({ precision, scale, mode: 'number' | 'bigint' })`
- Serial: `serial()` - alias for BIGINT UNSIGNED NOT NULL AUTO_INCREMENT UNIQUE

## Binary & String Types
- Binary: `binary()`, `varbinary({ length })`
- String: `char()`, `varchar({ length, enum: [...] })`, `text({ enum: [...] })`

## Date/Time & Other
- `date()`, `datetime({ mode: 'date' | 'string' })`, `time()`, `year()`, `timestamp({ mode: 'date' | 'string' }).defaultNow()`
- `boolean()`, `json().$type<T>()`, `singlestoreEnum([...])`

## Column Modifiers
- Type: `.$type<T>()` - customize type for branded types
- Constraints: `.notNull()`, `.primaryKey()`, `.autoincrement()`
- Defaults: `.default(value)`, `.$defaultFn(() => value)` (runtime only)
- Updates: `.$onUpdateFn(() => value)` (runtime only, also used on insert if no default)