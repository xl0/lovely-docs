## Setting SQL Timestamp as Default Value

### PostgreSQL

Use `defaultNow()` method or `sql` operator with `now()` function for current timestamp:

```ts
import { sql } from 'drizzle-orm';
import { timestamp, pgTable, serial } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  timestamp1: timestamp('timestamp1').notNull().defaultNow(),
  timestamp2: timestamp('timestamp2', { mode: 'string' })
    .notNull()
    .default(sql`now()`),
});
```

The `mode` option controls how values are handled in the application. `string` mode treats values as strings in the application but stores them as timestamps in the database. Without mode specified, timestamps are returned as Date objects.

For unix timestamp (seconds since 1970-01-01 UTC), use `extract(epoch from now())`:

```ts
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  timestamp: integer('timestamp')
    .notNull()
    .default(sql`extract(epoch from now())`),
});
```

### MySQL

Use `defaultNow()` method or `sql` operator with `now()` function:

```ts
import { sql } from 'drizzle-orm';
import { mysqlTable, serial, timestamp } from 'drizzle-orm/mysql-core';

export const users = mysqlTable('users', {
  id: serial('id').primaryKey(),
  timestamp1: timestamp('timestamp1').notNull().defaultNow(),
  timestamp2: timestamp('timestamp2', { mode: 'string' })
    .notNull()
    .default(sql`now()`),
  timestamp3: timestamp('timestamp3', { fsp: 3 })
    .notNull()
    .default(sql`now(3)`),
});
```

The `fsp` option defines fractional seconds precision (0-6). The `mode` option works the same as PostgreSQL.

For unix timestamp, use `unix_timestamp()`:

```ts
export const users = mysqlTable('users', {
  id: serial('id').primaryKey(),
  timestamp: int('timestamp')
    .notNull()
    .default(sql`(unix_timestamp())`),
});
```

### SQLite

Use `sql` operator with `current_timestamp` constant for current UTC date/time as text:

```ts
import { sql } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
  id: integer('id').primaryKey(),
  timestamp: text('timestamp')
    .notNull()
    .default(sql`(current_timestamp)`),
});
```

For unix timestamp, use `unixepoch()` function:

```ts
export const users = sqliteTable('users', {
  id: integer('id').primaryKey(),
  timestamp1: integer('timestamp1', { mode: 'timestamp' })
    .notNull()
    .default(sql`(unixepoch())`),
  timestamp2: integer('timestamp2', { mode: 'timestamp_ms' })
    .notNull()
    .default(sql`(unixepoch() * 1000)`),
  timestamp3: integer('timestamp3', { mode: 'number' })
    .notNull()
    .default(sql`(unixepoch())`),
});
```

The `mode` option controls application-level handling: `timestamp` and `timestamp_ms` modes return Date objects (handling seconds and milliseconds respectively), while `number` mode returns the raw integer value.