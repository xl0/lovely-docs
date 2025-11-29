## Key features in v0.29.0

**MySQL unsigned bigint:** `bigint('id', { mode: 'number', unsigned: true })`

**Improved query builder types:** Methods like `.where()` can only be invoked once by default. Use `.$dynamic()` to enable multiple invocations for dynamic query building.

**Custom constraint names:** `primaryKey({ name: 'composite_key', columns: [...] })` and `foreignKey({ name: 'fkName', columns: [...], foreignColumns: [...] })`

**Read replicas:** `withReplicas(primaryDb, [read1, read2])` with optional custom selection logic.

**Set operators:** `union()`, `intersect()`, `except()` with import or builder approach.

**Proxy drivers:** New MySQL and PostgreSQL HTTP proxy drivers for custom implementations.

**D1 Batch API:** `db.batch([...])` for executing multiple queries with proper typing.

**Drizzle Kit 0.20.0:** `defineConfig`, D1 in Studio, automatic env vars, custom constraint names.