## Major Features & Improvements

**Query Building & Performance**
- v0.28.0: Relational queries rewritten with lateral joins (430% IntelliSense speedup), removed nested relation filtering in where clauses
- v0.29.0: Query builder methods now enforce single invocation by default; use `.$dynamic()` for dynamic building. Added set operators (UNION, INTERSECT, EXCEPT)
- v0.29.1: Aggregate helpers (count, avg, sum, max, min with distinct variants)
- v0.30.10: `.if()` conditional method for WHERE expressions

**Database Drivers & Connectivity**
- v0.16.2: postgres.js driver support, PostgreSQL/MySQL schemas, database introspection
- v0.29.0: Read replicas with `withReplicas()`, MySQL/PostgreSQL proxy drivers
- v0.29.2: Expo SQLite driver with migration support via babel/metro config
- v0.30.1: OP-SQLite driver support
- v0.30.4: Xata HTTP driver for Xata Postgres platform
- v0.30.5: PGlite (WASM Postgres) driver support
- v0.30.7: Vercel Postgres mappings
- v0.31.2: TiDB Cloud Serverless driver support
- v0.31.1: Live queries for Expo SQLite via `useLiveQuery` hook

**Schema & Type Features**
- v0.28.3: `.$defaultFn()` for runtime defaults, `$inferSelect`/`$inferInsert` table type inference
- v0.29.0: Custom constraint names for primary/foreign keys
- v0.31.0: PostgreSQL indexes API redesigned (per-column ordering, `.using()` for index type), pg_vector support with distance helpers, point/line/geometry types, PostGIS support
- v0.32.0: PostgreSQL sequences/identity columns, generated columns (PostgreSQL/MySQL/SQLite)
- v0.32.0: MySQL `$returningId()` for retrieving inserted IDs

**Data Operations**
- v0.28.0: Insert rows with default values via empty objects
- v0.28.6: LibSQL batch API, SQLite JSON text mode, PostgreSQL array operators (arrayContains/arrayContained/arrayOverlaps)
- v0.29.4: Neon HTTP batch queries
- v0.29.5: WITH clauses for INSERT/UPDATE/DELETE, custom migrations table/schema configuration
- v0.30.5: `$onUpdate()` for dynamic column values on updates

**Unique Constraints & Conflict Resolution**
- Unique constraints across PostgreSQL (with NULLS NOT DISTINCT), MySQL, SQLite
- v0.30.8: Split `onConflictDoUpdate()` where into `setWhere` and `targetWhere`
- v0.30.9: Same split for SQLite `.onConflictDoUpdate()`

**Tooling & Integration**
- v0.29.1: ESLint plugin with enforce-delete-with-where and enforce-update-with-where rules
- v0.31.3: Prisma-Drizzle extension via `$extends(drizzle())`
- v0.32.0: Drizzle Kit migration file prefix customization (index, supabase, unix, none)

## Bug Fixes (Notable)
- v0.23.2: PostgreSQL schemaFilter enum detection, drizzle-kit up command
- v0.28.1: Postgres array handling regressions
- v0.28.2: MySQL timestamp milliseconds, SQLite `.get()` type, sqlite-proxy double-execution
- v0.28.4-v0.28.5: ESM imports, Postgres table types, OpenTelemetry import syntax
- v0.30.0: Postgres date/timestamp handling (breaking change: postgres.js client mutation for date strings)
- v0.30.2: LibSQL migrations batch execution, bun:sqlite findFirst
- v0.30.3: Neon HTTP raw query batching, sqlite-proxy `.run()` result format
- v0.31.3: RQB schema name collisions, RDS Data API type hints
- v0.32.1: Index typings for 3+ columns, limit 0 support, empty array in inArray/notInArray
- v0.32.2: AWS Data API types, MySQL transactions, useLiveQuery dependencies, SQLite type exports