## Transactions

Run SQL statements as atomic units with `db.transaction(async (tx) => {...})`. Supports nested transactions with savepoints, conditional rollback via `tx.rollback()`, and return values.

Dialect-specific config:
- **PostgreSQL**: `isolationLevel`, `accessMode`, `deferrable`
- **MySQL/SingleStore**: `isolationLevel`, `accessMode`, `withConsistentSnapshot`
- **SQLite**: `behavior` ("deferred" | "immediate" | "exclusive")

Works with both query builder and relational queries.