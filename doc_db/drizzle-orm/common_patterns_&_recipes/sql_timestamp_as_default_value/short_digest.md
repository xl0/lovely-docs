## Setting SQL Timestamp as Default Value

**PostgreSQL**: Use `defaultNow()` or `sql`now()`` for current timestamp, or `sql`extract(epoch from now())`` for unix timestamp.

**MySQL**: Use `defaultNow()` or `sql`now()`` with optional `fsp` for fractional seconds, or `sql`(unix_timestamp())`` for unix timestamp.

**SQLite**: Use `sql`(current_timestamp)`` for current timestamp as text, or `sql`(unixepoch())`` for unix timestamp. Use `mode: 'timestamp'` or `'timestamp_ms'` to get Date objects, or `'number'` for raw integers.

The `mode` option controls how values are returned in the application (Date objects vs strings vs numbers).