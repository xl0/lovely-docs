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