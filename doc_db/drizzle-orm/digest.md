## Core Concepts

**Headless TypeScript ORM** with zero dependencies, designed for lightweight, performant, type-safe, serverless-ready applications. Supports PostgreSQL, MySQL, SQLite, and SingleStore through native drivers.

## Query APIs

**SQL-like API**: Mirrors SQL syntax with `.select()`, `.insert()`, `.update()`, `.delete()`, `.join()`, `.where()`, `.groupBy()`, `.orderBy()`, `.limit()`, `.offset()`.

**Relational API**: Fetch nested data with single SQL query via `db.query.table.findMany({ with: { relation: true } })`.

## Schema Definition

Define tables with dialect-specific functions (`pgTable`, `mysqlTable`, `sqliteTable`). Columns support constraints (`.notNull()`, `.primaryKey()`, `.unique()`, `.references()`), defaults (`.default()`, `.$defaultFn()`), and type safety via `.$type<T>()`.

```typescript
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').unique(),
  createdAt: timestamp('created_at').defaultNow(),
});
```

## Migrations

**Code-first approach**: Define schema in TypeScript, generate SQL migrations with `drizzle-kit generate`, apply with `drizzle-kit migrate` or `migrate(db)` at runtime.

**Database-first approach**: Introspect existing database with `drizzle-kit pull` to generate TypeScript schema.

**Direct push**: Use `drizzle-kit push` to sync schema directly without SQL files (prototyping only).

## Database Connections

Initialize with dialect-specific drivers:
- PostgreSQL: `node-postgres`, `postgres.js`, Neon, Supabase, Vercel Postgres
- MySQL: `mysql2`, PlanetScale, TiDB
- SQLite: `libsql`, `better-sqlite3`, Turso, Cloudflare D1
- Edge/Serverless: Neon HTTP, Vercel Postgres, PlanetScale HTTP, Cloudflare D1

```typescript
const db = drizzle(process.env.DATABASE_URL);
```

## Advanced Features

**Transactions**: `db.transaction(async (tx) => { ... })` with nested savepoints and rollback support.

**Prepared Statements**: `.prepare()` for query reuse with `.execute()` or `.all()/.get()` (SQLite).

**Relations**: Define one-to-one, one-to-many, many-to-many with `relations()`, `one()`, `many()`.

**Indexes & Constraints**: `.primaryKey()`, `.unique()`, `.foreignKey()`, `.check()`, `index()`, `uniqueIndex()`.

**Set Operations**: `union()`, `intersect()`, `except()` with ALL variants.

**CTEs**: `.with()` for common table expressions in SELECT, INSERT, UPDATE, DELETE.

**Aggregations**: `count()`, `sum()`, `avg()`, `max()`, `min()` with `.groupBy()` and `.having()`.

**Full-Text Search**: PostgreSQL `to_tsvector()`, `to_tsquery()` with GIN indexes.

**Vector Search**: pgvector extension with `cosineDistance()`, `l2Distance()`, `innerProduct()`.

**Row-Level Security**: PostgreSQL `.enableRLS()`, `pgPolicy()`, `pgRole()` for tenant isolation.

**Caching**: Opt-in query caching with Upstash Redis via `upstashCache()`.

**Read Replicas**: `withReplicas()` routes SELECT to replicas, writes to primary.

## Validation Plugins

Generate validation schemas from Drizzle tables:
- **Zod**: `createSelectSchema()`, `createInsertSchema()`, `createUpdateSchema()`
- **Valibot**: Same API as Zod
- **Typebox**: Same API as Zod
- **Arktype**: Same API as Zod

## Seeding

`drizzle-seed` generates deterministic fake data with seedable pRNG. Supports weighted random distributions and relational data generation.

```typescript
await seed(db, schema, { count: 1000, seed: 12345 }).refine((f) => ({
  users: { columns: { name: f.fullName() } }
}));
```

## Drizzle Kit CLI

- `generate`: Create SQL migrations from schema changes
- `migrate`: Apply migrations to database
- `push`: Sync schema directly (no SQL files)
- `pull`: Introspect database and generate schema
- `studio`: Local database browser
- `check`: Validate migration history consistency
- `export`: Generate SQL DDL from schema

Configure via `drizzle.config.ts` with `dialect`, `schema`, `dbCredentials`.

## Type Inference

Extract types from tables:
```typescript
type User = typeof users.$inferSelect;
type NewUser = typeof users.$inferInsert;
```

## Performance

- Zero dependencies
- Prepared statements for query reuse
- Connection pooling support
- Serverless-optimized (reuse connections across invocations)
- Lateral joins for efficient relational queries