## MySQL Column Types

**Integer**: int, tinyint, smallint, mediumint, bigint (with `mode: 'number'|'bigint'`, optional `unsigned`)

**Float**: real, decimal (with `precision`, `scale`, `mode`), double, float

**Serial**: `serial()` = BIGINT UNSIGNED NOT NULL AUTO_INCREMENT UNIQUE

**Binary**: binary (fixed), varbinary({ length })

**String**: char, varchar({ length }), text (both support `enum` for type inference)

**Boolean**: boolean

**Date/Time**: date, datetime, time, year, timestamp (all support `fsp: 0..6` for fractional seconds; datetime/timestamp support `mode: 'date'|'string'`)

**JSON**: json().$type<T>() for type inference

**Enum**: mysqlEnum(['val1', 'val2'])

**Modifiers**: .notNull(), .default(val), .$defaultFn(fn), .$onUpdateFn(fn), .primaryKey(), .autoincrement(), .$type<T>()