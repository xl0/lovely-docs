
## Directories

### column_types_reference
Complete reference of column type definitions and modifiers across MySQL, PostgreSQL, SingleStore, and SQLite databases.

## Column Types by Database

### MySQL
**Numeric**: `int`, `bigint({ mode: 'number' | 'bigint', unsigned: true })`, `decimal({ precision, scale, mode })`, `real`, `double`, `float`, `serial`

**Binary**: `binary`, `varbinary({ length })`

**String**: `char`, `varchar({ length, enum })`, `text({ enum })`, `mysqlEnum(['value1', 'value2'])`

**Date/Time**: `date`, `datetime({ mode: 'date' | 'string', fsp: 0..6 })`, `time({ fsp })`, `year`, `timestamp({ mode, fsp }).defaultNow()`

**Other**: `boolean`, `json().$type<T>()`

### PostgreSQL
**Numeric**: `integer`, `smallint`, `bigint({ mode: 'number' | 'bigint' })`, `serial`, `smallserial`, `bigserial`, `numeric({ precision, scale, mode })`, `real`, `doublePrecision`

**String**: `text({ enum })`, `varchar({ length, enum })`, `char({ length, enum })`

**Date/Time**: `time({ precision, withTimezone })`, `timestamp({ precision, withTimezone, mode }).defaultNow()`, `date({ mode })`, `interval({ fields, precision })`

**Geometric**: `point({ mode: 'tuple' | 'xy' })`, `line({ mode: 'tuple' | 'abc' })`

**Other**: `boolean`, `json().$type<T>()`, `jsonb().$type<T>()`, `pgEnum('name', ['value1', 'value2'])`

**Identity**: `integer().generatedAlwaysAsIdentity({ startWith })`

### SingleStore
**Numeric**: `int`, `bigint({ mode, unsigned })`, `decimal({ precision, scale, mode })`, `real`, `double`, `serial`

**Binary**: `binary`, `varbinary({ length })`

**String**: `char`, `varchar({ length, enum })`, `text({ enum })`, `singlestoreEnum(['value1', 'value2'])`

**Date/Time**: `date`, `datetime({ mode })`, `time`, `year`, `timestamp({ mode }).defaultNow()`

**Other**: `boolean`, `json().$type<T>()`

### SQLite
**Numeric**: `integer({ mode: 'number' | 'boolean' | 'timestamp_ms' | 'timestamp' })`, `real`, `numeric({ mode })`

**String**: `text({ enum, mode: 'json' })`, `text({ mode: 'json' }).$type<T>()`

**Binary**: `blob()`, `blob({ mode: 'buffer' | 'bigint' | 'json' })`, `blob({ mode: 'json' }).$type<T>()`

**Other**: `integer({ mode: 'boolean' })` for booleans, `blob({ mode: 'bigint' })` for BigInt

## Universal Column Modifiers

**Type Safety**: `.$type<T>()` - compile-time type inference for branded/unknown types
```typescript
type UserId = number & { __brand: 'user_id' };
int().$type<UserId>().primaryKey()
```

**Constraints**: `.notNull()`, `.primaryKey()`, `.autoincrement()`

**Defaults**: 
- `.default(value)` - static default
- `.$defaultFn(() => value)` - runtime default (uuid, cuid, etc.)
- `.$onUpdateFn(() => value)` - runtime value on update

**Notes**: 
- `enum` option and `.$type<T>()` on JSON provide compile-time type inference only, no runtime validation
- `.$defaultFn()` and `.$onUpdateFn()` don't affect drizzle-kit schema generation, only runtime behavior
- Column names derive from TypeScript keys; use `casing` parameter or database aliases for custom mapping

### database_setup_guides
Step-by-step integration guides for connecting Drizzle ORM to 25+ database platforms including PostgreSQL, MySQL, SQLite variants, and specialized databases like Cloudflare D1 and Nile.

## Database Setup Guides

Comprehensive setup instructions for integrating Drizzle ORM with 25+ database platforms and drivers.

### Supported Databases

**PostgreSQL Variants:**
- PostgreSQL (node-postgres, postgres.js)
- Supabase (PostgreSQL)
- Neon (serverless PostgreSQL)
- Vercel Postgres
- Xata (PostgreSQL)
- Nile (multi-tenant PostgreSQL)
- PGLite (in-process PostgreSQL)

**MySQL Variants:**
- MySQL (mysql2)
- PlanetScale (MySQL via database-js HTTP driver)
- SingleStore (mysql2)
- TiDB (serverless via @tidbcloud/serverless HTTP driver)

**SQLite Variants:**
- SQLite (libsql, better-sqlite3)
- Turso (LibSQL cloud)
- SQLite Cloud (@sqlitecloud/drivers)
- Bun:SQLite (native Bun driver)
- Expo SQLite (React Native)
- OP-SQLite (React Native)

**Specialized:**
- Cloudflare D1 (serverless SQLite)
- Cloudflare Durable Objects (SQLite)
- Gel (PostgreSQL-compatible)

### Common Setup Pattern

1. Install driver package and Drizzle ORM
2. Configure `DATABASE_URL` or equivalent environment variable
3. Create `drizzle.config.ts` with appropriate dialect
4. For existing databases: run introspection (`drizzle-kit pull` or `drizzle-kit introspect:pg`)
5. Define or transfer schema to `src/db/schema.ts`
6. Connect Drizzle: `const db = drizzle({ connection: ... })`
7. Apply migrations: `drizzle-kit push` or `drizzle-kit migrate`
8. Execute queries: `db.select().from(table)`, `db.insert()`, `db.update()`, `db.delete()`

### Key Variations by Database Type

**HTTP-based drivers** (PlanetScale, TiDB, Neon HTTP, Vercel Postgres):
- Use HTTP connections for serverless environments
- Typically faster for single transactions
- Connection: `drizzle({ connection: { url, authToken } })`

**WebSocket drivers** (Neon WebSocket):
- Support interactive transactions and sessions
- Better for persistent connections

**Durable Objects** (Cloudflare):
- Use `ctx.blockConcurrencyWhile()` to ensure migrations complete before queries
- Bundle database interactions in single DO calls for performance

**React Native** (Expo SQLite, OP-SQLite):
- Use `useMigrations` hook to apply migrations
- Configure Metro bundler and Babel for `.sql` file support

**Bun Runtime:**
- Bun 1.2.0 has concurrent query execution issues (tracked in GitHub)
- Use `bun src/index.ts` to run

### Example: PostgreSQL Setup

```typescript
// .env
DATABASE_URL=postgresql://user:password@localhost:5432/dbname

// drizzle.config.ts
import { defineConfig } from 'drizzle-kit';
export default defineConfig({
  dialect: 'postgresql',
  schema: './src/db/schema.ts',
  dbCredentials: { url: process.env.DATABASE_URL! },
});

// src/db/schema.ts
import { pgTable, serial, text, integer } from 'drizzle-orm/pg-core';
export const users = pgTable('users', {
  id: serial().primaryKey(),
  name: text().notNull(),
  age: integer(),
  email: text().notNull().unique(),
});

// src/index.ts
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { users } from './db/schema';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle(pool);

await db.insert(users).values({ name: 'John', age: 30, email: 'john@example.com' });
const allUsers = await db.select().from(users);
```

### Example: SQLite Setup

```typescript
// .env
DB_FILE_NAME=file:local.db

// drizzle.config.ts
import { defineConfig } from 'drizzle-kit';
export default defineConfig({
  dialect: 'sqlite',
  schema: './src/db/schema.ts',
  dbCredentials: { url: process.env.DB_FILE_NAME! },
});

// src/index.ts
import { drizzle } from 'drizzle-orm/libsql';
import { users } from './db/schema';

const db = drizzle({ connection: { url: process.env.DB_FILE_NAME! } });
await db.insert(users).values({ name: 'John', age: 30, email: 'john@example.com' });
```

### Example: Cloudflare D1

```typescript
// wrangler.toml
[[d1_databases]]
binding = "DB"
database_name = "mydb"
database_id = "abc123"

// src/index.ts
import { drizzle } from 'drizzle-orm/d1';

export default {
  async fetch(request: Request, env: Env) {
    const db = drizzle(env.DB);
    const result = await db.select().from(users).all();
    return Response.json(result);
  },
};
```

### Example: Expo SQLite

```typescript
import * as SQLite from 'expo-sqlite';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator';
import migrations from './drizzle/migrations';

const expo = SQLite.openDatabaseSync('db.db');
const db = drizzle(expo);

export default function App() {
  const { success, error } = useMigrations(db, migrations);
  
  useEffect(() => {
    if (!success) return;
    (async () => {
      await db.insert(users).values({ name: 'John', age: 30, email: 'john@example.com' });
      const items = await db.select().from(users);
    })();
  }, [success]);
}
```

### common_patterns_&_recipes
Practical patterns for filtering, pagination, data modification, advanced queries, schema defaults, and database setup in Drizzle ORM.

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

### release_notes
Comprehensive release notes tracking DrizzleORM evolution from v0.11.0 through v0.32.2, covering query performance improvements, new database drivers, schema features, and bug fixes.

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

### migration_guides
Step-by-step guides for migrating from Prisma, Sequelize, and TypeORM to Drizzle with introspection, schema setup, and query pattern replacements.

## Migration from Prisma, Sequelize, and TypeORM

Five-step migration process for all ORMs:
1. Install Drizzle ORM & Drizzle Kit: `npm install drizzle-orm pg -D drizzle-kit @types/pg`
2. Create `drizzle.config.ts` with database credentials and schema path
3. Run `npx drizzle-kit introspect` to generate schema from existing database
4. Create `src/drizzle/db.ts` with database connection using `drizzle()` and pg Client
5. Replace ORM queries with Drizzle equivalents

### Schema Setup

Add relational definitions after introspection:
```typescript
export const suppliersRelations = relations(suppliers, ({ many }) => ({
  products: many(products),
}));
export const productsRelations = relations(products, ({ one, many }) => ({
  supplier: one(suppliers, { fields: [products.supplierId], references: [suppliers.id] }),
  orderDetails: many(orderDetails),
}));
```

### Query Patterns

**Insert**: `db.insert(table).values([...])`
```typescript
await db.insert(suppliers).values([
  { companyName: 'TestCompanyName1', city: 'TestCity1', country: 'TestCountry1' },
]);
```

**Select single with relations** (relational query):
```typescript
const response = await db.query.products.findFirst({
  where: (products, { eq }) => eq(products.id, id),
  with: { supplier: true },
});
```

**Select multiple with filtering and pagination**:
```typescript
const whereOptions = ilike(products.name, `%test%`);
const [response, count] = await Promise.all([
  db.query.products.findMany({
    where: whereOptions,
    columns: { id: true, name: true, unitPrice: true, unitsInStock: true },
    offset: 0,
    limit: 10,
  }),
  db.select({ count: sql<number>`cast(count(${products.id}) as integer)` })
    .from(products).where(whereOptions),
]);
```

**Aggregations** (core queries only, not relational):
```typescript
const response = await db.select({
  id: orders.id,
  totalPrice: sql<number>`cast(sum(${orderDetails.quantity} * ${products.unitPrice}) as float)`,
  totalQuantity: sql<number>`cast(sum(${orderDetails.quantity}) as int)`,
})
  .from(orders).where(eq(orders.id, id)).groupBy(orders.id)
  .leftJoin(orderDetails, eq(orderDetails.orderId, orders.id))
  .leftJoin(products, eq(products.id, orderDetails.productId));
```

**Update**: `db.update(table).set({...}).where(...)`

**Delete with transaction**:
```typescript
await db.transaction(async (tx) => {
  await tx.delete(orderDetails).where(eq(orderDetails.orderId, id));
  await tx.delete(orders).where(eq(orders.id, id));
});
```

### Key Differences from Other ORMs

- Strict type safety: selected fields are reflected in response type
- Numeric fields (decimal) must use string type for precision
- Relational queries provide cleaner syntax but don't support aggregations
- Core queries support aggregations with `sql<Type>` templates
- No entity classes; schema defined once in schema.ts
- Transactions use `db.transaction()` callback pattern

### integration_tutorials
Setup guides and working examples for integrating Drizzle ORM with various databases and deployment platforms.

## Edge Functions Integration

Deploy Drizzle ORM on serverless edge platforms using edge-compatible drivers.

**Netlify Edge Functions** (Neon/Supabase):
- Map ESM imports via `import_map.json`, configure `netlify.toml`
- Define schema in `netlify/edge-functions/common/schema.ts`
- Connect: `drizzle({ client: neon() })` or `drizzle({ client: postgres() })`
- Access env vars: `Netlify.env.get("DATABASE_URL")`

**Supabase Edge Functions**:
- Initialize: `supabase init` → `supabase functions new <name>`
- Generate migrations: `npx drizzle-kit generate` → `supabase/migrations`
- Apply: `supabase start` → `supabase migration up`
- Connect: `postgres(Deno.env.get("SUPABASE_DB_URL")!)` with `{ prepare: false }`
- Deploy: `supabase link` → `supabase db push` → `supabase secrets set` → `supabase functions deploy`

**Vercel Edge Functions**:
- Neon: `drizzle-orm/neon-serverless`, init with `drizzle(process.env.POSTGRES_URL!)`
- Vercel Postgres: `drizzle-orm/vercel-postgres`, init with `drizzle()`
- PlanetScale: `drizzle-orm/planetscale-serverless`, use `mysqlTable`
- Turso: `drizzle-orm/libsql`, use `sqliteTable`, init with `drizzle({ connection: { url, authToken } })`

Setup: Install driver → Create schema in `src/db/schema.ts` → Configure `drizzle.config.ts` → Generate migrations → Create client in `src/db/index.ts` → Create API route with `export const runtime = 'edge'` → Deploy with `vercel`

## Database Integration Tutorials

Setup and CRUD patterns for Neon, Nile, Supabase, Turso, Vercel Postgres, Xata.

**Common Setup**:
```typescript
// Schema with type inference
export const usersTable = pgTable('users', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
});

export type InsertUser = typeof usersTable.$inferInsert;
export type SelectUser = typeof usersTable.$inferSelect;
```

**CRUD Operations**:
```typescript
// Insert
await db.insert(usersTable).values(data);

// Select with joins and pagination
db.select({
  ...getTableColumns(usersTable),
  postsCount: count(postsTable.id),
})
  .from(usersTable)
  .leftJoin(postsTable, eq(usersTable.id, postsTable.userId))
  .groupBy(usersTable.id)
  .limit(pageSize)
  .offset((page - 1) * pageSize);

// Update
await db.update(usersTable).set(data).where(eq(usersTable.id, id));

// Delete
await db.delete(usersTable).where(eq(usersTable.id, id));
```

**Platform-Specific**:
- **Neon**: `@neondatabase/serverless` driver, migrations via `drizzle-kit generate/migrate` or `push`
- **Nile**: Multi-tenant with AsyncLocalStorage for automatic tenant context scoping
- **Supabase**: `postgres-js` driver with connection pooling
- **Turso**: `libSQL` driver with auth token, `sqliteTable` schema
- **Vercel Postgres**: `@vercel/postgres` package
- **Xata**: PostgreSQL with copy-on-write branches, connection: `postgresql://postgres:<password>@<branch-id>.<region>.xata.tech/<database>?sslmode=require`

## Todo App with Neon Postgres

Complete Next.js todo app with server actions and inline editing.

**Setup**:
```bash
npm install drizzle-orm drizzle-kit @neondatabase/serverless dotenv
```

**Database Config** (`src/db/drizzle.ts`):
```typescript
import { drizzle } from 'drizzle-orm/neon-http';
export const db = drizzle(process.env.DATABASE_URL!);
```

**Schema** (`src/db/schema.ts`):
```typescript
export const todo = pgTable("todo", {
  id: integer("id").primaryKey(),
  text: text("text").notNull(),
  done: boolean("done").default(false).notNull(),
});
```

**Drizzle Config** (`drizzle.config.ts`):
```typescript
export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./migrations",
  dialect: "postgresql",
  dbCredentials: { url: process.env.DATABASE_URL! },
});
```

**Migrations**: `npx drizzle-kit generate` → `npx drizzle-kit migrate` (or `push` for prototyping)

**Server Actions** (`src/actions/todoAction.ts`):
```typescript
"use server";
import { eq, not } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export const getData = async () => db.select().from(todo);
export const addTodo = async (id: number, text: string) => 
  db.insert(todo).values({ id, text });
export const deleteTodo = async (id: number) => {
  await db.delete(todo).where(eq(todo.id, id));
  revalidatePath("/");
};
export const toggleTodo = async (id: number) => {
  await db.update(todo).set({ done: not(todo.done) }).where(eq(todo.id, id));
  revalidatePath("/");
};
export const editTodo = async (id: number, text: string) => {
  await db.update(todo).set({ text }).where(eq(todo.id, id));
  revalidatePath("/");
};
```

**Client Components**: `Todo` component with edit/delete/toggle, `AddTodo` form, `Todos` list manager with state management, main page fetches data via server action.



## Pages

### postgresql_extensions
pg_vector and PostGIS extensions: vector columns with distance-based indexes and queries; geometry columns with GIST indexes and xy/tuple modes.

## pg_vector

Open-source vector similarity search for PostgreSQL. Requires pg_vector extension to be pre-installed in the database.

**Column Types:**
- `vector({ dimensions: 3 })` - stores vectors alongside other data

**Indexes:**
Create HNSW indexes with distance operators:
```ts
const table = pgTable('items', {
    embedding: vector({ dimensions: 3 })
}, (table) => [
  index('l2_index').using('hnsw', table.embedding.op('vector_l2_ops')),
  index('ip_index').using('hnsw', table.embedding.op('vector_ip_ops')),
  index('cosine_index').using('hnsw', table.embedding.op('vector_cosine_ops')),
  index('l1_index').using('hnsw', table.embedding.op('vector_l1_ops')),
  index('hamming_index').using('hnsw', table.embedding.op('bit_hamming_ops')),
  index('jaccard_index').using('hnsw', table.embedding.op('bit_jaccard_ops'))
])
```

**Helper Functions:**
```ts
import { l2Distance, l1Distance, innerProduct, cosineDistance, hammingDistance, jaccardDistance } from 'drizzle-orm'

l2Distance(table.column, [3, 1, 2])        // <->
l1Distance(table.column, [3, 1, 2])        // <+>
innerProduct(table.column, [3, 1, 2])      // <#>
cosineDistance(table.column, [3, 1, 2])    // <=>
hammingDistance(table.column, '101')       // <~>
jaccardDistance(table.column, '101')       // <%>
```

**Query Examples:**
```ts
// Nearest neighbor search
db.select().from(items).orderBy(l2Distance(items.embedding, [3,1,2])).limit(5)

// Distance calculation
db.select({ distance: l2Distance(items.embedding, [3,1,2]) }).from(items)

// Subquery distance
const subquery = db.select({ embedding: items.embedding }).from(items).where(eq(items.id, 1))
db.select().from(items).orderBy(l2Distance(items.embedding, subquery)).limit(5)

// Custom operations
db.select({ innerProduct: sql`(${innerProduct(items.embedding, [3,1,2])}) * -1` }).from(items)
```

Custom distance functions can be created by replicating the pattern:
```ts
export function l2Distance(column: SQLWrapper | AnyColumn, value: number[] | string[] | TypedQueryBuilder<any> | string): SQL {
  if (is(value, TypedQueryBuilder<any>) || typeof value === 'string') {
    return sql`${column} <-> ${value}`;
  }
  return sql`${column} <-> ${JSON.stringify(value)}`;
}
```

## PostGIS

Extends PostgreSQL with geospatial data support. Requires postgis extension to be pre-installed. Use `extensionsFilters` in drizzle config to exclude PostGIS tables from introspect/push commands.

**Column Types:**
- `geometry('geo', { type: 'point' })` - stores geometry data

**Modes:**
- `tuple` (default) - maps to array `[1, 2]`
- `xy` - maps to object `{ x: 1, y: 2 }`

**Examples:**
```ts
const items = pgTable('items', {
  geo: geometry('geo', { type: 'point' }),
  geoObj: geometry('geo_obj', { type: 'point', mode: 'xy' }),
  geoSrid: geometry('geo_options', { type: 'point', mode: 'xy', srid: 4000 }),
})
```

**Indexes:**
```ts
const table = pgTable('table', {
  geo: geometry({ type: 'point' }),
}, (table) => [
  index('custom_idx').using('gist', table.geo)
])
```

Type can be any string to support other PostGIS geometry types beyond `point`.

### arktype
Plugin generating Arktype validation schemas from Drizzle ORM table/view/enum definitions; supports select/insert/update schemas with field refinements and comprehensive data type mappings across PostgreSQL, MySQL, SQLite.

## drizzle-arktype Plugin

A plugin for Drizzle ORM that generates Arktype schemas from Drizzle ORM schemas. Requires Drizzle ORM v0.36.0+, Arktype v2.0.0+.

### Select Schema
Validates data queried from the database (API responses). Generated from table definitions, views, and enums.

```ts
import { pgTable, text, integer } from 'drizzle-orm/pg-core';
import { createSelectSchema } from 'drizzle-arktype';

const users = pgTable('users', {
  id: integer().generatedAlwaysAsIdentity().primaryKey(),
  name: text().notNull(),
  age: integer().notNull()
});

const userSelectSchema = createSelectSchema(users);
const rows = await db.select().from(users).limit(1);
const parsed = userSelectSchema(rows[0]); // Validates: { id: number; name: string; age: number }
```

### Insert Schema
Validates data to be inserted into the database (API requests). Auto-generated columns are excluded.

```ts
import { createInsertSchema } from 'drizzle-arktype';

const userInsertSchema = createInsertSchema(users);
const user = { name: 'Jane', age: 30 };
const parsed = userInsertSchema(user); // Validates: { name: string, age: number }
await db.insert(users).values(parsed);
```

### Update Schema
Validates data to be updated in the database. All fields become optional, generated columns excluded.

```ts
import { createUpdateSchema } from 'drizzle-arktype';

const userUpdateSchema = createUpdateSchema(users);
const user = { age: 35 };
const parsed = userUpdateSchema(user); // Validates: { name?: string | undefined, age?: number | undefined }
await db.update(users).set(parsed).where(eq(users.name, 'Jane'));
```

### Refinements
Each create schema function accepts an optional parameter to extend, modify, or overwrite field schemas. Callback functions extend/modify; Arktype schemas overwrite.

```ts
import { createSelectSchema } from 'drizzle-arktype';
import { pipe, maxLength, object, string } from 'arktype';

const userSelectSchema = createSelectSchema(users, {
  name: (schema) => pipe(schema, maxLength(20)), // Extends
  bio: (schema) => pipe(schema, maxLength(1000)), // Extends before nullability
  preferences: object({ theme: string() }) // Overwrites including nullability
});
```

### Data Type Reference

**Boolean**: `pg.boolean()`, `mysql.boolean()`, `sqlite.integer({ mode: 'boolean' })` → `type.boolean`

**Date/Timestamp**: `pg.date({ mode: 'date' })`, `pg.timestamp({ mode: 'date' })`, `mysql.date({ mode: 'date' })`, `mysql.datetime({ mode: 'date' })`, `mysql.timestamp({ mode: 'date' })`, `sqlite.integer({ mode: 'timestamp' })`, `sqlite.integer({ mode: 'timestamp_ms' })` → `type.Date`

**String**: `pg.text()`, `pg.date({ mode: 'string' })`, `pg.timestamp({ mode: 'string' })`, `pg.cidr()`, `pg.inet()`, `pg.interval()`, `pg.macaddr()`, `pg.macaddr8()`, `pg.numeric()`, `pg.sparsevec()`, `pg.time()`, `mysql.binary()`, `mysql.date({ mode: 'string' })`, `mysql.datetime({ mode: 'string' })`, `mysql.decimal()`, `mysql.time()`, `mysql.timestamp({ mode: 'string' })`, `mysql.varbinary()`, `sqlite.numeric()`, `sqlite.text({ mode: 'text' })` → `type.string`

**Bit**: `pg.bit({ dimensions: ... })` → `type(/^[01]{${column.dimensions}}$/)`

**UUID**: `pg.uuid()` → `type(/^[\da-f]{8}(?:-[\da-f]{4}){3}-[\da-f]{12}$/iu)`

**Char (exact length)**: `pg.char({ length: ... })`, `mysql.char({ length: ... })` → `type.string.exactlyLength(length)`

**Varchar (max length)**: `pg.varchar({ length: ... })`, `mysql.varchar({ length: ... })`, `sqlite.text({ mode: 'text', length: ... })` → `type.string.atMostLength(length)`

**MySQL text variants**: `mysql.tinytext()` → `type.string.atMostLength(255)`, `mysql.text()` → `type.string.atMostLength(65_535)`, `mysql.mediumtext()` → `type.string.atMostLength(16_777_215)`, `mysql.longtext()` → `type.string.atMostLength(4_294_967_295)`

**Enum**: `pg.text({ enum: ... })`, `pg.char({ enum: ... })`, `pg.varchar({ enum: ... })`, `mysql.mysqlEnum(...)`, `sqlite.text({ mode: 'text', enum: ... })` → `type.enumerated(...enum)`

**MySQL tinyint**: `mysql.tinyint()` → `type.keywords.number.integer.atLeast(-128).atMost(127)`, `mysql.tinyint({ unsigned: true })` → `type.keywords.number.integer.atLeast(0).atMost(255)`

**Smallint**: `pg.smallint()`, `pg.smallserial()`, `mysql.smallint()` → `type.keywords.number.integer.atLeast(-32_768).atMost(32_767)`, `mysql.smallint({ unsigned: true })` → `type.keywords.number.integer.atLeast(0).atMost(65_535)`

**Float/Real (24-bit)**: `pg.real()`, `mysql.float()` → `type.number.atLeast(-8_388_608).atMost(8_388_607)`, `mysql.mediumint()` → `type.keywords.number.integer.atLeast(-8_388_608).atMost(8_388_607)`, `mysql.float({ unsigned: true })` → `type.number.atLeast(0).atMost(16_777_215)`, `mysql.mediumint({ unsigned: true })` → `type.keywords.number.integer.atLeast(0).atMost(16_777_215)`

**Integer (32-bit)**: `pg.integer()`, `pg.serial()`, `mysql.int()` → `type.keywords.number.integer.atLeast(-2_147_483_648).atMost(2_147_483_647)`, `mysql.int({ unsigned: true })` → `type.keywords.number.integer.atLeast(0).atMost(4_294_967_295)`

**Double precision (48-bit)**: `pg.doublePrecision()`, `mysql.double()`, `mysql.real()`, `sqlite.real()` → `type.number.atLeast(-140_737_488_355_328).atMost(140_737_488_355_327)`, `mysql.double({ unsigned: true })` → `type.number.atLeast(0).atMost(281_474_976_710_655)`

**Bigint (safe integers)**: `pg.bigint({ mode: 'number' })`, `pg.bigserial({ mode: 'number' })`, `mysql.bigint({ mode: 'number' })`, `mysql.bigserial({ mode: 'number' })`, `sqlite.integer({ mode: 'number' })` → `type.keywords.number.integer.atLeast(-9_007_199_254_740_991).atMost(9_007_199_254_740_991)`, `mysql.serial()` → `type.keywords.number.integer.atLeast(0).atMost(9_007_199_254_740_991)`

**Bigint (64-bit)**: `pg.bigint({ mode: 'bigint' })`, `pg.bigserial({ mode: 'bigint' })`, `mysql.bigint({ mode: 'bigint' })`, `sqlite.blob({ mode: 'bigint' })` → `type.bigint.narrow((value, ctx) => value < -9_223_372_036_854_775_808n ? ctx.mustBe('greater than') : value > 9_223_372_036_854_775_807n ? ctx.mustBe('less than') : true)`, `mysql.bigint({ mode: 'bigint', unsigned: true })` → `type.bigint.narrow((value, ctx) => value < 0n ? ctx.mustBe('greater than') : value > 18_446_744_073_709_551_615n ? ctx.mustBe('less than') : true)`

**Year**: `mysql.year()` → `type.keywords.number.integer.atLeast(1_901).atMost(2_155)`

**Point (tuple)**: `pg.geometry({ type: 'point', mode: 'tuple' })`, `pg.point({ mode: 'tuple' })` → `type([type.number, type.number])`

**Point (xy object)**: `pg.geometry({ type: 'point', mode: 'xy' })`, `pg.point({ mode: 'xy' })` → `type({ x: type.number, y: type.number })`

**Vector/Halfvec**: `pg.halfvec({ dimensions: ... })`, `pg.vector({ dimensions: ... })` → `type.number.array().exactlyLength(dimensions)`

**Line (abc)**: `pg.line({ mode: 'abc' })` → `type({ a: type.number, b: type.number, c: type.number })`

**Line (tuple)**: `pg.line({ mode: 'tuple' })` → `type([type.number, type.number, type.number])`

**JSON**: `pg.json()`, `pg.jsonb()`, `mysql.json()`, `sqlite.blob({ mode: 'json' })`, `sqlite.text({ mode: 'json' })` → `type('string | number | boolean | null').or(type('unknown.any[] | Record<string, unknown.any>'))`

**Buffer**: `sqlite.blob({ mode: 'buffer' })` → `type.instanceOf(Buffer)`

**Array**: `pg.dataType().array(...)` → `baseDataTypeSchema.array().exactlyLength(size)`

### batch-api
Batch API executes multiple SQL statements in single call with implicit transaction (all-or-nothing); supports LibSQL, Neon, D1; returns tuple of results; all query builders supported.

## Batch API

Execute multiple SQL statements in a single database call with implicit transaction handling.

### Overview

Batch APIs allow executing one or more SQL statements in order within an implicit transaction. The behavior differs by database:

- **LibSQL**: Transaction controlled by backend. All statements succeed and commit together, or all fail and rollback.
- **D1**: Statements execute sequentially and non-concurrently in auto-commit mode. If any statement fails, the entire sequence aborts/rolls back.
- **Neon**: Similar transactional guarantees to LibSQL.

### Usage

```ts
const batchResponse: BatchResponse = await db.batch([
	db.insert(usersTable).values({ id: 1, name: 'John' }).returning({ id: usersTable.id }),
	db.update(usersTable).set({ name: 'Dan' }).where(eq(usersTable.id, 1)),
	db.query.usersTable.findMany({}),
	db.select().from(usersTable).where(eq(usersTable.id, 1)),
	db.select({ id: usersTable.id, invitedBy: usersTable.invitedBy }).from(usersTable),
]);
```

The response is a tuple where each element corresponds to the result of each statement in order. Result types vary by database (ResultSet for libSQL, NeonHttpQueryResult for Neon, D1Result for D1).

### Supported Builders

All query builders can be used inside `db.batch()`:
- `db.all()`, `db.get()`, `db.values()`, `db.run()`, `db.execute()`
- `db.query.<table>.findMany()`, `db.query.<table>.findFirst()`
- `db.select()...`, `db.update()...`, `db.delete()...`, `db.insert()...`

### Performance Benefit

Batching reduces network latency by combining multiple statements into a single database call, providing significant performance improvements especially for D1.

### cache
Opt-in or global query caching with Upstash Redis integration; manual invalidation by table/tag; custom cache implementation via Cache class extension; not supported for raw queries, batch ops, transactions, relational queries, or certain drivers.

## Caching Strategy

Drizzle sends every query to the database by default with no automatic caching. Caching is opt-in to prevent hidden performance traps. Two strategies are available:
- `explicit` (default, `global: false`): Cache only when explicitly requested via `.$withCache()`
- `all` (`global: true`): All select queries check cache first

## Upstash Integration

Drizzle provides `upstashCache()` helper that auto-configures from environment variables:

```ts
import { upstashCache } from "drizzle-orm/cache/upstash";
const db = drizzle(process.env.DB_URL!, {
  cache: upstashCache(),
});
```

With explicit configuration and options:

```ts
const db = drizzle(process.env.DB_URL!, {
  cache: upstashCache({
    url: '<UPSTASH_URL>',
    token: '<UPSTASH_TOKEN>',
    global: true,  // cache all queries by default
    config: { ex: 60 }  // 60 second TTL
  })
});
```

## Cache Config

Upstash cache config options:
- `ex`: Expiration in seconds (positive integer)
- `hexOptions`: HEXPIRE command options for hash field TTL ("NX", "XX", "GT", "LT", case-insensitive)

## Usage Examples

**With `global: false` (opt-in, default):**

```ts
const db = drizzle(process.env.DB_URL!, {
  cache: upstashCache({ url: "", token: "" }),
});

// Won't use cache
const res = await db.select().from(users);

// Use cache with .$withCache()
const res = await db.select().from(users).$withCache();

// .$withCache() options:
.$withCache({ config: { ex: 60 } })  // override TTL
.$withCache({ tag: 'custom_key' })  // custom cache key
.$withCache({ autoInvalidate: false })  // disable auto-invalidation
```

**With `global: true`:**

```ts
const db = drizzle(process.env.DB_URL!, {
  cache: upstashCache({ url: "", token: "", global: true }),
});

// Uses cache automatically
const res = await db.select().from(users);

// Disable cache for specific query
const res = await db.select().from(users).$withCache(false);
```

## Cache Invalidation

Manual invalidation via `db.$cache.invalidate()`:

```ts
// By table reference
await db.$cache.invalidate({ tables: users });
await db.$cache.invalidate({ tables: [users, posts] });

// By table name string
await db.$cache.invalidate({ tables: "usersTable" });
await db.$cache.invalidate({ tables: ["usersTable", "postsTable"] });

// By custom tags
await db.$cache.invalidate({ tags: "custom_key" });
await db.$cache.invalidate({ tags: ["custom_key", "custom_key1"] });
```

Mutations (insert, update, delete) automatically trigger `onMutate` handler and invalidate cached queries involving affected tables.

## Eventual Consistency

When `autoInvalidate: false` is set, cache won't invalidate on mutations. Data remains stale until TTL expires. Useful for data that changes infrequently (product listings, blog posts) where slight staleness is acceptable.

Example: Query cached with 3-second TTL and `autoInvalidate: false` will show old data for up to 3 seconds after an insert.

## Custom Cache Implementation

Extend the `Cache` class to implement custom caching:

```ts
export class TestGlobalCache extends Cache {
  private globalTtl: number = 1000;
  private usedTablesPerKey: Record<string, string[]> = {};

  constructor(private kv: Keyv = new Keyv()) {
    super();
  }

  override strategy(): "explicit" | "all" {
    return "all";
  }

  override async get(key: string): Promise<any[] | undefined> {
    return (await this.kv.get(key)) ?? undefined;
  }

  override async put(
    key: string,
    response: any,
    tables: string[],
    config?: CacheConfig,
  ): Promise<void> {
    const ttl = config?.px ?? (config?.ex ? config.ex * 1000 : this.globalTtl);
    await this.kv.set(key, response, ttl);
    for (const table of tables) {
      const keys = this.usedTablesPerKey[table];
      if (keys === undefined) {
        this.usedTablesPerKey[table] = [key];
      } else {
        keys.push(key);
      }
    }
  }

  override async onMutate(params: {
    tags: string | string[];
    tables: string | string[] | Table<any> | Table<any>[];
  }): Promise<void> {
    const tagsArray = Array.isArray(params.tags) ? params.tags : params.tags ? [params.tags] : [];
    const tablesArray = Array.isArray(params.tables) ? params.tables : param.tables ? [params.tables] : [];
    const keysToDelete = new Set<string>();

    for (const table of tablesArray) {
      const tableName = is(table, Table) ? getTableName(table) : (table as string);
      const keys = this.usedTablesPerKey[tableName] ?? [];
      for (const key of keys) keysToDelete.add(key);
    }

    for (const tag of tagsArray) {
      await this.kv.delete(tag);
    }
    for (const key of keysToDelete) {
      await this.kv.delete(key);
      for (const table of tablesArray) {
        const tableName = is(table, Table) ? getTableName(table) : (table as string);
        this.usedTablesPerKey[tableName] = [];
      }
    }
  }
}

const db = drizzle(process.env.DB_URL!, { cache: new TestGlobalCache() });
```

Custom cache config options:
- `ex`: Expiration in seconds
- `px`: Expiration in milliseconds
- `exat`: Unix time (seconds) when key expires
- `pxat`: Unix time (milliseconds) when key expires
- `keepTtl`: Retain existing TTL when updating key
- `hexOptions`: HEXPIRE options

## Limitations

**Not supported:**
- Raw queries: `db.execute(sql\`select 1\`)`
- Batch operations in d1 and libsql
- Transactions
- Relational queries: `db.query.users.findMany()`
- better-sqlite3, Durable Objects, expo sqlite drivers
- AWS Data API drivers
- Views

Relational queries, better-sqlite3, Durable Objects, expo sqlite, AWS Data API, and views are temporary limitations that will be addressed soon.

### connect-aws-data-api-pg
Connect Drizzle to AWS RDS Aurora PostgreSQL via Data API using database, secretArn, and resourceArn; supports both inline config and existing RDSDataClient.

## AWS Data API PostgreSQL Connection

Connect Drizzle ORM to AWS RDS Aurora PostgreSQL using the AWS Data API.

### Prerequisites
- Database connection basics with Drizzle
- AWS Data API (see AWS RDS Aurora documentation)
- AWS SDK for JavaScript v3

### Installation
```
npm install drizzle-orm @aws-sdk/client-rds-data
npm install -D drizzle-kit
```

### Basic Setup
Initialize the driver with required connection properties:

```typescript
import { drizzle } from 'drizzle-orm/aws-data-api/pg';

const db = drizzle({ 
  connection: {
    database: process.env['DATABASE']!,
    secretArn: process.env['SECRET_ARN']!,
    resourceArn: process.env['RESOURCE_ARN']!,
  }
});

await db.select().from(...);
```

### Using Existing RDSDataClient
If you have an existing RDSDataClient instance, pass it to drizzle:

```typescript
import { drizzle } from 'drizzle-orm/aws-data-api/pg';
import { RDSDataClient } from '@aws-sdk/client-rds-data';

const rdsClient = new RDSDataClient({ region: 'us-east-1' });

const db = drizzle(rdsClient, {
  database: process.env['DATABASE']!,
  secretArn: process.env['SECRET_ARN']!,
  resourceArn: process.env['RESOURCE_ARN']!,
});

await db.select().from(...);
```

The connection object accepts any additional properties from the RDSDataClient type.

### connect-bun-sql
Setup Drizzle with Bun SQL for PostgreSQL: install packages, import from 'drizzle-orm/bun-sql', initialize with DATABASE_URL or existing SQL client instance.

## Bun SQL Integration

Drizzle ORM natively supports the `bun sql` module for PostgreSQL database connections with high performance.

### Prerequisites
- Database connection basics with Drizzle
- Bun runtime (JavaScript runtime)
- Bun SQL - native PostgreSQL bindings

### Installation
Install `drizzle-orm` and `drizzle-kit` as dev dependency:
```
npm install drizzle-orm
npm install -D drizzle-kit
```

### Basic Usage
Initialize the driver with a database URL:
```typescript
import 'dotenv/config';
import { drizzle } from 'drizzle-orm/bun-sql';

const db = drizzle(process.env.DATABASE_URL);
const result = await db.select().from(...);
```

### Using Existing Driver
If you have an existing Bun SQL driver instance, pass it to Drizzle:
```typescript
import 'dotenv/config';
import { drizzle } from 'drizzle-orm/bun-sql';
import { SQL } from 'bun';

const client = new SQL(process.env.DATABASE_URL!);
const db = drizzle({ client });
```

### connect-bun-sqlite
Connect Drizzle ORM to Bun's native SQLite driver with async or sync APIs; initialize with `drizzle()` or `drizzle({ client: new Database('sqlite.db') })`.

## Drizzle ORM with Bun SQLite

Drizzle ORM natively supports the `bun:sqlite` module with both async and sync APIs. The library mirrors popular SQLite query methods: `all`, `get`, `values`, and `run`.

### Installation
Install `drizzle-orm` and `drizzle-kit` as dev dependency.

### Basic Setup

**Default initialization (uses Bun's default SQLite):**
```typescript
import { drizzle } from 'drizzle-orm/bun-sqlite';
const db = drizzle();
const result = await db.select().from(...);
```

**With existing driver:**
```typescript
import { drizzle } from 'drizzle-orm/bun-sqlite';
import { Database } from 'bun:sqlite';

const sqlite = new Database('sqlite.db');
const db = drizzle({ client: sqlite });
const result = await db.select().from(...);
```

### Sync APIs

For synchronous operations, use the same driver initialization but call sync methods directly:
```typescript
const result = db.select().from(users).all();
const result = db.select().from(users).get();
const result = db.select().from(users).values();
const result = db.select().from(users).run();
```

The sync API provides direct access to SQLite's synchronous query execution without async/await overhead.

### connect-cloudflare-d1
Connect Drizzle ORM to Cloudflare D1: install packages, configure wrangler.json with D1 binding, initialize driver with `drizzle(env.BINDING_NAME)`, execute queries.

## Cloudflare D1 Setup

D1 is Cloudflare's queryable relational database. Drizzle ORM fully supports D1 and Cloudflare Workers environment, supporting SQLite-like query methods (`all`, `get`, `values`, `run`).

### Installation
Install `drizzle-orm` and `drizzle-kit` as dev dependency.

### Configuration
Create a `wrangler.json` or `wrangler.toml` file with D1 database binding configuration:

**wrangler.json:**
```json
{
    "name": "YOUR_PROJECT_NAME",
    "main": "src/index.ts",
    "compatibility_date": "2024-09-26",
    "compatibility_flags": ["nodejs_compat"],
    "d1_databases": [
        {
            "binding": "BINDING_NAME",
            "database_name": "YOUR_DB_NAME",
            "database_id": "YOUR_DB_ID",
            "migrations_dir": "drizzle/migrations"
        }
    ]
}
```

**wrangler.toml:**
```toml
name = "YOUR_PROJECT_NAME"
main = "src/index.ts"
compatibility_date = "2022-11-07"
node_compat = true

[[ d1_databases ]]
binding = "BINDING_NAME"
database_name = "YOUR_DB_NAME"
database_id = "YOUR_DB_ID"
migrations_dir = "drizzle/migrations"
```

### Basic Query
```typescript
import { drizzle } from 'drizzle-orm/d1';

export interface Env {
  <BINDING_NAME>: D1Database;
}

export default {
  async fetch(request: Request, env: Env) {
    const db = drizzle(env.<BINDING_NAME>);
    const result = await db.select().from(users).all()
    return Response.json(result);
  },
};
```

Initialize the driver by importing from `drizzle-orm/d1`, pass the D1 database binding from the Cloudflare Workers environment, and execute queries using standard Drizzle syntax.

### connect-cloudflare-do
Setup Drizzle with Cloudflare Durable Objects SQLite: install packages, configure wrangler.toml with DO bindings/migrations, initialize db with drizzle(storage) in DO constructor with blockConcurrencyWhile for migrations, expose query methods, call from Worker via DO stub.

## Drizzle with Cloudflare Durable Objects SQLite

Drizzle ORM fully supports Cloudflare Durable Objects database and Cloudflare Workers environment, supporting SQLite-like query methods (`all`, `get`, `values`, `run`).

### Prerequisites
- Database connection basics with Drizzle
- Cloudflare SQLite Durable Objects - SQLite database embedded within a Durable Object

### Setup

**Install packages:**
```
drizzle-orm
-D drizzle-kit
```

**Configure wrangler.toml** with Durable Object bindings and migrations:
```toml
name = "sqlite-durable-objects"
main = "src/index.ts"
compatibility_date = "2024-11-12"
compatibility_flags = [ "nodejs_compat" ]

[[durable_objects.bindings]]
name = "MY_DURABLE_OBJECT"
class_name = "MyDurableObject"

[[migrations]]
tag = "v1"
new_sqlite_classes = ["MyDurableObject"]

[[rules]] 
type = "Text"
globs = ["**/*.sql"]
fallthrough = true
```

**Initialize driver and create Durable Object class:**
```typescript
import { drizzle, DrizzleSqliteDODatabase } from 'drizzle-orm/durable-sqlite';
import { DurableObject } from 'cloudflare:workers'
import { migrate } from 'drizzle-orm/durable-sqlite/migrator';
import migrations from '../drizzle/migrations';
import { usersTable } from './db/schema';

export class MyDurableObject extends DurableObject {
	storage: DurableObjectStorage;
	db: DrizzleSqliteDODatabase<any>;

	constructor(ctx: DurableObjectState, env: Env) {
		super(ctx, env);
		this.storage = ctx.storage;
		this.db = drizzle(this.storage, { logger: false });

		ctx.blockConcurrencyWhile(async () => {
			await this._migrate();
		});
	}

	async insertAndList(user: typeof usersTable.$inferInsert) {
		await this.insert(user);
		return this.select();
	}

	async insert(user: typeof usersTable.$inferInsert) {
		await this.db.insert(usersTable).values(user);
	}

	async select() {
		return this.db.select().from(usersTable);
	}

	async _migrate() {
		migrate(this.db, migrations);
	}
}
```

**Use in Worker fetch handler:**
```typescript
export default {
	async fetch(request: Request, env: Env): Promise<Response> {
		const id: DurableObjectId = env.MY_DURABLE_OBJECT.idFromName('durable-object');
		const stub = env.MY_DURABLE_OBJECT.get(id);

		// Option A - Maximum performance: bundle all database interactions in single DO call
		const usersAll = await stub.insertAndList({
			name: 'John',
			age: 30,
			email: 'john@example.com',
		});

		// Option B - Slower but useful for debugging: individual query calls
		await stub.insert({
			name: 'John',
			age: 30,
			email: 'john@example.com',
		});
		const users = await stub.select();

		return Response.json(users);
	}
}
```

**Key points:**
- Initialize database with `drizzle(this.storage, { logger: false })`
- Run migrations in constructor using `ctx.blockConcurrencyWhile()` to ensure they complete before accepting queries
- Bundle database interactions within single Durable Object call for maximum performance
- Each individual query call is a round-trip to the Durable Object instance

### http_proxy_driver
HTTP proxy driver for custom database communication: pass async callback receiving (sql, params, method) returning {rows}, with examples for PostgreSQL, MySQL, SQLite including batch support.

## HTTP Proxy Driver

The HTTP Proxy allows implementing custom driver communication with databases. It's used when you need to add custom logic at the query stage or when using an HTTP driver that sends queries to a server, executes them on the database, and returns raw data for Drizzle ORM to map.

### How It Works

1. Drizzle ORM builds a query
2. HTTP Proxy Driver sends the built query to an HTTP server
3. Server executes the query on the database
4. Server sends raw results back
5. Drizzle ORM maps the data and returns results

### Callback Function Signature

The proxy accepts an async callback function with parameters:
- `sql`: query string with placeholders
- `params`: array of parameters
- `method`: one of `run`, `all`, `values`, or `get` depending on the SQL statement

Return value must be `{rows: string[][]}` or `{rows: string[]}`:
- When `method` is `get`, return `{rows: string[]}`
- Otherwise, return `{rows: string[][]}`

### PostgreSQL Example

**Client:**
```typescript
import { drizzle } from 'drizzle-orm/pg-proxy';

const db = drizzle(async (sql, params, method) => {
  try {
    const rows = await axios.post('http://localhost:3000/query', { sql, params, method });
    return { rows: rows.data };
  } catch (e: any) {
    console.error('Error from pg proxy server: ', e.response.data)
    return { rows: [] };
  }
});
```

**Server:**
```typescript
import { Client } from 'pg';
import express from 'express';

const app = express();
app.use(express.json());
const client = new Client('postgres://postgres:postgres@localhost:5432/postgres');

app.post('/query', async (req, res) => {
  const { sql, params, method } = req.body;
  const sqlBody = sql.replace(/;/g, '');

  try {
    const result = await client.query({
      text: sqlBody,
      values: params,
      rowMode: method === 'all' ? 'array': undefined,
    });
    res.send(result.rows);
  } catch (e: any) {
    res.status(500).json({ error: e });
  }
});

app.listen(3000);
```

### MySQL Example

**Client:**
```typescript
import { drizzle } from 'drizzle-orm/mysql-proxy';

const db = drizzle(async (sql, params, method) => {
  try {
    const rows = await axios.post('http://localhost:3000/query', { sql, params, method });
    return { rows: rows.data };
  } catch (e: any) {
    console.error('Error from mysql proxy server: ', e.response.data)
    return { rows: [] };
  }
});
```

**Server:**
```typescript
import * as mysql from 'mysql2/promise';
import express from 'express';

const app = express();
app.use(express.json());
const connection = await mysql.createConnection('mysql://root:mysql@127.0.0.1:5432/drizzle');

app.post('/query', async (req, res) => {
  const { sql, params, method } = req.body;
  const sqlBody = sql.replace(/;/g, '');

  try {
    const result = await connection.query({
      sql: sqlBody,
      values: params,
      rowsAsArray: method === 'all',
      typeCast: function(field: any, next: any) {
        if (field.type === 'TIMESTAMP' || field.type === 'DATETIME' || field.type === 'DATE') {
          return field.string();
        }
        return next();
      },
    });
    if (method === 'all') {
      res.send(result[0]);
    } else if (method === 'execute') {
      res.send(result);
    }
  } catch (e: any) {
    res.status(500).json({ error: e });
  }
});

app.listen(3000);
```

### SQLite Example

**Client:**
```typescript
import { drizzle } from 'drizzle-orm/sqlite-proxy';

const db = drizzle(async (sql, params, method) => {
  try {
    const rows = await axios.post('http://localhost:3000/query', { sql, params, method });
    return { rows: rows.data };
  } catch (e: any) {
    console.error('Error from sqlite proxy server: ', e.response.data)
    return { rows: [] };
  }
});
```

### SQLite Batch Support

SQLite Proxy supports batch requests. Specify a second callback for batch queries:

```typescript
type ResponseType = { rows: any[][] | any[] }[];

const db = drizzle(
  async (sql, params, method) => {
    // single queries logic
  },
  async (queries: { sql: string, params: any[], method: 'all' | 'run' | 'get' | 'values'}[]) => {
    try {
      const result: ResponseType = await axios.post('http://localhost:3000/batch', { queries });
      return result;
    } catch (e: any) {
      console.error('Error from sqlite proxy server:', e);
      throw e;
    }
  }
);
```

The batch response must be an array of raw values in the same order as sent. Use `db.batch([])` to proxy all queries.

### Table Declaration Example

```typescript
import { sql } from "drizzle-orm";
import { text, integer, sqliteTable } from "drizzle-orm/sqlite-core";

const users = sqliteTable('users', {
  id: text('id'),
  textModifiers: text('text_modifiers').notNull().default(sql`CURRENT_TIMESTAMP`),
  intModifiers: integer('int_modifiers', { mode: 'boolean' }).notNull().default(false),
});
```

### expo_sqlite_integration
Native Expo SQLite driver with live queries, Drizzle Kit migrations, and Studio support; requires babel/metro config for bundling SQL migrations.

## Drizzle ORM for Expo SQLite

Drizzle provides native ORM support for Expo SQLite with the following features:
- Native ORM driver for Expo SQLite
- Drizzle Kit support for migration generation and bundling
- Drizzle Studio dev tools plugin for on-device database browsing
- Live Queries support

### Installation
```
npm install drizzle-orm expo-sqlite@next
npm install -D drizzle-kit
```

### Basic Usage
```ts
import { drizzle } from "drizzle-orm/expo-sqlite";
import { openDatabaseSync } from "expo-sqlite";

const expo = openDatabaseSync("db.db");
const db = drizzle(expo);

await db.select().from(users);
```

### Live Queries
Use the `useLiveQuery` hook to make queries reactive and automatically re-render when data changes. Requires enabling change listeners when opening the database:

```ts
import { useLiveQuery, drizzle } from 'drizzle-orm/expo-sqlite';
import { openDatabaseSync } from 'expo-sqlite';
import { Text } from 'react-native';
import * as schema from './schema';

const expo = openDatabaseSync('db.db', { enableChangeListener: true });
const db = drizzle(expo);

const App = () => {
  const { data } = useLiveQuery(db.select().from(schema.users));
  return <Text>{JSON.stringify(data)}</Text>;
};
```

### Migrations with Drizzle Kit

Expo requires SQL migrations to be bundled into the app as strings. Setup involves:

1. Install babel plugin for inlining SQL files:
```
npm install babel-plugin-inline-import
```

2. Update `babel.config.js` to include the inline-import plugin for `.sql` files:
```js
module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [["inline-import", { "extensions": [".sql"] }]]
  };
};
```

3. Update `metro.config.js` to recognize `.sql` files:
```js
const { getDefaultConfig } = require('expo/metro-config');
const config = getDefaultConfig(__dirname);
config.resolver.sourceExts.push('sql');
module.exports = config;
```

4. Configure `drizzle.config.ts` with `dialect: 'sqlite'` and `driver: 'expo'`:
```ts
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
	schema: './db/schema.ts',
	out: './drizzle',
  dialect: 'sqlite',
	driver: 'expo',
});
```

5. Generate migrations:
```bash
npx drizzle-kit generate
```

6. Run migrations on app startup using the `useMigrations` hook:
```ts
import { drizzle } from "drizzle-orm/expo-sqlite";
import { openDatabaseSync } from "expo-sqlite";
import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator';
import migrations from './drizzle/migrations';

const expoDb = openDatabaseSync("db.db");
const db = drizzle(expoDb);

export default function App() {
  const { success, error } = useMigrations(db, migrations);

  if (error) {
    return <View><Text>Migration error: {error.message}</Text></View>;
  }

  if (!success) {
    return <View><Text>Migration is in progress...</Text></View>;
  }

  return ...your application component;
}
```

### connect-neon
Connect Drizzle to Neon Postgres using neon-http (serverless HTTP), neon-websockets (interactive transactions), or PostgresJS (serverful) drivers.

## Neon Postgres Connection

Drizzle has native support for Neon connections using `neon-http` and `neon-websockets` drivers, which use the neon-serverless driver under the hood.

**HTTP vs WebSockets:**
- `neon-http`: Faster for single, non-interactive transactions, works over HTTP in serverless environments
- `neon-websockets`: Required for session or interactive transaction support
- For serverful environments, use PostgresJS driver as described in Neon's official Node.js docs

**Installation:**
```
npm install drizzle-orm @neondatabase/serverless
npm install -D drizzle-kit
```

**Neon HTTP:**
```typescript
import { drizzle } from 'drizzle-orm/neon-http';
const db = drizzle(process.env.DATABASE_URL);
const result = await db.execute('select 1');
```

Or with existing driver:
```typescript
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
const sql = neon(process.env.DATABASE_URL!);
const db = drizzle({ client: sql });
```

**Neon WebSockets:**
```typescript
import { drizzle } from 'drizzle-orm/neon-serverless';
const db = drizzle(process.env.DATABASE_URL);
const result = await db.execute('select 1');
```

For Node.js, install `ws` and `bufferutil` packages and configure:
```typescript
import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from 'ws';

neonConfig.webSocketConstructor = ws;
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle({ client: pool });
```

**Alternative drivers for Neon:**

node-postgres (for serverful environments):
```typescript
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle({ client: pool });
```

postgres.js (for serverful environments):
```typescript
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
const queryClient = postgres(process.env.DATABASE_URL);
const db = drizzle({ client: queryClient });
```

**Prerequisites:** Neon serverless database account, Neon serverless driver, understanding of database connection basics with Drizzle, familiarity with PostgreSQL drivers.

### connect-nile
Connect to Nile (multi-tenant PostgreSQL) using any Drizzle PostgreSQL driver; set tenant context via `nile.tenant_id` in transactions to isolate queries per tenant, optionally using AsyncLocalStorage middleware.

## Drizzle with Nile Database

Nile is PostgreSQL re-engineered for multi-tenant applications. Use any Drizzle PostgreSQL driver with Nile; examples use `node-postgres`.

### Installation
```
npm install drizzle-orm postgres
npm install -D drizzle-kit
```

### Basic Connection
```typescript
import { drizzle } from 'drizzle-orm/node-postgres'
const db = drizzle(process.env.NILEDB_URL);
const response = await db.select().from(...);
```

Or with explicit Pool:
```typescript
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle({ client: pool });
```

### Virtual Tenant Databases

Nile provides virtual tenant databases. When you set tenant context, queries automatically apply only to that tenant's data (e.g., `select * from table` returns only that tenant's records).

Set tenant context by wrapping queries in a transaction that sets `nile.tenant_id`:

```typescript
import { drizzle } from 'drizzle-orm/node-postgres';
import { todosTable } from "./db/schema";
import { sql } from 'drizzle-orm';

const db = drizzle(process.env.NILEDB_URL);

function tenantDB<T>(tenantId: string, cb: (tx: any) => T | Promise<T>): Promise<T> {
  return db.transaction(async (tx) => {
    if (tenantId) {
      await tx.execute(sql`set local nile.tenant_id = '${sql.raw(tenantId)}'`);
    }
    return cb(tx);
  }) as Promise<T>;
}

const tenantId = '01943e56-16df-754f-a7b6-6234c368b400'
const response = await tenantDB(tenantId, async (tx) => {
    return await tx.select().from(todosTable);
});
```

### AsyncLocalStorage Pattern

For web frameworks supporting it, use AsyncLocalStorage to store tenant ID in middleware:

```typescript
import { drizzle } from 'drizzle-orm/node-postgres';
import { sql } from "drizzle-orm";
import { AsyncLocalStorage } from "async_hooks";

export const db = drizzle(process.env.NILEDB_URL);
export const tenantContext = new AsyncLocalStorage<string | undefined>();

export function tenantDB<T>(cb: (tx: any) => T | Promise<T>): Promise<T> {
  return db.transaction(async (tx) => {
    const tenantId = tenantContext.getStore();
    if (tenantId) {
      await tx.execute(sql`set local nile.tenant_id = '${sql.raw(tenantId)}'`);
    }
    return cb(tx);
  }) as Promise<T>;
}
```

Middleware setup:
```typescript
app.use("/api/tenants/:tenantId/*", async (c, next) => {
  const tenantId = c.req.param("tenantId");
  return tenantContext.run(tenantId, () => next());
});

app.get("/api/tenants/:tenantId/todos", async (c) => {
    const todos = await tenantDB(async (tx) => {
      return await tx.select().from(todoSchema);
    });
    return c.json(todos);
});
```

### op_sqlite_integration
Connect Drizzle to OP SQLite in Expo/React Native with babel plugin for SQL migration bundling; use useMigrations hook to run migrations on app startup.

## Setup

Install dependencies:
```
npm install drizzle-orm @op-engineering/op-sqlite -D drizzle-kit
```

Initialize database and Drizzle:
```ts
import { drizzle } from "drizzle-orm/op-sqlite";
import { open } from '@op-engineering/op-sqlite';

const opsqlite = open({ name: 'myDB' });
const db = drizzle(opsqlite);

await db.select().from(users);
```

## Migrations Setup

OP SQLite requires SQL migrations to be bundled into the app. Follow these steps:

1. Install babel plugin for inlining SQL files:
```
npm install babel-plugin-inline-import
```

2. Update `babel.config.js`:
```js
module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    ['inline-import', { extensions: ['.sql'] }],
  ],
};
```

3. Update `metro.config.js`:
```js
const { getDefaultConfig } = require('@react-native/metro-config');
const config = getDefaultConfig(__dirname);
config.resolver.sourceExts.push('sql');
module.exports = config;
```

4. Configure `drizzle.config.ts` with `dialect: 'sqlite'` and `driver: 'expo'`:
```ts
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './db/schema.ts',
  out: './drizzle',
  dialect: 'sqlite',
  driver: 'expo',
});
```

5. Generate migrations:
```bash
npx drizzle-kit generate
```

6. Run migrations in your Expo/React Native app using the `useMigrations` hook:
```ts
import { drizzle } from "drizzle-orm/op-sqlite";
import { open } from '@op-engineering/op-sqlite';
import { useMigrations } from 'drizzle-orm/op-sqlite/migrator';
import migrations from './drizzle/migrations';

const opsqliteDb = open({ name: 'myDB' });
const db = drizzle(opsqliteDb);

export default function App() {
  const { success, error } = useMigrations(db, migrations);

  if (error) {
    return <View><Text>Migration error: {error.message}</Text></View>;
  }

  if (!success) {
    return <View><Text>Migration is in progress...</Text></View>;
  }

  return ...your application component;
}
```

### database-connection
Initialize Drizzle with driver-specific imports (node-postgres, neon-http, vercel-postgres, planetscale, d1, bun-sqlite, expo-sqlite, etc.) and connection URL; access underlying driver via db.$client.

## Database Connection Overview

Drizzle ORM executes SQL queries through database drivers. The core pattern is:
1. Import a driver-specific drizzle function
2. Initialize with connection parameters
3. Execute queries through the db instance

### Basic Setup
```ts
import { drizzle } from "drizzle-orm/node-postgres"
const db = drizzle(process.env.DATABASE_URL);
const usersCount = await db.$count(users);
```

The drizzle instance translates ORM queries into SQL, which the driver sends to the database and returns results.

### Accessing the Underlying Driver
Access the native driver client via `db.$client`:
```ts
const pool = db.$client;
```

This is equivalent to manually creating a driver instance:
```ts
import { Pool } from "pg";
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle({ client: pool });
```

### Supported Drivers

**PostgreSQL drivers:**
- node-postgres (standard)
- Neon HTTP
- Neon with websockets
- Vercel Postgres
- Supabase
- Xata
- PGLite

**MySQL drivers:**
- MySQL
- PlanetScale HTTP
- TiDB

**SQLite drivers:**
- SQLite
- Turso Cloud
- Turso Database
- Cloudflare D1
- Bun SQLite
- SQLite Cloud

**Native SQLite (runtime-specific):**
- Expo SQLite
- OP SQLite
- React Native SQLite

**Other:**
- Drizzle Proxy

### Edge/Serverless Runtime Support
Drizzle is natively compatible with edge and serverless runtimes. Examples:

```ts
// Neon HTTP
import { drizzle } from "drizzle-orm/neon-http";
const db = drizzle(process.env.DATABASE_URL);

// Vercel Postgres
import { drizzle } from "drizzle-orm/vercel-postgres";
const db = drizzle();

// PlanetScale HTTP
import { drizzle } from "drizzle-orm/planetscale";
const db = drizzle(process.env.DATABASE_URL);

// Cloudflare D1
import { drizzle } from "drizzle-orm/d1";
const db = drizzle({ connection: env.DB });

// Bun SQLite
import { drizzle } from "drizzle-orm/bun-sqlite";
const db = drizzle("./sqlite.db");

// Expo SQLite
import { drizzle } from "drizzle-orm/expo-sqlite";
import { openDatabaseSync } from "expo-sqlite";
const expo = openDatabaseSync("db.db");
const db = drizzle(expo);
```

### Database Connection URL Format
```
postgresql://role:password@hostname/database
```
Example: `postgresql://alex:AbC123dEf@ep-cool-darkness-123456.us-east-2.aws.neon.tech/dbname`

### connect-pglite
WASM Postgres for browser/Node.js/Bun with drizzle-orm; supports in-memory or persistent storage via filesystem/indexedDB.

## PGlite Integration

PGlite is a WASM-based Postgres build packaged as a TypeScript client library that runs Postgres in browser, Node.js, and Bun without external dependencies. It's 2.6mb gzipped and uses native WASM instead of a Linux VM. Supports ephemeral in-memory databases or persistent storage via filesystem (Node/Bun) or indexedDB (browser).

### Installation

```
npm install drizzle-orm @electric-sql/pglite
npm install -D drizzle-kit
```

### Usage

**In-memory database:**
```typescript
import { drizzle } from 'drizzle-orm/pglite';
const db = drizzle();
await db.select().from(...);
```

**With filesystem persistence:**
```typescript
import { drizzle } from 'drizzle-orm/pglite';
const db = drizzle('path-to-dir');
await db.select().from(...);
```

**With advanced configuration:**
```typescript
import { drizzle } from 'drizzle-orm/pglite';
const db = drizzle({ connection: { dataDir: 'path-to-dir' }});
await db.select().from(...);
```

**Using existing PGlite driver instance:**
```typescript
import { PGlite } from '@electric-sql/pglite';
import { drizzle } from 'drizzle-orm/pglite';
const client = new PGlite();
const db = drizzle({ client });
await db.select().from(users);
```

### connect-planetscale
HTTP access to PlanetScale serverless MySQL via drizzle-orm/planetscale-serverless package; install @planetscale/database, initialize with credentials or existing client.

## PlanetScale Integration

PlanetScale is a serverless MySQL platform. Drizzle ORM provides access to PlanetScale via HTTP through the `@planetscale/database` driver using the `drizzle-orm/planetscale-serverless` package, suitable for both serverless and traditional server environments. TCP access via `mysql2` driver is also available.

### Installation
```
npm install drizzle-orm @planetscale/database
npm install -D drizzle-kit
```

### Basic Setup
Initialize the driver with connection credentials:
```typescript
import { drizzle } from "drizzle-orm/planetscale-serverless";

const db = drizzle({ connection: {
  host: process.env["DATABASE_HOST"],
  username: process.env["DATABASE_USERNAME"],
  password: process.env["DATABASE_PASSWORD"],
}});

const response = await db.select().from(...)
```

### Using Existing Client
If you have an existing PlanetScale client instance, pass it to drizzle:
```typescript
import { drizzle } from "drizzle-orm/planetscale-serverless";
import { Client } from "@planetscale/database";

const client = new Client({
  host: process.env["DATABASE_HOST"],
  username: process.env["DATABASE_USERNAME"],
  password: process.env["DATABASE_PASSWORD"],
});

const db = drizzle({ client });
```

Prerequisites: familiarity with database connection basics, PlanetScale account and documentation, and Drizzle MySQL drivers.

### connect-prisma-postgres
Connect to Prisma Postgres serverless database using node-postgres or postgres.js driver with connection string.

## Connecting to Prisma Postgres

Prisma Postgres is a serverless PostgreSQL database built on unikernels with a large free tier, operation-based pricing, and no cold starts.

### Supported Drivers

Connect using either `node-postgres` (pg) or `postgres.js` drivers.

### Installation

**For node-postgres (pg):**
```
npm install drizzle-orm pg
npm install -D drizzle-kit
```

**For postgres.js:**
```
npm install drizzle-orm postgres
npm install -D drizzle-kit
```

### Setup and Query

**Using node-postgres (pg):**
```typescript
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});
const db = drizzle({ client: pool });

const result = await db.execute('select 1');
```

**Using postgres.js:**
```typescript
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

const queryClient = postgres(process.env.DATABASE_URL);
const db = drizzle({ client: queryClient });

const result = await db.execute('select 1');
```

### Note

Prisma Postgres also offers a serverless driver that will be supported by Drizzle ORM in the future.

### react-native-sqlite-setup
Use Expo SQLite for React Native; react-native-sqlite-storage lacks Hermes runtime support.

To use Drizzle ORM with React Native, use Expo SQLite. The popular react-native-sqlite-storage library does not support the Hermes JavaScript runtime, which is now the standard runtime for React Native and Expo by default. Expo SQLite is the recommended solution for React Native SQLite integration with Drizzle ORM.

### connect-sqlite-cloud
Connect Drizzle to SQLite Cloud via connection string or driver instance; install drizzle-orm@beta and @sqlitecloud/drivers.

## SQLite Cloud Connection Setup

SQLite Cloud is a managed, distributed relational database system built on SQLite. This page covers connecting Drizzle ORM to SQLite Cloud.

### Prerequisites
- Database connection basics with Drizzle
- SQLite Cloud database account
- SQLite Cloud JavaScript driver

### Installation
Install required packages:
```
drizzle-orm@beta @sqlitecloud/drivers
-D drizzle-kit@beta
```

### Basic Connection
Initialize the driver using a connection string:
```typescript
import { drizzle } from 'drizzle-orm/sqlite-cloud';

const db = drizzle(process.env.SQLITE_CLOUD_CONNECTION_STRING);
const result = await db.execute('select 1');
```

### Using Existing Driver Instance
If you have an existing SQLite Cloud driver instance, pass it to Drizzle:
```typescript
import { Database } from '@sqlitecloud/drivers';
import { drizzle } from 'drizzle-orm/sqlite-cloud';

const client = new Database(process.env.SQLITE_CLOUD_CONNECTION_STRING!);
const db = drizzle({ client });
const result = await db.execute('select 1');
```

Both approaches support executing queries through the initialized `db` instance.

### connect-supabase
Connect Drizzle to Supabase Postgres: install drizzle-orm and postgres, initialize with DATABASE_URL or custom client, disable prepare statements for Transaction pool mode.

## Connecting Drizzle to Supabase

Supabase is an open source Firebase alternative for building secure and performant Postgres backends with minimal configuration.

### Installation

Install required packages:
```
drizzle-orm postgres
-D drizzle-kit
```

### Basic Connection

Initialize the driver with your database URL:
```typescript
import { drizzle } from 'drizzle-orm/postgres-js'

const db = drizzle(process.env.DATABASE_URL);
const allUsers = await db.select().from(...);
```

### Using Existing Driver

Provide your own postgres client instance:
```typescript
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'

const client = postgres(process.env.DATABASE_URL)
const db = drizzle({ client });
const allUsers = await db.select().from(...);
```

### Connection Pooling Configuration

When using Supabase's Connection Pooler in "Transaction" pool mode, disable prepared statements since they are not supported:
```typescript
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'

const client = postgres(process.env.DATABASE_URL, { prepare: false })
const db = drizzle({ client });
const allUsers = await db.select().from(...);
```

Use the Connection Pooler for serverless environments and the Direct Connection for long-running servers.

### connect-tidb-serverless
Connect to TiDB Serverless via HTTP driver: install @tidbcloud/serverless, initialize with drizzle({ connection: { url } }) or pass existing client to drizzle({ client }).

## TiDB Serverless Integration

TiDB Serverless is a fully-managed, autonomous DBaaS with split-second cluster provisioning and consumption-based pricing. It is compatible with MySQL and provides an HTTP driver for edge environments, natively supported by Drizzle ORM.

### Installation

Install the required packages:
```
drizzle-orm @tidbcloud/serverless
-D drizzle-kit
```

### Basic Setup

Initialize the driver with connection URL:
```typescript
import { drizzle } from 'drizzle-orm/tidb-serverless';

const db = drizzle({ connection: { url: process.env.TIDB_URL }});
const response = await db.select().from(...)
```

### Using Existing Driver

If you have an existing TiDB Serverless driver instance, pass it to Drizzle:
```typescript
import { connect } from '@tidbcloud/serverless';
import { drizzle } from 'drizzle-orm/tidb-serverless';

const client = connect({ url: process.env.TIDB_URL });
const db = drizzle({ client });
```

### Prerequisites

- Database connection basics with Drizzle
- TiDB database account
- TiDB HTTP Driver
- Drizzle MySQL drivers knowledge (since TiDB is MySQL-compatible)

### connect-turso-database
Connect Turso SQLite database to Drizzle ORM via @tursodatabase/database driver; initialize with drizzle('sqlite.db') or pass existing Database instance to drizzle({ client }).

## Turso Database Integration

Turso is a small database designed to power applications in the AI age. It provides SQLite-compatible database functionality.

### Installation

Install the required packages:
```
drizzle-orm@beta @tursodatabase/database
-D drizzle-kit@beta
```

### Basic Setup

Initialize the driver and execute queries:

```typescript
import { drizzle } from 'drizzle-orm/tursodatabase/database';

const db = drizzle('sqlite.db');
const result = await db.execute('select 1');
```

### Using Existing Driver Instance

If you have an existing Turso driver instance, pass it to drizzle:

```typescript
import { Database } from '@tursodatabase/drivers';
import { drizzle } from 'drizzle-orm/tursodatabase/database';

const client = new Database('sqlite.db');
const db = drizzle({ client });
const result = await db.execute('select 1');
```

### Prerequisites

- Understanding of database connection basics with Drizzle
- Turso Database account and knowledge of its basics
- Turso Database JavaScript driver installed

### connect-turso
Connect Drizzle to Turso Cloud (libSQL edge SQLite): install @libsql/client, create client with URL and auth token, initialize drizzle with client or connection config.

## Turso Cloud Integration

Turso is a libSQL-powered edge SQLite database as a service. Drizzle ORM provides native support for the libSQL driver.

### Installation

Install required packages:
```
drizzle-orm @libsql/client
-D drizzle-kit
```

### Driver Initialization

Drizzle supports all `@libsql/client` driver variations. Initialize the driver by creating a client with your database URL and authentication token:

**Node.js environment:**
```typescript
import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';

const client = createClient({ 
  url: process.env.DATABASE_URL,
  authToken: process.env.DATABASE_AUTH_TOKEN
});

const db = drizzle({ client });
```

**Web environment:**
```typescript
import { drizzle } from 'drizzle-orm/libsql/web';
import { createClient } from '@libsql/client/web';

const client = createClient({ 
  url: process.env.DATABASE_URL,
  authToken: process.env.DATABASE_AUTH_TOKEN
});

const db = drizzle({ client });
```

Alternatively, pass connection config directly:
```typescript
import { drizzle } from 'drizzle-orm/libsql';
import * as s from 'drizzle-orm/sqlite-core';

const db = drizzle({ connection: {
  url: process.env.DATABASE_URL, 
  authToken: process.env.DATABASE_AUTH_TOKEN 
}});

const users = s.sqliteTable("users", {
  id: s.integer(),
  name: s.text(),
})

const result = await db.select().from(users);
```

Drizzle mirrors SQLite query methods: `all()`, `get()`, `values()`, and `run()`.

### connect-vercel-postgres
Connect Drizzle to Vercel Postgres using @vercel/postgres driver or postgres/pg with postgresql:// URLs; supports serverless via websockets and serverful via TCP.

## Vercel Postgres Integration

Vercel Postgres is a serverless SQL database designed to integrate with Vercel Functions. Drizzle ORM natively supports both the `@vercel/postgres` serverless driver via `drizzle-orm/vercel-postgres` package and traditional `postgres` or `pg` drivers for accessing Vercel Postgres through `postgresql://` connection strings.

### Installation

```
drizzle-orm @vercel/postgres
-D drizzle-kit
```

### Setup

1. Set up a Vercel Postgres project according to official Vercel documentation
2. Initialize the driver and execute queries

### Usage

**With @vercel/postgres (default):**
```typescript
import { drizzle } from 'drizzle-orm/vercel-postgres';

const db = drizzle();
const result = await db.execute('select 1');
```

**With existing @vercel/postgres driver instance:**
```typescript
import { sql } from '@vercel/postgres';
import { drizzle } from 'drizzle-orm/vercel-postgres';

const db = drizzle({ client: sql });
const result = await db.execute('select 1');
```

### Key Features

- `@vercel/postgres` supports both serverful and serverless environments (including Cloudflare Workers) via websockets when TCP is unavailable
- For serverful environments, you can use either `@vercel/postgres` or direct `postgresql://` access with `postgres` or `pg` drivers
- No configuration needed for default usage - `drizzle()` automatically connects using environment variables

### connect-xata
Connect to Xata PostgreSQL database using postgres driver; install drizzle-orm and postgres, initialize with DATABASE_URL or existing postgres client.

## Xata Integration

Xata is a PostgreSQL database platform with features like instant copy-on-write database branches, zero-downtime schema changes, data anonymization, AI-powered performance monitoring, and BYOC.

### Installation

Install required packages:
```
npm install drizzle-orm postgres
npm install -D drizzle-kit
```

### Basic Setup

Initialize the driver with your Xata database URL:
```typescript
import { drizzle } from 'drizzle-orm/postgres-js'

const db = drizzle(process.env.DATABASE_URL);
const allUsers = await db.select().from(...);
```

### Using Existing Driver

If you have an existing postgres driver instance, pass it to drizzle:
```typescript
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'

const client = postgres(process.env.DATABASE_URL)
const db = drizzle({ client });
const allUsers = await db.select().from(...);
```

Xata uses the standard PostgreSQL driver, so all PostgreSQL documentation applies. See official Xata + Drizzle documentation for additional details.

### custom-types
Define custom database types with TypeScript type safety using `customType` function with `dataType()`, optional `toDriver()` and `fromDriver()` mapping functions, and generic `CustomTypeValues` for data/driverData/config types.

## Defining Custom Types

Custom types in Drizzle ORM are created using the `customType` function, which allows you to define database-specific data types with TypeScript type safety.

### Core Concept

The `customType` function accepts a generic type parameter `CustomTypeValues` with the following properties:
- `data`: The TypeScript type for the column (e.g., `string`, `number`, `boolean`, `Date`)
- `driverData` (optional): The type the database driver uses internally
- `config` (optional): Configuration object type for parameterized data types
- `notNull` (optional): Set to `true` if the type should be `notNull` by default
- `default` (optional): Set to `true` if the type has a default value by default

### CustomTypeParams Interface

The configuration object passed to `customType` implements `CustomTypeParams<T>`:

- `dataType(config?)`: Required function returning the SQL data type string. Can accept config for parameterized types like `varchar(256)` or `numeric(2,3)`.
- `toDriver(value)`: Optional function mapping TypeScript value to driver format (e.g., object to JSON string).
- `fromDriver(value)`: Optional function mapping driver value back to TypeScript type (e.g., string to Date).

### PostgreSQL Examples

**Serial** - Auto-incrementing integer:
```typescript
const customSerial = customType<{ data: number; notNull: true; default: true }>({
  dataType() { return 'serial'; }
});
```

**Text** - String type:
```typescript
const customText = customType<{ data: string }>({
  dataType() { return 'text'; }
});
```

**Boolean**:
```typescript
const customBoolean = customType<{ data: boolean }>({
  dataType() { return 'boolean'; }
});
```

**JSONB** - JSON with type-generic support:
```typescript
const customJsonb = <TData>(name: string) =>
  customType<{ data: TData; driverData: string }>({
    dataType() { return 'jsonb'; },
    toDriver(value: TData): string { return JSON.stringify(value); }
  })(name);
```

**Timestamp** - With timezone and precision config:
```typescript
const customTimestamp = customType<{
  data: Date;
  driverData: string;
  config: { withTimezone: boolean; precision?: number };
}>({
  dataType(config) {
    const precision = typeof config.precision !== 'undefined' ? ` (${config.precision})` : '';
    return `timestamp${precision}${config.withTimezone ? ' with time zone' : ''}`;
  },
  fromDriver(value: string): Date { return new Date(value); }
});
```

### MySQL Examples

**Int** - Integer type:
```typescript
const customInt = customType<{ data: number; notNull: false; default: false }>({
  dataType() { return 'int'; }
});
```

**Boolean** - With driver mapping (MySQL returns 0/1):
```typescript
const customBoolean = customType<{ data: boolean }>({
  dataType() { return 'boolean'; },
  fromDriver(value) { return typeof value === 'boolean' ? value : value === 1; }
});
```

**JSON** - Type-generic JSON:
```typescript
const customJson = <TData>(name: string) =>
  customType<{ data: TData; driverData: string }>({
    dataType() { return 'json'; },
    toDriver(value: TData): string { return JSON.stringify(value); }
  })(name);
```

**Timestamp** - With fractional seconds precision (fsp):
```typescript
const customTimestamp = customType<{ data: Date; driverData: string; config: { fsp: number } }>({
  dataType(config) {
    const precision = typeof config.fsp !== 'undefined' ? ` (${config.fsp})` : '';
    return `timestamp${precision}`;
  },
  fromDriver(value: string): Date { return new Date(value); }
});
```

### Usage in Table Definitions

Custom types are used like built-in types:

```typescript
const usersTable = pgTable('users', {
  id: customSerial('id').primaryKey(),
  name: customText('name').notNull(),
  verified: customBoolean('verified').notNull().default(false),
  jsonb: customJsonb<string[]>('jsonb'),
  createdAt: customTimestamp('created_at', { withTimezone: true }).notNull().default(sql`now()`)
});
```

```typescript
const usersTable = mysqlTable('userstest', {
  id: customInt('id').primaryKey(),
  name: customText('name').notNull(),
  verified: customBoolean('verified').notNull().default(false),
  jsonb: customJson<string[]>('jsonb'),
  createdAt: customTimestamp('created_at', { fsp: 2 }).notNull().default(sql`now()`)
});
```

### queries_and_crud_operations
SQL-like and relational query APIs with composable filters, subqueries, and nested data fetching.

Drizzle provides two complementary approaches for querying databases:

**SQL-like Syntax**: Mirrors standard SQL with minimal learning curve. Supports select, insert, update, delete, joins, aliases, WITH clauses, subqueries, and prepared statements. Examples:
- `db.select().from(posts).leftJoin(comments, eq(posts.id, comments.post_id)).where(eq(posts.id, 10))`
- `db.insert(users).values({ email: 'user@gmail.com' })`
- `db.update(users).set({ email: 'user@gmail.com' }).where(eq(users.id, 1))`
- `db.delete(users).where(eq(users.id, 1))`

**Relational Queries API**: Fetches nested relational data efficiently without manual joins or data mapping. Always generates exactly one SQL query, suitable for serverless databases. Example:
- `db.query.users.findMany({ with: { posts: true } })`

**Advanced Composition**: Queries support flexible composition patterns:
- Build WHERE filters independently: `const filters: SQL[] = []; if (name) filters.push(ilike(products.name, name)); db.select().from(products).where(and(...filters))`
- Separate subqueries into variables and reuse them in main queries
- Compose conditional statements and partitioned logic separately

Both approaches coexist - use SQL-like syntax for full SQL control or relational queries for convenience with nested data.

### delete
Delete rows with optional WHERE, LIMIT, ORDER BY; return deleted rows (PostgreSQL/SQLite); support CTEs via WITH clause.

## Delete Operations

Delete all rows from a table:
```typescript
await db.delete(users);
```

Delete with WHERE conditions:
```typescript
await db.delete(users).where(eq(users.name, 'Dan'));
```

### Limit
Supported in MySQL, SQLite, SingleStore (not PostgreSQL). Add a limit clause to restrict the number of deleted rows:
```typescript
await db.delete(users).where(eq(users.name, 'Dan')).limit(2);
```

### Order By
Sort deleted rows by specified fields before deletion. Supports ascending (asc) and descending (desc) order, and multiple fields:
```typescript
import { asc, desc } from 'drizzle-orm';

await db.delete(users).where(eq(users.name, 'Dan')).orderBy(users.name);
await db.delete(users).where(eq(users.name, 'Dan')).orderBy(desc(users.name));
await db.delete(users).where(eq(users.name, 'Dan')).orderBy(users.name, users.name2);
await db.delete(users).where(eq(users.name, 'Dan')).orderBy(asc(users.name), desc(users.name2));
```

### Delete with Return
Supported in PostgreSQL and SQLite (not MySQL or SingleStore). Retrieve deleted rows:
```typescript
const deletedUser = await db.delete(users)
  .where(eq(users.name, 'Dan'))
  .returning();

// Partial return - select specific fields
const deletedUserIds = await db.delete(users)
  .where(eq(users.name, 'Dan'))
  .returning({ deletedId: users.id });
```

### WITH DELETE Clause
Use Common Table Expressions (CTEs) to simplify complex delete queries:
```typescript
const averageAmount = db.$with('average_amount').as(
  db.select({ value: sql`avg(${orders.amount})`.as('value') }).from(orders)
);

const result = await db
	.with(averageAmount)
	.delete(orders)
	.where(gt(orders.amount, sql`(select * from ${averageAmount})`))
	.returning({ id: orders.id });
```

### configuration_file
TypeScript/JavaScript config file for Drizzle Kit with dialect, schema paths, database credentials, filtering, migrations, introspection, role management, and command behavior options.

## Drizzle Kit Configuration File

Drizzle Kit uses TypeScript or JavaScript configuration files (typically `drizzle.config.ts`) to declare all configuration options. The config file is placed in the project root alongside `package.json`.

### Core Configuration Options

**`dialect`** (required)
- Specifies the database type: `postgresql`, `mysql`, `sqlite`, `turso`, or `singlestore`
- Used by commands: `generate`, `migrate`, `push`, `pull`, `check`, `up`

**`schema`** (required)
- Glob-based path to schema file(s) or folder(s)
- Accepts `string` or `string[]`
- Used by: `generate`, `push`

**`out`** (optional, default: `"drizzle"`)
- Output folder for SQL migration files, JSON snapshots, and generated schema
- Used by: `generate`, `migrate`, `push`, `pull`, `check`, `up`

**`driver`** (optional)
- Explicitly specify database driver when auto-detection isn't sufficient
- Examples: `pglite`, `d1-http`, `aws-data-api`
- Used by: `migrate`, `push`, `pull`

**`dbCredentials`** (required for most commands)
- Database connection configuration, varies by dialect:
  - PostgreSQL: `url` or `{host, port, user, password, database, ssl}`
  - MySQL: `url` or `{host, port, user, password, database, ssl}`
  - SQLite: `url` (`:memory:`, `sqlite.db`, or `file:sqlite.db`)
  - Turso: `url` and `authToken`
  - Cloudflare D1: `accountId`, `databaseId`, `token`
  - AWS Data API: `database`, `resourceArn`, `secretArn`
  - PGLite: `url` (folder path)

### Filtering and Schema Management

**`tablesFilter`** (optional)
- Glob-based filter for table names (e.g., `["users", "posts"]` or `"user*"`)
- Used by: `generate`, `push`, `pull`

**`schemaFilter`** (optional, default: `["public"]`)
- List of schemas to manage (PostgreSQL only)
- Used by: `push`, `pull`

**`extensionsFilters`** (optional, default: `[]`)
- List of database extensions to ignore (e.g., `["postgis"]`)
- Used by: `push`, `pull`

### Advanced Options

**`migrations`** (optional)
- Configure migration logging table and schema
- Default: `{ table: "__drizzle_migrations", schema: "drizzle" }`
- Options: `{ table: string, schema: string }`
- Used by: `migrate`

**`introspect`** (optional)
- Configuration for `drizzle-kit pull` command
- `casing`: `"preserve"` or `"camel"` (default: `"camel"`)
- Controls how column names are converted in generated code

**`entities`** (optional)
- Manage database entities like roles
- `roles`: `boolean | { provider: "neon" | "supabase", include: string[], exclude: string[] }`
- Default: `false`
- Used by: `push`, `pull`, `generate`

**`strict`** (optional, default: `false`)
- Require confirmation before running SQL statements in `push` command

**`verbose`** (optional, default: `true`)
- Print all SQL statements during `push` and `pull` commands

**`breakpoints`** (optional, default: `true`)
- Embed `--> statement-breakpoint` in generated migrations (required for MySQL and SQLite)

### Multiple Configuration Files

You can maintain separate config files for different environments or databases:
```bash
drizzle-kit generate --config=drizzle-dev.config.ts
drizzle-kit generate --config=drizzle-prod.config.ts
```

### Example Configurations

Basic PostgreSQL setup:
```ts
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/schema.ts",
  out: "./drizzle",
});
```

Extended configuration with multiple options:
```ts
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./drizzle",
  dialect: "postgresql",
  schema: "./src/schema.ts",
  driver: "pglite",
  dbCredentials: {
    url: "./database/",
  },
  extensionsFilters: ["postgis"],
  schemaFilter: "public",
  tablesFilter: "*",
  introspect: {
    casing: "camel",
  },
  migrations: {
    prefix: "timestamp",
    table: "__drizzle_migrations__",
    schema: "public",
  },
  entities: {
    roles: {
      provider: 'supabase',
      exclude: ['admin']
    }
  },
  breakpoints: true,
  strict: true,
  verbose: true,
});
```

Role management examples:
```ts
// Enable role management
export default defineConfig({
  entities: { roles: true }
});

// Exclude specific roles
export default defineConfig({
  entities: { roles: { exclude: ['admin'] } }
});

// Use provider presets (Neon/Supabase)
export default defineConfig({
  entities: { roles: { provider: 'neon' } }
});

// Combine provider with exclusions
export default defineConfig({
  entities: { roles: { provider: 'supabase', exclude: ['new_role'] } }
});
```

### check
Command to validate SQL migrations history consistency; requires dialect and database credentials via config file or CLI flags (--dialect, --out, --config).

## Purpose
`drizzle-kit check` validates consistency of generated SQL migrations history. Essential for team environments where multiple developers work on different branches and alter the database schema independently.

## Configuration
The command requires `dialect` and database connection credentials, provided via either `drizzle.config.ts` or CLI options.

**Via config file:**
```ts
// drizzle.config.ts
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
});
```
```shell
npx drizzle-kit check
```

**Via CLI:**
```shell
npx drizzle-kit check --dialect=postgresql
```

## Multiple Configuration Files
Support for multiple config files in a single project for different database stages or multiple databases:
```shell
npx drizzle-kit check --config=drizzle-dev.config.ts
npx drizzle-kit check --config=drizzle-prod.config.ts
```

## CLI Options
| Option | Required | Description |
|--------|----------|-------------|
| `dialect` | Yes | Database dialect: `postgresql`, `mysql`, or `sqlite` |
| `out` | No | Migrations folder path (default: `./drizzle`) |
| `config` | No | Configuration file path (default: `drizzle.config.ts`) |

**Examples:**
```shell
npx drizzle-kit check --dialect=postgresql
npx drizzle-kit check --dialect=postgresql --out=./migrations-folder
```

### export
Export command generates SQL DDL from Drizzle schema; requires dialect and schema path via config or CLI; supports glob patterns for multiple schema files and multiple config files per database stage.

## Purpose
`drizzle-kit export` generates SQL DDL representation of a Drizzle schema and outputs it to console. It's designed for the codebase-first approach to migrations, allowing external tools like Atlas to handle migrations.

## How it works
1. Reads Drizzle schema file(s) and creates a JSON snapshot
2. Generates SQL DDL statements based on the schema
3. Outputs SQL DDL to console

## Configuration
Requires `dialect` and `schema` options, configurable via `drizzle.config.ts` or CLI:

```ts
// drizzle.config.ts
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/schema.ts",
});
```

```shell
npx drizzle-kit export
# or with CLI options
npx drizzle-kit export --dialect=postgresql --schema=./src/schema.ts
```

## Schema paths
- Can use single or multiple schema files
- Specify paths via glob patterns in `schema` config option
- Example: `"./src/schema/**/*.ts"` matches all TypeScript files in schema directory

## Multiple config files
Support multiple config files for different database stages or databases:

```shell
npx drizzle-kit export --config=drizzle-dev.config.ts
npx drizzle-kit export --config=drizzle-prod.config.ts
```

## CLI options
- `--sql`: Generate SQL representation (default output format)
- `--config`: Path to config file (default: `drizzle.config.ts`)

## Example
Config file at `configs/drizzle.config.ts`:
```ts
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/schema.ts",
});
```

Schema at `src/schema.ts`:
```ts
import { pgTable, serial, text } from 'drizzle-orm/pg-core'

export const users = pgTable('users', {
	id: serial('id').primaryKey(),
	email: text('email').notNull(),
	name: text('name')
});
```

Running:
```shell
npx drizzle-kit export --config=./configs/drizzle.config.ts
```

Output:
```sql
CREATE TABLE "users" (
        "id" serial PRIMARY KEY NOT NULL,
        "email" text NOT NULL,
        "name" text
);
```

### generate
Generate SQL migrations from Drizzle schema by comparing current schema snapshot against previous migrations; supports custom names, multiple configs, and custom SQL migrations.

## Purpose
`drizzle-kit generate` creates SQL migrations from your Drizzle schema definitions. It compares your current schema against previous migration snapshots and generates the necessary SQL to transform the database.

## How It Works
1. Reads Drizzle schema file(s) and creates a JSON snapshot
2. Compares snapshot against the most recent migration snapshot
3. Generates SQL migration file based on differences
4. Saves `migration.sql` and `snapshot.json` with a timestamp

## Basic Usage
Requires `dialect` and `schema` configuration, provided via `drizzle.config.ts` or CLI:

```ts
// drizzle.config.ts
import { defineConfig } from "drizzle-kit";
export default defineConfig({
  dialect: "postgresql",
  schema: "./src/schema.ts",
});
```
```shell
npx drizzle-kit generate
```

Or via CLI:
```shell
npx drizzle-kit generate --dialect=postgresql --schema=./src/schema.ts
```

## Schema Files
- Can use single or multiple schema files
- Specify paths using glob patterns via `schema` config option
- Example: `"./src/**/*.schema.ts"` matches all schema files in src directory

## Custom Migration Names
```shell
npx drizzle-kit generate --name=init
```
Creates migration file like `0000_init.sql`

## Multiple Config Files
Support multiple config files for different database stages or databases:
```shell
npx drizzle-kit generate --config=drizzle-dev.config.ts
npx drizzle-kit generate --config=drizzle-prod.config.ts
```

## Custom Migrations
Generate empty migration files for custom SQL or unsupported DDL operations:
```shell
drizzle-kit generate --custom --name=seed-users
```
Creates empty `0001_seed-users.sql` for manual SQL writing.

## Configuration Options
| Option | Required | Description |
|--------|----------|-------------|
| `dialect` | Yes | Database dialect (postgresql, mysql, sqlite, etc.) |
| `schema` | Yes | Path to schema file(s) or folder with glob patterns |
| `out` | No | Migrations output folder, default `./drizzle` |
| `config` | No | Config file path, default `drizzle.config.ts` |
| `breakpoints` | No | SQL statement breakpoints, default `true` |
| `custom` | No | Generate empty SQL for custom migration |
| `name` | No | Custom migration file name |

## Extended Example
Config file at `./configs/drizzle.config.ts`:
```ts
import { defineConfig } from "drizzle-kit";
export default defineConfig({
  dialect: "postgresql",
  schema: "./src/schema.ts",
  out: "./migrations",
});
```

Generate custom migration:
```shell
npx drizzle-kit generate --config=./configs/drizzle.config.ts --name=seed-users --custom
```

Creates `./migrations/0001_seed-users.sql` with custom SQL content.

## Migration Application
Generated migrations can be applied using:
- `drizzle-kit migrate` command
- Drizzle ORM's `migrate()` function
- External tools like Bytebase
- Direct database execution

### migrate
Applies generated SQL migrations to database; reads migration files, checks migration log table, runs unapplied migrations; configure via drizzle.config.ts or CLI flags; tracks applied migrations in __drizzle_migrations table; supports multiple config files per project.

## Purpose
`drizzle-kit migrate` applies SQL migrations generated by `drizzle-kit generate`. It implements the code-first approach to managing migrations.

## How it works
1. Reads all `.sql` migration files from the migrations folder
2. Connects to the database and fetches entries from the drizzle migrations log table (`__drizzle_migrations`)
3. Determines which migrations haven't been applied yet
4. Runs new SQL migrations and logs them to the migrations table

## Configuration
Requires `dialect` and database connection credentials via either `drizzle.config.ts` or CLI options.

**Via config file:**
```ts
// drizzle.config.ts
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/schema.ts",
  dbCredentials: {
    url: "postgresql://user:password@host:port/dbname"
  },
});
```
```shell
npx drizzle-kit migrate
```

**Via CLI options:**
```shell
npx drizzle-kit migrate --dialect=postgresql --url=postgresql://user:password@host:port/dbname
```

## Migrations log table
Successfully applied migrations are stored in `__drizzle_migrations` table by default. Customize the table name and schema (PostgreSQL only) in config:
```ts
export default defineConfig({
  dialect: "postgresql",
  schema: "./src/schema.ts",
  dbCredentials: {
    url: "postgresql://user:password@host:port/dbname"
  },
  migrations: {
    table: 'my-migrations-table',
    schema: 'public', // PostgreSQL only, 'drizzle' by default
  },
});
```

## Multiple configuration files
Use `--config` flag to specify different config files for different database stages:
```shell
npx drizzle-kit migrate --config=drizzle-dev.config.ts
npx drizzle-kit migrate --config=drizzle-prod.config.ts
```

## Example workflow
1. Define schema in `src/schema.ts`:
```ts
import * as p from "drizzle-orm/pg-core";

export const users = p.pgTable("users", {
  id: p.serial().primaryKey(),
  name: p.text(),
})
```

2. Generate migration:
```shell
npx drizzle-kit generate --name=init
```
Creates `drizzle/0000_init.sql`:
```sql
CREATE TABLE "users"(
  id serial primary key,
  name text
)
```

3. Apply migration:
```shell
npx drizzle-kit migrate
```

### drizzle-kit_pull
Introspect existing database schema and generate TypeScript Drizzle schema file; supports multiple config files, special drivers (aws-data-api, pglite, d1-http), and filtering by tables/schemas/extensions.

## Purpose
`drizzle-kit pull` introspects an existing database schema and generates a TypeScript Drizzle schema file (`schema.ts`). It's designed for database-first migration approaches where the database schema is managed outside the TypeScript project or by external teams.

## How It Works
The command connects to your database, extracts the DDL (Data Definition Language), and generates a corresponding Drizzle schema file in the configured output folder (default: `./drizzle`).

## Configuration
Configuration can be provided via `drizzle.config.ts` or CLI options. Required parameters:
- `dialect`: Database type (postgresql, mysql, sqlite, etc.)
- Connection details: either `url` string or individual `user`, `password`, `host`, `port`, `database` parameters

Example config file:
```ts
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  dbCredentials: {
    url: "postgresql://user:password@host:port/dbname",
  },
});
```

CLI usage:
```shell
npx drizzle-kit pull
npx drizzle-kit pull --dialect=postgresql --url=postgresql://user:password@host:port/dbname
```

## Multiple Configuration Files
Support multiple config files for different database stages or environments:
```shell
npx drizzle-kit pull --config=drizzle-dev.config.ts
npx drizzle-kit pull --config=drizzle-prod.config.ts
```

## Database Drivers
Drizzle Kit automatically detects available drivers based on dialect. For special drivers (aws-data-api, pglite, d1-http), explicitly specify the `driver` parameter:

```ts
export default defineConfig({
  dialect: "postgresql",
  driver: "aws-data-api",
  dbCredentials: {
    database: "database",
    resourceArn: "resourceArn",
    secretArn: "secretArn",
  },
});
```

Note: Expo SQLite and OP SQLite (on-device databases) cannot be pulled; use embedded migrations instead.

## Filtering Tables, Schemas, and Extensions
Control which database objects are introspected:
- `tablesFilter`: Glob-based table name filter (default: `"*"`)
- `schemaFilter`: Schema names to include (default: `["public"]`)
- `extensionsFilters`: List of extensions to ignore (default: `[]`)

Example:
```ts
export default defineConfig({
  dialect: "postgresql",
  extensionsFilters: ["postgis"],
  schemaFilter: ["public"],
  tablesFilter: ["*"],
});
```

## Configuration Options Reference
| Option | Required | Description |
|--------|----------|-------------|
| `dialect` | Yes | Database dialect (postgresql, mysql, sqlite, etc.) |
| `driver` | No | Driver exception (aws-data-api, pglite, d1-http) |
| `out` | No | Output folder path (default: `./drizzle`) |
| `url` | No | Database connection string |
| `user`, `password`, `host`, `port`, `database` | No | Individual connection parameters |
| `config` | No | Config file path (default: `drizzle.config.ts`) |
| `introspect-casing` | No | JS key naming strategy: `preserve` or `camel` |
| `tablesFilter` | No | Table name filter |
| `schemaFilter` | No | Schema filter (default: `["public"]`) |
| `extensionsFilters` | No | Extension filters |

### drizzle-kit-push
Push schema changes directly to database without SQL files; code-first migrations with config file or CLI options for dialect, schema paths, connection details, filtering, and approval modes.

## `drizzle-kit push` Command

Pushes schema and schema changes directly to the database without generating SQL files. Implements code-first migrations approach.

### How it works
1. Reads Drizzle schema file(s) and creates a JSON snapshot
2. Introspects current database schema
3. Generates SQL migrations based on differences
4. Applies migrations to the database

### Configuration
Requires `dialect`, path to `schema` file(s), and database connection details. Can be provided via `drizzle.config.ts` or CLI options.

**Config file example:**
```ts
// drizzle.config.ts
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/schema.ts",
  dbCredentials: {
    url: "postgresql://user:password@host:port/dbname",
  },
});
```

**CLI example:**
```shell
npx drizzle-kit push --dialect=postgresql --schema=./src/schema.ts --url=postgresql://user:password@host:port/dbname
```

### Schema files
- Can use single or multiple schema files
- Specify paths using glob patterns via `schema` option
- Example: `"./src/schema/**/*.ts"` or `["./src/schema.ts", "./src/auth/schema.ts"]`

### Multiple config files
Support multiple config files for different database stages or databases:
```shell
npx drizzle-kit push --config=drizzle-dev.config.ts
npx drizzle-kit push --config=drizzle-prod.config.ts
```

### Database drivers
Drizzle Kit automatically picks available driver based on `dialect`. For exceptions like `aws-data-api`, `pglight`, and `d1-http`, explicitly specify `driver` param.

**Note:** Expo SQLite and OP SQLite (on-device databases) don't support `push` - use embedded migrations instead.

### Filtering tables, schemas, and extensions
Configure what to manage:
- `tablesFilter`: glob-based table names filter, default `"*"`
- `schemaFilter`: schema names filter, default `["public"]`
- `extensionsFilters`: list of installed extensions to ignore, default `[]`

**Example:**
```ts
export default defineConfig({
  dialect: "postgresql",
  schema: "./src/schema.ts",
  dbCredentials: {
    url: "postgresql://user:password@host:port/dbname",
  },
  extensionsFilters: ["postgis"],
  schemaFilter: ["public"],
  tablesFilter: ["*"],
});
```

### CLI-only options
- `verbose`: print all SQL statements before execution
- `strict`: ask for approval before executing SQL statements
- `force`: auto-accept all data-loss statements

```shell
npx drizzle-kit push --strict --verbose --force
```

### All configuration options
| Option | Required | Description |
|--------|----------|-------------|
| `dialect` | yes | Database dialect (postgresql, mysql, sqlite, etc.) |
| `schema` | yes | Path to schema file(s) or folder with glob patterns |
| `driver` | | Driver exception (aws-data-api, pglight, d1-http) |
| `tablesFilter` | | Table name filter |
| `schemaFilter` | | Schema name filter, default `["public"]` |
| `extensionsFilters` | | Database extensions to ignore |
| `url` | | Database connection string |
| `user` | | Database user |
| `password` | | Database password |
| `host` | | Host |
| `port` | | Port |
| `database` | | Database name |
| `config` | | Config file path, default `drizzle.config.ts` |

**CLI examples:**
```shell
npx drizzle-kit push dialect=postgresql schema=src/schema.ts url=postgresql://user:password@host:port/dbname
npx drizzle-kit push dialect=postgresql schema=src/schema.ts driver=pglite url=database/
npx drizzle-kit push dialect=postgresql schema=src/schema.ts --tablesFilter='user*' --extensionsFilters=postgis url=postgresql://user:password@host:port/dbname
```

### Use case example
Define schema and push to database:

**drizzle.config.ts:**
```ts
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/schema.ts",
  dbCredentials: {
    url: "postgresql://user:password@host:port/dbname"
  },
});
```

**src/schema.ts:**
```ts
import * as p from "drizzle-orm/pg-core";

export const users = p.pgTable("users", {
  id: p.serial().primaryKey(),
  name: p.text(),
})
```

Run `npx drizzle-kit push` to generate and apply:
```sql
CREATE TABLE "users"(
  id serial primary key,
  name text
)
```

### Best practices
- Ideal for rapid prototyping and code-first development
- Works well with blue/green deployment strategy
- Suitable for serverless databases (Planetscale, Neon, Turso)
- Recommended for production applications

### studio
Local database browser server with configurable host/port, verbose logging, Safari/Brave support via mkcert, embeddable component for B2B, chrome extension for serverless databases, not open source.

## Overview
`drizzle-kit studio` command starts a local server for Drizzle Studio, a database browser hosted at `local.drizzle.studio`. It requires database connection credentials configured in `drizzle.config.ts`.

## Default Configuration
Starts on `127.0.0.1:4983` by default.

Example config:
```ts
// drizzle.config.ts
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  dbCredentials: {
    url: "postgresql://user:password@host:port/dbname"
  },
});
```

## CLI Options
Configure host and port via command-line flags:
```shell
npx drizzle-kit studio --port=3000
npx drizzle-kit studio --host=0.0.0.0
npx drizzle-kit studio --host=0.0.0.0 --port=3000
```

Enable SQL statement logging:
```shell
npx drizzle-kit studio --verbose
```

## Safari and Brave Support
These browsers block localhost access by default. Install mkcert and generate self-signed certificates:
1. Install mkcert following their documentation
2. Run `mkcert -install`
3. Restart `drizzle-kit studio`

## Embeddable Version
Drizzle Studio component is a framework-agnostic web component for embedding into UIs (React, Vue, Svelte, VanillaJS, etc). This is a B2B offering for businesses providing Database-as-a-SaaS or data-centric SaaS solutions. Used by platforms like Turso, Neon, Hydra, Nuxt Hub, and Deco.cx.

## Chrome Extension
Drizzle Studio chrome extension allows browsing PlanetScale, Cloudflare D1, and Vercel Postgres serverless databases directly in vendor admin panels.

## Limitations
- Hosted version is for local development only, not for remote deployment (VPS, etc)
- Alpha version of Drizzle Studio Gateway available for VPS deployment (contact via Twitter or Discord)

## Open Source Status
Drizzle ORM and Drizzle Kit are fully open source. Drizzle Studio is not open source - the hosted local version is free forever to enrich the ecosystem, but keeping it proprietary enables B2B offerings and monetization.

### drizzle-kit-up
Command to upgrade schema snapshots to newer versions; requires dialect and database credentials via config or CLI flags.

## Purpose
`drizzle-kit up` upgrades drizzle schema snapshots to a newer version. It's required when breaking changes are introduced to JSON snapshots and the internal version is updated.

## Configuration
The command requires `dialect` and database connection credentials, provided via `drizzle.config.ts` or CLI options.

**With config file:**
```ts
// drizzle.config.ts
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
});
```
```shell
npx drizzle-kit up
```

**As CLI options:**
```shell
npx drizzle-kit up --dialect=postgresql
```

## Multiple Configuration Files
Support for multiple config files in one project for different database stages or databases:
```shell
npx drizzle-kit migrate --config=drizzle-dev.config.ts
npx drizzle-kit migrate --config=drizzle-prod.config.ts
```

Project structure example:
```
📦 <project root>
 ├ 📂 drizzle
 ├ 📂 src
 ├ 📜 .env
 ├ 📜 drizzle-dev.config.ts
 ├ 📜 drizzle-prod.config.ts
 ├ 📜 package.json
 └ 📜 tsconfig.json
```

## CLI Options
| Option | Required | Description |
|--------|----------|-------------|
| `dialect` | yes | Database dialect: `postgresql`, `mysql`, or `sqlite` |
| `out` | no | Migrations folder, default: `./drizzle` |
| `config` | no | Configuration file path, default: `drizzle.config.ts` |

**Examples:**
```shell
npx drizzle-kit up --dialect=postgresql
npx drizzle-kit up --dialect=postgresql --out=./migrations-folder
```

### dynamic-query-building
Enable dynamic mode with `.$dynamic()` to invoke query builder methods multiple times; use dialect-specific generic types (PgSelect, MySqlSelect, SQLiteSelect) for functions that enhance queries dynamically.

## Dynamic Query Building

By default, Drizzle query builders enforce SQL semantics where most methods can only be invoked once. For example, you cannot call `.where()` multiple times on a SELECT statement:

```ts
const query = db
	.select()
	.from(users)
	.where(eq(users.id, 1))
	.where(eq(users.name, 'John')); // ❌ Type error
```

This restriction is useful for conventional query building but becomes problematic when building queries dynamically, such as in shared functions that enhance query builders.

### Enabling Dynamic Mode

Call `.$dynamic()` on a query builder to enable dynamic mode, which removes the restriction of invoking methods only once:

```ts
function withPagination<T extends PgSelect>(
	qb: T,
	page: number = 1,
	pageSize: number = 10,
) {
	return qb.limit(pageSize).offset((page - 1) * pageSize);
}

const query = db.select().from(users).where(eq(users.id, 1));
withPagination(query, 1); // ❌ Type error - not in dynamic mode

const dynamicQuery = query.$dynamic();
withPagination(dynamicQuery, 1); // ✅ OK
```

### Generic Query Builder Types

Dynamic query building uses generic types that can be used as type parameters to modify query builders. These types are specifically designed for dynamic mode and only work in that context:

**Postgres**: `PgSelect`, `PgSelectQueryBuilder`, `PgInsert`, `PgUpdate`, `PgDelete`

**MySQL**: `MySqlSelect`, `MySqlSelectQueryBuilder`, `MySqlInsert`, `MySqlUpdate`, `MySqlDelete`

**SQLite**: `SQLiteSelect`, `SQLiteSelectQueryBuilder`, `SQLiteInsert`, `SQLiteUpdate`, `SQLiteDelete`

Example with generic enhancement:

```ts
function withFriends<T extends PgSelect>(qb: T) {
	return qb.leftJoin(friends, eq(friends.userId, users.id));
}

let query = db.select().from(users).where(eq(users.id, 1)).$dynamic();
query = withFriends(query);
```

The `...QueryBuilder` types are for standalone query builder instances (created with `new QueryBuilder()`), but DB query builders are subclasses of them, so both can be used interchangeably.

### eslint-plugin
ESLint plugin with enforce-delete-with-where and enforce-update-with-where rules; supports drizzleObjectName config to target specific objects.

## ESLint Plugin for Drizzle

An ESLint plugin that provides rules for catching common mistakes during development that are difficult to enforce through TypeScript's type system.

### Installation

Install the plugin along with TypeScript ESLint dependencies:
```
eslint-plugin-drizzle
@typescript-eslint/eslint-plugin @typescript-eslint/parser
```

### Configuration

Add to `.eslintrc.yml`:
```yml
root: true
parser: '@typescript-eslint/parser'
parserOptions:
  project: './tsconfig.json'
plugins:
  - drizzle
rules:
  'drizzle/enforce-delete-with-where': "error"
  'drizzle/enforce-update-with-where': "error"
```

Use the `recommended` or `all` config (currently equivalent):
```yml
extends:
  - "plugin:drizzle/recommended"
```

### Rules

**enforce-delete-with-where**

Requires `.where()` clause on `.delete()` statements to prevent accidental deletion of all table rows.

Optional `drizzleObjectName` config accepts `string` or `string[]` to specify which objects trigger the rule. Without this, any `.delete()` call triggers it. With it, only delete calls on specified objects (like `db`) trigger the rule:

```yml
rules:
  'drizzle/enforce-delete-with-where':
    - "error"
    - drizzleObjectName: ["db"]
```

```ts
class MyClass {
  public delete() { return {} }
}

const myClassObj = new MyClass();
myClassObj.delete()  // OK - not triggered

const db = drizzle(...)
db.delete()  // ERROR - triggered
db.delete().where(...)  // OK
```

**enforce-update-with-where**

Requires `.where()` clause on `.update()` statements to prevent accidental updates to all table rows.

Same optional `drizzleObjectName` configuration as `enforce-delete-with-where`:

```yml
rules:
  'drizzle/enforce-update-with-where':
    - "error"
    - drizzleObjectName: ["db"]
```

```ts
class MyClass {
  public update() { return {} }
}

const myClassObj = new MyClass();
myClassObj.update()  // OK - not triggered

const db = drizzle(...)
db.update()  // ERROR - triggered
db.update().set({...}).where(...)  // OK
```

### faq
generate creates migrations, push syncs schema; PostgreSQL indexes with expressions need manual names, push can't detect expression/where/operator changes.

## generate vs push

`generate` creates SQL migration files with metadata for drizzle-kit or other migration tools. The generated migrations are not automatically applied to the database—you must apply them separately.

`push` syncs your schema directly with the database schema without generating migration files. Use only for local development and local databases due to safety concerns.

## PostgreSQL indexes limitations

### For both push and generate:
When using indexes with expressions, you must manually specify a name:
```ts
index().on(table.id, table.email) // auto-named, works
index('my_name').on(table.id, table.email) // works
index().on(sql`lower(${table.email})`) // error - must name it
index('my_name').on(sql`lower(${table.email})`) // works
```

### For push only:
Push won't generate statements if these index properties change in an existing index:
- expressions inside `.on()` and `.using()`
- `.where()` statements
- operator classes `.op()` on columns

Workaround: comment out the index, push, uncomment and modify, then push again.

The `generate` command has no such limitations—it detects changes to any index property.

### generated-columns
Generated columns: auto-computed DB columns from expressions. PostgreSQL (STORED only), MySQL/SQLite (STORED/VIRTUAL). API: `.generatedAlwaysAs(string|sql|callback)` with optional `{ mode }`. Limitations vary by DB for schema changes.

## Generated Columns

Generated columns are database columns whose values are automatically computed based on expressions involving other columns in the same table. They help ensure data consistency, simplify database design, and improve query performance.

### Types

**Virtual (non-persistent)**: Computed dynamically on each query, no storage space used.

**Stored (persistent)**: Computed during insert/update and stored in the database, can be indexed.

### Use Cases

- Deriving new data from existing columns
- Automating calculations to avoid manual updates
- Enforcing data integrity and consistency
- Simplifying application logic by keeping complex calculations in the database schema

### PostgreSQL

**Types**: STORED only

**Capabilities**:
- Precomputes complex expressions
- Supports indexing on generated columns

**Limitations**:
- Cannot specify default values
- Expressions cannot reference other generated columns or include subqueries
- Schema changes required to modify expressions
- Cannot use in primary keys, foreign keys, or unique constraints

**Drizzle API**: Use `.generatedAlwaysAs()` on any column type. Accepts expressions in three ways:

1. **String**: `text("gen_name").generatedAlwaysAs(\`hello world!\`)`
2. **SQL tag**: `text("gen_name").generatedAlwaysAs(sql\`hello "world"!\`)` - for escaping values
3. **Callback**: `text("gen_name").generatedAlwaysAs((): SQL => sql\`hi, ${test.name}!\`)` - for column references

**Example with full-text search**:
```typescript
const tsVector = customType<{ data: string }>({
  dataType() { return "tsvector"; }
});

export const test = pgTable("test", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  content: text("content"),
  contentSearch: tsVector("content_search", { dimensions: 3 })
    .generatedAlwaysAs((): SQL => sql`to_tsvector('english', ${test.content})`),
}, (t) => [index("idx_content_search").using("gin", t.contentSearch)]);
```

### MySQL

**Types**: STORED, VIRTUAL

**Capabilities**:
- Used in SELECT, INSERT, UPDATE, DELETE statements
- Both virtual and stored columns can be indexed
- Can specify NOT NULL and other constraints

**Limitations**:
- Cannot directly insert or update values in generated columns

**Drizzle API**: Same three expression formats as PostgreSQL. For MySQL, specify mode:

```typescript
export const users = mysqlTable("users", {
  name: text("first_name"),
  storedGenerated: text("stored_gen").generatedAlwaysAs(
    (): SQL => sql`${users.name} || 'hello'`,
    { mode: "stored" }
  ),
  virtualGenerated: text("virtual_gen").generatedAlwaysAs(
    (): SQL => sql`${users.name} || 'hello'`,
    { mode: "virtual" }
  ),
});
```

**Drizzle Kit limitations for `push` command**:
- Cannot change generated constraint expression and type - must drop column, push, then add with new expression
- `generate` command has no limitations

### SQLite

**Types**: STORED, VIRTUAL

**Capabilities**:
- Used in SELECT, INSERT, UPDATE, DELETE statements
- Both virtual and stored columns can be indexed
- Can specify NOT NULL and other constraints

**Limitations**:
- Cannot directly insert or update values in generated columns

**Drizzle API**: Same three expression formats. Specify mode like MySQL:

```typescript
export const users = sqliteTable("users", {
  id: int("id"),
  name: text("name"),
  storedGenerated: text("stored_gen").generatedAlwaysAs(
    (): SQL => sql`${users.name} || 'hello'`,
    { mode: "stored" }
  ),
  virtualGenerated: text("virtual_gen").generatedAlwaysAs(
    (): SQL => sql`${users.name} || 'hello'`,
    { mode: "virtual" }
  ),
});
```

**Drizzle Kit limitations for `push` and `generate` commands**:
- Cannot change stored generated expression in existing table - must delete and recreate table
- Cannot add stored generated expression to existing column - can only add virtual
- Cannot change stored generated expression - can only change virtual
- Cannot change from virtual to stored - can only change from stored to virtual

### Requirements

Requires `drizzle-orm@0.32.0` or higher and `drizzle-kit@0.23.0` or higher

### gel-setup
Install drizzle-orm and gel, initialize driver with connection string/options/client, execute queries via db.execute().

## Gel Integration Setup

Drizzle provides native support for Gel database connections through the `gel-js` client.

### Prerequisites
- Database connection basics with Drizzle
- gel-js basics

### Installation
Install `drizzle-orm`, `gel`, and `drizzle-kit` as dev dependency.

### Driver Initialization

**Basic initialization with connection string:**
```typescript
import { drizzle } from 'drizzle-orm/gel';
const db = drizzle(process.env.DATABASE_URL);
const result = await db.execute('select 1');
```

**With connection options:**
```typescript
import { drizzle } from "drizzle-orm/gel";
const db = drizzle({
  connection: {
    dsn: process.env.DATABASE_URL,
    tlsSecurity: "default",
  },
});
const result = await db.execute("select 1");
```

**With existing Gel client:**
```typescript
import { drizzle } from "drizzle-orm/gel";
import { createClient } from "gel";
const gelClient = createClient();
const db = drizzle({ client: gelClient });
const result = await db.execute('select 1');
```

All three approaches support executing raw SQL queries via `db.execute()`.

### mysql_setup
Install mysql2 and drizzle-orm, initialize drizzle with connection URL or existing mysql2 client/pool connection; use single client for migrations, either for queries.

## MySQL Setup with Drizzle ORM

Drizzle ORM supports MySQL through the `mysql2` driver, a high-performance MySQL client for Node.js.

### Installation
Install `drizzle-orm`, `mysql2`, and `drizzle-kit` (dev dependency):
```
npm install drizzle-orm mysql2
npm install -D drizzle-kit
```

### Basic Usage
Initialize the driver with a database URL:
```typescript
import { drizzle } from "drizzle-orm/mysql2";
const db = drizzle(process.env.DATABASE_URL);
const response = await db.select().from(...)
```

Or with explicit connection config:
```typescript
import { drizzle } from "drizzle-orm/mysql2";
const db = drizzle({ connection: { uri: process.env.DATABASE_URL } });
const response = await db.select().from(...)
```

### Using Existing Driver Connections

**Client connection** (single connection):
```typescript
import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";

const connection = await mysql.createConnection({
  host: "host",
  user: "user",
  database: "database",
});
const db = drizzle({ client: connection });
```

**Pool connection** (connection pool):
```typescript
import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";

const poolConnection = mysql.createPool({
  host: "host",
  user: "user",
  database: "database",
});
const db = drizzle({ client: poolConnection });
```

### Important Notes
- For DDL migrations using the built-in `migrate` function, use a single client connection
- For querying, you can use either client or pool connections based on your needs

### postgresql_setup
PostgreSQL driver setup for node-postgres and postgres.js with connection string, config object, or existing client initialization patterns.

## PostgreSQL Driver Support

Drizzle ORM provides native support for PostgreSQL through two drivers: `node-postgres` (pg) and `postgres.js`.

### Driver Differences

- **node-postgres**: Can install `pg-native` for ~10% performance boost. Supports per-query type parsers without global patching.
- **postgres.js**: Uses prepared statements by default, which may need to be disabled in AWS environments.

### node-postgres Setup

Install packages:
```
drizzle-orm pg
drizzle-kit @types/pg (dev)
```

Initialize with connection string:
```typescript
import { drizzle } from 'drizzle-orm/node-postgres';
const db = drizzle(process.env.DATABASE_URL);
const result = await db.execute('select 1');
```

Initialize with config options:
```typescript
import { drizzle } from 'drizzle-orm/node-postgres';
const db = drizzle({ 
  connection: { 
    connectionString: process.env.DATABASE_URL,
    ssl: true
  }
});
const result = await db.execute('select 1');
```

Initialize with existing Pool:
```typescript
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle({ client: pool });
const result = await db.execute('select 1');
```

### postgres.js Setup

Install packages:
```
drizzle-orm postgres
drizzle-kit (dev)
```

Initialize with connection string:
```typescript
import { drizzle } from 'drizzle-orm/postgres-js';
const db = drizzle(process.env.DATABASE_URL);
const result = await db.execute('select 1');
```

Initialize with config options:
```typescript
import { drizzle } from 'drizzle-orm/postgres-js';
const db = drizzle({ 
  connection: { 
    url: process.env.DATABASE_URL, 
    ssl: true 
  }
});
const result = await db.execute('select 1');
```

Initialize with existing client:
```typescript
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
const queryClient = postgres(process.env.DATABASE_URL);
const db = drizzle({ client: queryClient });
const result = await db.execute('select 1');
```

### singlestore_setup
SingleStore setup with mysql2 driver: install packages, initialize with `drizzle(url)` or pass existing connection, supports client/pool; limitations include no foreign keys, no nested transactions, no relational API, incomplete MySQL compatibility.

## Installation
Install `drizzle-orm`, `mysql2`, and `drizzle-kit` (dev dependency).

## Driver Initialization
Use `drizzle-orm/singlestore` package with `mysql2` driver.

Initialize with connection string:
```typescript
import { drizzle } from "drizzle-orm/singlestore";
const db = drizzle(process.env.DATABASE_URL);
```

Or with explicit config:
```typescript
const db = drizzle({ connection: { uri: process.env.DATABASE_URL } });
```

## Existing Driver Integration
Pass existing `mysql2` client or pool connection:
```typescript
import { drizzle } from "drizzle-orm/singlestore";
import mysql from "mysql2/promise";

const connection = await mysql.createConnection({ host: "host", user: "user", database: "database" });
const db = drizzle({ client: connection });
```

Or with pool:
```typescript
const poolConnection = mysql.createPool({ host: "host", user: "user", database: "database" });
const db = drizzle({ client: poolConnection });
```

Use single client connection for migrations with DDL. Use either client or pool for queries based on requirements.

## Limitations
- Serial column type only ensures uniqueness, not auto-increment behavior
- `ORDER BY` and `LIMIT` cannot be chained
- Foreign keys not supported
- `INTERSECT ALL` and `EXCEPT ALL` not supported
- Nested transactions not supported
- Only one `isolationLevel` supported
- FSP option in `DATE`, `TIMESTAMP`, `DATETIME` not supported
- Relational API not supported (pending SingleStore API development)
- Additional limitations due to incomplete MySQL compatibility

### sqlite_setup
Setup SQLite with libsql (local/Turso, more features) or better-sqlite3 (standard); install driver packages, import from drizzle-orm/[driver], initialize with URL or client instance.

## SQLite Driver Support

Drizzle ORM provides native support for SQLite through two drivers: `libsql` and `better-sqlite3`.

### libsql vs better-sqlite3

**libsql** is a fork of SQLite with additional features:
- Supports both local SQLite files and remote Turso databases
- More ALTER statements for schema management
- Native encryption at rest configuration
- Broader SQLite extension support

**better-sqlite3** is a standard SQLite driver with synchronous operations.

### libsql Setup

**Install:**
```
drizzle-orm @libsql/client
-D drizzle-kit
```

**Basic usage:**
```typescript
import { drizzle } from 'drizzle-orm/libsql';
const db = drizzle(process.env.DATABASE_URL);
const result = await db.execute('select 1');
```

**With connection options:**
```typescript
import { drizzle } from 'drizzle-orm/libsql';
const db = drizzle({ connection: { url: '', authToken: '' } });
const result = await db.execute('select 1');
```

**With explicit client:**
```typescript
import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
const client = createClient({ url: process.env.DATABASE_URL, authToken: process.env.DATABASE_AUTH_TOKEN });
const db = drizzle(client);
const result = await db.execute('select 1');
```

### better-sqlite3 Setup

**Install:**
```
drizzle-orm better-sqlite3
-D drizzle-kit @types/better-sqlite3
```

**Basic usage:**
```typescript
import { drizzle } from 'drizzle-orm/better-sqlite3';
const db = drizzle(process.env.DATABASE_URL);
const result = await db.execute('select 1');
```

**With connection options:**
```typescript
import { drizzle } from 'drizzle-orm/better-sqlite3';
const db = drizzle({ connection: { source: process.env.DATABASE_URL } });
const result = await db.execute('select 1');
```

**With existing driver instance:**
```typescript
import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
const sqlite = new Database('sqlite.db');
const db = drizzle({ client: sqlite });
const result = await db.execute('select 1');
```

### goodies
Type inference helpers, logging configuration, multi-project schema namespacing, SQL query inspection, raw SQL execution, standalone query builder, table introspection utilities, type-safe instanceof alternative, and mock driver for testing.

## Type API
Extract types from table schemas for select and insert queries using type helpers:
- `typeof users.$inferSelect` / `typeof users.$inferInsert`
- `typeof users._.$inferSelect` / `typeof users._.$inferInsert`
- `InferSelectModel<typeof users>` / `InferInsertModel<typeof users>`

Works across PostgreSQL, MySQL, SQLite, and SingleStore with database-specific table creators (pgTable, mysqlTable, sqliteTable, singlestoreTable).

## Logging
Enable query logging by passing `{ logger: true }` to drizzle initialization. Customize log destination with DefaultLogger and custom LogWriter implementation, or create a custom Logger class implementing the Logger interface with logQuery(query, params) method.

## Multi-project Schema
Use table creator APIs to customize table names for keeping multiple project schemas in one database:
- `pgTableCreator((name) => \`project1_${name}\`)`
- `mysqlTableCreator((name) => \`project1_${name}\`)`
- `sqliteTableCreator((name) => \`project1_${name}\`)`
- `singlestoreTableCreator((name) => \`project1_${name}\`)`

In drizzle-kit config, use `tablesFilter: ["project1_*"]` or multiple filters like `["project1_*", "project2_*"]`.

## Printing SQL Queries
Call `.toSQL()` on query builder to get generated SQL and parameters:
```ts
const query = db.select({ id: users.id, name: users.name }).from(users).groupBy(users.id).toSQL();
// Returns: { sql: '...', params: [] }
```

## Raw SQL Queries
Execute complex parametrized queries using `db.execute()` with sql template literals:
```ts
const statement = sql\`select * from ${users} where ${users.id} = ${userId}\`;
const res = await db.execute(statement);
```
SQLite has additional methods: `db.all()`, `db.get()`, `db.values()`, `db.run()`.

## Standalone Query Builder
Build queries without database instance using QueryBuilder from database-specific core modules:
```ts
import { QueryBuilder } from 'drizzle-orm/pg-core';
const qb = new QueryBuilder();
const query = qb.select().from(users).where(eq(users.name, 'Dan'));
const { sql, params } = query.toSQL();
```

## Get Typed Table Columns
Use `getTableColumns()` to get a typed columns map for selective column queries:
```ts
const { password, role, ...rest } = getTableColumns(user);
await db.select({ ...rest }).from(users);
```

## Get Table Information
Use `getTableConfig()` to retrieve table metadata:
```ts
const { columns, indexes, foreignKeys, checks, primaryKeys, name, schema } = getTableConfig(table);
```

## Type Checking with is()
Use `is()` function instead of `instanceof` to check Drizzle types:
```ts
import { Column, is } from 'drizzle-orm';
if (is(value, Column)) { /* value is Column */ }
```

## Mock Driver
Create mock database instances for testing without actual database connection:
```ts
import { drizzle } from "drizzle-orm/node-postgres";
const db = drizzle.mock();
// or with schema for types:
const db = drizzle.mock({ schema });
```

### graphql_integration
Auto-generate GraphQL server from Drizzle schema with buildSchema(), customize via entities object containing queries, mutations, types, and inputs.

## drizzle-graphql

Generate a GraphQL server from a Drizzle schema with `buildSchema()` in one line, then optionally customize it.

### Requirements
- drizzle-orm version 0.30.9 or later

### Quick Start

**Apollo Server setup:**
```ts
import { buildSchema } from 'drizzle-graphql';
import { drizzle } from 'drizzle-orm/...';
import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import * as dbSchema from './schema';

const db = drizzle({ client, schema: dbSchema });
const { schema } = buildSchema(db);
const server = new ApolloServer({ schema });
const { url } = await startStandaloneServer(server);
console.log(`🚀 Server ready at ${url}`);
```

**GraphQL Yoga setup:**
```ts
import { buildSchema } from 'drizzle-graphql';
import { drizzle } from 'drizzle-orm/...';
import { createYoga } from 'graphql-yoga';
import { createServer } from 'node:http';
import * as dbSchema from './schema';

const db = drizzle({ schema: dbSchema });
const { schema } = buildSchema(db);
const yoga = createYoga({ schema });
const server = createServer(yoga);
server.listen(4000, () => console.info('Server is running on http://localhost:4000/graphql'));
```

Both examples use the same Drizzle schema with users and posts tables with relations.

### Customization

`buildSchema()` returns both `schema` (ready-to-use GraphQL schema) and `entities` (for custom building).

Use `entities` to build a custom GraphQL schema with selective queries/mutations:
```ts
import { GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLSchema } from 'graphql';

const { entities } = buildSchema(db);

const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    fields: {
      users: entities.queries.users,
      customer: entities.queries.customersSingle,
      customUsers: {
        type: new GraphQLList(new GraphQLNonNull(entities.types.UsersItem)),
        args: {
          where: { type: entities.inputs.UsersFilters }
        },
        resolve: async (source, args, context, info) => {
          // Custom logic here
          return await db.select(schema.users).where()...
        },
      },
    },
  }),
  mutation: new GraphQLObjectType({
    name: 'Mutation',
    fields: entities.mutations,
  }),
  types: [...Object.values(entities.types), ...Object.values(entities.inputs)],
});
```

The `entities` object contains:
- `entities.queries` - auto-generated query fields
- `entities.mutations` - auto-generated mutation fields
- `entities.types` - GraphQL object types for tables
- `entities.inputs` - GraphQL input types for filters

`buildSchema()` uses standard GraphQL SDK, so output is compatible with any GraphQL library.

### indexes-constraints
SQL constraints (DEFAULT, NOT NULL, UNIQUE, CHECK, PRIMARY KEY, FOREIGN KEY) and indexes (index, uniqueIndex) with database-specific options and advanced parameters for PostgreSQL, MySQL, SQLite, SingleStore.

## Constraints

SQL constraints enforce rules on table columns to prevent invalid data and ensure data accuracy and reliability.

### Default
The `DEFAULT` clause specifies a default value for a column when no value is provided during INSERT. If no explicit DEFAULT is specified, the default is NULL. Default values can be constants or expressions.

Examples across databases:
- PostgreSQL: `.default(42)`, `.default(sql`'42'::integer`)`, `.defaultRandom()`, `.default(sql`gen_random_uuid()`)`
- MySQL: `.default(42)`, `.default(sql`cast("14:06:10" AS TIME)`)`
- SQLite: `.default(42)`, `.default(sql`(abs(42))`)`
- SingleStore: Same as MySQL

### Not Null
The `NOT NULL` constraint enforces that a column cannot accept NULL values. This ensures a field always contains a value, preventing inserts or updates without providing a value for that field.

Usage: `.notNull()` across all databases.

### Unique
The `UNIQUE` constraint ensures all values in a column are different. Both UNIQUE and PRIMARY KEY provide uniqueness guarantees. A PRIMARY KEY automatically has a UNIQUE constraint. You can have many UNIQUE constraints per table but only one PRIMARY KEY.

Single column: `.unique()` or `.unique('custom_name')`

Composite unique constraints:
```typescript
unique().on(t.id, t.name)
unique('custom_name').on(t.id, t.name)
```

PostgreSQL 15.0+ supports NULLS NOT DISTINCT:
```typescript
.unique("custom_name", { nulls: 'not distinct' })
unique().on(t.id).nullsNotDistinct()
```

### Check
The `CHECK` constraint limits the value range that can be placed in a column. Can be defined on a single column or on a table to limit values in certain columns based on values in other columns.

Example:
```typescript
check("age_check1", sql`${table.age} > 21`)
```

Supported in PostgreSQL, MySQL, SQLite. Not supported in SingleStore.

### Primary Key
The `PRIMARY KEY` constraint uniquely identifies each record in a table. Primary keys must contain UNIQUE values and cannot contain NULL values. A table can have only ONE primary key, which can consist of single or multiple columns.

Single column: `.primaryKey()`

Examples:
- PostgreSQL: `serial('id').primaryKey()`
- MySQL: `int("id").autoincrement().primaryKey()`
- SQLite: `integer("id").primaryKey()` or `integer("id").primaryKey({ autoIncrement: true })`

### Composite Primary Key
Composite primary keys uniquely identify records using multiple fields. Use the standalone `primaryKey` operator:

```typescript
primaryKey({ columns: [table.bookId, table.authorId] })
primaryKey({ name: 'custom_name', columns: [table.bookId, table.authorId] })
```

### Foreign Key
The `FOREIGN KEY` constraint prevents actions that would destroy links between tables. A foreign key is a field (or collection of fields) in one table that refers to the PRIMARY KEY in another table. The table with the foreign key is the child table; the table with the primary key is the parent table.

Single column foreign key (inline):
```typescript
authorId: integer("author_id").references(() => user.id)
```

Self-reference requires explicit return type or standalone operator:
```typescript
parentId: integer("parent_id").references((): AnyPgColumn => user.id)

// or
foreignKey({
  columns: [table.parentId],
  foreignColumns: [table.id],
  name: "custom_fk"
})
```

Multicolumn foreign keys use the standalone `foreignKey` operator:
```typescript
foreignKey({
  columns: [table.userFirstName, table.userLastName],
  foreignColumns: [user.firstName, user.lastName],
  name: "custom_fk"
})
```

Supported in PostgreSQL, MySQL, SQLite. Not supported in SingleStore.

## Indexes

Drizzle ORM provides API for both `index` and `uniqueIndex` declaration.

Basic usage:
```typescript
index("name_idx").on(table.name)
uniqueIndex("email_idx").on(table.email)
```

PostgreSQL (0.31.0+) supports advanced index parameters:
```typescript
index('name')
  .on(table.column1.asc(), table.column2.nullsFirst())
  .concurrently()
  .where(sql``)
  .with({ fillfactor: '70' })

index('name')
  .using('btree', table.column1.asc(), sql`lower(${table.column2})`, table.column1.op('text_ops'))
  .where(sql``)
  .with({ fillfactor: '70' })
```

MySQL supports:
```typescript
index("name")
  .on(table.name)
  .algorythm("default") // "default" | "copy" | "inplace"
  .using("btree") // "btree" | "hash"
  .lock("default") // "none" | "default" | "exclusive" | "shared"
```

SQLite supports:
```typescript
index("name")
  .on(table.name)
  .where(sql`...`)
```

Note: For drizzle-kit versions before 0.22.0 and drizzle-orm before 0.31.0, only `name` and `on()` parameters are supported. After these versions, all fields are supported.

### insert
INSERT operations: single/multiple rows, RETURNING (PostgreSQL/SQLite), $returningId (MySQL/SingleStore), ON CONFLICT DO NOTHING/UPDATE with targetWhere/setWhere, ON DUPLICATE KEY UPDATE, WITH clauses, INSERT ... SELECT.

## Insert Operations

### Insert Single Row
```typescript
await db.insert(users).values({ name: 'Andrew' });
```

Type inference for insert values:
```typescript
type NewUser = typeof users.$inferInsert;
const insertUser = async (user: NewUser) => {
  return db.insert(users).values(user);
}
```

### Insert Multiple Rows
```typescript
await db.insert(users).values([{ name: 'Andrew' }, { name: 'Dan' }]);
```

### Insert Returning (PostgreSQL, SQLite)
```typescript
await db.insert(users).values({ name: "Dan" }).returning();
await db.insert(users).values({ name: "Partial Dan" }).returning({ insertedId: users.id });
```

### Insert $returningId (MySQL, SingleStore)
MySQL doesn't support RETURNING, but Drizzle provides `$returningId()` for autoincrement primary keys:
```typescript
const result = await db.insert(usersTable).values([{ name: 'John' }, { name: 'John1' }]).$returningId();
// Returns: { id: number }[]
```

Works with custom primary keys using `$defaultFn`:
```typescript
const usersTableDefFn = mysqlTable('users_default_fn', {
  customId: varchar('id', { length: 256 }).primaryKey().$defaultFn(createId),
  name: text('name').notNull(),
});
const result = await db.insert(usersTableDefFn).values([{ name: 'John' }, { name: 'John1' }]).$returningId();
// Returns: { customId: string }[]
```

If no primary keys exist, returns `{}[]`.

### On Conflict Do Nothing (PostgreSQL, SQLite)
```typescript
await db.insert(users).values({ id: 1, name: 'John' }).onConflictDoNothing();
await db.insert(users).values({ id: 1, name: 'John' }).onConflictDoNothing({ target: users.id });
```

### On Conflict Do Update (PostgreSQL, SQLite)
```typescript
await db.insert(users)
  .values({ id: 1, name: 'Dan' })
  .onConflictDoUpdate({ target: users.id, set: { name: 'John' } });
```

With `where` clauses using `targetWhere` (for partial indexes) and `setWhere` (for update condition):
```typescript
await db.insert(employees)
  .values({ employeeId: 123, name: 'John Doe' })
  .onConflictDoUpdate({
    target: employees.employeeId,
    targetWhere: sql`name <> 'John Doe'`,
    set: { name: sql`excluded.name` }
  });

await db.insert(employees)
  .values({ employeeId: 123, name: 'John Doe' })
  .onConflictDoUpdate({
    target: employees.employeeId,
    set: { name: 'John Doe' },
    setWhere: sql`name <> 'John Doe'`
  });
```

Composite indexes/primary keys:
```typescript
await db.insert(users)
  .values({ firstName: 'John', lastName: 'Doe' })
  .onConflictDoUpdate({
    target: [users.firstName, users.lastName],
    set: { firstName: 'John1' }
  });
```

### On Duplicate Key Update (MySQL, SingleStore)
MySQL uses `ON DUPLICATE KEY UPDATE` instead of `ON CONFLICT`:
```typescript
await db.insert(users)
  .values({ id: 1, name: 'John' })
  .onDuplicateKeyUpdate({ set: { name: 'John' } });
```

To simulate "do nothing", set a column to itself:
```typescript
await db.insert(users)
  .values({ id: 1, name: 'John' })
  .onDuplicateKeyUpdate({ set: { id: sql`id` } });
```

### WITH Clause (CTE)
```typescript
const userCount = db.$with('user_count').as(
  db.select({ value: sql`count(*)`.as('value') }).from(users)
);

const result = await db.with(userCount)
  .insert(users)
  .values([
    { username: 'user1', admin: sql`((select * from ${userCount}) = 0)` }
  ])
  .returning({
    admin: users.admin
  });
```

### Insert Into ... Select
Three approaches to insert from SELECT:

**Query Builder:**
```typescript
const insertedEmployees = await db
  .insert(employees)
  .select(
    db.select({ name: users.name }).from(users).where(eq(users.role, 'employee'))
  )
  .returning({
    id: employees.id,
    name: employees.name
  });
```

**Callback:**
```typescript
await db.insert(employees).select(
  () => db.select({ name: users.name }).from(users).where(eq(users.role, 'employee'))
);
```

**SQL Template Tag:**
```typescript
await db.insert(employees).select(
  sql`select "users"."name" as "name" from "users" where "users"."role" = 'employee'`
);
```

**Important:** When using upsert clauses with INSERT ... SELECT, the SELECT must contain a WHERE clause (even `WHERE true`) to avoid parsing ambiguity with JOIN constraints.

### joins
SQL join types (INNER, LEFT, RIGHT, FULL, CROSS, LATERAL variants) with type-safe syntax, partial select with field-level type inference, table aliases for self-joins, and aggregation patterns for many-to-one/many-to-many relationships.

## Join Types

Drizzle ORM supports: `INNER JOIN [LATERAL]`, `FULL JOIN`, `LEFT JOIN [LATERAL]`, `RIGHT JOIN`, `CROSS JOIN [LATERAL]`.

### Left Join
Combines tables keeping all rows from the left table. Right table fields become nullable.
```typescript
const result = await db.select().from(users).leftJoin(pets, eq(users.id, pets.ownerId))
// Result: { user: {...}, pets: {...} | null }[]
```

### Left Join Lateral
Left join with a subquery that can reference columns from the left table.
```typescript
const subquery = db.select().from(pets).where(gte(users.age, 16)).as('userPets')
const result = await db.select().from(users).leftJoinLateral(subquery, sql`true`)
// Result: { user: {...}, userPets: {...} | null }[]
```

### Right Join
Keeps all rows from the right table. Left table fields become nullable.
```typescript
const result = await db.select().from(users).rightJoin(pets, eq(users.id, pets.ownerId))
// Result: { user: {...} | null, pets: {...} }[]
```

### Inner Join
Keeps only matching rows from both tables. No nullable fields.
```typescript
const result = await db.select().from(users).innerJoin(pets, eq(users.id, pets.ownerId))
// Result: { user: {...}, pets: {...} }[]
```

### Inner Join Lateral
Inner join with a subquery that can reference columns from the left table.
```typescript
const subquery = db.select().from(pets).where(gte(users.age, 16)).as('userPets')
const result = await db.select().from(users).innerJoinLateral(subquery, sql`true`)
// Result: { user: {...}, userPets: {...} }[]
```

### Full Join
Keeps all rows from both tables. Both sides can be nullable.
```typescript
const result = await db.select().from(users).fullJoin(pets, eq(users.id, pets.ownerId))
// Result: { user: {...} | null, pets: {...} | null }[]
```

### Cross Join
Cartesian product of both tables. No join condition needed.
```typescript
const result = await db.select().from(users).crossJoin(pets)
// Result: { user: {...}, pets: {...} }[]
```

### Cross Join Lateral
Cross join with a subquery that can reference columns from the left table.
```typescript
const subquery = db.select().from(pets).where(gte(users.age, 16)).as('userPets')
const result = await db.select().from(users).crossJoinLateral(subquery)
// Result: { user: {...}, userPets: {...} }[]
```

## Partial Select

Select specific fields instead of entire tables. Return type is automatically inferred based on selected fields.
```typescript
await db.select({
  userId: users.id,
  petId: pets.id,
}).from(users).leftJoin(pets, eq(users.id, pets.ownerId))
// Result: { userId: number, petId: number | null }[]
```

When using `sql` operator with partial selection, explicitly specify nullable types:
```typescript
const result = await db.select({
  userId: users.id,
  petId: pets.id,
  petName1: sql`upper(${pets.name})`,
  petName2: sql<string | null>`upper(${pets.name})`,
}).from(users).leftJoin(pets, eq(users.id, pets.ownerId))
// Result: { userId: number, petId: number | null, petName1: unknown, petName2: string | null }[]
```

Use nested select object syntax to make entire objects nullable instead of individual fields:
```typescript
await db.select({
  userId: users.id,
  userName: users.name,
  pet: {
    id: pets.id,
    name: pets.name,
    upperName: sql<string>`upper(${pets.name})`
  }
}).from(users).fullJoin(pets, eq(users.id, pets.ownerId))
// Result: { userId: number | null, userName: string | null, pet: {...} | null }[]
```

## Aliases & Self-joins

Use `alias()` to join a table to itself. Useful for hierarchical data like users with parents.
```typescript
import { alias } from 'drizzle-orm';
const parent = alias(user, "parent");
const result = db
  .select()
  .from(user)
  .leftJoin(parent, eq(parent.id, user.parentId));
// Result: { user: {...}, parent: {...} | null }[]
```

## Aggregating Results

Drizzle returns name-mapped results from the driver without modification. Aggregate many-to-one relationships using `reduce()`:
```typescript
type User = typeof users.$inferSelect;
type Pet = typeof pets.$inferSelect;

const rows = db.select({
    user: users,
    pet: pets,
  }).from(users).leftJoin(pets, eq(users.id, pets.ownerId)).all();

const result = rows.reduce<Record<number, { user: User; pets: Pet[] }>>(
  (acc, row) => {
    const user = row.user;
    const pet = row.pet;
    if (!acc[user.id]) {
      acc[user.id] = { user, pets: [] };
    }
    if (pet) {
      acc[user.id].pets.push(pet);
    }
    return acc;
  },
  {}
);
// Result: Record<number, { user: User; pets: Pet[] }>
```

## Many-to-One Example

```typescript
const cities = sqliteTable('cities', {
  id: integer('id').primaryKey(),
  name: text('name'),
});

const users = sqliteTable('users', {
  id: integer('id').primaryKey(),
  name: text('name'),
  cityId: integer('city_id').references(() => cities.id)
});

const result = db.select().from(cities).leftJoin(users, eq(cities.id, users.cityId)).all();
```

## Many-to-Many Example

```typescript
const users = sqliteTable('users', {
  id: integer('id').primaryKey(),
  name: text('name'),
});

const chatGroups = sqliteTable('chat_groups', {
  id: integer('id').primaryKey(),
  name: text('name'),
});

const usersToChatGroups = sqliteTable('usersToChatGroups', {
  userId: integer('user_id').notNull().references(() => users.id),
  groupId: integer('group_id').notNull().references(() => chatGroups.id),
});

db.select()
  .from(usersToChatGroups)
  .leftJoin(users, eq(usersToChatGroups.userId, users.id))
  .leftJoin(chatGroups, eq(usersToChatGroups.groupId, chatGroups.id))
  .where(eq(chatGroups.id, 1))
  .all();
```

### custom_migrations
Generate custom SQL migrations with `drizzle-kit generate --custom --name=<name>` for unsupported DDL and seeding; run with `drizzle-kit migrate`.

## Custom Migrations

Drizzle Kit allows you to generate empty migration files for writing custom SQL migrations. This is useful for DDL alterations not yet supported by Drizzle Kit or for data seeding operations.

### Generating Custom Migrations

Use the `drizzle-kit generate` command with the `--custom` flag:

```shell
drizzle-kit generate --custom --name=seed-users
```

This creates a new migration file in your drizzle directory with a sequential number prefix. For example, running the above command creates `0001_seed-users.sql` in the `drizzle/` folder.

### Example: Data Seeding

```sql
-- ./drizzle/0001_seed-users.sql

INSERT INTO "users" ("name") VALUES('Dan');
INSERT INTO "users" ("name") VALUES('Andrew');
INSERT INTO "users" ("name") VALUES('Dandrew');
```

Custom migration files are executed using the `drizzle-kit migrate` command, which runs all pending migrations in sequence.

### JavaScript and TypeScript Migrations

Support for running custom JavaScript and TypeScript migration/seeding scripts is planned for an upcoming release. Track the feature request on the GitHub discussions page.

### kit_overview
CLI tool for SQL migrations with commands for generating, applying, pushing, pulling, and introspecting schemas; configured via drizzle.config.ts with dialect and schema path.

**Drizzle Kit** is a CLI tool for managing SQL database migrations with Drizzle ORM.

## Installation
```
npm install -D drizzle-kit
```

## Core Commands

- **drizzle-kit generate**: Generates SQL migration files based on your Drizzle schema, either on initial declaration or subsequent changes
- **drizzle-kit migrate**: Applies generated SQL migration files to your database
- **drizzle-kit push**: Pushes your Drizzle schema directly to the database without generating migration files
- **drizzle-kit pull**: Introspects database schema, converts it to Drizzle schema format, and saves it to your codebase
- **drizzle-kit studio**: Connects to your database and spins up a proxy server for Drizzle Studio for convenient database browsing
- **drizzle-kit check**: Walks through all generated migrations and checks for race conditions/collisions
- **drizzle-kit up**: Upgrades snapshots of previously generated migrations

## Configuration

Drizzle Kit is configured via `drizzle.config.ts` file or CLI parameters. Minimum required configuration:

```ts
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/schema.ts",
});
```

Extended configuration example:
```ts
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./drizzle",
  dialect: "postgresql",
  schema: "./src/schema.ts",
  driver: "pglite",
  dbCredentials: {
    url: "./database/",
  },
  extensionsFilters: ["postgis"],
  schemaFilter: "public",
  tablesFilter: "*",
  introspect: {
    casing: "camel",
  },
  migrations: {
    prefix: "timestamp",
    table: "__drizzle_migrations__",
    schema: "public",
  },
  breakpoints: true,
  strict: true,
  verbose: true,
});
```

You can specify different config files via CLI for managing multiple database stages or environments:
```
drizzle-kit push --config=drizzle-dev.config.ts
drizzle-kit push --config=drizzle-prod.config.ts
```

Required configuration: SQL `dialect` and `schema` path must be provided for Drizzle Kit to generate migrations.

### migrations-fundamentals
Six migration strategies: pull database schema to TypeScript, push TypeScript schema directly to DB, generate SQL migrations for CLI or runtime application, or export SQL for external tools like Atlas.

## Database Migrations Fundamentals

SQL databases require strict schemas defined upfront. When schema changes are needed, they must be applied via migrations. Drizzle supports both database-first and codebase-first approaches.

**Database First vs Codebase First:**
- **Database First**: Database schema is source of truth. Manage schema directly on database or via migration tools, then pull schema to codebase.
- **Codebase First**: TypeScript/JavaScript schema in codebase is source of truth under version control. Declare schema in code, apply to database.

**Drizzle-kit** is a CLI tool that supports both approaches with commands: `drizzle-kit migrate`, `drizzle-kit generate`, `drizzle-kit push`, `drizzle-kit pull`.

**Six Migration Strategies:**

1. **Database First - Pull Schema**: Use `drizzle-kit pull` to pull database schema and generate TypeScript Drizzle schema file. Example: Pull existing database with users table → generates TypeScript schema with pgTable definition.

2. **Codebase First - Direct Push**: Use `drizzle-kit push` to push TypeScript schema directly to database without SQL files. Best for rapid prototyping. Example: Add `email: p.text().unique()` to schema → drizzle-kit push detects diff and applies `ALTER TABLE users ADD COLUMN email TEXT UNIQUE`.

3. **Codebase First - Generate & CLI Migrate**: Use `drizzle-kit generate` to create SQL migration files, then `drizzle-kit migrate` to apply them. Example: Generate creates `drizzle/20242409125510_premium_mister_fear/migration.sql` with CREATE TABLE statement → migrate command reads migration history from database and applies unapplied migrations.

4. **Codebase First - Generate & Runtime Migrate**: Use `drizzle-kit generate` to create SQL files, then apply during application runtime via `migrate(db)`. Used for monolithic apps with zero-downtime deployments and serverless deployments. Example: Call `await migrate(db)` in application startup code to apply pending migrations.

5. **Codebase First - Generate & External Tools**: Use `drizzle-kit generate` to create SQL files, then apply via external migration tools (Bytebase, Liquibase, Atlas, etc.) or directly to database. Example: Generate migration file, then run via Liquibase or direct SQL execution.

6. **Codebase First - Export & Atlas**: Use `drizzle-kit export` to output SQL representation of schema to console, then apply via Atlas or other external SQL tools. Example: Export generates CREATE TABLE statement → pipe to Atlas for application.

### operators
Comparison (eq, ne, gt, gte, lt, lte), existence (exists, notExists), null checks (isNull, isNotNull), array membership (inArray, notInArray), range (between, notBetween), string patterns (like, ilike, notIlike), logical (not, and, or), and PostgreSQL array operators (arrayContains, arrayContained, arrayOverlaps) for WHERE clause filtering.

## Filter and Conditional Operators

All filter and conditional operators are imported from `drizzle-orm`:
```typescript
import { eq, ne, gt, gte, lt, lte, ... } from "drizzle-orm";
```

### Comparison Operators (PostgreSQL, MySQL, SQLite, SingleStore)

**eq** - Value equal to n
```typescript
db.select().from(table).where(eq(table.column, 5));
// SELECT * FROM table WHERE table.column = 5
db.select().from(table).where(eq(table.column1, table.column2));
// SELECT * FROM table WHERE table.column1 = table.column2
```

**ne** - Value not equal to n
```typescript
db.select().from(table).where(ne(table.column, 5));
// SELECT * FROM table WHERE table.column <> 5
```

**gt** - Value greater than n
```typescript
db.select().from(table).where(gt(table.column, 5));
// SELECT * FROM table WHERE table.column > 5
```

**gte** - Value greater than or equal to n
```typescript
db.select().from(table).where(gte(table.column, 5));
// SELECT * FROM table WHERE table.column >= 5
```

**lt** - Value less than n
```typescript
db.select().from(table).where(lt(table.column, 5));
// SELECT * FROM table WHERE table.column < 5
```

**lte** - Value less than or equal to n
```typescript
db.select().from(table).where(lte(table.column, 5));
// SELECT * FROM table WHERE table.column <= 5
```

### Existence Operators

**exists** - Value exists (PostgreSQL, MySQL, SQLite, SingleStore)
```typescript
const query = db.select().from(table2);
db.select().from(table).where(exists(query));
// SELECT * FROM table WHERE EXISTS (SELECT * from table2)
```

**notExists** - Value does not exist
```typescript
const query = db.select().from(table2);
db.select().from(table).where(notExists(query));
// SELECT * FROM table WHERE NOT EXISTS (SELECT * from table2)
```

### Null Operators (PostgreSQL, MySQL, SQLite, SingleStore)

**isNull** - Value is null
```typescript
db.select().from(table).where(isNull(table.column));
// SELECT * FROM table WHERE table.column IS NULL
```

**isNotNull** - Value is not null
```typescript
db.select().from(table).where(isNotNull(table.column));
// SELECT * FROM table WHERE table.column IS NOT NULL
```

### Array Operators (PostgreSQL, MySQL, SQLite, SingleStore)

**inArray** - Value is in array of values
```typescript
db.select().from(table).where(inArray(table.column, [1, 2, 3, 4]));
// SELECT * FROM table WHERE table.column in (1, 2, 3, 4)
const query = db.select({ data: table2.column }).from(table2);
db.select().from(table).where(inArray(table.column, query));
// SELECT * FROM table WHERE table.column IN (SELECT table2.column FROM table2)
```

**notInArray** - Value is not in array of values
```typescript
db.select().from(table).where(notInArray(table.column, [1, 2, 3, 4]));
// SELECT * FROM table WHERE table.column NOT in (1, 2, 3, 4)
```

### Range Operators (PostgreSQL, MySQL, SQLite, SingleStore)

**between** - Value is between two values
```typescript
db.select().from(table).where(between(table.column, 2, 7));
// SELECT * FROM table WHERE table.column BETWEEN 2 AND 7
```

**notBetween** - Value is not between two values
```typescript
db.select().from(table).where(notBetween(table.column, 2, 7));
// SELECT * FROM table WHERE table.column NOT BETWEEN 2 AND 7
```

### String Pattern Operators (PostgreSQL, MySQL, SQLite, SingleStore)

**like** - Value matches pattern, case sensitive
```typescript
db.select().from(table).where(like(table.column, "%llo wor%"));
// SELECT * FROM table WHERE table.column LIKE '%llo wor%'
```

**ilike** - Value matches pattern, case insensitive (PostgreSQL only)
```typescript
db.select().from(table).where(ilike(table.column, "%llo wor%"));
// SELECT * FROM table WHERE table.column ILIKE '%llo wor%'
```

**notIlike** - Value does not match pattern, case insensitive (PostgreSQL, MySQL, SQLite, SingleStore)
```typescript
db.select().from(table).where(notIlike(table.column, "%llo wor%"));
// SELECT * FROM table WHERE table.column NOT ILIKE '%llo wor%'
```

### Logical Operators (PostgreSQL, MySQL, SQLite, SingleStore)

**not** - Condition returns false
```typescript
db.select().from(table).where(not(eq(table.column, 5)));
// SELECT * FROM table WHERE NOT (table.column = 5)
```

**and** - All conditions must return true
```typescript
db.select().from(table).where(and(gt(table.column, 5), lt(table.column, 7)));
// SELECT * FROM table WHERE (table.column > 5 AND table.column < 7)
```

**or** - One or more conditions must return true
```typescript
db.select().from(table).where(or(gt(table.column, 5), lt(table.column, 7)));
// SELECT * FROM table WHERE (table.column > 5 OR table.column < 7)
```

### PostgreSQL Array Operators

**arrayContains** - Column contains all elements of the list (PostgreSQL only)
```typescript
db.select({ id: posts.id }).from(posts).where(arrayContains(posts.tags, ['Typescript', 'ORM']));
// select "id" from "posts" where "posts"."tags" @> {Typescript,ORM}
```

**arrayContained** - List contains all elements of the column (PostgreSQL only)
```typescript
db.select({ id: posts.id }).from(posts).where(arrayContained(posts.tags, ['Typescript', 'ORM']));
// select "id" from "posts" where "posts"."tags" <@ {Typescript,ORM}
```

**arrayOverlaps** - Column contains any elements of the list (PostgreSQL only)
```typescript
db.select({ id: posts.id }).from(posts).where(arrayOverlaps(posts.tags, ['Typescript', 'ORM']));
// select "id" from "posts" where "posts"."tags" && {Typescript,ORM}
```

### overview
Headless TypeScript ORM with zero dependencies, SQL-like and relational query APIs, automatic migrations, serverless-ready, supports PostgreSQL/MySQL/SQLite/SingleStore.

## What is Drizzle ORM

Drizzle ORM is a headless TypeScript ORM designed to be lightweight, performant, typesafe, and serverless-ready. It's a library and collection of opt-in tools that lets you build projects your way without forcing you to structure code around the framework.

## Core Philosophy

Unlike traditional data frameworks (Django-like, Spring-like) that require building projects around them, Drizzle is non-intrusive. It provides tools you use when needed without interfering with your project structure.

## SQL-Like Query API

Drizzle embraces SQL as its core design principle. If you know SQL, you know Drizzle - there's minimal learning curve because the API mirrors SQL syntax rather than abstracting it away.

Example schema definition:
```typescript
export const countries = pgTable('countries', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 256 }),
});

export const cities = pgTable('cities', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 256 }),
  countryId: integer('country_id').references(() => countries.id),
});
```

SQL-like query example:
```typescript
await db
  .select()
  .from(countries)
  .leftJoin(cities, eq(cities.countryId, countries.id))
  .where(eq(countries.id, 10))
```

This generates corresponding SQL migrations automatically.

## Relational Query API

For scenarios where SQL-like queries aren't optimal, Drizzle provides a Queries API for fetching nested relational data conveniently. Drizzle always outputs exactly 1 SQL query, making it suitable for serverless databases without performance concerns.

```typescript
const result = await db.query.users.findMany({
  with: {
    posts: true
  },
});
```

## Key Features

- **Zero dependencies**: Drizzle has exactly 0 dependencies, making it slim and serverless-ready by design
- **Dialect-specific**: Best-in-class support for PostgreSQL, MySQL, SQLite, and SingleStore
- **Native drivers**: Operates through industry-standard database drivers
- **TypeScript schema management**: Define and manage database schemas in TypeScript
- **Automatic migrations**: Generate migrations from schema definitions

## Use Cases

Define schemas in TypeScript, query data using either SQL-like syntax or relational API, and leverage opt-in tools for enhanced developer experience. Works with PostgreSQL, MySQL, SQLite, or SingleStore databases.

### prepared-statements
Prepared statements API for query performance optimization: concatenate SQL once, reuse precompiled binary; use `.prepare()` with optional statement name (PostgreSQL), execute with `.execute()` (PostgreSQL/MySQL/SingleStore) or `.all()/.get()` (SQLite), embed dynamic values with `sql.placeholder(name)`.

## Query Performance with Prepared Statements

Drizzle ORM is a thin TypeScript layer on top of SQL with minimal overhead. To achieve near-zero overhead, use prepared statements.

### How Query Execution Works
When running a query, three steps occur:
1. Query builder configurations are concatenated into an SQL string
2. The string and parameters are sent to the database driver
3. The driver compiles the SQL to binary executable format and sends it to the database

### Prepared Statements
Prepared statements perform SQL concatenation once on the Drizzle side, allowing the database driver to reuse precompiled binary SQL instead of parsing the query repeatedly. This provides extreme performance benefits, especially for large SQL queries. Different database drivers support prepared statements differently.

**PostgreSQL:**
```typescript
const db = drizzle(...);
const prepared = db.select().from(customers).prepare("statement_name");
const res1 = await prepared.execute();
const res2 = await prepared.execute();
```

**MySQL:**
```typescript
const prepared = db.select().from(customers).prepare();
const res1 = await prepared.execute();
const res2 = await prepared.execute();
```

**SQLite:**
```typescript
const prepared = db.select().from(customers).prepare();
const res1 = prepared.all();
const res2 = prepared.all();
```

**SingleStore:**
```typescript
const prepared = db.select().from(customers).prepare();
const res1 = await prepared.execute();
const res2 = await prepared.execute();
```

### Placeholders for Dynamic Values
Use `sql.placeholder(...)` to embed dynamic runtime values in prepared statements.

**PostgreSQL/MySQL/SingleStore:**
```typescript
import { sql } from "drizzle-orm";

const p1 = db
  .select()
  .from(customers)
  .where(eq(customers.id, sql.placeholder('id')))
  .prepare("p1");

await p1.execute({ id: 10 }); // SELECT * FROM customers WHERE id = 10
await p1.execute({ id: 12 }); // SELECT * FROM customers WHERE id = 12

const p2 = db
  .select()
  .from(customers)
  .where(sql`lower(${customers.name}) like ${sql.placeholder('name')}`)
  .prepare("p2");

await p2.execute({ name: '%an%' }); // SELECT * FROM customers WHERE name ilike '%an%'
```

**SQLite:**
```typescript
const p1 = db
  .select()
  .from(customers)
  .where(eq(customers.id, sql.placeholder('id')))
  .prepare();

p1.get({ id: 10 }); // SELECT * FROM customers WHERE id = 10
p1.get({ id: 12 }); // SELECT * FROM customers WHERE id = 12

const p2 = db
  .select()
  .from(customers)
  .where(sql`lower(${customers.name}) like ${sql.placeholder('name')}`)
  .prepare();

p2.all({ name: '%an%' }); // SELECT * FROM customers WHERE name ilike '%an%'
```

### serverless-performance
Reuse database connections and prepared statements in serverless by declaring them outside handler scope; edge functions don't support this.

## Serverless Performance Benefits

Serverless functions like AWS Lambda and Vercel Server Functions (AWS Lambda-based) can live up to 15 minutes and reuse both database connections and prepared statements, providing significant performance benefits.

Edge functions, by contrast, clean up immediately after invocation, offering little to no performance benefits.

## Connection and Statement Reuse

To reuse database connections and prepared statements, declare them outside the handler scope:

```ts
const databaseConnection = ...;
const db = drizzle({ client: databaseConnection });
const prepared = db.select().from(...).prepare();

export const handler = async (event: APIGatewayProxyEvent) => {
  return prepared.execute();
}
```

This pattern allows the connection and prepared statement to persist across multiple function invocations within the 15-minute lifetime, eliminating the overhead of creating new connections and re-preparing statements for each request.

### prisma-extension
Prisma extension adding Drizzle query builder to Prisma client; install drizzle-orm and drizzle-prisma-generator, add generator to schema, run prisma generate, extend client with $extends(drizzle()), use via prisma.$drizzle; limitations: no relational queries, SQLite .values() unsupported, prepared statements limited.

## Drizzle Extension for Prisma

Allows using Drizzle alongside Prisma in existing projects by extending the Prisma client with Drizzle API, reusing the same database connection.

### Installation

Install dependencies:
```
drizzle-orm@latest
-D drizzle-prisma-generator
```

### Setup

1. Add Drizzle generator to Prisma schema:
```prisma
generator drizzle {
  provider = "drizzle-prisma-generator"
  output   = "./drizzle"
}
```

2. Run `prisma generate` to create Drizzle schema files.

3. Extend Prisma client with Drizzle (choose based on database):
```ts
// PostgreSQL
import { drizzle } from 'drizzle-orm/prisma/pg';
const prisma = new PrismaClient().$extends(drizzle());

// MySQL
import { drizzle } from 'drizzle-orm/prisma/mysql';
const prisma = new PrismaClient().$extends(drizzle());

// SQLite
import { drizzle } from 'drizzle-orm/prisma/sqlite';
const prisma = new PrismaClient().$extends(drizzle());
```

### Usage

Import generated Drizzle tables and use via `prisma.$drizzle`:
```ts
import { User } from './drizzle';

await prisma.$drizzle.insert().into(User).values({ email: 'sorenbs@drizzle.team', name: 'Søren' });
const users = await prisma.$drizzle.select().from(User);
```

### Limitations

- Relational queries not supported due to Prisma driver limitation - Prisma cannot return results in array format required for relational queries.
- SQLite: `.values()` not supported for the same reason.
- Prepared statements: `.prepare()` only builds SQL on Drizzle side; no Prisma API exists for prepared queries.

### read-replicas
withReplicas() automatically routes SELECT queries to read replicas and write operations to primary; supports custom replica selection logic via callback function.

## Read Replicas

The `withReplicas()` function enables automatic routing of database operations between a primary instance and read replica instances. SELECT queries are distributed across replicas while CREATE, UPDATE, and DELETE operations are routed to the primary instance.

### Setup

Create separate database connections for the primary and each read replica, then pass them to `withReplicas()`:

**PostgreSQL:**
```ts
import { drizzle } from 'drizzle-orm/node-postgres';
import { withReplicas } from 'drizzle-orm/pg-core';

const primaryDb = drizzle("postgres://user:password@host:port/primary_db");
const read1 = drizzle("postgres://user:password@host:port/read_replica_1");
const read2 = drizzle("postgres://user:password@host:port/read_replica_2");

const db = withReplicas(primaryDb, [read1, read2]);
```

**MySQL:**
```ts
import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { withReplicas } from 'drizzle-orm/mysql-core';

const primaryClient = await mysql.createConnection({ host: "host", user: "user", database: "primary_db" });
const primaryDb = drizzle({ client: primaryClient });

const read1Client = await mysql.createConnection({ host: "host", user: "user", database: "read_1" });
const read1 = drizzle({ client: read1Client });

const read2Client = await mysql.createConnection({ host: "host", user: "user", database: "read_2" });
const read2 = drizzle({ client: read2Client });

const db = withReplicas(primaryDb, [read1, read2]);
```

**SQLite:**
```ts
import { drizzle } from 'drizzle-orm/libsql';
import { withReplicas } from 'drizzle-orm/sqlite-core';
import { createClient } from '@libsql/client';

const primaryDb = drizzle({ client: createClient({ url: 'DATABASE_URL', authToken: 'DATABASE_AUTH_TOKEN' }) });
const read1 = drizzle({ client: createClient({ url: 'DATABASE_URL', authToken: 'DATABASE_AUTH_TOKEN' }) });
const read2 = drizzle({ client: createClient({ url: 'DATABASE_URL', authToken: 'DATABASE_AUTH_TOKEN' }) });

const db = withReplicas(primaryDb, [read1, read2]);
```

**SingleStore:**
```ts
import { drizzle } from "drizzle-orm/singlestore";
import mysql from "mysql2/promise";
import { withReplicas } from 'drizzle-orm/singlestore-core';

const primaryClient = await mysql.createConnection({ host: "host", user: "user", database: "primary_db" });
const primaryDb = drizzle({ client: primaryClient });

const read1Client = await mysql.createConnection({ host: "host", user: "user", database: "read_1" });
const read1 = drizzle({ client: read1Client });

const read2Client = await mysql.createConnection({ host: "host", user: "user", database: "read_2" });
const read2 = drizzle({ client: read2Client });

const db = withReplicas(primaryDb, [read1, read2]);
```

### Usage

Use the `db` instance normally. Drizzle automatically routes SELECT queries to replicas and write operations (INSERT, UPDATE, DELETE) to the primary:

```ts
// Routed to a read replica
await db.select().from(usersTable);

// Routed to primary
await db.delete(usersTable).where(eq(usersTable.id, 1));
```

### Force Primary for Reads

Use the `$primary` property to force read operations against the primary instance:

```ts
await db.$primary.select().from(usersTable);
```

### Custom Replica Selection Logic

Pass a third argument to `withReplicas()` to implement custom replica selection. The function receives the replicas array and must return a selected replica:

```ts
const db = withReplicas(primaryDb, [read1, read2], (replicas) => {
    const weight = [0.7, 0.3];
    let cumulativeProbability = 0;
    const rand = Math.random();

    for (const [i, replica] of replicas.entries()) {
      cumulativeProbability += weight[i]!;
      if (rand < cumulativeProbability) return replica;
    }
    return replicas[0]!
});

await db.select().from(usersTable);
```

This example implements weighted random selection where the first replica has 70% probability and the second has 30%. Any custom selection method can be implemented.

### relations
Define one-to-one, one-to-many, and many-to-many relations between tables using `one()`, `many()` operators; configure foreign key actions (cascade, restrict, no action, set null, set default); disambiguate multiple relations with relationName.

## Overview
Drizzle relations enable querying relational data with a simple API. They are application-level abstractions that define relationships between tables without affecting the database schema or creating foreign keys implicitly.

Relational queries example:
```ts
const db = drizzle(client, { schema });
const result = db.query.users.findMany({
  with: {
    posts: true,
  },
});
// Returns: [{ id: 10, name: "Dan", posts: [...] }]
```

## One-to-One Relations
Define with `one()` operator. When the foreign key is in the referenced table, the relation is nullable.

Self-referencing example (user invites another user):
```ts
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: text('name'),
  invitedBy: integer('invited_by'),
});

export const usersRelations = relations(users, ({ one }) => ({
  invitee: one(users, {
    fields: [users.invitedBy],
    references: [users.id],
  }),
}));
```

Foreign key in separate table (user has profile info):
```ts
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: text('name'),
});

export const usersRelations = relations(users, ({ one }) => ({
  profileInfo: one(profileInfo),
}));

export const profileInfo = pgTable('profile_info', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id),
  metadata: jsonb('metadata'),
});

export const profileInfoRelations = relations(profileInfo, ({ one }) => ({
  user: one(users, { fields: [profileInfo.userId], references: [users.id] }),
}));
// user.profileInfo is nullable
```

## One-to-Many Relations
Define with `many()` operator on the parent side and `one()` on the child side.

Users with posts and posts with comments:
```ts
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: text('name'),
});

export const usersRelations = relations(users, ({ many }) => ({
  posts: many(posts),
}));

export const posts = pgTable('posts', {
  id: serial('id').primaryKey(),
  content: text('content'),
  authorId: integer('author_id'),
});

export const postsRelations = relations(posts, ({ one, many }) => ({
  author: one(users, {
    fields: [posts.authorId],
    references: [users.id],
  }),
  comments: many(comments),
}));

export const comments = pgTable('comments', {
  id: serial('id').primaryKey(),
  text: text('text'),
  authorId: integer('author_id'),
  postId: integer('post_id'),
});

export const commentsRelations = relations(comments, ({ one }) => ({
  post: one(posts, {
    fields: [comments.postId],
    references: [posts.id],
  }),
}));
```

## Many-to-Many Relations
Require explicit junction/join tables that store associations between related tables.

Users and groups with junction table:
```ts
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: text('name'),
});

export const usersRelations = relations(users, ({ many }) => ({
  usersToGroups: many(usersToGroups),
}));

export const groups = pgTable('groups', {
  id: serial('id').primaryKey(),
  name: text('name'),
});

export const groupsRelations = relations(groups, ({ many }) => ({
  usersToGroups: many(usersToGroups),
}));

export const usersToGroups = pgTable(
  'users_to_groups',
  {
    userId: integer('user_id').notNull().references(() => users.id),
    groupId: integer('group_id').notNull().references(() => groups.id),
  },
  (t) => [primaryKey({ columns: [t.userId, t.groupId] })],
);

export const usersToGroupsRelations = relations(usersToGroups, ({ one }) => ({
  group: one(groups, {
    fields: [usersToGroups.groupId],
    references: [groups.id],
  }),
  user: one(users, {
    fields: [usersToGroups.userId],
    references: [users.id],
  }),
}));
```

## Relations vs Foreign Keys
Relations are application-level abstractions; foreign keys are database-level constraints. Relations don't affect the database schema or create foreign keys implicitly. They can be used independently or together, allowing relations to work with databases that don't support foreign keys.

## Foreign Key Actions
Specify actions when referenced data in parent table is modified using the `references()` second argument:

```ts
export type UpdateDeleteAction = 'cascade' | 'restrict' | 'no action' | 'set null' | 'set default';

// In column definition:
author: integer('author').references(() => users.id, { onDelete: 'cascade' }).notNull(),

// In foreignKey operator:
foreignKey({
  name: "author_fk",
  columns: [table.author],
  foreignColumns: [users.id],
})
  .onDelete('cascade')
  .onUpdate('cascade')
```

Actions:
- `CASCADE`: Delete/update parent row also deletes/updates all child rows
- `NO ACTION`: Prevents deletion of parent row if dependent child rows exist (default)
- `RESTRICT`: Same as NO ACTION, included for compatibility
- `SET DEFAULT`: Sets foreign key column to default value when parent row deleted
- `SET NULL`: Sets foreign key column to NULL when parent row deleted (requires nullable column)

ON UPDATE works the same way as ON DELETE, with CASCADE copying updated values to referencing rows.

## Disambiguating Relations
Use `relationName` option to distinguish multiple relations between the same two tables:

```ts
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: text('name'),
});

export const usersRelations = relations(users, ({ many }) => ({
  author: many(posts, { relationName: 'author' }),
  reviewer: many(posts, { relationName: 'reviewer' }),
}));

export const posts = pgTable('posts', {
  id: serial('id').primaryKey(),
  content: text('content'),
  authorId: integer('author_id'),
  reviewerId: integer('reviewer_id'),
});

export const postsRelations = relations(posts, ({ one }) => ({
  author: one(users, {
    fields: [posts.authorId],
    references: [users.id],
    relationName: 'author',
  }),
  reviewer: one(users, {
    fields: [posts.reviewerId],
    references: [users.id],
    relationName: 'reviewer',
  }),
}));
```

### row-level_security
Enable PostgreSQL Row-Level Security on tables with `.enableRLS()` or policies; define roles with `pgRole()` and policies with `pgPolicy(as, to, for, using, withCheck)` as table parameters; manage roles in drizzle.config.ts with `entities.roles` (true/exclude/include/provider); link policies to existing tables with `.link()`; use Neon's `crudPolicy()` or Supabase's predefined roles/tables/`createDrizzle()` wrapper.

## Row-Level Security (RLS)

Drizzle supports enabling Row-Level Security for PostgreSQL tables, creating policies with various options, and managing roles. Works with Neon and Supabase.

### Enable RLS

Use `.enableRLS()` on a table to enable RLS without policies. PostgreSQL applies a default-deny policy when no policies exist. Operations like TRUNCATE and REFERENCES are not subject to row security.

```ts
import { integer, pgTable } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
	id: integer(),
}).enableRLS();
```

Note: Adding a policy automatically enables RLS, so explicit enablement is unnecessary when policies are present.

### Roles

Define roles using `pgRole()` with options like `createRole`, `createDb`, and `inherit`:

```ts
import { pgRole } from 'drizzle-orm/pg-core';

export const admin = pgRole('admin', { createRole: true, createDb: true, inherit: true });
```

Mark existing database roles with `.existing()` to prevent drizzle-kit from managing them:

```ts
export const admin = pgRole('admin').existing();
```

### Policies

Define policies as parameters to `pgTable`. Policies are always associated with a specific table.

**Full example with all properties:**

```ts
import { sql } from 'drizzle-orm';
import { integer, pgPolicy, pgRole, pgTable } from 'drizzle-orm/pg-core';

export const admin = pgRole('admin');

export const users = pgTable('users', {
	id: integer(),
}, (t) => [
	pgPolicy('policy', {
		as: 'permissive',
		to: admin,
		for: 'delete',
		using: sql``,
		withCheck: sql``,
	}),
]);
```

**Policy options:**
- `as`: `'permissive'` or `'restrictive'`
- `to`: Role target - `'public'`, `'current_role'`, `'current_user'`, `'session_user'`, role name string, or `pgRole` object
- `for`: Command type - `'all'`, `'select'`, `'insert'`, `'update'`, `'delete'`
- `using`: SQL for the USING clause
- `withCheck`: SQL for the WITH CHECK clause

**Link policy to existing table:**

Use `.link()` to attach a policy to an existing table (common with Neon/Supabase):

```ts
import { sql } from "drizzle-orm";
import { pgPolicy } from "drizzle-orm/pg-core";
import { authenticatedRole, realtimeMessages } from "drizzle-orm/supabase";

export const policy = pgPolicy("authenticated role insert policy", {
  for: "insert",
  to: authenticatedRole,
  using: sql``,
}).link(realtimeMessages);
```

### Migrations

By default, drizzle-kit does not manage roles. Enable role management in `drizzle.config.ts`:

```ts
export default defineConfig({
  dialect: 'postgresql',
  schema: "./drizzle/schema.ts",
  dbCredentials: { url: process.env.DATABASE_URL! },
  entities: {
    roles: true
  }
});
```

**Exclude specific roles:**

```ts
entities: {
  roles: {
    exclude: ['admin']
  }
}
```

**Include specific roles:**

```ts
entities: {
  roles: {
    include: ['admin']
  }
}
```

**Use provider to exclude provider-defined roles:**

```ts
entities: {
  roles: {
    provider: 'neon'  // or 'supabase'
  }
}
```

**Combine provider with exclude:**

```ts
entities: {
  roles: {
    provider: 'supabase',
    exclude: ['new_supabase_role']
  }
}
```

### RLS on Views

Enable RLS on views using `securityInvoker` in the view's WITH options:

```ts
export const roomsUsersProfiles = pgView("rooms_users_profiles")
  .with({
    securityInvoker: true,
  })
  .as((qb) =>
    qb
      .select({
        ...getTableColumns(roomsUsers),
        email: profiles.email,
      })
      .from(roomsUsers)
      .innerJoin(profiles, eq(roomsUsers.userId, profiles.id))
  );
```

### Using with Neon

Import `crudPolicy` from `'drizzle-orm/neon'` for a wrapper with predefined functions and Neon's default roles:

```ts
import { crudPolicy } from 'drizzle-orm/neon';
import { integer, pgRole, pgTable } from 'drizzle-orm/pg-core';

export const admin = pgRole('admin');

export const users = pgTable('users', {
	id: integer(),
}, (t) => [
	crudPolicy({ role: admin, read: true, modify: false }),
]);
```

This expands to four policies (insert, update, delete, select) with appropriate SQL conditions.

Neon exposes predefined roles and functions:

```ts
// drizzle-orm/neon
export const authenticatedRole = pgRole('authenticated').existing();
export const anonymousRole = pgRole('anonymous').existing();

export const authUid = (userIdColumn: AnyPgColumn) => sql`(select auth.user_id() = ${userIdColumn})`;

export const neonIdentitySchema = pgSchema('neon_identity');

export const usersSync = neonIdentitySchema.table('users_sync', {
  rawJson: jsonb('raw_json').notNull(),
  id: text().primaryKey().notNull(),
  name: text(),
  email: text(),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' }),
  deletedAt: timestamp('deleted_at', { withTimezone: true, mode: 'string' }),
});
```

Use them in policies:

```ts
import { sql } from 'drizzle-orm';
import { authenticatedRole } from 'drizzle-orm/neon';
import { integer, pgPolicy, pgRole, pgTable } from 'drizzle-orm/pg-core';

export const admin = pgRole('admin');

export const users = pgTable('users', {
	id: integer(),
}, (t) => [
	pgPolicy(`policy-insert`, {
		for: 'insert',
		to: authenticatedRole,
		withCheck: sql`false`,
	}),
]);
```

### Using with Supabase

Import predefined roles from `'drizzle-orm/supabase'`:

```ts
// drizzle-orm/supabase
export const anonRole = pgRole('anon').existing();
export const authenticatedRole = pgRole('authenticated').existing();
export const serviceRole = pgRole('service_role').existing();
export const postgresRole = pgRole('postgres_role').existing();
export const supabaseAuthAdminRole = pgRole('supabase_auth_admin').existing();
```

Use in policies:

```ts
import { sql } from 'drizzle-orm';
import { serviceRole } from 'drizzle-orm/supabase';
import { integer, pgPolicy, pgRole, pgTable } from 'drizzle-orm/pg-core';

export const admin = pgRole('admin');

export const users = pgTable('users', {
	id: integer(),
}, (t) => [
	pgPolicy(`policy-insert`, {
		for: 'insert',
		to: serviceRole,
		withCheck: sql`false`,
	}),
]);
```

Supabase also provides predefined tables and functions:

```ts
// drizzle-orm/supabase

const auth = pgSchema('auth');
export const authUsers = auth.table('users', {
	id: uuid().primaryKey().notNull(),
});

const realtime = pgSchema('realtime');
export const realtimeMessages = realtime.table(
	'messages',
	{
		id: bigserial({ mode: 'bigint' }).primaryKey(),
		topic: text().notNull(),
		extension: text({
			enum: ['presence', 'broadcast', 'postgres_changes'],
		}).notNull(),
	},
);

export const authUid = sql`(select auth.uid())`;
export const realtimeTopic = sql`realtime.topic()`;
```

Use them in foreign keys and policies:

```ts
import { foreignKey, pgPolicy, pgTable, text, uuid } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm/sql";
import { authenticatedRole, authUsers } from "drizzle-orm/supabase";

export const profiles = pgTable(
  "profiles",
  {
    id: uuid().primaryKey().notNull(),
    email: text().notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.id],
      foreignColumns: [authUsers.id],
      name: "profiles_id_fk",
    }).onDelete("cascade"),
    pgPolicy("authenticated can view all profiles", {
      for: "select",
      to: authenticatedRole,
      using: sql`true`,
    }),
  ]
);
```

Link policies to existing Supabase tables:

```ts
import { sql } from "drizzle-orm";
import { pgPolicy } from "drizzle-orm/pg-core";
import { authenticatedRole, realtimeMessages } from "drizzle-orm/supabase";

export const policy = pgPolicy("authenticated role insert policy", {
  for: "insert",
  to: authenticatedRole,
  using: sql``,
}).link(realtimeMessages);
```

**Example: createDrizzle wrapper for Supabase RLS**

The Drizzle SupaSecureSlack repository demonstrates using RLS with Supabase. It includes a `createDrizzle` wrapper that handles transactional work:

```ts
type SupabaseToken = {
  iss?: string;
  sub?: string;
  aud?: string[] | string;
  exp?: number;
  nbf?: number;
  iat?: number;
  jti?: string;
  role?: string;
};

export function createDrizzle(token: SupabaseToken, { admin, client }: { admin: PgDatabase<any>; client: PgDatabase<any> }) {
  return {
    admin,
    rls: (async (transaction, ...rest) => {
      return await client.transaction(async (tx) => {
        try {
          await tx.execute(sql`
          select set_config('request.jwt.claims', '${sql.raw(
            JSON.stringify(token)
          )}', TRUE);
          select set_config('request.jwt.claim.sub', '${sql.raw(
            token.sub ?? ""
          )}', TRUE);												
          set local role ${sql.raw(token.role ?? "anon")};
          `);
          return await transaction(tx);
        } finally {
          await tx.execute(sql`
            select set_config('request.jwt.claims', NULL, TRUE);
            select set_config('request.jwt.claim.sub', NULL, TRUE);
            reset role;
            `);
        }
      }, ...rest);
    }) as typeof client.transaction,
  };
}
```

Usage:

```ts
export async function createDrizzleSupabaseClient() {
  const {
    data: { session },
  } = await createClient().auth.getSession();
  return createDrizzle(decode(session?.access_token ?? ""), { admin, client });
}

async function getRooms() {
  const db = await createDrizzleSupabaseClient();
  return db.rls((tx) => tx.select().from(rooms));
}
```

### relational_queries
Typed relational query API generating single SQL statements with lateral joins; supports nested relations, partial field selection, filtering, ordering, limit/offset, computed fields via extras, and prepared statements with placeholders.

## Relational Queries

Drizzle ORM's relational query API provides a typed layer for querying nested relational data from SQL databases, avoiding multiple joins and complex data mappings. It generates exactly one SQL statement per query using lateral joins of subqueries.

### Setup

Define schema with tables and relations, then pass to drizzle initialization:

```typescript
import * as schema from './schema';
import { drizzle } from 'drizzle-orm/...';

const db = drizzle({ schema });
```

For multiple schema files: `drizzle({ schema: { ...schema1, ...schema2 } })`

Relations are defined using the `relations()` function with `one()` and `many()` helpers:

```typescript
export const usersRelations = relations(users, ({ one, many }) => ({
  invitee: one(users, { fields: [users.invitedBy], references: [users.id] }),
  posts: many(posts),
}));
```

### Modes

- `mode: "default"` for regular MySQL
- `mode: "planetscale"` for PlanetScale (doesn't support lateral joins)

### Query Methods

**findMany()** - returns array of records:
```typescript
const users = await db.query.users.findMany();
```

**findFirst()** - returns single record with `limit 1`:
```typescript
const user = await db.query.users.findFirst();
```

### Include Relations

Use `with` operator to fetch related data:

```typescript
const posts = await db.query.posts.findMany({
  with: {
    comments: true,
  },
});
```

Nest `with` statements for deeper relations:
```typescript
const users = await db.query.users.findMany({
  with: {
    posts: {
      with: {
        comments: true,
      },
    },
  },
});
```

### Partial Field Selection

`columns` parameter includes/excludes specific fields (performed at query level, no extra data transferred):

```typescript
const posts = await db.query.posts.findMany({
  columns: {
    id: true,
    content: true,
  },
  with: {
    comments: true,
  }
});
```

Exclude fields with `false`:
```typescript
const posts = await db.query.posts.findMany({
  columns: {
    content: false,
  },
});
```

When both `true` and `false` are present, `false` options are ignored. Include only nested relations:
```typescript
const res = await db.query.users.findMany({
  columns: {},
  with: {
    posts: true
  }
});
```

Nested partial select:
```typescript
const posts = await db.query.posts.findMany({
  columns: {
    id: true,
    content: true,
  },
  with: {
    comments: {
      columns: {
        authorId: false
      }
    }
  }
});
```

### Filtering

Use operators from `drizzle-orm` or callback syntax:

```typescript
import { eq } from 'drizzle-orm';

const users = await db.query.users.findMany({
  where: eq(users.id, 1)
});

// or callback syntax
const users = await db.query.users.findMany({
  where: (users, { eq }) => eq(users.id, 1),
});
```

Filter nested relations:
```typescript
await db.query.posts.findMany({
  where: (posts, { eq }) => eq(posts.id, 1),
  with: {
    comments: {
      where: (comments, { lt }) => lt(comments.createdAt, new Date()),
    },
  },
});
```

### Limit & Offset

`limit` and `offset` work on top-level and nested queries:

```typescript
await db.query.posts.findMany({
  limit: 5,
  offset: 2,
  with: {
    comments: {
      limit: 3,
    },
  },
});
```

Note: `offset` is only available at top level, not in nested relations.

### Order By

Use core API or callback syntax:

```typescript
import { desc, asc } from 'drizzle-orm';

await db.query.posts.findMany({
  orderBy: [asc(posts.id)],
});

// or callback
await db.query.posts.findMany({
  orderBy: (posts, { asc }) => [asc(posts.id)],
  with: {
    comments: {
      orderBy: (comments, { desc }) => [desc(comments.id)],
    },
  },
});
```

### Custom Fields with extras

Add computed fields using `extras`:

```typescript
import { sql } from 'drizzle-orm';

await db.query.users.findMany({
  extras: {
    loweredName: sql`lower(${users.name})`.as('lowered_name'),
  },
});

// or callback syntax
await db.query.users.findMany({
  extras: {
    loweredName: (users, { sql }) => sql`lower(${users.name})`.as('lowered_name'),
  },
});
```

Must explicitly use `.as("<column_name>")`. Aggregations are not supported in `extras`; use core queries instead.

Example with concatenation and nested relations:
```typescript
const res = await db.query.users.findMany({
  extras: {
    fullName: sql<string>`concat(${users.name}, " ", ${users.name})`.as('full_name'),
  },
  with: {
    usersToGroups: {
      with: {
        group: true,
      },
    },
  },
});
```

Example with computed field on nested relations:
```typescript
const res = await db.query.posts.findMany({
  extras: (table, { sql }) => ({
    contentLength: sql<number>`length(${table.content})`.as('content_length'),
  }),
  with: {
    comments: {
      extras: {
        commentSize: sql<number>`length(${comments.content})`.as('comment_size'),
      },
    },
  },
});
```

### Prepared Statements

Prepared statements improve query performance. Use `placeholder()` for dynamic values:

**Placeholder in where:**
```typescript
const prepared = db.query.users.findMany({
  where: (users, { eq }) => eq(users.id, placeholder('id')),
  with: {
    posts: {
      where: (users, { eq }) => eq(users.id, placeholder('pid')),
    },
  },
}).prepare('query_name'); // PostgreSQL requires name

const usersWithPosts = await prepared.execute({ id: 1 });
```

**Placeholder in limit:**
```typescript
const prepared = db.query.users.findMany({
  with: {
    posts: {
      limit: placeholder('limit'),
    },
  },
}).prepare();

const usersWithPosts = await prepared.execute({ limit: 1 });
```

**Placeholder in offset:**
```typescript
const prepared = db.query.users.findMany({
  offset: placeholder('offset'),
  with: {
    posts: true,
  },
}).prepare();

const usersWithPosts = await prepared.execute({ offset: 1 });
```

**Multiple placeholders:**
```typescript
const prepared = db.query.users.findMany({
  limit: placeholder('uLimit'),
  offset: placeholder('uOffset'),
  where: (users, { eq, or }) => or(eq(users.id, placeholder('id')), eq(users.id, 3)),
  with: {
    posts: {
      where: (users, { eq }) => eq(users.id, placeholder('pid')),
      limit: placeholder('pLimit'),
    },
  },
}).prepare();

const usersWithPosts = await prepared.execute({ pLimit: 1, uLimit: 3, uOffset: 1, id: 2, pid: 6 });
```

### table_schemas
Declare SQL schemas with pgSchema/mysqlSchema/singlestoreSchema; tables within schemas are automatically prefixed in queries; SQLite unsupported.

## Table Schemas

Drizzle ORM provides an API for declaring SQL schemas in PostgreSQL, MySQL, and SingleStore dialects. When entities are declared within a schema, the query builder automatically prepends schema names in generated queries (e.g., `select * from "schema"."users"`).

### PostgreSQL

Use `pgSchema()` to create a schema. You can define enums and tables within it:

```ts
import { serial, text, pgSchema } from "drizzle-orm/pg-core";

export const mySchema = pgSchema("my_schema");
export const colors = mySchema.enum('colors', ['red', 'green', 'blue']);
export const mySchemaUsers = mySchema.table('users', {
  id: serial('id').primaryKey(),
  name: text('name'),
  color: colors('color').default('red'),
});
```

Generates:
```sql
CREATE SCHEMA "my_schema";
CREATE TYPE "my_schema"."colors" AS ENUM ('red', 'green', 'blue');
CREATE TABLE "my_schema"."users" (
  "id" serial PRIMARY KEY,
  "name" text,
  "color" "my_schema"."colors" DEFAULT 'red'
);
```

### MySQL

Use `mysqlSchema()` to create a schema and define tables:

```ts
import { int, text, mysqlSchema } from "drizzle-orm/mysql-core";

export const mySchema = mysqlSchema("my_schema");
export const mySchemaUsers = mySchema.table("users", {
  id: int("id").primaryKey().autoincrement(),
  name: text("name"),
});
```

### SQLite

SQLite does not support schemas.

### SingleStore

Use `singlestoreSchema()` similar to MySQL:

```ts
import { int, text, singlestoreSchema } from "drizzle-orm/singlestore-core";

export const mySchema = singlestoreSchema("my_schema");
export const mySchemaUsers = mySchema.table("users", {
  id: int("id").primaryKey().autoincrement(),
  name: text("name"),
});
```

### seed_generators_reference
30+ generator functions for test data: numeric (int, number), temporal (date, time, timestamp, datetime, year, interval), person (name, email, phone), location (country, city, address, state, postcode), business (job, company, lorem), data (json, string, uuid), geometric (point, line); most support isUnique and arraySize parameters.

## Seed Generators Reference

Complete reference for all generator functions available in drizzle-seed for generating test data.

### Core Generators

**`default`** - Generates the same value repeatedly. Supports `defaultValue` (any) and `arraySize` (number).

**`valuesFromArray`** - Picks values from a provided array. Parameters: `values` (array or weighted array), `isUnique` (boolean, defaults to column uniqueness), `arraySize` (number). Supports weighted values via `{ weight: number; values: any[] }[]` format.

**`intPrimaryKey`** - Generates sequential integers starting from 1. No parameters.

### Numeric Generators

**`number`** - Generates floating-point numbers. Parameters: `minValue`, `maxValue` (defaults: `precision * 1000` if not unique, `precision * count` if unique), `precision` (default: 100), `isUnique`, `arraySize`.

**`int`** - Generates integers. Parameters: `minValue`, `maxValue` (defaults: 1000 if not unique, `count * 10` if unique), `isUnique`, `arraySize`. Supports `number | bigint` types.

### Boolean & Temporal Generators

**`boolean`** - Generates true/false values. Only parameter: `arraySize`.

**`date`** - Generates dates within range. Parameters: `minDate` (default: 2020-05-08), `maxDate` (default: 2028-05-08), `arraySize`. If only one date is provided, the other is calculated by adding/subtracting 8 years.

**`time`** - Generates 24-hour format times. Only parameter: `arraySize`.

**`timestamp`** - Generates timestamps. Only parameter: `arraySize`.

**`datetime`** - Generates datetime objects. Only parameter: `arraySize`.

**`year`** - Generates years in YYYY format. Only parameter: `arraySize`.

**`interval`** - Generates time intervals (e.g., "1 year 12 days 5 minutes"). Parameters: `isUnique`, `arraySize`.

### Data Type Generators

**`json`** - Generates JSON objects with fixed structures. Randomly picks between structures like `{ email, name, isGraduated, hasJob, salary, startedWorking, visitedCountries }` or `{ email, name, isGraduated, hasJob, visitedCountries }`. Only parameter: `arraySize`.

**`string`** - Generates random strings. Parameters: `isUnique`, `arraySize`.

**`uuid`** - Generates v4 UUID strings. Only parameter: `arraySize`.

### Person & Location Generators

**`firstName`** - Generates first names. Parameters: `isUnique`, `arraySize`.

**`lastName`** - Generates last names. Parameters: `isUnique`, `arraySize`.

**`fullName`** - Generates full names. Parameters: `isUnique`, `arraySize`.

**`email`** - Generates unique email addresses. Only parameter: `arraySize`.

**`phoneNumber`** - Generates unique phone numbers. Three modes:
- Template mode: `template` parameter with '#' replaced by digits (e.g., "+(380) ###-####")
- Prefix mode: `prefixes` array and `generatedDigitsNumbers` (number or array matching prefix count)
- Default uses built-in dataset for prefixes with 7 generated digits
Parameter: `arraySize`.

**`country`** - Generates country names. Parameters: `isUnique`, `arraySize`.

**`city`** - Generates city names. Parameters: `isUnique`, `arraySize`.

**`streetAddress`** - Generates street addresses. Parameters: `isUnique`, `arraySize`.

**`state`** - Generates US state names. Only parameter: `arraySize`.

**`postcode`** - Generates postal codes. Parameters: `isUnique`, `arraySize`.

### Business & Content Generators

**`jobTitle`** - Generates job titles. Only parameter: `arraySize`.

**`companyName`** - Generates company names. Parameters: `isUnique`, `arraySize`.

**`loremIpsum`** - Generates lorem ipsum text. Parameters: `sentencesCount` (default: 1), `arraySize`.

### Geometric Generators

**`point`** - Generates 2D points. Parameters: `isUnique`, `minXValue`, `maxXValue` (defaults: `10 * 1000` if not unique, `10 * count` if unique), `minYValue`, `maxYValue` (same defaults as X), `arraySize`.

**`line`** - Generates 2D lines using equation `a*x + b*y + c = 0`. Parameters: `isUnique`, `minAValue`, `maxAValue`, `minBValue`, `maxBValue`, `minCValue`, `maxCValue` (all with same defaults as point), `arraySize`.

### Important Notes

- When `arraySize` is specified, arrays are generated with that many elements
- When both `arraySize` and `isUnique` are specified together, unique values are generated and then packed into arrays (not unique arrays)
- Most generators support `isUnique` parameter which defaults to the database column's uniqueness constraint
- All generators can be used within the `refine()` callback of `seed()` function

### seed-limitations
Third parameter type constraints in seed operations

The page documents type limitations for the third parameter in seeding operations. This is a technical constraint that developers need to be aware of when implementing database seeding functionality. The specific limitations affect how the third parameter can be typed and used in seed functions, which may impact the design of seed scripts and data initialization routines.

### seed-overview
Deterministic fake data generation with seedable pRNG, database reset strategies, column/entity refinements, and weighted random distributions for realistic test data.

## Drizzle Seed

TypeScript library for generating deterministic, realistic fake data to populate databases. Uses a seedable pseudorandom number generator (pRNG) to ensure consistent and reproducible data across runs.

**Supported databases:** PostgreSQL, SQLite, MySQL (not SingleStore)

**Requirements:** drizzle-orm@0.36.4 or higher

### Key Concepts

**Deterministic Data Generation:** Same seed input always produces identical output, enabling predictable and repeatable datasets.

**Pseudorandom Number Generator (pRNG):** Algorithm producing number sequences that approximate randomness but remain reproducible via seed control.

**Benefits:** Consistency across test runs, easier debugging with reproducible data, team collaboration via shared seeds.

### Installation

```
npm install drizzle-seed
```

### Basic Usage

```ts
import { pgTable, integer, text } from "drizzle-orm/pg-core";
import { drizzle } from "drizzle-orm/node-postgres";
import { seed } from "drizzle-seed";

const users = pgTable("users", {
  id: integer().primaryKey(),
  name: text().notNull(),
});

async function main() {
  const db = drizzle(process.env.DATABASE_URL!);
  await seed(db, { users });
}
```

Creates 10 entities by default.

### Options

**`count`:** Specify number of entities to create (default: 10)
```ts
await seed(db, schema, { count: 1000 });
```

**`seed`:** Define seed number for different value sets
```ts
await seed(db, schema, { seed: 12345 });
```

### Reset Database

```ts
import * as schema from "./schema.ts";
import { reset } from "drizzle-seed";

async function main() {
  const db = drizzle(process.env.DATABASE_URL!);
  await reset(db, schema);
}
```

**Reset strategies by dialect:**
- **PostgreSQL:** `TRUNCATE tableName1, tableName2, ... CASCADE;`
- **MySQL:** Disables `FOREIGN_KEY_CHECKS`, runs `TRUNCATE` statements, re-enables checks
- **SQLite:** Disables `foreign_keys` pragma, runs `DELETE FROM` statements, re-enables pragma

### Refinements

Use `.refine()` callback to customize seed generator behavior and define table-specific seeding logic:

```ts
await seed(db, schema).refine((f) => ({
  users: {
    columns: {},
    count: 10,
    with: {
      posts: 10
    }
  },
}));
```

**Refinement properties:**
- `columns`: Override default generator functions for specific columns
- `count`: Number of rows to insert (overrides global count if specified)
- `with`: Define how many referenced entities to create for parent table (supports weighted random distribution)

**Example 1 - Refine column generation:**
```ts
await seed(db, { users: schema.users }).refine((f) => ({
  users: {
    columns: {
      name: f.fullName(),
    },
    count: 20
  }
}));
```

**Example 2 - Create related entities:**
```ts
await seed(db, schema).refine((f) => ({
  users: {
    count: 20,
    with: {
      posts: 10  // 10 posts per user
    }
  }
}));
```

**Example 3 - Custom value ranges and arrays:**
```ts
await seed(db, schema).refine((f) => ({
  users: {
    count: 5,
    columns: {
      id: f.int({
        minValue: 10000,
        maxValue: 20000,
        isUnique: true,
      }),
    }
  },
  posts: {
    count: 100,
    columns: {
      description: f.valuesFromArray({
        values: [
          "The sun set behind the mountains...",
          "I can't believe how good this pizza...",
          // ...
        ],
      })
    }
  }
}));
```

### Weighted Random

Use weighted random for multiple datasets with different priorities in columns or `with` property:

**Example 1 - Weighted column values:**
```ts
await seed(db, schema).refine((f) => ({
  orders: {
    count: 5000,
    columns: {
      unitPrice: f.weightedRandom([
        {
          weight: 0.3,
          value: f.int({ minValue: 10, maxValue: 100 })
        },
        {
          weight: 0.7,
          value: f.number({ minValue: 100, maxValue: 300, precision: 100 })
        }
      ]),
    }
  }
}));
```

**Example 2 - Weighted related entity counts:**
```ts
await seed(db, schema).refine((f) => ({
  orders: {
    with: {
      details: [
        { weight: 0.6, count: [1, 2, 3] },
        { weight: 0.3, count: [5, 6, 7] },
        { weight: 0.1, count: [8, 9, 10] },
      ]
    }
  }
}));
```

### Limitations

**TypeScript limitations for `with`:** Cannot properly infer references between tables due to TypeScript constraints and circular dependencies. The `with` option displays all tables; manually select the one with one-to-many relationship.

**One-to-many only:** `with` works for one-to-many relationships (e.g., users with posts), not many-to-one (posts with users).

**Third parameter type support:** No type support for third parameter in Drizzle tables; works at runtime but not at type level.

### versioning
drizzle-seed versioning maintains deterministic outputs while allowing generator improvements; v2 fixes unique interval normalization and improves string generation for length-constrained columns.

# Versioning

`drizzle-seed` uses versioning to manage outputs for static and dynamic data generators. The same `seed` number produces identical results (deterministic), and when generators change, the version increments, allowing you to choose between old and new behavior.

Specify a version with `await seed(db, schema, { version: '2' })`. If no version is specified, the latest is used.

## Version History

| API Version | NPM Version | Changed Generators |
|---|---|---|
| `v1` | `0.1.1` | - |
| `v2 (LTS)` | `0.2.1` | `string()`, `interval({ isUnique: true })` |

## How Versioning Works

Each generator has its own version. When you specify a version, you get the latest version of each generator up to that version number. For example, if `lastName` generator changed to V2 and `firstName` changed to V3:

- No version specified: `firstName` V3, `lastName` V2
- `version: '2'`: `firstName` V1, `lastName` V2
- `version: '1'`: `firstName` V1, `lastName` V1

## Version 2 Changes

### Unique `interval` Generator

**Problem**: The old generator could produce intervals like `1 minute 60 seconds` and `2 minutes 0 seconds` as distinct values. However, PostgreSQL normalizes `1 minute 60 seconds` to `2 minutes 0 seconds`, causing unique constraint violations when both are inserted.

**Affected if**: Your table has a unique `interval` column or you use `f.interval({ isUnique: true })` in seeding scripts.

Example affected schema:
```ts
const intervals = pgTable("intervals", {
    interval: interval().unique()
});
```

Example affected seeding script:
```ts
await seed(db, { intervals }).refine((f) => ({
    intervals: {
        columns: {
            interval: f.interval({ isUnique: true }),
        }
    }
}));
```

### `string` Generators (Both Unique and Non-Unique)

**Improvement**: New ability to generate unique strings based on the column's maximum length parameter (e.g., `varchar(20)`).

**Affected if**: Your table includes text-like columns with a maximum length parameter or unique text-like columns.

Example affected schema:
```ts
const strings = pgTable("strings", {
    string1: char({ length: 256 }).unique(),
    string2: varchar({ length: 256 }),
    string3: text().unique(),
});
```

Example affected seeding script:
```ts
await seed(db, { strings }).refine((f) => ({
    strings: {
        columns: {
            string1: f.string({ isUnique: true }),
            string2: f.string(),
            string3: f.string({ isUnique: true }),
        }
    }
}));
```

### select
Type-safe SQL SELECT with column selection, filtering, pagination, CTEs, subqueries, aggregations, and MySQL index hints.

## SQL Select

Drizzle provides type-safe, composable SQL select queries with support for all major database dialects.

### Basic Selection

Select all rows with automatic type inference:
```typescript
const result = await db.select().from(users);
// Result type: { id: number; name: string; age: number | null }[]
```

Drizzle explicitly lists columns instead of using `SELECT *` to guarantee field order and follow best practices.

### Partial Selection

Select specific columns or use arbitrary expressions:
```typescript
const result = await db.select({
  field1: users.id,
  field2: users.name,
}).from(users);

const result = await db.select({
  id: users.id,
  lowerName: sql<string>`lower(${users.name})`,
}).from(users);
```

When using `sql<Type>`, you specify the expected return type. Drizzle cannot perform runtime type casts, so if the type is incorrect, the runtime value won't match. Use `.mapWith()` for runtime transformations.

### Conditional Selection

Build dynamic selection objects based on conditions:
```typescript
async function selectUsers(withName: boolean) {
  return db.select({
    id: users.id,
    ...(withName ? { name: users.name } : {}),
  }).from(users);
}
```

### Distinct Selection

Use `.selectDistinct()` for unique rows:
```typescript
await db.selectDistinct().from(users).orderBy(users.id, users.name);
await db.selectDistinct({ id: users.id }).from(users).orderBy(users.id);
```

PostgreSQL supports `distinct on` to specify how uniqueness is determined:
```typescript
await db.selectDistinctOn([users.id]).from(users).orderBy(users.id);
await db.selectDistinctOn([users.name], { name: users.name }).from(users).orderBy(users.name);
```

### Advanced Selection

Use `getTableColumns()` to select all columns with modifications:
```typescript
import { getTableColumns, sql } from 'drizzle-orm';

// Select all columns plus computed field
await db.select({
  ...getTableColumns(posts),
  titleLength: sql<number>`length(${posts.title})`,
}).from(posts);

// Exclude specific columns
const { content, ...rest } = getTableColumns(posts);
await db.select({ ...rest }).from(posts);
```

Alternative query API syntax:
```typescript
await db.query.posts.findMany({ columns: { title: true } });
await db.query.posts.findMany({ columns: { content: false } });
```

## Filters

Use filter operators in `.where()` clause:
```typescript
import { eq, lt, gte, ne } from 'drizzle-orm';

await db.select().from(users).where(eq(users.id, 42));
await db.select().from(users).where(lt(users.id, 42));
await db.select().from(users).where(gte(users.id, 42));
await db.select().from(users).where(ne(users.id, 42));
```

All filter operators use the `sql` function internally. Write custom filters with `sql`:
```typescript
import { sql } from 'drizzle-orm';

function equals42(col: Column) {
  return sql`${col} = 42`;
}

await db.select().from(users).where(sql`${users.id} < 42`);
await db.select().from(users).where(sql`lower(${users.name}) = 'aaron'`);
await db.select().from(users).where(equals42(users.id));
```

All values are automatically parameterized: `eq(users.id, 42)` becomes `WHERE "id" = $1; -- params: [42]`

### Inverting Conditions

Use `not()` operator:
```typescript
import { eq, not } from 'drizzle-orm';

await db.select().from(users).where(not(eq(users.id, 42)));
```

Schema changes (renaming tables/columns) are automatically reflected in queries due to template interpolation.

### Combining Filters

Use `and()` and `or()` operators:
```typescript
import { eq, and, or } from 'drizzle-orm';

await db.select().from(users).where(
  and(eq(users.id, 42), eq(users.name, 'Dan'))
);

await db.select().from(users).where(
  or(eq(users.id, 42), eq(users.name, 'Dan'))
);
```

### Advanced Filtering

Conditional filters with undefined handling:
```typescript
const searchPosts = async (term?: string) => {
  await db.select().from(posts)
    .where(term ? ilike(posts.title, term) : undefined);
};

const searchPosts = async (filters: SQL[]) => {
  await db.select().from(posts).where(and(...filters));
};
const filters: SQL[] = [];
filters.push(ilike(posts.title, 'AI'));
filters.push(inArray(posts.category, ['Tech', 'Art', 'Science']));
await searchPosts(filters);
```

## Pagination

### Limit & Offset

```typescript
await db.select().from(users).limit(10);
await db.select().from(users).limit(10).offset(10);
```

### Order By

```typescript
import { asc, desc } from 'drizzle-orm';

await db.select().from(users).orderBy(users.name);
await db.select().from(users).orderBy(desc(users.name));
await db.select().from(users).orderBy(asc(users.name), desc(users.name2));
```

### Advanced Pagination

Limit-offset pagination:
```typescript
await db.select().from(users)
  .orderBy(asc(users.id))
  .limit(4)
  .offset(4);

const getUsers = async (page = 1, pageSize = 3) => {
  await db.query.users.findMany({
    orderBy: (users, { asc }) => asc(users.id),
    limit: pageSize,
    offset: (page - 1) * pageSize,
  });
};
```

Cursor-based pagination:
```typescript
const nextUserPage = async (cursor?: number, pageSize = 3) => {
  await db.select().from(users)
    .where(cursor ? gt(users.id, cursor) : undefined)
    .limit(pageSize)
    .orderBy(asc(users.id));
};
await nextUserPage(3); // Pass cursor of last row from previous page
```

## WITH Clause (CTEs)

Simplify complex queries using Common Table Expressions:
```typescript
const sq = db.$with('sq').as(
  db.select().from(users).where(eq(users.id, 42))
);
const result = await db.with(sq).select().from(sq);
```

Use insert/update/delete in WITH:
```typescript
const sq = db.$with('sq').as(
  db.insert(users).values({ name: 'John' }).returning()
);
const result = await db.with(sq).select().from(sq);

const sq = db.$with('sq').as(
  db.update(users).set({ age: 25 }).where(eq(users.name, 'John')).returning()
);
const result = await db.with(sq).select().from(sq);

const sq = db.$with('sq').as(
  db.delete(users).where(eq(users.name, 'John')).returning()
);
const result = await db.with(sq).select().from(sq);
```

For arbitrary SQL values in CTEs, add aliases:
```typescript
const sq = db.$with('sq').as(
  db.select({ 
    name: sql<string>`upper(${users.name})`.as('name'),
  }).from(users)
);
const result = await db.with(sq).select({ name: sq.name }).from(sq);
```

Without aliases, fields become `DrizzleTypeError` and cannot be referenced.

## Subqueries

Embed queries into other queries:
```typescript
const sq = db.select().from(users).where(eq(users.id, 42)).as('sq');
const result = await db.select().from(sq);
```

Use subqueries in joins:
```typescript
const sq = db.select().from(users).where(eq(users.id, 42)).as('sq');
const result = await db.select().from(users)
  .leftJoin(sq, eq(users.id, sq.id));
```

## Aggregations

Use aggregation functions with `.groupBy()` and `.having()`:
```typescript
import { gt } from 'drizzle-orm';

await db.select({
  age: users.age,
  count: sql<number>`cast(count(${users.id}) as int)`,
})
  .from(users)
  .groupBy(users.age);

await db.select({
  age: users.age,
  count: sql<number>`cast(count(${users.id}) as int)`,
})
  .from(users)
  .groupBy(users.age)
  .having(({ count }) => gt(count, 1));
```

Note: `cast(... as int)` is necessary because `count()` returns `bigint` in PostgreSQL and `decimal` in MySQL. Alternatively use `.mapWith(Number)`.

### Aggregation Helpers

Wrapped `sql` functions for common aggregations. Remember to use `.groupBy()` when selecting aggregating functions with other columns.

**count** - Returns number of values:
```typescript
import { count } from 'drizzle-orm'

await db.select({ value: count() }).from(users);
await db.select({ value: count(users.id) }).from(users);
```

**countDistinct** - Returns number of non-duplicate values:
```typescript
import { countDistinct } from 'drizzle-orm'

await db.select({ value: countDistinct(users.id) }).from(users);
```

**avg** - Returns average of non-null values:
```typescript
import { avg } from 'drizzle-orm'

await db.select({ value: avg(users.id) }).from(users);
```

**avgDistinct** - Returns average of non-null, non-duplicate values:
```typescript
import { avgDistinct } from 'drizzle-orm'

await db.select({ value: avgDistinct(users.id) }).from(users);
```

**sum** - Returns sum of non-null values:
```typescript
import { sum } from 'drizzle-orm'

await db.select({ value: sum(users.id) }).from(users);
```

**sumDistinct** - Returns sum of non-null, non-duplicate values:
```typescript
import { sumDistinct } from 'drizzle-orm'

await db.select({ value: sumDistinct(users.id) }).from(users);
```

**max** - Returns maximum value:
```typescript
import { max } from 'drizzle-orm'

await db.select({ value: max(users.id) }).from(users);
```

**min** - Returns minimum value:
```typescript
import { min } from 'drizzle-orm'

await db.select({ value: min(users.id) }).from(users);
```

Complex aggregation example:
```typescript
db.select({
  id: orders.id,
  shippedDate: orders.shippedDate,
  shipName: orders.shipName,
  shipCity: orders.shipCity,
  shipCountry: orders.shipCountry,
  productsCount: sql<number>`cast(count(${details.productId}) as int)`,
  quantitySum: sql<number>`sum(${details.quantity})`,
  totalPrice: sql<number>`sum(${details.quantity} * ${details.unitPrice})`,
})
  .from(orders)
  .leftJoin(details, eq(orders.id, details.orderId))
  .groupBy(orders.id)
  .orderBy(asc(orders.id))
  .all();
```

### $count

Dedicated count API (see separate documentation).

## Iterator

**MySQL only** (PostgreSQL, SQLite, SingleStore: WIP)

For large result sets, use `.iterator()` to avoid loading all rows into memory:
```typescript
const iterator = await db.select().from(users).iterator();

for await (const row of iterator) {
  console.log(row);
}
```

Works with prepared statements:
```typescript
const query = await db.select().from(users).prepare();
const iterator = await query.iterator();

for await (const row of iterator) {
  console.log(row);
}
```

## Index Hints

**MySQL only** (PostgreSQL, SQLite, SingleStore: not supported)

### USE INDEX

Suggests indexes to the optimizer (not forced):
```typescript
export const users = mysqlTable('users', {
  id: int('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
}, () => [usersTableNameIndex]);

const usersTableNameIndex = index('users_name_index').on(users.name);

await db.select()
  .from(users, { useIndex: usersTableNameIndex })
  .where(eq(users.name, 'David'));

// Also works on joins
await db.select()
  .from(users)
  .leftJoin(posts, eq(posts.userId, users.id), { useIndex: usersTableNameIndex })
  .where(eq(users.name, 'David'));
```

### IGNORE INDEX

Tells optimizer to avoid specific indexes:
```typescript
await db.select()
  .from(users, { ignoreIndex: usersTableNameIndex })
  .where(eq(users.name, 'David'));

// Also works on joins
await db.select()
  .from(users)
  .leftJoin(posts, eq(posts.userId, users.id), { ignoreIndex: usersTableNameIndex })
  .where(eq(users.name, 'David'));
```

### FORCE INDEX

Forces optimizer to use specified index(es):
```typescript
await db.select()
  .from(users, { forceIndex: usersTableNameIndex })
  .where(eq(users.name, 'David'));

// Also works on joins
await db.select()
  .from(users)
  .leftJoin(posts, eq(posts.userId, users.id), { forceIndex: usersTableNameIndex })
  .where(eq(users.name, 'David'));
```

### sequences
PostgreSQL sequences: thread-safe unique identifier generation with nextval/currval/setval/lastval functions, configurable start/increment/min/max/cycle/cache, creates gaps on transaction abort, no rollback semantics.

## Sequences

PostgreSQL sequences are special single-row tables that generate unique sequential identifiers, commonly used for auto-incrementing primary keys. They provide thread-safe value generation across multiple sessions.

### Key Features

**Creation and Initialization**
- Use `pgSequence()` to create sequences with customizable parameters: start value, increment, min/max values, and cache size
- Default behavior: increments by 1, starts at 1

**Manipulation Functions**
- `nextval('sequence_name')`: Advances sequence and returns next value
- `currval('sequence_name')`: Returns current value for current session
- `setval('sequence_name', value)`: Sets sequence's current value
- `lastval()`: Returns last value from nextval in current session

**Ownership and Lifecycle**
- Sequences can be linked to table columns using OWNED BY clause
- Dropping table or column automatically drops associated sequence

**Cycling and Caching**
- CYCLE option allows sequences to restart at min value after reaching max (default: NO CYCLE)
- CACHE option preallocates values for performance improvement

### Limitations

- **Gaps**: Aborted transactions or crashes create gaps in sequence values
- **Concurrency**: Values are unique but may be out of order across sessions
- **No Rollback**: Sequence changes persist even if transaction fails, ensuring uniqueness but creating gaps
- **Crash Recovery**: Unlogged sequences may not restore properly after crashes

### Usage Examples

```ts
import { pgSchema, pgSequence } from "drizzle-orm/pg-core";

// Basic sequence with defaults
export const customSequence = pgSequence("name");

// Sequence with custom parameters
export const customSequence = pgSequence("name", {
  startWith: 100,
  maxValue: 10000,
  minValue: 100,
  cycle: true,
  cache: 10,
  increment: 2
});

// Sequence in custom schema
export const customSchema = pgSchema('custom_schema');
export const customSequence = customSchema.sequence("name");
```

**Requirements**: drizzle-orm@0.32.0+ and drizzle-kit@0.23.0+
**Database Support**: PostgreSQL only

### set-operations
SQL set operations (UNION, UNION ALL, INTERSECT, INTERSECT ALL, EXCEPT, EXCEPT ALL) combining multiple query results with function or builder syntax; INTERSECT ALL and EXCEPT ALL PostgreSQL/MySQL only.

## Set Operations

SQL set operations combine results from multiple query blocks into a single result. Drizzle-orm supports: UNION, INTERSECT, EXCEPT, and their ALL variants.

### UNION
Combines all results from two queries, removing duplicates.

```typescript
import { union } from 'drizzle-orm/pg-core'
const result = await union(
  db.select({ name: users.name }).from(users),
  db.select({ name: customers.name }).from(customers)
).limit(10);
```

Builder pattern alternative:
```typescript
const result = await db
  .select({ name: users.name })
  .from(users)
  .union(db.select({ name: customers.name }).from(customers))
  .limit(10);
```

### UNION ALL
Combines all results from two queries, keeping duplicates. Useful when you want to preserve all records without deduplication.

```typescript
import { unionAll } from 'drizzle-orm/pg-core'
const result = await unionAll(
  db.select({ transaction: onlineSales.transactionId }).from(onlineSales),
  db.select({ transaction: inStoreSales.transactionId }).from(inStoreSales)
);
```

Builder pattern:
```typescript
const result = await db
  .select({ transaction: onlineSales.transactionId })
  .from(onlineSales)
  .unionAll(db.select({ transaction: inStoreSales.transactionId }).from(inStoreSales));
```

Note: SingleStore has different ORDER BY behavior with UNION ALL compared to MySQL.

### INTERSECT
Returns only rows that appear in both query results, removing duplicates.

```typescript
import { intersect } from 'drizzle-orm/pg-core'
const result = await intersect(
  db.select({ courseName: depA.courseName }).from(depA),
  db.select({ courseName: depB.courseName }).from(depB)
);
```

Builder pattern:
```typescript
const result = await db
  .select({ courseName: depA.courseName })
  .from(depA)
  .intersect(db.select({ courseName: depB.courseName }).from(depB));
```

### INTERSECT ALL
Returns only rows that appear in both query results, keeping duplicates.

```typescript
import { intersectAll } from 'drizzle-orm/pg-core'
const result = await intersectAll(
  db.select({ productId: regularCustomerOrders.productId, quantityOrdered: regularCustomerOrders.quantityOrdered }).from(regularCustomerOrders),
  db.select({ productId: vipCustomerOrders.productId, quantityOrdered: vipCustomerOrders.quantityOrdered }).from(vipCustomerOrders)
);
```

Builder pattern:
```typescript
const result = await db
  .select({ productId: regularCustomerOrders.productId, quantityOrdered: regularCustomerOrders.quantityOrdered })
  .from(regularCustomerOrders)
  .intersectAll(
    db.select({ productId: vipCustomerOrders.productId, quantityOrdered: vipCustomerOrders.quantityOrdered }).from(vipCustomerOrders)
  );
```

Supported in PostgreSQL and MySQL only.

### EXCEPT
Returns all rows from the first query that are not in the second query, removing duplicates.

```typescript
import { except } from 'drizzle-orm/pg-core'
const result = await except(
  db.select({ courseName: depA.projectsName }).from(depA),
  db.select({ courseName: depB.projectsName }).from(depB)
);
```

Builder pattern:
```typescript
const result = await db
  .select({ courseName: depA.projectsName })
  .from(depA)
  .except(db.select({ courseName: depB.projectsName }).from(depB));
```

### EXCEPT ALL
Returns all rows from the first query that are not in the second query, keeping duplicates.

```typescript
import { exceptAll } from 'drizzle-orm/pg-core'
const result = await exceptAll(
  db.select({ productId: regularCustomerOrders.productId, quantityOrdered: regularCustomerOrders.quantityOrdered }).from(regularCustomerOrders),
  db.select({ productId: vipCustomerOrders.productId, quantityOrdered: vipCustomerOrders.quantityOrdered }).from(vipCustomerOrders)
);
```

Builder pattern:
```typescript
const result = await db
  .select({ productId: regularCustomerOrders.productId, quantityOrdered: regularCustomerOrders.quantityOrdered })
  .from(regularCustomerOrders)
  .exceptAll(
    db.select({ productId: vipCustomerOrders.productId, quantityOrdered: vipCustomerOrders.quantityOrdered }).from(vipCustomerOrders)
  );
```

Supported in PostgreSQL and MySQL only.

## Database Support

- **UNION, UNION ALL, INTERSECT, EXCEPT**: PostgreSQL, MySQL, SQLite, SingleStore
- **INTERSECT ALL, EXCEPT ALL**: PostgreSQL, MySQL only

## Import Paths

- PostgreSQL: `drizzle-orm/pg-core`
- MySQL: `drizzle-orm/mysql-core`
- SQLite: `drizzle-orm/sqlite-core`
- SingleStore: `drizzle-orm/singlestore-core`

Both import-pattern (function-based) and builder-pattern (method-based) syntaxes are supported for all operations.

### schema-declaration
Define TypeScript database schemas with dialect-specific table functions, organize in single or multiple files, use column aliases or casing option for name mapping, reuse common columns, and leverage PostgreSQL schemas.

## Schema Declaration and Organization

Drizzle lets you define database schemas in TypeScript that serve as the source of truth for queries and migrations. All schema models must be exported so Drizzle-Kit can use them in migration generation.

### File Organization

**Single file approach** - Put all tables in one `schema.ts` file (or any name you prefer):
```
📦 src/db/schema.ts
```
Configure in `drizzle.config.ts`:
```ts
export default defineConfig({
  dialect: 'postgresql',
  schema: './src/db/schema.ts'
})
```

**Multiple files approach** - Spread tables across separate files and configure the schema folder:
```
📦 src/db/schema/
  ├ users.ts
  ├ posts.ts
  └ comments.ts
```
Configure in `drizzle.config.ts`:
```ts
export default defineConfig({
  dialect: 'postgresql',
  schema: './src/db/schema'
})
```
Drizzle recursively finds all files and extracts tables. You can also group files by domain (users.ts, messaging.ts, products.ts).

### Tables and Columns

Tables must be defined with at least 1 column using dialect-specific functions. TypeScript key names become database column names by default:

```ts
// PostgreSQL
import { pgTable, integer, varchar } from "drizzle-orm/pg-core"
export const users = pgTable('users', {
  id: integer(),
  first_name: varchar()
})

// MySQL
import { mysqlTable, int } from "drizzle-orm/mysql-core"
export const users = mysqlTable('users', {
  id: int()
})

// SQLite
import { sqliteTable, integer } from "drizzle-orm/sqlite-core"
export const users = sqliteTable('users', {
  id: integer()
})
```

### Column Aliases

Use different names in TypeScript vs database with column aliases:
```ts
export const users = pgTable('users', {
  id: integer(),
  firstName: varchar('first_name')  // TypeScript key: firstName, DB column: first_name
})
```

### Camel to Snake Case Mapping

Automatically map camelCase TypeScript names to snake_case database names using the `casing` option during DB initialization:
```ts
// schema.ts
export const users = pgTable('users', {
  id: integer(),
  firstName: varchar()  // No alias needed
})

// db.ts
const db = drizzle({ connection: process.env.DATABASE_URL, casing: 'snake_case' })

// Generates: SELECT "id", "first_name" from users
```

### Reusable Column Definitions

Define common columns once and spread them across tables:
```ts
// columns.helpers.ts
const timestamps = {
  updated_at: timestamp(),
  created_at: timestamp().defaultNow().notNull(),
  deleted_at: timestamp(),
}

// users.ts
export const users = pgTable('users', {
  id: integer(),
  ...timestamps
})

// posts.ts
export const posts = pgTable('posts', {
  id: integer(),
  ...timestamps
})
```

### PostgreSQL Schemas

PostgreSQL supports schemas (namespace containers). Define and use them:
```ts
import { pgSchema, integer } from "drizzle-orm/pg-core"

export const customSchema = pgSchema('custom')

export const users = customSchema.table('users', {
  id: integer()
})
```

### MySQL Schemas

MySQL schemas are equivalent to databases. They can be defined and used in queries but aren't detected by Drizzle-Kit for migrations:
```ts
import { mysqlSchema, int } from "drizzle-orm/mysql-core"

export const customSchema = mysqlSchema('custom')

export const users = customSchema.table('users', {
  id: int()
})
```

### SQLite

SQLite has no schema concept - tables exist within a single file context.

### Complete Example

PostgreSQL example with enums, primary keys, references, indexes, and constraints:
```ts
import { pgEnum, pgTable as table, integer, varchar, AnyPgColumn } from "drizzle-orm/pg-core"
import * as t from "drizzle-orm/pg-core"

export const rolesEnum = pgEnum("roles", ["guest", "user", "admin"])

export const users = table("users", {
  id: t.integer().primaryKey().generatedAlwaysAsIdentity(),
  firstName: t.varchar("first_name", { length: 256 }),
  lastName: t.varchar("last_name", { length: 256 }),
  email: t.varchar().notNull(),
  invitee: t.integer().references((): AnyPgColumn => users.id),
  role: rolesEnum().default("guest"),
}, (table) => [
  t.uniqueIndex("email_idx").on(table.email)
])

export const posts = table("posts", {
  id: t.integer().primaryKey().generatedAlwaysAsIdentity(),
  slug: t.varchar().$default(() => generateUniqueString(16)),
  title: t.varchar({ length: 256 }),
  ownerId: t.integer("owner_id").references(() => users.id),
}, (table) => [
  t.uniqueIndex("slug_idx").on(table.slug),
  t.index("title_idx").on(table.title),
])

export const comments = table("comments", {
  id: t.integer().primaryKey().generatedAlwaysAsIdentity(),
  text: t.varchar({ length: 256 }),
  postId: t.integer("post_id").references(() => posts.id),
  ownerId: t.integer("owner_id").references(() => users.id),
})
```

MySQL and SQLite have equivalent examples with dialect-specific functions (mysqlTable, sqliteTable, int vs integer, etc.).

### sql
Type-safe parameterized SQL template with automatic escaping, SQL injection prevention, runtime value mapping, and support for database-specific expressions in any query clause.

## Overview
The `sql` template is a type-safe, parameterized way to write raw SQL queries and fragments within Drizzle. It prevents SQL injection by automatically escaping table/column names and converting dynamic parameters to placeholders.

## Basic Usage
```typescript
import { sql } from 'drizzle-orm'
const id = 69;
await db.execute(sql`select * from ${usersTable} where ${usersTable.id} = ${id}`)
// Generates: select * from "users" where "users"."id" = $1; --> [69]
```
Tables and columns are automatically escaped, dynamic values become parameterized placeholders ($1, $2, etc.).

## Type Definition with `sql<T>`
Define custom return types for fields (purely a TypeScript helper, no runtime mapping):
```typescript
const response: { lowerName: string }[] = await db.select({
    lowerName: sql<string>`lower(${usersTable.name})`
}).from(usersTable);
```
Without `sql<T>`, the type would be `unknown`.

## Runtime Value Mapping with `.mapWith()`
Map database driver values at runtime:
```typescript
sql`...`.mapWith(usersTable.name);  // Replicates column's mapping strategy
sql`...`.mapWith({ mapFromDriverValue: (value: any) => { /* custom logic */ } });
sql`...`.mapWith(Number);
```

## Field Aliasing with `.as()`
Explicitly name custom fields:
```typescript
sql`lower(usersTable.name)`.as('lower_name')
// Generates: ... "usersTable"."name" as lower_name ...
```

## Raw SQL with `sql.raw()`
Include unescaped SQL without parameterization:
```typescript
sql.raw(`select * from users where id = ${12}`);
// Generates: select * from users where id = 12;

// vs parameterized:
sql`select * from users where id = ${12}`;
// Generates: select * from users where id = $1; --> [12]
```
Use `sql.raw()` inside `sql` to include unescaped strings:
```typescript
sql`select * from ${usersTable} where id = ${sql.raw(12)}`;
// Generates: select * from "users" where id = 12;
```

## Combining SQL Chunks
**`sql.fromList()`** - Concatenate multiple SQL chunks into one:
```typescript
const sqlChunks: SQL[] = [sql`select * from users`, sql` where `];
for (let i = 0; i < 5; i++) {
    sqlChunks.push(sql`id = ${i}`);
    if (i < 4) sqlChunks.push(sql` or `);
}
const finalSql: SQL = sql.fromList(sqlChunks)
// Generates: select * from users where id = $1 or id = $2 or id = $3 or id = $4 or id = $5; --> [0, 1, 2, 3, 4]
```

**`sql.join()`** - Like `fromList()` but with custom separators:
```typescript
const sqlChunks: SQL[] = [sql`select * from users`, sql`where`, sql`id = ${0}`, sql`or`, sql`id = ${1}`];
const finalSql: SQL = sql.join(sqlChunks, sql.raw(' '));
// Generates: select * from users where id = $1 or id = $2; --> [0, 1]
```

**`sql.append()`** - Dynamically add chunks to existing SQL:
```typescript
const finalSql = sql`select * from users`;
finalSql.append(sql` where `);
for (let i = 0; i < 5; i++) {
    finalSql.append(sql`id = ${i}`);
    if (i < 4) finalSql.append(sql` or `);
}
// Generates: select * from users where id = $1 or id = $2 or id = $3 or id = $4 or id = $5; --> [0, 1, 2, 3, 4]
```

**`sql.empty()`** - Start with blank SQL and build incrementally:
```typescript
const finalSql = sql.empty();
finalSql.append(sql`select * from users`);
finalSql.append(sql` where `);
// ... append more chunks
```

## Converting to Query String and Parameters
Specify database dialect to convert SQL template to query string and params:
```typescript
import { PgDialect } from 'drizzle-orm/pg-core';
const pgDialect = new PgDialect();
pgDialect.sqlToQuery(sql`select * from ${usersTable} where ${usersTable.id} = ${12}`);
// PostgreSQL: select * from "users" where "users"."id" = $1; --> [ 12 ]

import { MySqlDialect } from 'drizzle-orm/mysql-core';
const mysqlDialect = new MySqlDialect();
mysqlDialect.sqlToQuery(sql`select * from ${usersTable} where ${usersTable.id} = ${12}`);
// MySQL: select * from `users` where `users`.`id` = ?; --> [ 12 ]

import { SQLiteSyncDialect } from 'drizzle-orm/sqlite-core';
const sqliteDialect = new SQLiteSyncDialect();
sqliteDialect.sqlToQuery(sql`select * from ${usersTable} where ${usersTable.id} = ${12}`);
// SQLite: select * from "users" where "users"."id" = ?; --> [ 12 ]
```

## Using `sql` in Query Clauses

**SELECT** - Select custom fields with type safety:
```typescript
await db.select({
    id: usersTable.id,
    lowerName: sql<string>`lower(${usersTable.name})`,
    aliasedName: sql<string>`lower(${usersTable.name})`.as('aliased_column'),
    count: sql<number>`count(*)`.mapWith(Number) 
}).from(usersTable)
// Generates: select `id`, lower(`name`), lower(`name`) as `aliased_column`, count(*) from `users`;
```

**WHERE** - Use database-specific expressions not natively supported by Drizzle:
```typescript
const id = 77;
await db.select().from(usersTable).where(sql`${usersTable.id} = ${id}`)
// Generates: select * from "users" where "users"."id" = $1; --> [ 77 ]

// Advanced fulltext search:
const searchParam = "Ale";
await db.select().from(usersTable)
    .where(sql`to_tsvector('simple', ${usersTable.name}) @@ to_tsquery('simple', ${searchParam})`)
// Generates: select * from "users" where to_tsvector('simple', "users"."name") @@ to_tsquery('simple', '$1'); --> [ "Ale" ]
```

**ORDER BY** - Custom ordering logic:
```typescript
await db.select().from(usersTable).orderBy(sql`${usersTable.id} desc nulls first`)
// Generates: select * from "users" order by "users"."id" desc nulls first;
```

**GROUP BY and HAVING** - Custom grouping and filtering:
```typescript
await db.select({ 
    projectId: usersTable.projectId,
    count: sql<number>`count(${usersTable.id})`.mapWith(Number)
}).from(usersTable)
    .groupBy(sql`${usersTable.projectId}`)
    .having(sql`count(${usersTable.id}) > 300`)
// Generates: select "project_id", count("users"."id") from users group by "users"."project_id" having count("users"."id") > 300;
```

### transactions
Transaction API with nested savepoints, conditional rollback, return values, and dialect-specific isolation/access configuration for PostgreSQL, MySQL, SQLite, and SingleStore.

## Transactions

SQL transactions group one or more SQL statements into a single logical unit that either commits entirely or rolls back entirely.

### Basic Usage

Run statements in a transaction using `db.transaction()`:

```ts
await db.transaction(async (tx) => {
  await tx.update(accounts).set({ balance: sql`${accounts.balance} - 100.00` }).where(eq(users.name, 'Dan'));
  await tx.update(accounts).set({ balance: sql`${accounts.balance} + 100.00` }).where(eq(users.name, 'Andrew'));
});
```

### Nested Transactions with Savepoints

Drizzle supports savepoints via nested transactions:

```ts
await db.transaction(async (tx) => {
  await tx.update(accounts).set({ balance: sql`${accounts.balance} - 100.00` }).where(eq(users.name, 'Dan'));
  await tx.transaction(async (tx2) => {
    await tx2.update(users).set({ name: "Mr. Dan" }).where(eq(users.name, "Dan"));
  });
});
```

### Rollback on Condition

Call `tx.rollback()` to rollback the transaction based on business logic:

```ts
await db.transaction(async (tx) => {
  const [account] = await tx.select({ balance: accounts.balance }).from(accounts).where(eq(users.name, 'Dan'));
  if (account.balance < 100) {
    tx.rollback();
  }
  await tx.update(accounts).set({ balance: sql`${accounts.balance} - 100.00` }).where(eq(users.name, 'Dan'));
});
```

### Return Values

Transactions can return values:

```ts
const newBalance: number = await db.transaction(async (tx) => {
  await tx.update(accounts).set({ balance: sql`${accounts.balance} - 100.00` }).where(eq(users.name, 'Dan'));
  const [account] = await tx.select({ balance: accounts.balance }).from(accounts).where(eq(users.name, 'Dan'));
  return account.balance;
});
```

### Relational Queries in Transactions

Transactions work with relational query builder:

```ts
await db.transaction(async (tx) => {
  await tx.query.users.findMany({
    with: { accounts: true }
  });
});
```

### Dialect-Specific Configuration

**PostgreSQL** supports `isolationLevel` ("read uncommitted" | "read committed" | "repeatable read" | "serializable"), `accessMode` ("read only" | "read write"), and `deferrable`:

```ts
await db.transaction(async (tx) => {
  // statements
}, {
  isolationLevel: "read committed",
  accessMode: "read write",
  deferrable: true,
});
```

**MySQL** and **SingleStore** support `isolationLevel`, `accessMode`, and `withConsistentSnapshot`:

```ts
await db.transaction(async (tx) => {
  // statements
}, {
  isolationLevel: "read committed",
  accessMode: "read write",
  withConsistentSnapshot: true,
});
```

**SQLite** supports `behavior` ("deferred" | "immediate" | "exclusive"):

```ts
await db.transaction(async (tx) => {
  // statements
}, {
  behavior: "deferred",
});
```

### typebox
Plugin generating Typebox validation schemas from Drizzle ORM table/view/enum definitions; supports select/insert/update schemas with field refinements and factory functions for extended Typebox instances; comprehensive type mappings for all database column types.

## Overview
`drizzle-typebox` is a plugin for Drizzle ORM that generates Typebox schemas from Drizzle ORM schemas. Requires Drizzle ORM v0.36.0+, Typebox v0.34.8+, and drizzle-typebox@0.2.0+.

## Select Schema
Generates schemas for data queried from the database, useful for validating API responses. Supports tables, views, and enums.

```ts
import { pgTable, text, integer } from 'drizzle-orm/pg-core';
import { createSelectSchema } from 'drizzle-typebox';
import { Value } from '@sinclair/typebox/value';

const users = pgTable('users', {
  id: integer().generatedAlwaysAsIdentity().primaryKey(),
  name: text().notNull(),
  age: integer().notNull()
});

const userSelectSchema = createSelectSchema(users);
const rows = await db.select().from(users).limit(1);
const parsed = Value.Parse(userSelectSchema, rows[0]);
```

## Insert Schema
Generates schemas for data to be inserted into the database, useful for validating API requests. Generated columns are excluded.

```ts
const userInsertSchema = createInsertSchema(users);
const user = { name: 'Jane', age: 30 };
const parsed = Value.Parse(userInsertSchema, user);
await db.insert(users).values(parsed);
```

## Update Schema
Generates schemas for data to be updated in the database. All fields become optional and generated columns are excluded.

```ts
const userUpdateSchema = createUpdateSchema(users);
const user = { age: 35 };
const parsed = Value.Parse(userUpdateSchema, user);
await db.update(users).set(parsed).where(eq(users.name, 'Jane'));
```

## Refinements
Each create schema function accepts an optional parameter to extend, modify, or overwrite field schemas. Pass a callback function to extend/modify or a Typebox schema to overwrite.

```ts
const userSelectSchema = createSelectSchema(users, {
  name: (schema) => Type.String({ ...schema, maxLength: 20 }),
  bio: (schema) => Type.String({ ...schema, maxLength: 1000 }),
  preferences: Type.Object({ theme: Type.String() })
});
```

## Factory Functions
Use `createSchemaFactory` for advanced use cases like using an extended Typebox instance.

```ts
import { createSchemaFactory } from 'drizzle-typebox';
import { t } from 'elysia';

const { createInsertSchema } = createSchemaFactory({ typeboxInstance: t });
const userInsertSchema = createInsertSchema(users, {
  name: (schema) => t.Number({ ...schema }, { error: '`name` must be a string' })
});
```

## Data Type Reference
Comprehensive mapping of Drizzle ORM column types to Typebox schemas:

- **Boolean**: `pg.boolean()`, `mysql.boolean()`, `sqlite.integer({ mode: 'boolean' })` → `Type.Boolean()`
- **Date**: `pg.date({ mode: 'date' })`, `pg.timestamp({ mode: 'date' })`, etc. → `Type.Date()`
- **String**: `pg.text()`, `pg.varchar()`, `mysql.binary()`, etc. → `Type.String()`
- **UUID**: `pg.uuid()` → `Type.String({ format: 'uuid' })`
- **Char**: `pg.char({ length: 10 })` → `Type.String({ minLength: 10, maxLength: 10 })`
- **Varchar**: `pg.varchar({ length: 100 })` → `Type.String({ maxLength: 100 })`
- **MySQL Text Variants**: `mysql.tinytext()` → `Type.String({ maxLength: 255 })`, `mysql.text()` → `Type.String({ maxLength: 65_535 })`, `mysql.mediumtext()` → `Type.String({ maxLength: 16_777_215 })`, `mysql.longtext()` → `Type.String({ maxLength: 4_294_967_295 })`
- **Enum**: `pg.text({ enum: [...] })`, `mysql.mysqlEnum(...)` → `Type.Enum(enum)`
- **Integer Types**: 
  - `mysql.tinyint()` → `Type.Integer({ minimum: -128, maximum: 127 })`
  - `mysql.tinyint({ unsigned: true })` → `Type.Integer({ minimum: 0, maximum: 255 })`
  - `pg.smallint()` → `Type.Integer({ minimum: -32_768, maximum: 32_767 })`
  - `mysql.smallint({ unsigned: true })` → `Type.Integer({ minimum: 0, maximum: 65_535 })`
  - `pg.integer()` → `Type.Integer({ minimum: -2_147_483_648, maximum: 2_147_483_647 })`
  - `mysql.int({ unsigned: true })` → `Type.Integer({ minimum: 0, maximum: 4_294_967_295 })`
- **Float/Double**: `pg.real()`, `mysql.float()` → `Type.Number()` with appropriate bounds
- **BigInt**: `pg.bigint({ mode: 'bigint' })` → `Type.BigInt({ minimum: -9_223_372_036_854_775_808n, maximum: 9_223_372_036_854_775_807n })`
- **Year**: `mysql.year()` → `Type.Integer({ minimum: 1_901, maximum: 2_155 })`
- **Geometry**: `pg.point({ mode: 'tuple' })` → `Type.Tuple([Type.Number(), Type.Number()])`, `pg.point({ mode: 'xy' })` → `Type.Object({ x: Type.Number(), y: Type.Number() })`
- **Vectors**: `pg.vector({ dimensions: 3 })` → `Type.Array(Type.Number(), { minItems: 3, maxItems: 3 })`
- **Line**: `pg.line({ mode: 'abc' })` → `Type.Object({ a: Type.Number(), b: Type.Number(), c: Type.Number() })`, `pg.line({ mode: 'tuple' })` → `Type.Tuple([Type.Number(), Type.Number(), Type.Number()])`
- **JSON**: `pg.json()`, `pg.jsonb()`, `mysql.json()` → `Type.Recursive((self) => Type.Union([Type.Union([Type.String(), Type.Number(), Type.Boolean(), Type.Null()]), Type.Array(self), Type.Record(Type.String(), self)]))`
- **Arrays**: `pg.text().array(3)` → `Type.Array(Type.String(), { minItems: 3, maxItems: 3 })`

### update
UPDATE queries with .set(), .where(), optional .limit()/.orderBy()/.returning()/.with()/.from() clauses; database-specific feature support varies.

## SQL Update

Basic update syntax with `.set()` and `.where()`:
```typescript
await db.update(users)
  .set({ name: 'Mr. Dan' })
  .where(eq(users.name, 'Dan'));
```

Object keys must match column names. `undefined` values are ignored; pass `null` to set a column to null. SQL expressions can be passed as values:
```typescript
await db.update(users)
  .set({ updatedAt: sql`NOW()` })
  .where(eq(users.name, 'Dan'));
```

### Limit
Supported in MySQL, SQLite, SingleStore (not PostgreSQL). Use `.limit()` to restrict the number of rows updated:
```typescript
await db.update(usersTable).set({ verified: true }).limit(2);
```

### Order By
Use `.orderBy()` to sort rows before updating. Supports single or multiple fields with `asc()` and `desc()`:
```typescript
import { asc, desc } from 'drizzle-orm';

await db.update(usersTable).set({ verified: true }).orderBy(usersTable.name);
await db.update(usersTable).set({ verified: true }).orderBy(desc(usersTable.name));
await db.update(usersTable).set({ verified: true }).orderBy(asc(usersTable.name), desc(usersTable.name2));
```

### Update with Returning
Supported in PostgreSQL and SQLite. Retrieve updated rows after the update:
```typescript
const updatedUserId: { updatedId: number }[] = await db.update(users)
  .set({ name: 'Mr. Dan' })
  .where(eq(users.name, 'Dan'))
  .returning({ updatedId: users.id });
```

### WITH Clause
Use common table expressions (CTEs) to simplify complex queries:
```typescript
const averagePrice = db.$with('average_price').as(
  db.select({ value: sql`avg(${products.price})`.as('value') }).from(products)
);

const result = await db.with(averagePrice)
  .update(products)
  .set({ cheap: true })
  .where(lt(products.price, sql`(select * from ${averagePrice})`))
  .returning({ id: products.id });
```

### Update ... FROM
Supported in PostgreSQL and SQLite (from drizzle-orm@0.36.3+). Join the target table against other tables to compute which rows to update and their new values:
```typescript
await db
  .update(users)
  .set({ cityId: cities.id })
  .from(cities)
  .where(and(eq(cities.name, 'Seattle'), eq(users.name, 'John')));
```

Table aliases are supported:
```typescript
const c = alias(cities, 'c');
await db
  .update(users)
  .set({ cityId: c.id })
  .from(c);
```

In PostgreSQL, you can return columns from joined tables:
```typescript
const updatedUsers = await db
  .update(users)
  .set({ cityId: cities.id })
  .from(cities)
  .returning({ id: users.id, cityName: cities.name });
```

### migrate_to_0.21.0
Migration guide for drizzle-orm 0.21.0: remove CLI dialect prefixes, add mandatory `dialect` and optional `driver` to config, replace `connectionString`/`uri` with `url`, run snapshot upgrade, new driver auto-selection strategy, relations extraction, custom migration names, and direct migrate command.

## Migration Steps

1. **Remove dialect prefixes from CLI commands**: Change `drizzle-kit push:mysql` to `drizzle-kit push`, etc.

2. **Update drizzle.config.ts**:
   - Add mandatory `dialect` field: `"postgresql"`, `"mysql"`, or `"sqlite"`
   - Add optional `driver` field only if using `aws-data-api`, `turso`, `d1-http` (WIP), or `expo`
   - Replace `connectionString` or `uri` in `dbCredentials` with `url`
   - Add optional `migrations` object to customize migration storage:
     ```ts
     migrations: {
       table: "migrations",
       schema: "public" // PostgreSQL only
     }
     ```

3. **Upgrade snapshots**: Run `drizzle-kit up` for PostgreSQL and SQLite projects to upgrade snapshots to version 6.

## Configuration Example
```ts
import { defineConfig } from "drizzle-kit"

export default defineConfig({
    dialect: "sqlite", // "postgresql" | "mysql"
    driver: "turso", // optional
    dbCredentials: {
        url: ""
    },
    migrations: {
        table: "migrations",
        schema: "public"
    }
})
```

## Driver Auto-Selection Strategy

When no `driver` is specified, Drizzle attempts to find drivers in this order:

**PostgreSQL**: `pg` → `postgres` → `@vercel/postgres` → `@neondatabase/serverless`

**MySQL**: `mysql2` → `@planetscale/database`

**SQLite**: `@libsql/client` → `better-sqlite3`

If no driver is found, an error is thrown.

## Breaking Changes

- **Snapshots upgrade**: All PostgreSQL and SQLite snapshots upgraded to version 6
- **CLI commands**: Dialect prefix removed from all commands
- **MySQL schemas**: Drizzle Kit no longer handles schema changes for additional schemas/databases

## New Features

- **Pull relations**: Drizzle now extracts foreign key information from database and generates `relations.ts` file during introspection
- **Custom migration names**: Use `drizzle-kit generate --name init_db` to name migrations
- **New migrate command**: `drizzle-kit migrate` applies generated migrations directly from CLI, storing metadata in `__drizzle_migrations` table (or custom table/schema via config)

### valibot
Plugin to generate Valibot validation schemas from Drizzle ORM table definitions with createSelectSchema/createInsertSchema/createUpdateSchema functions and comprehensive type mapping including refinements for field customization.

## drizzle-valibot Plugin

Generate Valibot schemas from Drizzle ORM schemas for data validation.

**Installation**: Install `drizzle-valibot@0.3.0+` with Drizzle ORM v0.36.0+ and Valibot v1.0.0-beta.7+.

### Select Schema
Validates data queried from the database (API responses). Generated from table definitions, includes all columns. Supports tables, views, and enums.

```ts
const users = pgTable('users', {
  id: integer().generatedAlwaysAsIdentity().primaryKey(),
  name: text().notNull(),
  age: integer().notNull()
});

const userSelectSchema = createSelectSchema(users);
const parsed = parse(userSelectSchema, rows[0]); // Validates all fields are present
```

### Insert Schema
Validates data before inserting into the database (API requests). Auto-generated columns are excluded and required fields must be provided.

```ts
const userInsertSchema = createInsertSchema(users);
const user = { name: 'Jane', age: 30 };
const parsed = parse(userInsertSchema, user);
await db.insert(users).values(parsed);
```

### Update Schema
Validates data before updating in the database. All fields become optional, and auto-generated columns cannot be updated.

```ts
const userUpdateSchema = createUpdateSchema(users);
const user = { age: 35 };
const parsed = parse(userUpdateSchema, user);
await db.update(users).set(parsed).where(eq(users.name, 'Jane'));
```

### Refinements
Extend, modify, or overwrite field schemas using optional parameters. Callback functions extend/modify; Valibot schemas overwrite.

```ts
const userSelectSchema = createSelectSchema(users, {
  name: (schema) => pipe(schema, maxLength(20)), // Extends
  bio: (schema) => pipe(schema, maxLength(1000)), // Extends before nullable
  preferences: object({ theme: string() }) // Overwrites
});
```

### Data Type Reference
Complete mapping of Drizzle column types to Valibot schemas:

- **Boolean**: `pg.boolean()` → `boolean()`
- **Date**: `pg.date({ mode: 'date' })` → `date()`
- **String**: `pg.text()` → `string()`
- **UUID**: `pg.uuid()` → `pipe(string(), uuid())`
- **Char**: `pg.char({ length: 10 })` → `pipe(string(), length(10))`
- **Varchar**: `pg.varchar({ length: 100 })` → `pipe(string(), maxLength(100))`
- **MySQL text variants**: `tinytext` → `maxLength(255)`, `text` → `maxLength(65_535)`, `mediumtext` → `maxLength(16_777_215)`, `longtext` → `maxLength(4_294_967_295)`
- **Enum**: `pg.text({ enum: [...] })` → `enum([...])`
- **Integer types**: `pg.smallint()` → `pipe(number(), minValue(-32_768), maxValue(32_767), integer())`; `mysql.tinyint()` → `pipe(number(), minValue(-128), maxValue(127), integer())`; `mysql.tinyint({ unsigned: true })` → `pipe(number(), minValue(0), maxValue(255), integer())`; `mysql.smallint({ unsigned: true })` → `pipe(number(), minValue(0), maxValue(65_535), integer())`; `pg.integer()` → `pipe(number(), minValue(-2_147_483_648), maxValue(2_147_483_647), integer())`; `mysql.int({ unsigned: true })` → `pipe(number(), minValue(0), maxValue(4_294_967_295), integer())`
- **Float types**: `pg.real()` → `pipe(number(), minValue(-8_388_608), maxValue(8_388_607))`; `mysql.mediumint()` → `pipe(number(), minValue(-8_388_608), maxValue(8_388_607), integer())`; `mysql.float({ unsigned: true })` → `pipe(number(), minValue(0), maxValue(16_777_215))`; `mysql.mediumint({ unsigned: true })` → `pipe(number(), minValue(0), maxValue(16_777_215), integer())`; `pg.doublePrecision()` → `pipe(number(), minValue(-140_737_488_355_328), maxValue(140_737_488_355_327))`; `mysql.double({ unsigned: true })` → `pipe(number(), minValue(0), maxValue(281_474_976_710_655))`
- **BigInt (number mode)**: `pg.bigint({ mode: 'number' })` → `pipe(number(), minValue(-9_007_199_254_740_991), maxValue(9_007_199_254_740_991), integer())`; `mysql.serial()` → `pipe(number(), minValue(0), maxValue(9_007_199_254_740_991), integer())`
- **BigInt (bigint mode)**: `pg.bigint({ mode: 'bigint' })` → `pipe(bigint(), minValue(-9_223_372_036_854_775_808n), maxValue(9_223_372_036_854_775_807n))`; `mysql.bigint({ mode: 'bigint', unsigned: true })` → `pipe(bigint(), minValue(0n), maxValue(18_446_744_073_709_551_615n))`
- **Year**: `mysql.year()` → `pipe(number(), minValue(1_901), maxValue(2_155), integer())`
- **Geometry (tuple)**: `pg.point({ mode: 'tuple' })` → `tuple([number(), number()])`
- **Geometry (xy)**: `pg.point({ mode: 'xy' })` → `object({ x: number(), y: number() })`
- **Vector**: `pg.vector({ dimensions: 3 })` → `pipe(array(number()), length(3))`
- **Line (abc)**: `pg.line({ mode: 'abc' })` → `object({ a: number(), b: number(), c: number() })`
- **Line (tuple)**: `pg.line({ mode: 'tuple' })` → `tuple([number(), number(), number()])`
- **JSON**: `pg.json()` → `union([union([string(), number(), boolean(), null_()]), array(any()), record(string(), any())])`
- **Buffer**: `sqlite.blob({ mode: 'buffer' })` → `custom<Buffer>((v) => v instanceof Buffer)`
- **Arrays**: `pg.dataType().array(size)` → `pipe(array(baseDataTypeSchema), length(size))`

### views
Declare views via inline/standalone query builders (auto-inferred schema) or raw SQL (explicit schema); use `.existing()` for read-only views; PostgreSQL supports materialized views with refresh operations and advanced configuration options.

## Declaring Views

Views can be declared in three ways:
1. **Inline query builder**: Pass a callback to `.as()` that receives the query builder
2. **Standalone query builder**: Create a `QueryBuilder` instance and pass queries to `.as()`
3. **Raw SQL**: Use the `sql` operator when query builder syntax is insufficient

When using inline or standalone query builders, column schemas are automatically inferred. With raw SQL, you must explicitly declare the view columns schema.

### Basic Declaration (Inline Query Builder)

PostgreSQL example:
```ts
export const userView = pgView("user_view").as((qb) => qb.select().from(user));
export const customersView = pgView("customers_view").as((qb) => 
  qb.select().from(user).where(eq(user.role, "customer"))
);
```

MySQL and SQLite use `mysqlView` and `sqliteView` respectively with identical syntax.

### Selecting Specific Columns

```ts
export const customersView = pgView("customers_view").as((qb) => {
  return qb
    .select({
      id: user.id,
      name: user.name,
      email: user.email,
    })
    .from(user);
});
```

### Standalone Query Builder

```ts
import { QueryBuilder } from "drizzle-orm/pg-core";

const qb = new QueryBuilder();
export const userView = pgView("user_view").as(qb.select().from(user));
export const customersView = pgView("customers_view").as(
  qb.select().from(user).where(eq(user.role, "customer"))
);
```

### Raw SQL Declaration

When query builder doesn't support needed syntax, explicitly define columns:
```ts
const newYorkers = pgView('new_yorkers', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  cityId: integer('city_id').notNull(),
}).as(sql`select * from ${users} where ${eq(users.cityId, 1)}`);
```

Parameters in raw SQL are inlined rather than replaced with `$1`, `$2`, etc.

### Existing Views

For read-only access to existing database views, use `.existing()` so drizzle-kit won't generate a `CREATE VIEW` statement:
```ts
export const trimmedUser = pgView("trimmed_user", {
  id: serial("id"),
  name: text("name"),
  email: text("email"),
}).existing();
```

### Materialized Views (PostgreSQL Only)

PostgreSQL supports materialized views that persist results in table-like form:

```ts
const newYorkers = pgMaterializedView('new_yorkers').as((qb) => 
  qb.select().from(users).where(eq(users.cityId, 1))
);
```

Refresh materialized views at runtime:
```ts
await db.refreshMaterializedView(newYorkers);
await db.refreshMaterializedView(newYorkers).concurrently();
await db.refreshMaterializedView(newYorkers).withNoData();
```

### Advanced Configuration

Regular views support options like `checkOption`, `securityBarrier`, `securityInvoker`:
```ts
const newYorkers = pgView('new_yorkers')
  .with({
    checkOption: 'cascaded',
    securityBarrier: true,
    securityInvoker: true,
  })
  .as((qb) => { /* query */ });
```

Materialized views support index method, storage parameters, tablespace, and `withNoData()`:
```ts
const newYorkers = pgMaterializedView('new_yorkers')
  .using('btree')
  .with({
    fillfactor: 90,
    toast_tuple_target: 0.5,
    autovacuum_enabled: true,
  })
  .tablespace('custom_tablespace')
  .withNoData()
  .as((qb) => { /* query */ });
```

Supported databases: PostgreSQL, MySQL, SQLite (materialized views PostgreSQL only).

### introduction
Headless TypeScript ORM with zero dependencies offering SQL-like and relational query APIs, automatic migrations, full type safety, and serverless-ready design for PostgreSQL, MySQL, and SQLite.

## What is Drizzle ORM

Drizzle is a headless TypeScript ORM designed to be lightweight, performant, typesafe, and serverless-ready. It's a library with opt-in complementary tools that lets you build projects your way without forcing a specific structure around it.

Key distinction: Drizzle is not a "data framework" (like Django or Spring) that requires building projects around it. Instead, it's a library you build projects with.

## Core Features

**SQL-like Query API**: If you know SQL, you know Drizzle. The query API mirrors SQL syntax, eliminating the double learning curve of learning both SQL and a framework's custom API. You get familiar SQL schema declaration, queries, automatic migrations, and full SQL power.

Example query:
```typescript
await db
  .select()
  .from(countries)
  .leftJoin(cities, eq(cities.countryId, countries.id))
  .where(eq(countries.id, 10))
```

Schema definition:
```typescript
export const countries = pgTable('countries', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 256 }),
});

export const cities = pgTable('cities', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 256 }),
  countryId: integer('country_id').references(() => countries.id),
});
```

Generated migrations are standard SQL:
```sql
CREATE TABLE IF NOT EXISTS "countries" (
  "id" serial PRIMARY KEY NOT NULL,
  "name" varchar(256)
);

CREATE TABLE IF NOT EXISTS "cities" (
  "id" serial PRIMARY KEY NOT NULL,
  "name" varchar(256),
  "country_id" integer
);

ALTER TABLE "cities" ADD CONSTRAINT "cities_country_id_countries_id_fk" FOREIGN KEY ("country_id") REFERENCES "countries"("id") ON DELETE no action ON UPDATE no action;
```

**Relational Query API**: For common scenarios where SQL-like queries aren't optimal, Drizzle provides a Queries API for fetching nested relational data conveniently and performantly. Crucially, Drizzle always outputs exactly 1 SQL query regardless of nesting depth, making it safe for serverless databases without performance or roundtrip cost concerns.

Example:
```typescript
const result = await db.query.users.findMany({
  with: {
    posts: true
  },
});
```

## Technical Details

**Zero Dependencies**: Drizzle has exactly 0 dependencies, making it slim and serverless-ready by design.

**Database Support**: Dialect-specific implementation with native support for PostgreSQL, MySQL, and SQLite through industry-standard drivers. The library operates natively through these drivers rather than abstracting them.

**TypeScript**: Full TypeScript support with type safety throughout.

## Philosophy

Drizzle is described as "a good friend who's there for you when necessary and doesn't bother when you need some space" - emphasizing its non-intrusive nature and flexibility.

### zod
Generate Zod validation schemas from Drizzle ORM tables with createSelectSchema/createInsertSchema/createUpdateSchema, support field refinements and type coercion via createSchemaFactory, comprehensive data type mappings across PostgreSQL/MySQL/SQLite with bit-limit constraints.

## Overview
`drizzle-zod` is a plugin that generates Zod schemas from Drizzle ORM schemas, enabling validation of database queries and API requests/responses.

**Requirements:** drizzle-zod@0.6.0+, Drizzle ORM v0.36.0+, Zod v3.25.1+

## Select Schema
Validates data queried from the database. Generated from table definitions and can validate API responses.

```ts
import { pgTable, text, integer } from 'drizzle-orm/pg-core';
import { createSelectSchema } from 'drizzle-zod';

const users = pgTable('users', {
  id: integer().generatedAlwaysAsIdentity().primaryKey(),
  name: text().notNull(),
  age: integer().notNull()
});

const userSelectSchema = createSelectSchema(users);
const rows = await db.select().from(users).limit(1);
const parsed = userSelectSchema.parse(rows[0]); // Validates all fields match schema
```

Supports views and enums:
```ts
const roles = pgEnum('roles', ['admin', 'basic']);
const rolesSchema = createSelectSchema(roles);

const usersView = pgView('users_view').as((qb) => qb.select().from(users).where(gt(users.age, 18)));
const usersViewSchema = createSelectSchema(usersView);
```

## Insert Schema
Validates data before insertion into the database. Can validate API requests.

```ts
const userInsertSchema = createInsertSchema(users);
const user = { name: 'Jane', age: 30 };
const parsed = userInsertSchema.parse(user); // Validates required fields
await db.insert(users).values(parsed);
```

## Update Schema
Validates data for database updates. All fields become optional since updates are partial.

```ts
const userUpdateSchema = createUpdateSchema(users);
const user = { age: 35 };
const parsed = userUpdateSchema.parse(user); // Generated columns like `id` cannot be updated
await db.update(users).set(parsed).where(eq(users.name, 'Jane'));
```

## Refinements
Extend, modify, or overwrite field schemas using optional parameters. Callback functions extend/modify; Zod schemas overwrite.

```ts
const userSelectSchema = createSelectSchema(users, {
  name: (schema) => schema.max(20), // Extends schema
  bio: (schema) => schema.max(1000), // Extends before nullability applied
  preferences: z.object({ theme: z.string() }) // Overwrites field including nullability
});
```

## Factory Functions
Use `createSchemaFactory` for advanced use cases.

**Extended Zod instance:**
```ts
import { z } from '@hono/zod-openapi';
const { createInsertSchema } = createSchemaFactory({ zodInstance: z });
const userInsertSchema = createInsertSchema(users, {
  name: (schema) => schema.openapi({ example: 'John' })
});
```

**Type coercion:**
```ts
const { createInsertSchema } = createSchemaFactory({
  coerce: { date: true } // Coerce dates; set `coerce: true` for all types
});
const userInsertSchema = createInsertSchema(users);
// Generates z.coerce.date() for timestamp fields
```

## Data Type Reference
Maps Drizzle ORM column types to Zod schemas across PostgreSQL, MySQL, and SQLite:

- **Boolean:** `z.boolean()`
- **Date/Timestamp:** `z.date()`
- **String types (text, varchar, etc.):** `z.string()` with optional `.max(length)` or `.length(length)`
- **UUID:** `z.string().uuid()`
- **Bit:** `z.string().regex(/^[01]+$/).max(dimensions)`
- **Enum:** `z.enum(enum)`
- **Integer types:** `z.number().min(min).max(max).int()` with appropriate bit limits (8-bit, 16-bit, 32-bit, 48-bit, 64-bit)
- **BigInt:** `z.bigint().min(min).max(max)` for 64-bit values
- **Float/Double:** `z.number()` with appropriate bit limits
- **Year:** `z.number().min(1901).max(2155).int()`
- **Geometry (point):** `z.tuple([z.number(), z.number()])` or `z.object({ x: z.number(), y: z.number() })`
- **Vector/Halfvec:** `z.array(z.number()).length(dimensions)`
- **Line:** `z.object({ a: z.number(), b: z.number(), c: z.number() })` or tuple variant
- **JSON/JSONB:** `z.union([z.union([z.string(), z.number(), z.boolean(), z.null()]), z.record(z.any()), z.array(z.any())])`
- **Buffer:** `z.custom<Buffer>((v) => v instanceof Buffer)`
- **Arrays:** `z.array(baseDataTypeSchema).length(size)`

MySQL-specific limits: tinytext (255), text (65,535), mediumtext (16,777,215), longtext (4,294,967,295)

