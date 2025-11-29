

## Pages

### v0.23.2_release_notes
v0.23.2 fixes PostgreSQL schemaFilter enum detection bug and drizzle-kit up command

## Bug Fixes

**PostgreSQL schemaFilter Bug**: Fixed an issue where the `schemaFilter` object in push and introspect operations was not being respected. The tool was incorrectly detecting enums in schemas that were not included in the schemaFilter configuration.

**drizzle-kit up Command**: Fixed the `drizzle-kit up` command to function correctly starting from the sequences release.

### drizzleorm_v0.11.0_release
TypeScript ORM for PostgreSQL with fully typed schemas, compile-time safe queries, joins, CRUD operations, and automatic migration generation.

## Overview
DrizzleORM is an open-source TypeScript ORM supporting PostgreSQL with MySQL and SQLite support planned. It provides fully typed SQL schemas in-code for type safety and developer experience benefits.

## Schema Definition
Define tables as classes extending `PgTable` with typed columns. Supports enums, indexes, and foreign keys:
```ts
export const popularityEnum = createEnum({ alias: 'popularity', values: ['unknown', 'known', 'popular'] });

export class CountriesTable extends PgTable<CountriesTable> {
  id = this.serial("id").primaryKey();
  name = this.varchar("name", { size: 256 })
  nameIndex = this.uniqueIndex(this.name)
  public tableName(): string { return 'countries'; }
}

export class CitiesTable extends PgTable<CitiesTable> {
  id = this.serial("id").primaryKey();
  name = this.varchar("name", { size: 256 })
  countryId = this.int("country_id").foreignKey(CountriesTable, (country) => country.id)
  popularity = this.type(popularityEnum, "popularity")
  public tableName(): string { return 'cities'; }
}
```

## Connection and Basic Queries
Connect to database and execute typed queries:
```ts
const db = await drizzle.connect("postgres://user:password@host:port/db");
const usersTable = new UsersTable(db);
const users: User[] = await usersTable.select().execute();
```

## Filtering and Query Modifiers
Use `where` with `eq()`, `and()`, `or()` filters; support partial select, limit/offset, and ordering:
```ts
await table.select().where(eq(table.id, 42)).execute();
await table.select().where(and([eq(table.id, 42), eq(table.name, "Dan")])).execute();
await table.select().where(or([eq(table.id, 42), eq(table.id, 1)])).execute();

const result = await table.select({ mapped1: table.id, mapped2: table.name }).execute();
const { mapped1, mapped2 } = result[0];

await table.select().limit(10).offset(10).execute()
await table.select().orderBy((table) => table.name, Order.ASC).execute()
```

## Insert, Update, Delete
```ts
await usersTable.insert({ name: "Andrew", createdAt: new Date() }).execute();
await usersTable.insertMany([{ name: "Andrew", createdAt: new Date() }, { name: "Dan", createdAt: new Date() }]).execute();
await usersTable.update().where(eq(usersTable.name, 'Dan')).set({ name: 'Mr. Dan' }).execute();
await usersTable.delete().where(eq(usersTable.name, 'Dan')).execute();
```

## Joins
Fully typed joins prevent mistakes at compile time:
```ts
const result = await citiesTable.select()
  .leftJoin(usersTable, (cities, users) => eq(cities.userId, users.id))
  .where((cities, users) => eq(cities.id, 1))
  .execute();
const citiesWithUsers: { city: City, user: User }[] = result.map((city, user) => ({ city, user }));
```

## Many-to-Many Relationships
```ts
export class ManyToManyTable extends PgTable<ManyToManyTable> {
  userId = this.int('user_id').foreignKey(UsersTable, (table) => table.id, { onDelete: 'CASCADE' });
  groupId = this.int('group_id').foreignKey(ChatGroupsTable, (table) => table.id, { onDelete: 'CASCADE' });
}

const usersWithUserGroups = await manyToManyTable.select()
  .leftJoin(usersTable, (manyToMany, users) => eq(manyToManyTable.userId, users.id))
  .leftJoin(chatGroupsTable, (manyToMany, _users, chatGroups) => eq(manyToManyTable.groupId, chatGroups.id))
  .where((manyToMany, _users, userGroups) => eq(userGroups.id, 1))
  .execute();
```

## Migrations
CLI tool generates automatic migrations from TypeScript schema, handling renames and deletes with prompts. Generates SQL with table creation, indexes, and foreign key constraints.

### v0.16.2_release_notes
v0.16.2 adds PostgreSQL/MySQL schemas, database introspection, postgres.js driver support, and custom type definitions.

## PostgreSQL Schemas
Declare PostgreSQL schemas and create tables within them using `pgSchema()`:
```ts
import { pgSchema } from "drizzle-orm-pg";
export const mySchema = pgSchema("my_schema");
export const users = mySchema("users", {
  id: serial("id").primaryKey(),
  name: text("name"),
  email: text("email"),
});
```
Generates: `CREATE SCHEMA "my_schema"; CREATE TABLE "my_schema"."users" (...)`
drizzle-kit auto-generates migrations: `drizzle-kit generate:pg --schema=src/schema.ts --out=migrations/`

## MySQL Databases/Schemas
Declare MySQL databases/schemas and tables using `mysqlSchema()`:
```ts
import { mysqlSchema } from "drizzle-orm-mysql";
const mySchema = mysqlSchema("my_schema");
const users = mySchema("users", {
  id: serial("id").primaryKey(),
  name: text("name"),
  email: text("email"),
});
```
Generates: `CREATE DATABASE \`my_schema\`; CREATE TABLE \`my_schema\`.\`users\` (...)`
drizzle-kit auto-generates migrations: `drizzle-kit generate:mysql --schema=src/schema.ts --out=migrations/`

## PostgreSQL Introspection
Pull existing PostgreSQL database schema using drizzle-kit:
```shell
drizzle-kit introspect:pg --out=migrations/ --connectionString=postgresql://user:pass@host:port/db_name
```
Supports: enums, tables with native/non-native columns, indexes, foreign keys (including self-references and cyclic), and schemas. Generates `schema.ts` with full type definitions for all columns and relationships.

## Postgres.js Driver Support
Full support for postgres.js driver (lightweight and fast):
```ts
import { drizzle, PostgresJsDatabase } from "drizzle-orm-pg/postgres.js";
import postgres from "postgres";
import { users } from "./schema";

const client = postgres(connectionString);
const db: PostgresJsDatabase = drizzle(client);
const allUsers = await db.select(users);
```

## Custom Types for PostgreSQL and MySQL
Create non-native types using `customType()`:
```ts
// PostgreSQL
const customText = customType<{ data: string }>({
  dataType() { return "text"; }
});
const usersTable = pgTable("users", {
  name: customText("name").notNull(),
});

// MySQL
const customText = customType<{ data: string }>({
  dataType() { return "text"; }
});
const usersTable = mysqlTable("users", {
  name: customText("name").notNull(),
});
```

### unique_constraints_support
UNIQUE constraints for PostgreSQL (with NULLS NOT DISTINCT), MySQL, and SQLite via `.unique()` at column level or `unique('name').on(cols)` for multi-column constraints.

## UNIQUE Constraints Support

Added support for UNIQUE constraints across PostgreSQL, MySQL, and SQLite databases.

### PostgreSQL
- Single-column constraints: defined at column level with `.unique()` or `.unique('custom_name')`
- Multi-column constraints: defined in table config third parameter using `unique('name').on(columns)`
- Supports custom constraint names
- Supports `NULLS NOT DISTINCT` option to restrict multiple NULL values: `.unique('name', { nulls: 'not distinct' })` or `.nullsNotDistinct()`

Example:
```ts
// Single column
const table = pgTable('table', {
  id: serial('id').primaryKey(),
  name: text('name').notNull().unique(),
  state: char('state', { length: 2 }).unique('custom'),
  field: char('field', { length: 2 }).unique('custom_field', { nulls: 'not distinct' }),
});

// Multiple columns
const table = pgTable('table', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  state: char('state', { length: 2 }),
}, (t) => ({
  first: unique('custom_name').on(t.name, t.state).nullsNotDistinct(),
  second: unique('custom_name1').on(t.name, t.state),
}));
```

### MySQL
- Single-column constraints: `.unique()` or `.unique('custom_name')`
- Multi-column constraints: `unique('name').on(columns)` in table config
- Supports custom constraint names
- Does not support `NULLS NOT DISTINCT`

Example:
```ts
// Single column
const table = mysqlTable('table', {
  id: serial('id').primaryKey(),
  name: text('name').notNull().unique(),
  state: text('state').unique('custom'),
});

// Multiple columns
const table = mysqlTable('cities1', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  state: text('state'),
}, (t) => ({
  first: unique().on(t.name, t.state),
  second: unique('custom_name1').on(t.name, t.state),
}));
```

### SQLite
- Unique constraints are implemented as unique indexes internally
- Single-column constraints: `.unique()` or `.unique('custom_name')`
- Multi-column constraints: `unique('name').on(columns)` in table config
- Supports custom index names

Example:
```ts
// Single column
const table = sqliteTable('table', {
  id: int('id').primaryKey(),
  name: text('name').notNull().unique(),
  state: text('state').unique('custom'),
});

// Multiple columns
const table = sqliteTable('table', {
  id: int('id').primaryKey(),
  name: text('name').notNull(),
  state: text('state'),
}, (t) => ({
  first: unique().on(t.name, t.state),
  second: unique('custom').on(t.name, t.state),
}));
```

### v0.28.0_release_notes
v0.28.0: Removed nested relation filtering in where clauses, added mysql2 mode config for PlanetScale support, 430% IntelliSense speedup, rewrote relational queries with lateral joins for better performance, added insert with all defaults via empty objects.

## Breaking Changes

**Removed support for filtering by nested relations**: The `table` object in the `where` callback no longer includes fields from `with` and `extras`. This change enables more efficient relational queries with improved performance and row reads. Workarounds include applying filters manually after fetching rows or using the core API.

Example that no longer works:
```ts
const usersWithPosts = await db.query.users.findMany({
  where: (table, { sql }) => (sql`json_array_length(${table.posts}) > 0`),
  with: { posts: true },
});
```

**Added Relational Queries `mode` config for `mysql2` driver**: Drizzle relational queries generate a single SQL statement using lateral joins of subqueries. PlanetScale doesn't support lateral joins, so a mode configuration is required:
- `mode: "default"` for regular MySQL databases
- `mode: "planetscale"` for PlanetScale

```ts
const db = drizzle({ client, schema, mode: 'planetscale' });
```

## Performance Improvements

**IntelliSense performance**: 430% speed improvement for large schemas (tested on 85 tables, 666 columns, 26 enums, 172 indexes, 133 foreign keys).

**Relational Queries performance and read usage**: Complete rewrite of query generation strategy:
1. **Lateral Joins**: Uses "LEFT JOIN LATERAL" for efficient data retrieval; MySQL PlanetScale and SQLite use simple subquery selects
2. **Selective Data Retrieval**: Only necessary data is fetched, reducing dataset size and execution time
3. **Reduced Aggregations**: Replaced multiple aggregation functions with direct `json_build_array` within lateral joins
4. **Simplified Grouping**: Removed GROUP BY clause as lateral joins and subqueries handle aggregation more efficiently

Example query transformation:
```ts
const items = await db.query.comments.findMany({
  limit,
  orderBy: comments.id,
  with: {
    user: { columns: { name: true } },
    post: {
      columns: { title: true },
      with: { user: { columns: { name: true } } },
    },
  },
});
```

Old query used multiple GROUP BY clauses and CASE statements with json_agg. New query uses nested lateral joins with json_build_array for cleaner, more efficient execution.

## New Features

**Insert rows with default values for all columns**: Pass empty objects to insert rows with all default values:
```ts
await db.insert(usersTable).values({});
await db.insert(usersTable).values([{}, {}]);
```

### v0.28.1_release
v0.28.1 patch fixes Postgres array regressions from 0.28.0

## Release: v0.28.1 (2023-08-07)

This is a patch release that fixes Postgres array-related issues that were introduced in version 0.28.0.

### Fixes
- Resolved Postgres array handling bugs from 0.28.0 (issues #983, #992)

### v0.28.2_release_notes
v0.28.2: MySQL timestamp milliseconds fix, SQLite `.get()` type correction, sqlite-proxy double-execution fix, Typebox package added

## v0.28.2 Release (2023-08-10)

### Internal Features and Changes
- Added comprehensive test suite for D1 database
- Fixed issues in internal documentation

### Bug Fixes
- Resolved MySQL timestamp milliseconds truncation issue
- Corrected `.get()` method type signature for sqlite-based dialects (issue #565)
- Fixed sqlite-proxy bug causing queries to execute twice

### New Packages
- Added Typebox support via new drizzle-typebox package for schema validation integration

### v0.28.3_release_notes
v0.28.3: SQLite query API, column `.$defaultFn()` for runtime defaults, `$inferSelect`/`$inferInsert` table type inference, deprecated `InferModel`, fixed sqlite-proxy/SQL.js `.get()` empty results

## Fixes
- Fixed sqlite-proxy and SQL.js response from `.get()` when the result is empty

## New Features

### SQLite Simplified Query API
Added a simplified query API for SQLite databases.

### Column Builder Default Methods
Added `.$defaultFn()` and `.$default()` methods to column builders for specifying runtime default values. These methods accept a function that can implement any logic (e.g., `cuid()` for generating IDs). The default value is only used at runtime in drizzle-orm and does not affect drizzle-kit behavior.

Example:
```ts
import { varchar, mysqlTable } from "drizzle-orm/mysql-core";
import { createId } from '@paralleldrive/cuid2';

const table = mysqlTable('table', {
	id: varchar('id', { length: 128 }).$defaultFn(() => createId()),
});
```

Available for PostgreSQL, MySQL, and SQLite column types.

### Table Model Type Inference
Added `table.$inferSelect` / `table._.inferSelect` and `table.$inferInsert` / `table._.inferInsert` methods for convenient table model type inference. These replace the deprecated `InferModel` type.

Example:
```ts
import { InferSelectModel, InferInsertModel } from 'drizzle-orm'

const usersTable = pgTable('users', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  verified: boolean('verified').notNull().default(false),
  jsonb: jsonb('jsonb').$type<string[]>(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

type SelectUser = typeof usersTable.$inferSelect;
type InsertUser = typeof usersTable.$inferInsert;

type SelectUser2 = InferSelectModel<typeof usersTable>;
type InsertUser2 = InferInsertModel<typeof usersTable>;
```

### Other Changes
- Deprecated `InferModel` type in favor of `InferSelectModel` and `InferInsertModel`
- Disabled `.d.ts` files bundling

### v0.28.4_release
v0.28.4 fixes ESM imports and Postgres table type errors; @opentelemetry/api issue resolved in v0.28.5

## Release v0.28.4 (2023-08-24)

### Fixes
- Fixed imports in ESM-based projects (issue #1088)
- Fixed type error on Postgres table definitions (issue #1089)

### Note
If you encounter a `Cannot find package '@opentelemetry/api'` error, update to v0.28.5 where this is resolved.

### v0.28.5_release_-_opentelemetry_type_import_fix
v0.28.5 fixed runtime error from incorrect OpenTelemetry type import syntax (`import { type }` vs `import type`), causing disabled OpenTelemetry code to leak into runtime.

## v0.28.5 Release - OpenTelemetry Type Import Fix

**Fix:** Corrected an incorrect OpenTelemetry type import that caused a runtime error.

**Context:** The OpenTelemetry implementation in drizzle-orm is currently disabled and non-functional. It was an experimental feature designed to allow users to collect query statistics and send them to their own telemetry consumers, but it was disabled before release and does nothing in the current version. Drizzle itself does not collect or send any statistics.

**Root Cause:** The issue occurred due to incorrect import syntax on the tracing.ts file. The code used `import { type ... }` instead of the correct `import type { ... }` syntax. This caused the `import '@opentelemetry/api'` statement to leak into the runtime instead of being tree-shaken during compilation, resulting in a runtime error.

**Impact:** This was a critical fix for users experiencing runtime errors related to OpenTelemetry imports, even though the OpenTelemetry functionality itself is not active.

### v0.28.6_release_notes
v0.28.6: LibSQL batch API, SQLite JSON text mode, Relational Query .toSQL(), PostgreSQL array operators (arrayContains/arrayContained/arrayOverlaps), relational query where filter operators, MySQL datetime UTC fix.

## Changes
MySQL `datetime` with `mode: 'date'` now stores and retrieves dates in UTC strings to align with MySQL behavior. Use `mode: 'string'` or custom types for different behavior.

## New Features

**LibSQL batch API support**: Execute multiple queries in a single batch call using `db.batch()`. Supports all query builders: `db.all()`, `db.get()`, `db.values()`, `db.run()`, `db.query.<table>.findMany()`, `db.query.<table>.findFirst()`, `db.select()`, `db.update()`, `db.delete()`, `db.insert()`.

Example:
```ts
const batchResponse = await db.batch([
  db.insert(usersTable).values({ id: 1, name: 'John' }).returning({ id: usersTable.id }),
  db.update(usersTable).set({ name: 'Dan' }).where(eq(usersTable.id, 1)),
  db.query.usersTable.findMany({}),
  db.select().from(usersTable).where(eq(usersTable.id, 1)),
]);
```

**JSON mode for SQLite text columns**: Store and retrieve JSON data using text columns with `mode: 'json'`:
```ts
const test = sqliteTable('test', {
  dataTyped: text('data_typed', { mode: 'json' }).$type<{ a: 1 }>().notNull(),
});
```

**`.toSQL()` for Relational Query API**: Convert relational queries to SQL:
```ts
const query = db.query.usersTable.findFirst().toSQL();
```

**PostgreSQL array operators**: New operators for array operations:
- `arrayContains(posts.tags, ['Typescript', 'ORM'])` - check if array contains values
- `arrayContained(posts.tags, ['Typescript', 'ORM'])` - check if array is contained in values
- `arrayOverlaps(posts.tags, ['Typescript', 'ORM'])` - check if arrays overlap

Supports subqueries:
```ts
db.select({ id: posts.id }).from(posts).where(
  arrayContains(posts.tags, db.select({ tags: posts.tags }).from(posts).where(eq(posts.id, 1)))
);
```

**More SQL operators in Relational Query where filters**: Operators like `inArray` are now available as parameters in the where callback:
```ts
// Before
await db.users.findFirst({ where: (table, _) => inArray(table.id, [...]) })

// After
await db.users.findFirst({ where: (table, { inArray }) => inArray(table.id, [...]) })
```

## Fixes
- Correct where in on conflict in SQLite
- Fix libsql/client type import
- Fix raw SQL query mapping on RDS
- Fix datetime mapping for MySQL
- Fix smallserial generating as serial

### v0.29.0_release
v0.29.0 adds MySQL unsigned bigint, strict query builder types with dynamic mode, custom constraint names, read replicas, set operators (UNION/INTERSECT/EXCEPT), MySQL/PostgreSQL proxy drivers, and D1 Batch API support; requires Kit 0.20.0.

## MySQL unsigned bigint
Specify `bigint unsigned` type with `bigint('id', { mode: 'number', unsigned: true })`.

## Improved query builder types
Query builders now enforce single invocation of most methods by default (e.g., `.where()` can only be called once) to match SQL semantics. Enable dynamic mode with `.$dynamic()` to remove this restriction for dynamic query building:

```ts
const query = db.select().from(users).$dynamic();
withPagination(query, 1); // ✅ OK
```

## Custom names for primary and foreign keys
Specify custom constraint names to avoid database truncation issues:

```ts
const table = pgTable('table', {
  id: integer('id'),
  name: text('name'),
}, (table) => ({
  cpk: primaryKey({ name: 'composite_key', columns: [table.id, table.name] }),
  cfk: foreignKey({
    name: 'fkName',
    columns: [table.id],
    foreignColumns: [table.name],
  }),
}));
```

## Read replicas support
Use `withReplicas()` to specify read replicas and primary database for writes:

```ts
const db = withReplicas(primaryDb, [read1, read2]);
db.$primary.select().from(usersTable); // read from primary
db.select().from(usersTable); // read from random replica
db.delete(usersTable).where(eq(usersTable.id, 1)); // write to primary
```

Implement custom replica selection logic:

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
```

## Set operators (UNION, UNION ALL, INTERSECT, INTERSECT ALL, EXCEPT, EXCEPT ALL)
Use import or builder approach:

```ts
// Import approach
import { union } from 'drizzle-orm/pg-core'
const result = await union(allUsersQuery, allCustomersQuery);

// Builder approach
const result = await db.select().from(users).union(db.select().from(customers));
```

## MySQL proxy driver
Create custom HTTP driver implementation for MySQL. Implement two endpoints: one for queries and one for migrations (optional). Example:

```ts
import { drizzle } from 'drizzle-orm/mysql-proxy';
import { migrate } from 'drizzle-orm/mysql-proxy/migrator';

const db = drizzle(async (sql, params, method) => {
  const rows = await axios.post(`${process.env.REMOTE_DRIVER}/query`, {
    sql,
    params,
    method,
  });
  return { rows: rows.data };
});

await migrate(db, async (queries) => {
  await axios.post(`${process.env.REMOTE_DRIVER}/migrate`, { queries });
}, { migrationsFolder: 'drizzle' });
```

## PostgreSQL proxy driver
Same as MySQL proxy driver but for PostgreSQL:

```ts
import { drizzle } from 'drizzle-orm/pg-proxy';
import { migrate } from 'drizzle-orm/pg-proxy/migrator';

const db = drizzle(async (sql, params, method) => {
  const rows = await axios.post(`${process.env.REMOTE_DRIVER}/query`, { sql, params, method });
  return { rows: rows.data };
});

await migrate(db, async (queries) => {
  await axios.post(`${process.env.REMOTE_DRIVER}/query`, { queries });
}, { migrationsFolder: 'drizzle' });
```

## D1 Batch API support
Execute multiple queries in a single batch with proper typing:

```ts
const batchResponse = await db.batch([
  db.insert(usersTable).values({ id: 1, name: 'John' }).returning({ id: usersTable.id }),
  db.update(usersTable).set({ name: 'Dan' }).where(eq(usersTable.id, 1)),
  db.query.usersTable.findMany({}),
  db.select().from(usersTable).where(eq(usersTable.id, 1)),
]);
```

Supported builders: `db.all()`, `db.get()`, `db.values()`, `db.run()`, `db.query.<table>.findMany()`, `db.query.<table>.findFirst()`, `db.select()...`, `db.update()...`, `db.delete()...`, `db.insert()...`

## Drizzle Kit 0.20.0
- New `defineConfig` function for drizzle.config
- Cloudflare D1 access in Drizzle Studio via wrangler.toml
- Drizzle Studio migrated to https://local.drizzle.studio/
- `bigint unsigned` support
- Custom names for `primaryKeys` and `foreignKeys`
- Automatic environment variable fetching
- Bug fixes and improvements

**Minimum version requirement:** Drizzle ORM v0.29.0 requires Drizzle Kit v0.20.0 and vice versa.

### v0.29.1_release_notes
v0.29.1 adds aggregate function helpers (count, avg, sum, max, min with distinct variants), enhanced JSDoc for all query builders, fixes withReplica and selectDistinctOn, and introduces eslint-plugin-drizzle with enforce-delete-with-where and enforce-update-with-where rules.

## Fixes
- Fixed withReplica feature to correctly forward arguments
- Fixed selectDistinctOn to work with multiple columns

## New Features

### Enhanced JSDoc Documentation
All query builders across all dialects now include detailed JSDoc with hints, documentation links, and IDE integration support.

### Aggregate Function Helpers
New SQL helper functions for aggregation operations (typically used with GROUP BY):

- `count()` / `count(column)` - equivalent to `sql\`count('*')\`` or `sql\`count(${column})\``
- `countDistinct(column)` - equivalent to `sql\`count(distinct ${column})\``
- `avg(column)` / `avgDistinct(column)` - equivalent to `sql\`avg(${column})\`` or `sql\`avg(distinct ${column})\``
- `sum(column)` / `sumDistinct(column)` - equivalent to `sql\`sum(${column})\`` or `sql\`sum(distinct ${column})\``
- `max(column)` / `min(column)` - equivalent to `sql\`max(${column})\`` or `sql\`min(${column})\``

Example usage:
```ts
await db.select({ value: count() }).from(users);
await db.select({ value: countDistinct(users.id) }).from(users);
await db.select({ value: avg(users.id) }).from(users);
```

## New Package: Drizzle ESLint Plugin

ESLint plugin providing rules for scenarios where type checking is insufficient or produces unclear error messages.

### Installation
```
npm install eslint eslint-plugin-drizzle @typescript-eslint/eslint-plugin @typescript-eslint/parser
```

### Configuration
Create `.eslintrc.yml`:
```yaml
root: true
parser: '@typescript-eslint/parser'
parserOptions:
  project: './tsconfig.json'
plugins:
  - drizzle
extends:
  - "plugin:drizzle/recommended"
rules:
  'drizzle/enforce-delete-with-where': "error"
  'drizzle/enforce-update-with-where': "error"
```

### Rules

**enforce-delete-with-where**: Prevents accidental deletion of all table rows by requiring `.where()` clause in delete statements. Optionally configure `drizzleObjectName` to target specific objects (e.g., only `db.delete()`, not other class delete methods).

**enforce-update-with-where**: Prevents accidental update of all table rows by requiring `.where()` clause in update statements. Same `drizzleObjectName` configuration option available.

Example with drizzleObjectName:
```json
"rules": {
  "drizzle/enforce-delete-with-where": ["error", { "drizzleObjectName": ["db"] }]
}
```

### v0.29.2_release_notes
v0.29.2 release: bug fixes for PgArray, SQLite exists, AWS Data API dates; ESLint plugin v0.2.3 with function support; new Expo SQLite driver with migration support via babel/metro config and useMigrations hook.

## Bug Fixes
- Improved planescale relational tests
- Fixed string escaping for empty PgArrays
- Fixed incorrect syntax for SQLite exists function
- Fixed date handling in AWS Data API
- Fixed Hermes mixins constructor issue

## ESLint Plugin v0.2.3
- Added support for Drizzle objects retrieved from functions
- Improved error message context in suggestions

## New Expo SQLite Driver
Install with: `npm install drizzle-orm expo-sqlite@next`

Basic usage:
```ts
import { drizzle } from "drizzle-orm/expo-sqlite";
import { openDatabaseSync } from "expo-sqlite";

const expoDb = openDatabaseSync("db.db");
const db = drizzle(expoDb);

await db.select().from(...);
// or db.select().from(...).then(...);
// or db.select().from(...).all();
```

For migrations support, install `babel-plugin-inline-import` and update configuration files:

**babel.config.js:**
```ts
module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [["inline-import", { "extensions": [".sql"] }]]
  };
};
```

**metro.config.js:**
```ts
const { getDefaultConfig } = require('expo/metro-config');
const config = getDefaultConfig(__dirname);
config.resolver.sourceExts.push('sql');
module.exports = config;
```

**drizzle.config.ts:**
```ts
import type { Config } from 'drizzle-kit';

export default {
  schema: './db/schema.ts',
  out: './drizzle',
  dialect: 'sqlite',
  driver: 'expo',
} satisfies Config;
```

Generate migrations with: `npx drizzle-kit generate`

In **App.tsx**, use the migration hook:
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

### v0.29.3_release
v0.29.3 makes expo peer dependencies optional to fix Expo SQLite integration.

DrizzleORM v0.29.3 fixes expo peer dependencies by making them optional. This resolves issues where expo was being treated as a required dependency. The fix is relevant for projects using Expo SQLite with Drizzle, allowing the library to work properly in Expo environments without forcing expo as a hard dependency.

### v0.29.4_release_notes
v0.29.4 adds Neon HTTP batch queries and deprecates PlanetScale connect() in favor of Client instance (breaking in v0.30.0).

## Neon HTTP Batch Support

Added support for batching multiple queries with Neon HTTP driver. Use `db.batch()` to execute multiple operations (inserts, queries) in a single request:

```ts
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

const sql = neon(process.env.DRIZZLE_DATABASE_URL!);
const db = drizzle(sql);

const batchResponse = await db.batch([
	db.insert(usersTable).values({ id: 1, name: 'John' }).returning({ id: usersTable.id }),
	db.insert(usersTable).values({ id: 2, name: 'Dan' }),
	db.query.usersTable.findMany({}),
	db.query.usersTable.findFirst({}),
]);
```

The batch response is a tuple with types matching each operation in order.

## PlanetScale Client Instance Change

Updated PlanetScale integration to use `Client` instance instead of `connect()` function. The new recommended approach:

```ts
import { Client } from '@planetscale/database';
import { drizzle } from 'drizzle-orm/planetscale-serverless';

const client = new Client({
	host: process.env['DATABASE_HOST'],
	username: process.env['DATABASE_USERNAME'],
	password: process.env['DATABASE_PASSWORD'],
});

const db = drizzle(client);
```

Using `connect()` now shows a deprecation warning. Starting from version 0.30.0, passing anything other than a `Client` instance will throw an error. No breaking changes in v0.29.4, but migration is recommended.

### v0.29.5_release_notes
WITH clauses for INSERT/UPDATE/DELETE, custom migrations table/schema configuration, SQLite proxy batch and relational query support

## WITH Clauses for DML Statements

WITH (CTE) support added for INSERT, UPDATE, and DELETE statements. Example with DELETE:

```ts
const averageAmount = db.$with('average_amount').as(
	db.select({ value: sql`avg(${orders.amount})`.as('value') }).from(orders),
);

const result = await db
	.with(averageAmount)
	.delete(orders)
	.where(gt(orders.amount, sql`(select * from ${averageAmount})`))
	.returning({ id: orders.id });
```

Generates: `with "average_amount" as (select avg("amount") as "value" from "orders") delete from "orders" where "orders"."amount" > (select * from "average_amount") returning "id";`

## Custom Migrations Configuration

**Custom migrations table name** - Use `migrationsTable` option to specify table name (default: `__drizzle_migrations`):
```ts
await migrate(db, {
	migrationsFolder: './drizzle',
	migrationsTable: 'my_migrations',
});
```

**Custom migrations schema** - PostgreSQL only, use `migrationsSchema` option (default: `drizzle` schema):
```ts
await migrate(db, {
	migrationsFolder: './drizzle',
	migrationsSchema: 'custom',
});
```

## SQLite Proxy Enhancements

- Relational queries support: `.query.findFirst()` and `.query.findMany()` now work with sqlite proxy driver
- Batch requests support: Pass a batch callback function as second parameter to `drizzle()` to handle multiple queries:

```ts
const db = drizzle(
	async (sql, params, method) => { /* single query */ },
	async (queries: { sql: string; params: any[]; method: 'all' | 'run' | 'get' | 'values' }[]) => {
		const result = await axios.post('http://localhost:3000/batch', { queries });
		return result; // array of raw values in same order as sent
	},
);

await db.batch([/* queries */]);
```

### v0.30.0_release_notes
v0.30.0 breaks postgres.js date handling by mutating clients to return date strings, which Drizzle remaps per mode; fixes 8 timestamp/date bugs including mode mismatches and timezone issues.

## Breaking Changes

The postgres.js driver instance has been modified to always return strings for dates. Drizzle then maps these strings to either strings or Date objects based on the selected mode. This is a breaking change because:

1. The behavior of postgres.js client objects passed to Drizzle will be mutated - all dates will be strings in responses
2. Timestamps with and without timezone now always use `.toISOString()` for mapping to the driver
3. If you were relying on specific timestamp response types, behavior will change

The change was necessary because postgres.js doesn't support per-query mapping interceptors. The following parsers were overridden:

```ts
const transparentParser = (val: any) => val;
for (const type of ['1184', '1082', '1083', '1114']) {
	client.options.parsers[type as any] = transparentParser;
	client.options.serializers[type as any] = transparentParser;
}
```

This aligns all drivers with consistent behavior. The team is reaching out to postgres.js maintainers to explore per-query mapping capabilities to avoid client mutation in the future.

## Fixes

Multiple timestamp and date handling issues were resolved:
- timestamp with mode string returned Date object instead of string
- Dates always returned as dates regardless of mode
- Inconsistencies between TypeScript types and actual runtime values for timestamps
- String type annotations on timestamp columns that actually returned Date objects
- Wrong data types for postgres date columns
- Invalid timestamp conversion with PostgreSQL UTC timezone
- Milliseconds being removed during postgres timestamp inserts
- Invalid dates from relational queries

### v0.30.1_release_notes
v0.30.1: Added OP-SQLite driver support; fixed Expo driver migration hook

## OP-SQLite Driver Support

Added support for the OP-SQLite driver. To use it, import the driver from `@op-engineering/op-sqlite` and initialize it with a database name, then pass it to `drizzle()`:

```ts
import { open } from '@op-engineering/op-sqlite';
import { drizzle } from 'drizzle-orm/op-sqlite';

const opsqlite = open({ name: 'myDB' });
const db = drizzle(opsqlite);

await db.select().from(users);
```

## Fixes

- Migration hook fixed for Expo driver

### v0.30.10_release_notes
Added `.if()` conditional method to WHERE expressions; fixed AWS DataAPI session method mappings

## New Features

### `.if()` function for WHERE expressions
Added conditional `.if()` method to all WHERE expressions, enabling conditional query building. Example:

```ts
await db
  .select()
  .from(posts)
  .where(gt(posts.views, views).if(views > 100));
```

This allows WHERE conditions to be applied only when a certain predicate is true, useful for optional filtering based on runtime values.

## Bug Fixes

- Fixed internal mappings for sessions `.all()`, `.values()`, and `.execute()` functions in AWS DataAPI

### v0.30.2_release_notes
v0.30.2: LibSQL migrations switched to batch execution; bun:sqlite findFirst fixed

## LibSQL Migrations Update

LibSQL migrations now use batch execution instead of transactions. Batch operations execute multiple SQL statements sequentially within an implicit transaction - the backend commits all changes on success or performs a full rollback on any failure with no modifications applied.

## Fixes

- Fixed findFirst query for bun:sqlite (PR #1885)

### v0.30.3_release_notes
v0.30.3: raw query batching for Neon HTTP, fixed serverless types and sqlite-proxy .run() result

## New Features

- Added raw query support (`db.execute(...)`) to batch API in Neon HTTP driver, enabling batch execution of raw SQL queries alongside prepared statements

## Fixes

- Fixed `@neondatabase/serverless` HTTP driver types issue (GitHub issues #1945 and neondatabase/serverless#66)
- Fixed sqlite-proxy driver `.run()` result to return correct response format

### xata_driver_support
v0.30.4 adds native xata-http driver support for Xata Postgres platform; use drizzle-orm/xata-http with @xata.io/client or standard pg/postgres.js drivers

## Xata HTTP Driver Support

Drizzle ORM v0.30.4 adds native support for the Xata driver. Xata is a Postgres data platform focused on reliability, scalability, and developer experience. The Xata Postgres service is currently in beta.

### Installation

```
npm install drizzle-orm @xata.io/client
npm install -D drizzle-kit
```

### Usage with Xata Client

Use the Xata-generated client obtained by running `xata init` CLI command:

```ts
import { drizzle } from 'drizzle-orm/xata-http';
import { getXataClient } from './xata'; // Generated client

const xata = getXataClient();
const db = drizzle(xata);

const result = await db.select().from(...);
```

### Alternative Drivers

You can also connect to Xata using standard `pg` or `postgres.js` drivers instead of the native xata driver.

### drizzleorm_v0.30.5_release
v0.30.5: Added $onUpdate() for dynamic column values on updates (PostgreSQL/MySQL/SQLite); fixed smallserial insertion optionality

## $onUpdate Functionality

Adds dynamic update values to columns for PostgreSQL, MySQL, and SQLite. The `$onUpdate()` function is called when a row is updated, and its returned value is used as the column value if none is provided. If no `default` or `$defaultFn` is set, the function also runs on insert.

This is a runtime-only feature in drizzle-orm and does not affect drizzle-kit behavior.

Example with multiple use cases:
```ts
const usersOnUpdate = pgTable('users_on_update', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  updateCounter: integer('update_counter').default(sql`1`).$onUpdateFn(() => sql`update_counter + 1`),
  updatedAt: timestamp('updated_at', { mode: 'date', precision: 3 }).$onUpdate(() => new Date()),
  alwaysNull: text('always_null').$type<string | null>().$onUpdate(() => null),
});
```

The example shows: incrementing a counter on update, setting current timestamp on update, and setting a column to null on update.

## Fixes

- Insertions on columns with smallserial datatype are now correctly non-optional (issue #1848)

### pglite_driver_support
PGlite driver support: WASM Postgres for browser/Node.js/Bun with in-memory or persistent storage, integrated via drizzle-orm/pglite

## PGlite Driver Support

PGlite is a WASM-based Postgres implementation packaged as a TypeScript client library, enabling Postgres to run in browsers, Node.js, and Bun without external dependencies. The library is 2.6mb gzipped.

**Key characteristics:**
- Pure WASM Postgres (no Linux VM required)
- Supports ephemeral in-memory databases
- Supports persistent storage: file system (Node/Bun) or indexedDB (Browser)

**Usage:**
```ts
import { PGlite } from '@electric-sql/pglite';
import { drizzle } from 'drizzle-orm/pglite';
import { users } from './schema';

const client = new PGlite();
const db = drizzle(client);

await db.select().from(users);
```

The drizzle-orm integration allows you to use PGlite as a database client with the standard Drizzle ORM API.

### v0.30.7_release_notes
v0.30.7: Added Vercel Postgres mappings, fixed Neon driver interval type mapping

## Fixes

**@vercel/postgres package mappings added**
- Enables support for Vercel Postgres driver
- Documentation available for getting started with Vercel Postgres integration

**Interval mapping fix for neon drivers**
- Resolves issue #1542 where interval types were incorrectly mapped in Neon driver
- Neon PostgreSQL driver now correctly handles interval data types
- Documentation available for getting started with Neon integration

### v0.30.8_release_notes
v0.30.8: Postgres enum schema support, D1 batch API migration, split onConflictDoUpdate where clauses (setWhere/targetWhere), onConflictDoNothing where fix, AWS Data API array fixes.

## New Features

**Custom schema support for Postgres enums:**
```ts
import { pgSchema } from 'drizzle-orm/pg-core';

const mySchema = pgSchema('mySchema');
const colors = mySchema.enum('colors', ['red', 'green', 'blue']);
```
Enums can now be created within custom schemas in Postgres.

## Fixes

**D1 migrate() function:** Changed to use batch API for better performance with Cloudflare D1.

**Postgres .onConflictDoUpdate() method:** Split `where` clause into `setWhere` and `targetWhere` to properly support both where cases in ON CONFLICT clauses:
```ts
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

**Postgres .onConflictDoNothing() method:** Fixed query generation for `where` clause which was being placed in wrong location.

**AWS Data API driver:** Fixed multiple issues including inserting and updating array values.

### v0.30.9_release_notes
v0.30.9: Split SQLite `.onConflictDoUpdate()` `where` into `targetWhere` and `setWhere`, added `db._.fullSchema` for schema access, fixed AWS Data API migrator.

## New Features

**Enhanced `.onConflictDoUpdate()` for SQLite**: Replaced single `where` field with separate `setWhere` and `targetWhere` fields for more granular control over conflict resolution.

- `targetWhere`: Filters which rows are considered for the conflict check
- `setWhere`: Filters which rows receive the update

Example with `targetWhere`:
```ts
await db.insert(employees)
  .values({ employeeId: 123, name: 'John Doe' })
  .onConflictDoUpdate({
    target: employees.employeeId,
    targetWhere: sql`name <> 'John Doe'`,
    set: { name: sql`excluded.name` }
  });
```

Example with `setWhere`:
```ts
await db.insert(employees)
  .values({ employeeId: 123, name: 'John Doe' })
  .onConflictDoUpdate({
    target: employees.employeeId,
    set: { name: 'John Doe' },
    setWhere: sql`name <> 'John Doe'`
  });
```

**Schema Information Access**: Added `db._.fullSchema` to access schema information from Drizzle instances.

## Fixes

- Fixed migrator in AWS Data API

### v0.31.0_release_notes
v0.31.0: PostgreSQL indexes API redesigned (ordering per-column, .using() for index type), pg_vector support with distance helpers, point/line/geometry types, drizzle-kit v0.22.0 with extensionsFilters, SSL config, index expression fixes.

## Breaking Changes

**PostgreSQL Indexes API Overhaul**

The PostgreSQL indexes API was redesigned to align with PostgreSQL documentation. The previous API had fundamental issues:
- No support for SQL expressions in `.on()`
- `.using()` and `.on()` were conflated
- Ordering modifiers (`.asc()`, `.desc()`, `.nullsFirst()`, `.nullsLast()`) were on the index instead of per-column

New API structure:

```ts
// With .on() - ordering per column/expression
index('name')
  .on(table.column1.asc(), table.column2.nullsFirst())
  .where(sql``)
  .with({ fillfactor: '70' })

// With .using() - specify index type and operator classes
index('name')
  .using('btree', table.column1.asc(), sql`lower(${table.column2})`, table.column1.op('text_ops'))
  .where(sql``)
  .with({ fillfactor: '70' })
```

Requires `drizzle-kit@0.22.0` or higher.

## New Features

**pg_vector Extension Support**

Vector type with multiple distance metrics:

```ts
const table = pgTable('items', {
    embedding: vector('embedding', { dimensions: 3 })
}, (table) => ({
    l2: index('l2_index').using('hnsw', table.embedding.op('vector_l2_ops')),
    ip: index('ip_index').using('hnsw', table.embedding.op('vector_ip_ops')),
    cosine: index('cosine_index').using('hnsw', table.embedding.op('vector_cosine_ops')),
    l1: index('l1_index').using('hnsw', table.embedding.op('vector_l1_ops')),
    hamming: index('hamming_index').using('hnsw', table.embedding.op('bit_hamming_ops')),
    jaccard: index('jaccard_index').using('hnsw', table.embedding.op('bit_jaccard_ops'))
}))
```

Helper functions for vector queries:

```ts
import { l2Distance, l1Distance, innerProduct, cosineDistance, hammingDistance, jaccardDistance } from 'drizzle-orm'

db.select().from(items).orderBy(l2Distance(items.embedding, [3,1,2])).limit(5)
db.select({ distance: l2Distance(items.embedding, [3,1,2]) }).from(items)

const subquery = db.select({ embedding: items.embedding }).from(items).where(eq(items.id, 1))
db.select().from(items).orderBy(l2Distance(items.embedding, subquery)).limit(5)
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

**PostgreSQL Geometric Types: point and line**

`point` type with two modes:

```ts
const items = pgTable('items', {
 point: point('point'),  // tuple mode: [1,2]
 pointObj: point('point_xy', { mode: 'xy' }),  // xy mode: { x: 1, y: 2 }
});
```

`line` type with two modes:

```ts
const items = pgTable('items', {
 line: line('line'),  // tuple mode: [1,2,3]
 lineObj: line('line_abc', { mode: 'abc' }),  // abc mode: { a: 1, b: 2, c: 3 }
});
```

**PostGIS Extension Support**

`geometry` type with configurable geometry type and modes:

```ts
const items = pgTable('items', {
  geo: geometry('geo', { type: 'point' }),
  geoObj: geometry('geo_obj', { type: 'point', mode: 'xy' }),
  geoSrid: geometry('geo_options', { type: 'point', mode: 'xy', srid: 4000 }),
});
```

## Drizzle Kit v0.22.0 Updates

**New Type Support**

Kit now handles `point`, `line`, `vector`, and `geometry` types.

**extensionsFilters Config**

Skip extension-created tables during push/introspect:

```ts
export default defineConfig({
  dialect: "postgresql",
  extensionsFilters: ["postgis"],  // skips geography_columns, geometry_columns, spatial_ref_sys
})
```

**SSL Configuration**

Full SSL parameter support for PostgreSQL and MySQL:

```ts
export default defineConfig({
  dialect: "postgresql",
  dbCredentials: {
    ssl: true, // or "require" | "allow" | "prefer" | "verify-full" | node:tls options
  }
})
```

**SQLite/libsql URL Normalization**

Kit now accepts both file path patterns for libsql and better-sqlite3 drivers.

**MySQL/SQLite Index Expression Handling**

Expressions in indexes are no longer escaped as strings:

```ts
// Before: CREATE UNIQUE INDEX `emailUniqueIndex` ON `users` (`lower("users"."email")`)
// After: CREATE UNIQUE INDEX `emailUniqueIndex` ON `users` (lower("email"))

export const users = sqliteTable('users', {
    id: integer('id').primaryKey(),
    email: text('email').notNull(),
  }, (table) => ({
    emailUniqueIndex: uniqueIndex('emailUniqueIndex').on(sql`lower(${table.email})`),
  }));
```

**Index Limitations**

- Must specify index name manually if using expressions: `index('my_name').on(sql`lower(${table.email})`)`
- Push won't regenerate if these fields change: expressions in `.on()`/`.using()`, `.where()` statements, operator classes `.op()`. Workaround: comment out index, push, uncomment and modify, push again.
- Generate command has no such limitations.

**Bug Fixes**

- Multiple constraints not added (only first generated)
- Drizzle Studio connection termination errors
- SQLite local migrations execution
- Unknown '--config' option errors

### live_queries_with_expo_sqlite
useLiveQuery React Hook for Expo SQLite auto-rerunning queries on database changes, returning {data, error, updatedAt}

## Live Queries for Expo SQLite

Drizzle ORM v0.31.1 introduces native support for Expo SQLite Live Queries through a `useLiveQuery` React Hook that automatically observes database changes and re-runs queries when data changes.

### Setup

Enable change listeners when opening the database:
```tsx
import { useLiveQuery, drizzle } from 'drizzle-orm/expo-sqlite';
import { openDatabaseSync } from 'expo-sqlite';

const expo = openDatabaseSync('db.db', { enableChangeListener: true });
const db = drizzle(expo);
```

### Usage

The hook works with both SQL-like and Drizzle query syntax:
```tsx
import { Text } from 'react-native';
import { users } from './schema';

const App = () => {
  // Automatically re-renders when data changes
  const { data } = useLiveQuery(db.select().from(users));
  
  // Also works with Drizzle query API
  // const { data, error, updatedAt } = useLiveQuery(db.query.users.findFirst());
  // const { data, error, updatedAt } = useLiveQuery(db.query.users.findMany());

  return <Text>{JSON.stringify(data)}</Text>;
};
```

### API Design

The hook returns an object with `data`, `error`, and `updatedAt` fields for explicit error handling, following patterns from React Query and Electric SQL. The API intentionally uses `useLiveQuery(databaseQuery)` rather than method chaining to maintain conventional React Hook patterns.

### tidb_cloud_serverless_driver_support
v0.31.2: TiDB Cloud Serverless driver support via @tidbcloud/serverless and drizzle-orm/tidb-serverless

DrizzleORM v0.31.2 added support for TiDB Cloud Serverless driver. To use it, import the connect function from @tidbcloud/serverless and the drizzle function from drizzle-orm/tidb-serverless. Create a client by calling connect with a URL configuration, then initialize the database instance by passing the client to drizzle(). After setup, you can execute queries normally using the db instance.

Example:
```ts
import { connect } from '@tidbcloud/serverless';
import { drizzle } from 'drizzle-orm/tidb-serverless';

const client = connect({ url: '...' });
const db = drizzle(client);
await db.select().from(...);
```

### v0.31.3_release_notes
v0.31.3: RQB schema name collision fix, RDS Data API type hints fix, new Prisma integration extension via $extends(drizzle())

## Bug Fixes

- Fixed RQB (Relational Query Builder) behavior for tables with identical names across different schemas
- Fixed type hint mismatch when using RDS Data API (issue #2097)

## New Prisma-Drizzle Extension

A new extension enables seamless integration between Prisma and Drizzle ORM, allowing you to use Drizzle queries within Prisma's client:

```ts
import { PrismaClient } from '@prisma/client';
import { drizzle } from 'drizzle-orm/prisma/pg';
import { User } from './drizzle';

const prisma = new PrismaClient().$extends(drizzle());
const users = await prisma.$drizzle.select().from(User);
```

The extension is accessed via `prisma.$drizzle` and supports standard Drizzle query operations like `select().from()`. Additional documentation available in the Prisma integration guide.

### v0.31.4_release_notes
v0.31.4 makes prisma clients package optional

DrizzleORM v0.31.4 release marks the prisma clients package as optional, reducing unnecessary dependencies for users who don't use Prisma integration.

### v0.32.0_release_notes
v0.32.0 adds MySQL $returningId(), PostgreSQL sequences/identity columns, and generated columns (PostgreSQL/MySQL/SQLite) with Drizzle Kit migrations support and configurable migration file prefixes.

## MySQL `$returningId()` Function

MySQL lacks native `RETURNING` support for `INSERT`. Drizzle provides `$returningId()` to automatically retrieve inserted primary key IDs from autoincrement/serial columns:

```ts
const result = await db.insert(usersTable).values([{ name: 'John' }, { name: 'John1' }]).$returningId();
// Returns: { id: number }[]
```

Also works with custom primary keys generated via `$default` function:

```ts
const usersTableDefFn = mysqlTable('users_default_fn', {
  customId: varchar('id', { length: 256 }).primaryKey().$defaultFn(createId),
  name: text('name').notNull(),
});
const result = await db.insert(usersTableDefFn).values([{ name: 'John' }, { name: 'John1' }]).$returningId();
// Returns: { customId: string }[]
```

If no primary keys exist, returns `{}[]`.

## PostgreSQL Sequences

Define sequences with optional parameters in any schema:

```ts
import { pgSchema, pgSequence } from "drizzle-orm/pg-core";

export const customSequence = pgSequence("name");
export const customSequence = pgSequence("name", {
  startWith: 100,
  maxValue: 10000,
  minValue: 100,
  cycle: true,
  cache: 10,
  increment: 2
});

export const customSchema = pgSchema('custom_schema');
export const customSequence = customSchema.sequence("name");
```

## PostgreSQL Identity Columns

Replace deprecated `serial` type with identity columns (recommended approach):

```ts
import { pgTable, integer, text } from 'drizzle-orm/pg-core' 

export const ingredients = pgTable("ingredients", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity({ startWith: 1000 }),
  name: text("name").notNull(),
  description: text("description"),
});
```

Supports all sequence properties and custom sequence names.

## PostgreSQL Generated Columns

Create generated columns with expressions referencing other columns or static values:

```ts
import { SQL, sql } from "drizzle-orm";
import { customType, index, integer, pgTable, text } from "drizzle-orm/pg-core";

const tsVector = customType<{ data: string }>({
  dataType() { return "tsvector"; },
});

export const test = pgTable("test", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  content: text("content"),
  contentSearch: tsVector("content_search", { dimensions: 3 })
    .generatedAlwaysAs((): SQL => sql`to_tsvector('english', ${test.content})`),
}, (t) => ({
  idx: index("idx_content_search").using("gin", t.contentSearch),
}));

// Static expressions
export const users = pgTable("users", {
  id: integer("id"),
  name: text("name"),
  generatedName: text("gen_name").generatedAlwaysAs(sql`hello world!`),
  generatedName1: text("gen_name1").generatedAlwaysAs("hello world!"),
});
```

## MySQL Generated Columns

Specify `stored` or `virtual` generated columns:

```ts
export const users = mysqlTable("users", {
  id: int("id"),
  name: text("name"),
  generatedName: text("gen_name").generatedAlwaysAs(
    (): SQL => sql`${schema2.users.name} || 'hello'`,
    { mode: "stored" }
  ),
  generatedName1: text("gen_name1").generatedAlwaysAs(
    (): SQL => sql`${schema2.users.name} || 'hello'`,
    { mode: "virtual" }
  ),
});
```

Drizzle Kit `push` limitations: Cannot change generated expression or type; must drop and recreate columns. `generate` has no limitations.

## SQLite Generated Columns

Support for `stored` and `virtual` generated columns with limitations:

- Cannot change stored generated expressions in existing tables (requires table recreation)
- Cannot add stored expressions to existing columns (but can add virtual)
- Cannot change stored expressions (but can change virtual)
- Cannot change from virtual to stored (but can change from stored to virtual)

## Drizzle Kit Features

**Migrations support**: Full support for PostgreSQL sequences, identity columns, and generated columns across all dialects.

**`--force` flag for `push`**: Auto-accept all data-loss statements in CLI.

**Migration file prefix customization**:
```ts
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  migrations: {
    prefix: 'supabase'  // or 'timestamp', 'unix', 'none'
  }
});
```

- `index` (default): `0001_name.sql`
- `supabase`/`timestamp`: `20240627123900_name.sql`
- `unix`: `1719481298_name.sql`
- `none`: no prefix

### v0.32.1_release_notes
v0.32.1 bug fixes: index typings for 3+ columns, limit 0 support, empty array handling in inArray/notInArray, doc corrections

## Bug Fixes and Improvements

**Index Typings and Multi-Column Support**
- Fixed typings for indexes
- Added support for creating indexes on 3 or more columns with mixed columns and expressions

**Limit 0 Support**
- Added support for "limit 0" across all database dialects (resolves issue #2011)

**Array Operations**
- `inArray` and `notInArray` now accept empty lists (resolves issue #1295)

**Documentation Fixes**
- Fixed typo in `lt` typedoc
- Corrected wrong example in README.md

### v0.32.2_release_notes
v0.32.2 patch: AWS Data API type fixes, MySQL transaction bug fix, useLiveQuery dependency forwarding, expanded SQLite type exports

## Bug Fixes and Improvements

**AWS Data API Type Hints**: Fixed type hint bugs in the RQB (Query Builder) for AWS Data API integration.

**MySQL Transactions**: Resolved a bug affecting set transactions in MySQL.

**useLiveQuery Dependencies**: Added forwarding dependencies within `useLiveQuery` hook, addressing issue #2651 where dependencies were not properly propagated.

**SQLite Type Exports**: Expanded SQLite package exports to include additional types such as `AnySQLiteUpdate`, providing better type support for update operations.

This release focuses on stability improvements across multiple database drivers and query building utilities.

