## Filtering & Querying
Conditional filters with ternary/`and()`/`or()`, dynamic SQL arrays, custom operators. Count rows with `count()` or `sql`count(*)`` (cast for PostgreSQL/MySQL). Select/exclude columns with `getTableColumns()` or relational query options.

## Pagination
Limit/offset (simple, degrades with large offsets, use deferred joins). Cursor-based (efficient, use `gt`/`lt` with `orderBy`, multi-column cursors for non-unique columns).

## Data Modification
Increment/decrement with `sql`${column} ± value``. Toggle booleans with `not()`. Bulk update different values per row using SQL CASE statements. Upsert with `.onConflictDoUpdate()` (PG/SQLite, use `excluded`) or `.onDuplicateKeyUpdate()` (MySQL, use `values()`).

## Advanced Queries
Full-text search: PostgreSQL `to_tsvector()`/`to_tsquery()` with GIN indexes, `setweight()` for multi-column, `ts_rank()` for ranking. Geospatial: `point` datatype with `<->` distance/`<@` boundary operators; PostGIS adds `geometry`, `ST_Distance()`, `ST_Within()`. Vector search: pgvector with OpenAI embeddings, `cosineDistance()` queries. Parent-child: `innerJoin()` returns both (parent repeats), `exists()` returns parent only.

## Schema & Defaults
Empty arrays: PostgreSQL `sql`'{}'::type[]``, MySQL `json` with `[]`, SQLite `text` mode `json`. Timestamps: `defaultNow()` or `sql`now()``, SQLite `sql`(unixepoch())`` for unix. Case-insensitive email: unique index on `lower(email)`.

## Setup & Seeding
PostgreSQL/MySQL Docker setup. Cloudflare D1 with `d1-http` driver. Gel auth with schema extension. Seed one-to-many with `with` option; handle missing foreign key tables by removing not-null, exposing table, or using `valuesFromArray()`.