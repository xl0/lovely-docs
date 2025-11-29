## Column Types by Database

### MySQL
**Numeric**: `int`, `bigint({ mode: 'number' | 'bigint', unsigned: true })`, `decimal({ precision, scale, mode })`, `real`, `double`, `float`, `serial`

**Binary**: `binary`, `varbinary({ length })`

**String**: `char`, `varchar({ length, enum })`, `text({ enum })`, `mysqlEnum(['value1', 'value2'])`

**Date/Time**: `date`, `datetime({ mode: 'date' | 'string', fsp: 0..6 })`, `time({ fsp })`, `year`, `timestamp({ mode, fsp }).defaultNow()`

**Other**: `boolean`, `json().$type<T>()`

### PostgreSQL
**Numeric**: `integer`, `smallint`, `bigint({ mode: 'number' | 'bigint' })`, `serial`, `smallserial`, `bigserial`, `numeric({ precision, scale, mode })`, `real`, `doublePrecision`

**String**: `text({ enum })`, `varchar({ length, enum })`, `char({ length, enum })`

**Date/Time**: `time({ precision, withTimezone })`, `timestamp({ precision, withTimezone, mode }).defaultNow()`, `date({ mode })`, `interval({ fields, precision })`

**Geometric**: `point({ mode: 'tuple' | 'xy' })`, `line({ mode: 'tuple' | 'abc' })`

**Other**: `boolean`, `json().$type<T>()`, `jsonb().$type<T>()`, `pgEnum('name', ['value1', 'value2'])`

**Identity**: `integer().generatedAlwaysAsIdentity({ startWith })`

### SingleStore
**Numeric**: `int`, `bigint({ mode, unsigned })`, `decimal({ precision, scale, mode })`, `real`, `double`, `serial`

**Binary**: `binary`, `varbinary({ length })`

**String**: `char`, `varchar({ length, enum })`, `text({ enum })`, `singlestoreEnum(['value1', 'value2'])`

**Date/Time**: `date`, `datetime({ mode })`, `time`, `year`, `timestamp({ mode }).defaultNow()`

**Other**: `boolean`, `json().$type<T>()`

### SQLite
**Numeric**: `integer({ mode: 'number' | 'boolean' | 'timestamp_ms' | 'timestamp' })`, `real`, `numeric({ mode })`

**String**: `text({ enum, mode: 'json' })`, `text({ mode: 'json' }).$type<T>()`

**Binary**: `blob()`, `blob({ mode: 'buffer' | 'bigint' | 'json' })`, `blob({ mode: 'json' }).$type<T>()`

**Other**: `integer({ mode: 'boolean' })` for booleans, `blob({ mode: 'bigint' })` for BigInt

## Universal Column Modifiers

**Type Safety**: `.$type<T>()` - compile-time type inference for branded/unknown types
```typescript
type UserId = number & { __brand: 'user_id' };
int().$type<UserId>().primaryKey()
```

**Constraints**: `.notNull()`, `.primaryKey()`, `.autoincrement()`

**Defaults**: 
- `.default(value)` - static default
- `.$defaultFn(() => value)` - runtime default (uuid, cuid, etc.)
- `.$onUpdateFn(() => value)` - runtime value on update

**Notes**: 
- `enum` option and `.$type<T>()` on JSON provide compile-time type inference only, no runtime validation
- `.$defaultFn()` and `.$onUpdateFn()` don't affect drizzle-kit schema generation, only runtime behavior
- Column names derive from TypeScript keys; use `casing` parameter or database aliases for custom mapping