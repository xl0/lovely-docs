## Filtering & Querying

**Conditional Filters**: Pass ternary operators to `.where()`, combine with `and()`/`or()`, build dynamic `SQL[]` arrays, or create custom operators using `sql` template tag.

**Counting Rows**: Use `count()` function or `sql`count(*)`` operator. PostgreSQL/MySQL require explicit integer casting; SQLite returns integer natively. Supports conditions, joins, and aggregations.

**Row Selection**: Use `.select()` with `getTableColumns()` to include/exclude columns. Relational queries support `columns`, `extras`, and `with` options for conditional selection.

## Pagination

**Limit/Offset**: Simple but degrades with large offsets. Order by unique columns to prevent duplicates. Use deferred joins for large tables.

**Cursor-Based**: More efficient for real-time data. Use comparison operators (`gt`/`lt`) with `orderBy`. Support multi-column cursors for non-unique columns and non-sequential PKs. Index cursor columns.

## Data Modification

**Increment/Decrement**: Use `sql`${column} + value`` or `sql`${column} - value`` in `update().set()`, or create reusable helper functions.

**Toggle Boolean**: Use `not()` operator in `update().set()`.

**Bulk Update Different Values**: Build SQL CASE statements with `sql` operator and `inArray()` filter to update multiple rows with different values per row.

**Upsert**: PostgreSQL/SQLite use `.onConflictDoUpdate()` with `target` and `set` options; reference proposed values with `excluded`. MySQL uses `.onDuplicateKeyUpdate()` with `values()` function. Support composite keys and conditional updates via `setWhere`.

## Advanced Queries

**Full-Text Search**: PostgreSQL uses `to_tsvector()`/`to_tsquery()` with `@@` operator and GIN indexes. Support multi-column search with `setweight()` and ranking with `ts_rank()`/`ts_rank_cd()`. Generated columns eliminate recalculation.

**Geospatial**: PostgreSQL `point` datatype stores (x, y) coordinates. Query distances with `<->` operator, filter boundaries with `<@` operator. PostGIS extends with `geometry` type, `ST_Distance()`, `ST_Within()`, and `ST_MakeEnvelope()`.

**Vector Search**: pgvector extension enables semantic search. Generate embeddings via OpenAI, store in vector column with HNSW index, query with `cosineDistance()` function.

**Parent-Child Relations**: Use `innerJoin()` to return parent rows with child data (parent repeats per child), or `exists()` subquery to return parent rows only (each appears once).

## Schema & Defaults

**Empty Array Defaults**: PostgreSQL uses `sql`'{}'::type[]`` or `ARRAY[]::type[]``. MySQL uses `json` type with `[]` or `JSON_ARRAY()`. SQLite uses `text` with `mode: 'json'` and `json_array()` or `'[]'`. Use `.$type<T>()` for compile-time type inference.

**Timestamp Defaults**: PostgreSQL/MySQL use `defaultNow()` or `sql`now()``. SQLite uses `sql`(current_timestamp)`` or `sql`(unixepoch())`` for unix timestamps. `mode` option controls application-level handling.

**Case-Insensitive Email**: Create unique index on `lower(email)` across PostgreSQL/MySQL/SQLite. Query with `eq(lower(users.email), email.toLowerCase())`.

## Database Setup

**PostgreSQL**: Pull Docker image, run container with `docker run --name drizzle-postgres -e POSTGRES_PASSWORD=mypassword -d -p 5432:5432 postgres`, connect via `postgres://postgres:mypassword@localhost:5432/postgres`.

**MySQL**: Pull Docker image, run container with `docker run --name drizzle-mysql -e MYSQL_ROOT_PASSWORD=mypassword -d -p 3306:3306 mysql`, connect via `mysql://root:mypassword@localhost:3306/mysql`.

**Cloudflare D1**: Configure `drizzle.config.ts` with `dialect: 'sqlite'`, `driver: 'd1-http'`, and credentials (accountId, databaseId, token). Supports migrate/push/introspect/studio commands.

**Gel Auth**: Define schema with `using extension auth`, push migrations, configure `drizzle.config.ts` with `dialect: 'gel'` and `schemaFilter`, run `drizzle-kit pull` to generate typed Identity and User tables.

## Seeding

**One-to-Many Relations**: Use `with` option in seed function to generate related data. Requires foreign key reference or explicit relation definition.

**Foreign Key Handling**: If referenced table isn't exposed, either remove not-null constraint, expose the table, or refine column generator with specific values using `valuesFromArray()`.