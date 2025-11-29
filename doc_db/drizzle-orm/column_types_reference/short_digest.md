## Column Types by Database

**MySQL**: int, bigint, decimal, real, double, char, varchar, text, date, datetime, time, timestamp, boolean, json, mysqlEnum, binary, varbinary

**PostgreSQL**: integer, bigint, serial, numeric, real, doublePrecision, text, varchar, char, date, time, timestamp, interval, point, line, boolean, json, jsonb, pgEnum, identity columns

**SingleStore**: int, bigint, decimal, real, double, char, varchar, text, date, datetime, time, timestamp, boolean, json, singlestoreEnum, binary, varbinary

**SQLite**: integer (with modes: boolean, timestamp), real, text (with json mode), blob (with modes: buffer, bigint, json), numeric

## Universal Modifiers
- `.$type<T>()` - type inference
- `.notNull()`, `.primaryKey()`, `.autoincrement()`
- `.default(value)`, `.$defaultFn(() => value)`, `.$onUpdateFn(() => value)`