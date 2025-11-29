## Query APIs
- **SQL-like**: `.select()`, `.insert()`, `.update()`, `.delete()`, `.join()`, `.where()`, `.groupBy()`, `.orderBy()`, `.limit()`, `.offset()`
- **Relational**: `db.query.table.findMany({ with: { relation: true } })` generates single SQL query

## Schema & Migrations
- Define tables with `pgTable()`, `mysqlTable()`, `sqliteTable()`
- Columns: constraints (`.notNull()`, `.primaryKey()`, `.unique()`, `.references()`), defaults (`.default()`, `.$defaultFn()`)
- Migrations: `drizzle-kit generate` → `drizzle-kit migrate` or `migrate(db)` at runtime
- Introspect: `drizzle-kit pull` for database-first approach

## Connections
PostgreSQL: node-postgres, postgres.js, Neon, Supabase, Vercel Postgres
MySQL: mysql2, PlanetScale, TiDB
SQLite: libsql, better-sqlite3, Turso, Cloudflare D1

## Advanced
- **Transactions**: `db.transaction(async (tx) => { ... })`
- **Prepared Statements**: `.prepare()` with `.execute()`
- **Relations**: `relations()`, `one()`, `many()`
- **Indexes**: `index()`, `uniqueIndex()`, `.primaryKey()`, `.unique()`, `.foreignKey()`
- **Set Operations**: `union()`, `intersect()`, `except()`
- **CTEs**: `.with()`
- **Aggregations**: `count()`, `sum()`, `avg()`, `max()`, `min()`
- **Full-Text Search**: PostgreSQL `to_tsvector()`, `to_tsquery()`
- **Vector Search**: pgvector with distance functions
- **RLS**: PostgreSQL `.enableRLS()`, `pgPolicy()`, `pgRole()`
- **Caching**: `upstashCache()` with Upstash Redis
- **Read Replicas**: `withReplicas()`

## Validation
Zod, Valibot, Typebox, Arktype plugins: `createSelectSchema()`, `createInsertSchema()`, `createUpdateSchema()`

## Seeding
`drizzle-seed` with deterministic pRNG, weighted distributions, relational data

## Type Inference
`typeof table.$inferSelect`, `typeof table.$inferInsert`