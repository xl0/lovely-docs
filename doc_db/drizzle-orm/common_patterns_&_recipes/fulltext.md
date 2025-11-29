

## Pages

### conditional_filters_in_query
Conditional filtering with ternary operators, combining filters with and()/or(), dynamic filter arrays, and custom SQL-based filter operators.

## Using Conditional Filters

Pass conditional filters to `.where()` using ternary operators:

```ts
await db
  .select()
  .from(posts)
  .where(term ? ilike(posts.title, term) : undefined);
```

## Combining Multiple Conditional Filters

Use `and()` or `or()` operators to combine multiple conditional filters:

```ts
await db
  .select()
  .from(posts)
  .where(
    and(
      term ? ilike(posts.title, term) : undefined,
      categories.length > 0 ? inArray(posts.category, categories) : undefined,
      views > 100 ? gt(posts.views, views) : undefined,
    ),
  );
```

## Building Filters Dynamically

Create a `SQL[]` array, push filters to it, and pass to `.where()` with `and()` or `or()`:

```ts
const filters: SQL[] = [];
filters.push(ilike(posts.title, 'AI'));
filters.push(inArray(posts.category, ['Tech', 'Art', 'Science']));
filters.push(gt(posts.views, 200));

await db
  .select()
  .from(posts)
  .where(and(...filters));
```

## Creating Custom Filter Operators

Custom operators are SQL expressions. Use `sql` template tag and `AnyColumn` type:

```ts
const lenlt = (column: AnyColumn, value: number) => {
  return sql`length(${column}) < ${value}`;
};

await db
  .select()
  .from(posts)
  .where(
    and(
      maxLen ? lenlt(posts.title, maxLen) : undefined,
      views > 100 ? gt(posts.views, views) : undefined,
    ),
  );
```

## Implementation Details

Drizzle filter operators are SQL expressions. The `lt` operator is implemented as:

```js
const lt = (left, right) => {
  return sql`${left} < ${bindIfParam(right, left)}`;
};
```

Supported on PostgreSQL, MySQL, and SQLite.

### count_rows
count() function and sql operator for row counting; database-specific type casting (PostgreSQL/MySQL need integer cast, SQLite native); supports conditions, joins, and aggregations.

## Counting All Rows

Use the `count()` function or `sql` operator to count all rows:

```ts
import { count, sql } from 'drizzle-orm';
import { products } from './schema';

await db.select({ count: count() }).from(products);
// or
await db.select({ count: sql`count(*)`.mapWith(Number) }).from(products);
```

Result type: `{ count: number }[]`

## Counting Non-NULL Values in a Column

Pass a column to `count()` to count only non-NULL values:

```ts
await db.select({ count: count(products.discount) }).from(products);
```

## Database-Specific Type Casting

PostgreSQL and MySQL return `count()` as bigint (interpreted as string by drivers), requiring explicit casting to integer:

```ts
import { AnyColumn, sql } from 'drizzle-orm';

const customCount = (column?: AnyColumn) => {
  if (column) {
    return sql<number>`cast(count(${column}) as integer)`;
  } else {
    return sql<number>`cast(count(*) as integer)`;
  }
};

await db.select({ count: customCount() }).from(products);
await db.select({ count: customCount(products.discount) }).from(products);
```

SQLite returns `count()` as integer natively:

```ts
await db.select({ count: sql<number>`count(*)` }).from(products);
await db.select({ count: sql<number>`count(${products.discount})` }).from(products);
```

## Type Generics Warning

When using `sql<number>`, you declare the expected type. Drizzle cannot perform runtime type casts based on the generic—if specified incorrectly, the runtime value won't match. Use `.mapWith()` for runtime transformations.

## Counting with Conditions

Use `.where()` to count rows matching a condition:

```ts
import { count, gt } from 'drizzle-orm';

await db
  .select({ count: count() })
  .from(products)
  .where(gt(products.price, 100));
```

## Counting with Joins and Aggregations

Combine `count()` with joins and grouping:

```ts
import { count, eq } from 'drizzle-orm';
import { countries, cities } from './schema';

await db
  .select({
    country: countries.name,
    citiesCount: count(cities.id),
  })
  .from(countries)
  .leftJoin(cities, eq(countries.id, cities.countryId))
  .groupBy(countries.id)
  .orderBy(countries.name);
```

## Supported Databases

PostgreSQL, MySQL, SQLite

### cursor-based_pagination
Cursor-based pagination: use row pointer with comparison operators (gt/lt) and orderBy to efficiently fetch next pages; support multi-column cursors for non-unique columns and non-sequential PKs; index cursor columns.

## Cursor-based Pagination

Cursor-based pagination uses a cursor as a pointer to a specific row, indicating the end of the previous page, to fetch the next set of rows. This approach is more efficient than offset/limit pagination because it doesn't need to scan and skip previous rows.

### Basic Implementation

Use a cursor (typically a unique, sequential column like `id`) with comparison operators:

```ts
const nextUserPage = async (cursor?: number, pageSize = 3) => {
  await db
    .select()
    .from(users)
    .where(cursor ? gt(users.id, cursor) : undefined)
    .limit(pageSize)
    .orderBy(asc(users.id));
};

await nextUserPage(3); // get rows after id 3
```

### Dynamic Order Direction

Support ascending and descending order by adjusting both the comparison operator and sort direction:

```ts
const nextUserPage = async (order: 'asc' | 'desc' = 'asc', cursor?: number, pageSize = 3) => {
  await db
    .select()
    .from(users)
    .where(cursor ? (order === 'asc' ? gt(users.id, cursor) : lt(users.id, cursor)) : undefined)
    .limit(pageSize)
    .orderBy(order === 'asc' ? asc(users.id) : desc(users.id));
};
```

### Multi-column Cursor for Non-unique Columns

When ordering by non-unique, non-sequential columns, use multiple columns in the cursor. Order by the primary column, then by a unique sequential column:

```ts
const nextUserPage = async (
  cursor?: { id: number; firstName: string },
  pageSize = 3,
) => {
  await db
    .select()
    .from(users)
    .where(
      cursor
        ? or(
            gt(users.firstName, cursor.firstName),
            and(eq(users.firstName, cursor.firstName), gt(users.id, cursor.id)),
          )
        : undefined,
    )
    .limit(pageSize)
    .orderBy(asc(users.firstName), asc(users.id));
};

await nextUserPage({ id: 2, firstName: 'Alex' });
```

### Non-sequential Primary Keys (UUIDv4)

For non-sequential primary keys, add a sequential column (like `created_at`) and use it with the primary key in the cursor:

```ts
const nextUserPage = async (
  cursor?: { id: string; createdAt: Date },
  pageSize = 3,
) => {
  await db
    .select()
    .from(users)
    .where(
      cursor
        ? or(
            gt(users.createdAt, cursor.createdAt),
            and(eq(users.createdAt, cursor.createdAt), gt(users.id, cursor.id)),
          )
        : undefined,
    )
    .limit(pageSize)
    .orderBy(asc(users.createdAt), asc(users.id));
};

await nextUserPage({
  id: '66ed00a4-c020-4dfd-a1ca-5d2e4e54d174',
  createdAt: new Date('2024-03-09T17:59:36.406Z'),
});
```

### Relational Query API

Using the relational queries API:

```ts
const nextUserPage = async (cursor?: number, pageSize = 3) => {
  await db.query.users.findMany({
    where: (users, { gt }) => (cursor ? gt(users.id, cursor) : undefined),
    orderBy: (users, { asc }) => asc(users.id),
    limit: pageSize,
  });
};

await nextUserPage(3);
```

### Indexing

Create indices on cursor columns for query efficiency:

```ts
export const users = pgTable('users', {
  // columns
}, (t) => [
  index('first_name_index').on(t.firstName).asc(),
  index('first_name_and_id_index').on(t.firstName, t.id).asc(),
]);
```

### Benefits and Drawbacks

**Benefits**: Consistent query results with no skipped or duplicated rows when data is inserted/deleted; more efficient than offset/limit pagination.

**Drawbacks**: Cannot directly navigate to a specific page; more complex implementation, especially with multiple cursor columns.

Supported on PostgreSQL, MySQL, and SQLite.

### cloudflare_d1_http_api_with_drizzle_kit
Configure Drizzle Kit for Cloudflare D1 HTTP API with driver 'd1-http' and credentials from Cloudflare dashboard; supports migrate/push/introspect/studio commands.

## Configuration

To use Drizzle Kit with Cloudflare D1 HTTP API, configure `drizzle.config.ts`:

```ts
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/schema.ts',
  out: './migrations',
  dialect: 'sqlite',
  driver: 'd1-http',
  dbCredentials: {
    accountId: process.env.CLOUDFLARE_ACCOUNT_ID!,
    databaseId: process.env.CLOUDFLARE_DATABASE_ID!,
    token: process.env.CLOUDFLARE_D1_TOKEN!,
  },
});
```

## Obtaining Credentials

- **accountId**: Go to Cloudflare dashboard → Workers & Pages → Overview → copy Account ID from right sidebar
- **databaseId**: Open your D1 database in Cloudflare dashboard and copy Database ID
- **token**: Go to My profile → API Tokens → create token with D1 edit permissions

## Requirements

- Drizzle Kit version 0.21.3 or higher
- Cloudflare account with deployed D1 database
- API token with D1 edit permissions

## Supported Commands

After configuration, Drizzle Kit supports: `migrate`, `push`, `introspect`, and `studio` commands with Cloudflare D1 HTTP API.

## Browser Integration

Use the Drizzle Chrome Extension to browse Cloudflare D1 databases directly in the Cloudflare admin panel.

### sql_decrement_value
Decrement columns with `sql`${column} - value`` in update().set() or via custom helper function

## Decrementing Column Values

To decrement a column value, use the `update().set()` method with the `sql` operator:

```ts
import { eq, sql } from 'drizzle-orm';

await db
  .update(table)
  .set({
    counter: sql`${table.counter} - 1`,
  })
  .where(eq(table.id, 1));
```

This generates: `update "table" set "counter" = "counter" - 1 where "id" = 1;`

## Custom Decrement Function

Create a reusable decrement function for cleaner code:

```ts
import { AnyColumn } from 'drizzle-orm';

const decrement = (column: AnyColumn, value = 1) => {
  return sql`${column} - ${value}`;
};

await db
  .update(table)
  .set({
    counter1: decrement(table.counter1),
    counter2: decrement(table.counter2, 10),
  })
  .where(eq(table.id, 1));
```

Supported databases: PostgreSQL, MySQL, SQLite

### empty_array_as_a_default_value
Set empty array defaults in PostgreSQL with `sql`'{}'::type[]`, MySQL with `json` type and `[]` or `JSON_ARRAY()`, SQLite with `text` mode `json` and `json_array()` or `'[]'`; use `.$type<T>()` for compile-time type inference.

## PostgreSQL

Set empty array defaults using `sql` operator with `'{}'` or `ARRAY[]` syntax:

```ts
import { sql } from 'drizzle-orm';
import { pgTable, serial, text } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  tags1: text('tags1').array().notNull().default(sql`'{}'::text[]`),
  tags2: text('tags2').array().notNull().default(sql`ARRAY[]::text[]`),
});
```

## MySQL

MySQL lacks native array type; use `json` type instead. Set empty array defaults with `JSON_ARRAY()` function or `sql` operator with `('[]')` syntax:

```ts
import { sql } from 'drizzle-orm';
import { json, mysqlTable, serial, varchar } from 'drizzle-orm/mysql-core';

export const users = mysqlTable('users', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  tags1: json('tags1').$type<string[]>().notNull().default([]),
  tags2: json('tags2').$type<string[]>().notNull().default(sql`('[]')`),
  tags3: json('tags3').$type<string[]>().notNull().default(sql`(JSON_ARRAY())`),
});
```

Use `.$type<..>()` for compile-time type inference on json columns; it provides type safety for default values, insert and select schemas without runtime checks.

## SQLite

SQLite lacks native array type; use `text` type with `mode: 'json'` instead. Set empty array defaults with `json_array()` function or `sql` operator with `'[]'` syntax:

```ts
import { sql } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
  id: integer('id').primaryKey(),
  tags1: text('tags1', { mode: 'json' }).notNull().$type<string[]>().default(sql`(json_array())`),
  tags2: text('tags2', { mode: 'json' }).notNull().$type<string[]>().default(sql`'[]'`),
});
```

The `mode: 'json'` option treats values as JSON object literals in the application. Use `.$type<..>()` for compile-time type inference providing type safety for default values, insert and select schemas.

### full-text-search-with-generated-columns
Implement PostgreSQL full-text search using generated tsvector columns with optional weighted search across multiple fields using setweight() and GIN indexes.

## Full-Text Search with Generated Columns in PostgreSQL

Generated columns are special columns that are always computed from other columns, eliminating the need to recalculate values on every query.

### Basic Full-Text Search Setup

Create a `tsvector` custom type for PostgreSQL's text search vector:

```ts
export const tsvector = customType<{ data: string }>({
  dataType() {
    return `tsvector`;
  },
});
```

Define a table with a generated column that converts body text to a searchable vector:

```ts
export const posts = pgTable(
  'posts',
  {
    id: serial('id').primaryKey(),
    title: text('title').notNull(),
    body: text('body').notNull(),
    bodySearch: tsvector('body_search')
      .notNull()
      .generatedAlwaysAs((): SQL => sql`to_tsvector('english', ${posts.body})`),
  },
  (t) => [
    index('idx_body_search').using('gin', t.bodySearch),
  ]
);
```

The generated column is automatically computed when inserting rows:

```ts
await db.insert(posts).values({
  body: "Golden leaves cover the quiet streets...",
  title: "The Beauty of Autumn",
}).returning();
// Returns: bodySearch: "'air':13 'breez':10 'bring':14 'chang':23 'cover':3 'crisp':9 'fill':11 'golden':1 'leav':2 'promis':21 'quiet':5 'rain':18 'scent':16 'street':6"
```

Query using the `@@` operator for full-text matches:

```ts
const searchParam = "bring";
await db
  .select()
  .from(posts)
  .where(sql`${posts.bodySearch} @@ to_tsquery('english', ${searchParam})`);
```

### Advanced: Weighted Full-Text Search

Use `setweight()` to assign different importance levels to different columns. This marks entries from different document parts (e.g., title vs body) with different weights:

```ts
export const posts = pgTable(
  'posts',
  {
    id: serial('id').primaryKey(),
    title: text('title').notNull(),
    body: text('body').notNull(),
    search: tsvector('search')
      .notNull()
      .generatedAlwaysAs(
        (): SQL =>
          sql`setweight(to_tsvector('english', ${posts.title}), 'A')
           ||
           setweight(to_tsvector('english', ${posts.body}), 'B')`,
      ),
  },
  (t) => [
    index('idx_search').using('gin', t.search),
  ],
);
```

Query the weighted search column:

```ts
const search = 'travel';
await db
  .select()
  .from(posts)
  .where(sql`${posts.search} @@ to_tsquery('english', ${search})`);
```

### Key Points

- Generated columns are stored (GENERATED ALWAYS AS ... STORED), so they persist in the database
- Use GIN indexes on tsvector columns for efficient full-text search
- The `@@` operator performs full-text matching between tsvector and tsquery
- `to_tsvector()` converts text to a searchable vector format
- `to_tsquery()` converts search terms to query format
- `setweight()` assigns importance levels (A, B, C, D) to different parts of the search vector

### gel_auth_extension
Integrate Gel's auth extension: define schema with auth extension and User type, apply migrations, configure drizzle.config.ts with gel dialect and auth schema filter, run drizzle-kit pull to generate typed Identity and User tables.

## Setting up Gel auth extension with Drizzle ORM

This guide covers integrating Gel's auth extension with Drizzle ORM for managing user authentication.

### Prerequisites
- Gel database setup (see get-started-gel)
- drizzle-kit pull command available

### Step 1: Define Gel auth schema
Add auth extension to `dbschema/default.esdl`:
```esdl
using extension auth;

module default {
  global current_user := (
    assert_single((
      select User { id, username, email }
      filter .identity = global ext::auth::ClientTokenIdentity
    ))
  );

  type User {
    required identity: ext::auth::Identity;
    required username: str;
    required email: str;
  }
}
```

### Step 2: Push schema to database
Generate and apply Gel migrations:
```bash
gel migration create
gel migration apply
```

### Step 3: Configure Drizzle
Create `drizzle.config.ts`:
```typescript
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  dialect: 'gel',
  schemaFilter: ['ext::auth', 'public']
});
```

### Step 4: Pull schema to Drizzle
Run `drizzle-kit pull` to generate TypeScript schema file.

Generated schema includes all auth tables. Example output:
```typescript
import { gelTable, uniqueIndex, uuid, text, gelSchema, timestamptz, foreignKey } from "drizzle-orm/gel-core"
import { sql } from "drizzle-orm"

export const extauth = gelSchema('ext::auth');

export const identityInExtauth = extauth.table('Identity', {
	id: uuid().default(sql`uuid_generate_v4()`).primaryKey().notNull(),
	createdAt: timestamptz('created_at').default(sql`(clock_timestamp())`).notNull(),
	issuer: text().notNull(),
	modifiedAt: timestamptz('modified_at').notNull(),
	subject: text().notNull(),
}, (table) => [
	uniqueIndex('6bc2dd19-bce4-5810-bb1b-7007afe97a11;schemaconstr').using(
		'btree',
		table.id.asc().nullsLast().op('uuid_ops'),
	),
]);

export const user = gelTable('User', {
	id: uuid().default(sql`uuid_generate_v4()`).primaryKey().notNull(),
	email: text().notNull(),
	identityId: uuid('identity_id').notNull(),
	username: text().notNull(),
}, (table) => [
	uniqueIndex('d504514c-26a7-11f0-b836-81aa188c0abe;schemaconstr').using(
		'btree',
		table.id.asc().nullsLast().op('uuid_ops'),
	),
	foreignKey({
		columns: [table.identityId],
		foreignColumns: [identityInExtauth.id],
		name: 'User_fk_identity',
	}),
]);
```

The drizzle-kit pull command generates all auth extension tables, not just Identity. After pulling, auth tables are ready for use in queries.

### include_or_exclude_columns_in_query
Select all/specific/extra columns or exclude columns using `.select()` with `getTableColumns()`, or use relational queries with `columns`/`extras`/`with` options; supports conditional selection via spread operator.

## Including All Columns

Use `.select()` without arguments to select all columns:
```ts
await db.select().from(posts);
// Result: { id, title, content, views }[]
```

## Including Specific Columns

Pass an object to `.select()` with desired columns:
```ts
await db.select({ title: posts.title }).from(posts);
// Result: { title }[]
```

## Including All Columns Plus Extra Columns

Use `getTableColumns()` utility to spread all columns and add computed fields:
```ts
import { getTableColumns, sql } from 'drizzle-orm';

await db.select({
  ...getTableColumns(posts),
  titleLength: sql<number>`length(${posts.title})`,
}).from(posts);
// Result: { id, title, content, views, titleLength }[]
```

## Excluding Columns

Use `getTableColumns()` with destructuring to exclude specific columns:
```ts
import { getTableColumns } from 'drizzle-orm';

const { content, ...rest } = getTableColumns(posts);
await db.select({ ...rest }).from(posts);
// Result: { id, title, views }[]
```

## With Joins

Combine column selection with joins by destructuring and spreading:
```ts
const { userId, postId, ...rest } = getTableColumns(comments);

await db.select({
  postId: posts.id,
  comment: { ...rest },
  user: users,
}).from(posts)
  .leftJoin(comments, eq(posts.id, comments.postId))
  .leftJoin(users, eq(users.id, posts.userId));
// Result: { postId, comment: { id, content, createdAt } | null, user: { id, name, email } | null }[]
```

## Relational Queries - Include All

Use `.findMany()` without options:
```ts
await db.query.posts.findMany();
// Result: { id, title, content, views }[]
```

## Relational Queries - Include Specific Columns

Use `columns` option with boolean flags:
```ts
await db.query.posts.findMany({
  columns: { title: true },
});
// Result: { title }[]
```

## Relational Queries - Include All Plus Extra

Use `extras` option with computed fields:
```ts
await db.query.posts.findMany({
  extras: {
    titleLength: sql<number>`length(${posts.title})`.as('title_length'),
  },
});
// Result: { id, title, content, views, titleLength }[]
```

## Relational Queries - Exclude Columns

Use `columns` option with `false` values:
```ts
await db.query.posts.findMany({
  columns: { content: false },
});
// Result: { id, title, views }[]
```

## Relational Queries - With Relations

Use `with` option to control columns in related tables:
```ts
await db.query.posts.findMany({
  columns: { id: true },
  with: {
    comments: {
      columns: { userId: false, postId: false },
    },
    user: true,
  },
});
// Result: { id, user: { id, name, email }, comments: { id, content, createdAt }[] }[]
```

## Conditional Selection

Use spread operator with conditional logic:
```ts
const searchPosts = async (withTitle = false) => {
  await db.select({
    id: posts.id,
    ...(withTitle && { title: posts.title }),
  }).from(posts);
};
// Result: { id, title?: string }[]
```

Supported on PostgreSQL, MySQL, and SQLite.

### sql_increment_value
Increment columns with sql`${column} + value` in update().set(), or create a reusable increment(column, value) helper function.

## Incrementing Column Values

To increment a column value, use the `update().set()` method with the `sql` operator:

```ts
import { eq, sql } from 'drizzle-orm';

await db
  .update(table)
  .set({
    counter: sql`${table.counter} + 1`,
  })
  .where(eq(table.id, 1));
```

This generates: `update "table" set "counter" = "counter" + 1 where "id" = 1;`

## Custom Increment Function

Create a reusable increment helper:

```ts
import { AnyColumn } from 'drizzle-orm';

const increment = (column: AnyColumn, value = 1) => {
  return sql`${column} + ${value}`;
};

await db
  .update(table)
  .set({
    counter1: increment(table.counter1),
    counter2: increment(table.counter2, 10),
  })
  .where(eq(table.id, 1));
```

Supported databases: PostgreSQL, MySQL, SQLite

### limit_offset_pagination
Implement limit/offset pagination with unique column ordering; use deferred joins for large tables; consider cursor-based pagination for real-time data changes.

## Limit/Offset Pagination

Limit/offset pagination skips a number of rows and returns a fixed page size. Limit is the page size, offset is `(page - 1) * pageSize`.

### Basic Usage

```ts
await db
  .select()
  .from(users)
  .orderBy(asc(users.id))
  .limit(4)
  .offset(4);
```

Generates: `select * from users order by id asc limit 4 offset 4;`

### Ordering Requirements

For consistent pagination, order by a unique column. If ordering by a non-unique column, append a unique column:

```ts
const getUsers = async (page = 1, pageSize = 3) => {
  await db
    .select()
    .from(users)
    .orderBy(asc(users.firstName), asc(users.id))
    .limit(pageSize)
    .offset((page - 1) * pageSize);
}
```

### Relational Query API

```ts
const getUsers = async (page = 1, pageSize = 3) => {
  await db.query.users.findMany({
    orderBy: (users, { asc }) => asc(users.id),
    limit: pageSize,
    offset: (page - 1) * pageSize,
  });
};
```

### Custom Pagination Function

```ts
function withPagination<T extends PgSelect>(
  qb: T,
  orderByColumn: PgColumn | SQL | SQL.Aliased,
  page = 1,
  pageSize = 3,
) {
  return qb
    .orderBy(orderByColumn)
    .limit(pageSize)
    .offset((page - 1) * pageSize);
}

const query = db.select().from(users);
await withPagination(query.$dynamic(), asc(users.id));
```

### Deferred Join Optimization

For better performance on large tables, use deferred join to paginate a subset before joining:

```ts
const getUsers = async (page = 1, pageSize = 10) => {
   const sq = db
    .select({ id: users.id })
    .from(users)
    .orderBy(users.id)
    .limit(pageSize)
    .offset((page - 1) * pageSize)
    .as('subquery');

   await db.select().from(users).innerJoin(sq, eq(users.id, sq.id)).orderBy(users.id);
};
```

### Benefits

- Simple to implement
- Pages are easily reachable; can navigate to any page without saving state

### Drawbacks

- Query performance degrades with increasing offset because the database must scan all rows before the offset to skip them
- Inconsistency due to data shifts: rows can appear on multiple pages or be skipped entirely if data is inserted/deleted between requests

Example: If a row is deleted while browsing, the next page may skip a row that was previously visible.

### When to Use

Use limit/offset for small datasets or when performance is not critical. For databases with frequent insert/delete operations or when paginating large tables, consider cursor-based pagination instead.

Supported on PostgreSQL, MySQL, and SQLite.

### mysql_local_setup
Pull MySQL Docker image, start container with root password and port mapping, connect via mysql://root:password@localhost:3306/database URL

## Setup MySQL locally with Docker

### Prerequisites
- Install Docker Desktop for your operating system

### Pull MySQL Image
Pull the latest MySQL image from Docker Hub:
```bash
docker pull mysql
```

Or pull a specific version:
```bash
docker pull mysql:8.2
```

Verify the image is downloaded with `docker images`.

### Start MySQL Container
Run a MySQL container with:
```bash
docker run --name drizzle-mysql -e MYSQL_ROOT_PASSWORD=mypassword -d -p 3306:3306 mysql
```

Command options:
- `--name drizzle-mysql`: Container name
- `-e MYSQL_ROOT_PASSWORD=mypassword`: Root user password
- `-d`: Run in detached mode (background)
- `-p 3306:3306`: Map container port 3306 to host port 3306
- `mysql`: Image name (can specify version like `mysql:8.2`)

Optional parameters:
- `-e MYSQL_DATABASE=`: Create a database on startup (default: `mysql`)
- `-e MYSQL_USER=` and `-e MYSQL_PASSWORD=`: Create a new user with password (still requires `MYSQL_ROOT_PASSWORD`)

Verify container is running with `docker ps`.

### Configure Database URL
Connection URL format:
```plaintext
mysql://<user>:<password>@<host>:<port>/<database>
```

Example for the created container:
```plaintext
mysql://root:mypassword@localhost:3306/mysql
```

Use this URL to connect to the database in your application.

### point_datatype_in_postgresql
PostgreSQL point datatype: define with point(), insert as {x,y}/[x,y]/sql, query distances with <-> operator, filter boundaries with <@ operator.

PostgreSQL's `point` datatype stores geometric data as (x, y) coordinates in 2D space, with longitude first, then latitude.

**Creating a table with point column:**
```ts
import { pgTable, point, serial, text } from 'drizzle-orm/pg-core';

export const stores = pgTable('stores', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  location: point('location', { mode: 'xy' }).notNull(),
});
```

**Inserting point data:**
Three modes are supported:
- `mode: 'xy'`: `location: { x: -90.9, y: 18.7 }`
- `mode: 'tuple'`: `location: [-90.9, 18.7]`
- Raw SQL: `location: sql\`point(-90.9, 18.7)\``

**Distance queries using `<->` operator:**
Find nearest location by computing distance:
```ts
import { getTableColumns, sql } from 'drizzle-orm';
import { stores } from './schema';

const point = { x: -73.935_242, y: 40.730_61 };
const sqlDistance = sql\`location <-> point(${point.x}, ${point.y})\`;

await db
  .select({
    ...getTableColumns(stores),
    distance: sql\`round((${sqlDistance})::numeric, 2)\`,
  })
  .from(stores)
  .orderBy(sqlDistance)
  .limit(1);
```

**Boundary filtering using `<@` operator:**
Filter points within a rectangular box defined by two diagonal corners:
```ts
const point = { x1: -88, x2: -73, y1: 40, y2: 43 };

await db
  .select()
  .from(stores)
  .where(
    sql\`${stores.location} <@ box(point(${point.x1}, ${point.y1}), point(${point.x2}, ${point.y2}))\`
  );
```

### postgis_geometry_point
PostGIS geometry point support: manual extension setup, point column definition with GIST indexing, insertion methods (object/tuple/SQL), distance queries with `<->` and `ST_Distance()`, rectangular filtering with `ST_Within()` and `ST_MakeEnvelope()`.

PostGIS extends PostgreSQL with geospatial data support. Drizzle doesn't create extensions automatically, so manually create the PostGIS extension with a custom migration: `CREATE EXTENSION postgis;`

**Table Schema with Spatial Index:**
Define a table with `geometry` datatype using `geometry('location', { type: 'point', mode: 'xy', srid: 4326 })`. Add a spatial index using GIST: `index('spatial_index').using('gist', t.location)`.

**Inserting Geometry Data:**
Three insertion methods:
1. Mode 'xy': `location: { x: -90.9, y: 18.7 }`
2. Mode 'tuple': `location: [-90.9, 18.7]`
3. Raw SQL: `location: sql\`ST_SetSRID(ST_MakePoint(-90.9, 18.7), 4326)\``

**Finding Nearest Location:**
Use the `<->` operator for distance ordering and `ST_Distance()` function to calculate minimum planar distance. Query example: select all store columns plus distance, ordered by `<->` operator, limited to 1 result.

**Filtering by Rectangular Area:**
Use `ST_MakeEnvelope()` to create a rectangular polygon from min/max X and Y coordinates, and `ST_Within()` to check if a geometry is within that envelope. Example: `ST_Within(stores.location, ST_MakeEnvelope(x1, y1, x2, y2, srid))`

### postgresql_full-text_search
PostgreSQL full-text search with to_tsvector/to_tsquery, GIN indexes, multi-column search with setweight, and ranking with ts_rank/ts_rank_cd.

## Full-Text Search Basics

PostgreSQL provides `to_tsvector` to parse text into tokens and lexemes, and `to_tsquery` to convert keywords into normalized tokens. The `@@` operator matches a `tsquery` against a `tsvector`.

```ts
await db.execute(
  sql`select to_tsvector('english', 'Guide to PostgreSQL full-text search with Drizzle ORM')
    @@ to_tsquery('english', 'Drizzle') as match`
);
// Returns: [ { match: true } ]
```

## Creating Indexes

Drizzle doesn't support `tsvector` type natively, so convert text on-the-fly. Create a GIN index for performance:

```ts
export const posts = pgTable(
  'posts',
  {
    id: serial('id').primaryKey(),
    title: text('title').notNull(),
  },
  (table) => [
    index('title_search_index').using('gin', sql`to_tsvector('english', ${table.title})`),
  ]
);
```

## Query Patterns

**Single keyword:**
```ts
const title = 'trip';
await db.select().from(posts)
  .where(sql`to_tsvector('english', ${posts.title}) @@ to_tsquery('english', ${title})`);
```

**Multiple keywords (OR)** - use `|` operator:
```ts
const title = 'Europe | Asia';
await db.select().from(posts)
  .where(sql`to_tsvector('english', ${posts.title}) @@ to_tsquery('english', ${title})`);
```

**Multiple keywords (AND)** - use `plainto_tsquery`:
```ts
const title = 'discover Italy';
await db.select().from(posts)
  .where(sql`to_tsvector('english', ${posts.title}) @@ plainto_tsquery('english', ${title})`);
```

**Phrase matching** - use `phraseto_tsquery`:
```ts
const title = 'family trip';
await db.select().from(posts)
  .where(sql`to_tsvector('english', ${posts.title}) @@ phraseto_tsquery('english', ${title})`);
```

**Web search syntax** - use `websearch_to_tsquery`:
```ts
const title = 'family or first trip Europe or Asia';
await db.select().from(posts)
  .where(sql`to_tsvector('english', ${posts.title}) @@ websearch_to_tsquery('english', ${title})`);
```

## Multi-Column Search

Use `setweight` to assign weights (A, B, C, D) to different columns, typically marking title as 'A' and body as 'B':

```ts
export const posts = pgTable(
  'posts',
  {
    id: serial('id').primaryKey(),
    title: text('title').notNull(),
    description: text('description').notNull(),
  },
  (table) => [
    index('search_index').using(
      'gin',
      sql`(
        setweight(to_tsvector('english', ${table.title}), 'A') ||
        setweight(to_tsvector('english', ${table.description}), 'B')
      )`,
    ),
  ],
);

const title = 'plan';
await db.select().from(posts)
  .where(sql`(
    setweight(to_tsvector('english', ${posts.title}), 'A') ||
    setweight(to_tsvector('english', ${posts.description}), 'B'))
    @@ to_tsquery('english', ${title})`);
```

## Ranking Results

Use `ts_rank` (focuses on frequency) or `ts_rank_cd` (focuses on proximity) with `orderBy`:

```ts
import { desc, getTableColumns, sql } from 'drizzle-orm';

const search = 'culture | Europe | Italy | adventure';
const matchQuery = sql`(
  setweight(to_tsvector('english', ${posts.title}), 'A') ||
  setweight(to_tsvector('english', ${posts.description}), 'B')), to_tsquery('english', ${search})`;

await db
  .select({
    ...getTableColumns(posts),
    rank: sql`ts_rank(${matchQuery})`,
    rankCd: sql`ts_rank_cd(${matchQuery})`,
  })
  .from(posts)
  .where(sql`(
    setweight(to_tsvector('english', ${posts.title}), 'A') ||
    setweight(to_tsvector('english', ${posts.description}), 'B'))
    @@ to_tsquery('english', ${search})`)
  .orderBy((t) => desc(t.rank));
```

### postgresql_local_setup
Pull PostgreSQL Docker image and start container with `docker run --name drizzle-postgres -e POSTGRES_PASSWORD=mypassword -d -p 5432:5432 postgres`, then connect via `postgres://postgres:mypassword@localhost:5432/postgres`

## Setup PostgreSQL with Docker

**Prerequisites:** Docker Desktop installed

**Pull PostgreSQL Image**
Pull the latest PostgreSQL image from Docker Hub:
```bash
docker pull postgres
```
Or pull a specific version:
```bash
docker pull postgres:15
```
Verify the image is downloaded with `docker images`.

**Start PostgreSQL Container**
Run a new PostgreSQL container:
```bash
docker run --name drizzle-postgres -e POSTGRES_PASSWORD=mypassword -d -p 5432:5432 postgres
```

Key options:
- `--name drizzle-postgres`: Container name
- `-e POSTGRES_PASSWORD=mypassword`: Set password
- `-d`: Run in detached mode (background)
- `-p 5432:5432`: Map container port 5432 to host port 5432
- `postgres`: Image name (can specify version like `postgres:15`)

Optional parameters:
- `-e POSTGRES_USER=`: Set username (defaults to `postgres`)
- `-e POSTGRES_DB=`: Set database name (defaults to `POSTGRES_USER` value)

Verify container is running with `docker ps`.

**Configure Database URL**
Connection URL format:
```
postgres://<user>:<password>@<host>:<port>/<database>
```

Example for the created container:
```
postgres://postgres:mypassword@localhost:5432/postgres
```

Use this URL to connect to the database in your application.

### seeding_with_one-to-many_relations
Generate related data in one-to-many relationships using `with` option; requires foreign key reference or explicit relation definition; supports PostgreSQL, MySQL, SQLite.

## Seeding with the `with` Option

The `with` option in Drizzle Seed allows you to generate related data for one-to-many relationships. It requires that tables have a proper one-to-many relationship defined.

### Requirements

To use `with`, you must either:
1. Add a foreign key reference to the child table column (e.g., `authorId: integer('author_id').notNull().references(() => users.id)`)
2. Define explicit relations using `relations()` and include them in the seed function schema

### Basic Usage

For a one-to-many relationship where one user has many posts:

```ts
import { users, posts } from './schema.ts';

await seed(db, { users, posts }).refine(() => ({
    users: {
        count: 2,
        with: {
            posts: 3,  // Generate 3 posts per user
        },
    },
}));
```

Schema with foreign key reference:
```ts
export const users = pgTable('users', {
    id: serial('id').primaryKey(),
    name: text('name'),
});

export const posts = pgTable('posts', {
    id: serial('id').primaryKey(),
    content: text('content'),
    authorId: integer('author_id').notNull().references(() => users.id),
});
```

This generates 2 users with 3 posts each (6 posts total), with `author_id` automatically populated.

### Alternative: Using Relations

Instead of foreign keys, you can define relations explicitly:

```ts
import { relations } from "drizzle-orm";

export const postsRelations = relations(posts, ({ one }) => ({
    author: one(users, {
        fields: [posts.authorId],
        references: [users.id],
    }),
}));
```

Then include the relation in the seed function:
```ts
await seed(db, { users, posts, postsRelations }).refine(() => ({
    users: {
        count: 2,
        with: {
            posts: 3,
        },
    },
}));
```

### Common Errors

**Error: "posts" table doesn't have a reference to "users" table**
- Cause: Missing foreign key reference or relation definition
- Solution: Add `.references(() => users.id)` to the foreign key column or define relations

**Error: "posts" table doesn't have a reference to "users" table** (when trying to generate many users per post)
- Cause: Attempting to use `with` in the wrong direction (many-to-one instead of one-to-many)
- Solution: Reverse the relationship - generate posts under users, not users under posts

**Error: "users" table has self reference**
- Cause: Attempting to use `with` on a self-referencing table (e.g., `reportsTo` field)
- Solution: Self-referencing tables cannot use `with` because you cannot generate multiple related records for a one-to-one relationship

### Supported Databases

PostgreSQL, MySQL, SQLite

### seeding_partially_exposed_tables_with_foreign_keys
Handle foreign key columns during seeding when referenced tables aren't exposed: remove not-null constraint, expose the table, or refine the column generator with specific values.

## Problem
When seeding a database with Drizzle Seed, if a table has a foreign key column with a not-null constraint, but the referenced table is not exposed to the seed function, an error occurs: "Column 'userId' has not null constraint, and you didn't specify a table for foreign key on column 'userId'".

If the foreign key column is nullable and the referenced table is not exposed, a warning is issued instead, and the column will be filled with null values.

## Solutions

**Option 1: Remove the not-null constraint**
```ts
userId: integer().references(() => users.id)  // nullable
```

**Option 2: Expose the referenced table**
```ts
await seed(db, { bloodPressure, users });
```

**Option 3: Refine the column generator**
Manually specify values for the foreign key column using `valuesFromArray()`. This requires the referenced table to already have data in the database:
```ts
await seed(db, { bloodPressure }).refine((funcs) => ({
  bloodPressure: {
    columns: {
      userId: funcs.valuesFromArray({ values: [1, 2] })
    }
  }
}));
```

## Scenarios

**Scenario 1 (Error):** Foreign key column is not-null and referenced table is not exposed
- Error is thrown
- Must use one of the three solutions above

**Scenario 2 (Warning):** Foreign key column is nullable and referenced table is not exposed
- Warning is issued
- Column will be filled with null values
- Can ignore warning or use refinement to provide specific values

### select_parent_rows_with_at_least_one_related_child_row
Two methods to filter parent rows by existence of related children: innerJoin() returns both parent and child data with parent repetition; exists() subquery returns parent rows only, each appearing once.

## Selecting Parent Rows with Related Child Rows

This guide shows two approaches to select parent rows that have at least one related child row.

### Schema Setup
```ts
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull(),
});

export const posts = pgTable('posts', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  content: text('content').notNull(),
  userId: integer('user_id').notNull().references(() => users.id),
});
```

### Approach 1: Inner Join (with child data)
Use `.innerJoin()` to select parent rows with their related child rows. This returns both parent and child data, with parent rows repeated for each child.

```ts
await db
  .select({
    user: users,
    post: posts,
  })
  .from(users)
  .innerJoin(posts, eq(users.id, posts.userId))
  .orderBy(users.id);
```

```sql
select users.*, posts.* from users
  inner join posts on users.id = posts.user_id
  order by users.id;
```

Result: Returns parent rows only if they have children. User with id 2 (Tom Brown) is excluded because he has no posts. User with id 1 appears twice (one row per post).

### Approach 2: Subquery with exists() (parent data only)
Use a subquery with the `exists()` function to select only parent rows that have at least one related child, without returning child data.

```ts
import { eq, exists, sql } from 'drizzle-orm';

const sq = db
  .select({ id: sql`1` })
  .from(posts)
  .where(eq(posts.userId, users.id));

await db.select().from(users).where(exists(sq));
```

```sql
select * from users where exists (select 1 from posts where posts.user_id = users.id);
```

Result: Returns only parent rows that have children. User with id 2 is excluded. Each parent appears once.

### Supported Databases
PostgreSQL, MySQL, SQLite

### sql_timestamp_as_default_value
Set default timestamp values in PostgreSQL/MySQL/SQLite using `defaultNow()`, `sql`now()``, `sql`extract(epoch from now())`` (PG), `sql`(unix_timestamp())`` (MySQL), or `sql`(current_timestamp/unixepoch())`` (SQLite); control application-level handling with `mode` option.

## Setting SQL Timestamp as Default Value

### PostgreSQL

Use `defaultNow()` method or `sql` operator with `now()` function for current timestamp:

```ts
import { sql } from 'drizzle-orm';
import { timestamp, pgTable, serial } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  timestamp1: timestamp('timestamp1').notNull().defaultNow(),
  timestamp2: timestamp('timestamp2', { mode: 'string' })
    .notNull()
    .default(sql`now()`),
});
```

The `mode` option controls how values are handled in the application. `string` mode treats values as strings in the application but stores them as timestamps in the database. Without mode specified, timestamps are returned as Date objects.

For unix timestamp (seconds since 1970-01-01 UTC), use `extract(epoch from now())`:

```ts
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  timestamp: integer('timestamp')
    .notNull()
    .default(sql`extract(epoch from now())`),
});
```

### MySQL

Use `defaultNow()` method or `sql` operator with `now()` function:

```ts
import { sql } from 'drizzle-orm';
import { mysqlTable, serial, timestamp } from 'drizzle-orm/mysql-core';

export const users = mysqlTable('users', {
  id: serial('id').primaryKey(),
  timestamp1: timestamp('timestamp1').notNull().defaultNow(),
  timestamp2: timestamp('timestamp2', { mode: 'string' })
    .notNull()
    .default(sql`now()`),
  timestamp3: timestamp('timestamp3', { fsp: 3 })
    .notNull()
    .default(sql`now(3)`),
});
```

The `fsp` option defines fractional seconds precision (0-6). The `mode` option works the same as PostgreSQL.

For unix timestamp, use `unix_timestamp()`:

```ts
export const users = mysqlTable('users', {
  id: serial('id').primaryKey(),
  timestamp: int('timestamp')
    .notNull()
    .default(sql`(unix_timestamp())`),
});
```

### SQLite

Use `sql` operator with `current_timestamp` constant for current UTC date/time as text:

```ts
import { sql } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
  id: integer('id').primaryKey(),
  timestamp: text('timestamp')
    .notNull()
    .default(sql`(current_timestamp)`),
});
```

For unix timestamp, use `unixepoch()` function:

```ts
export const users = sqliteTable('users', {
  id: integer('id').primaryKey(),
  timestamp1: integer('timestamp1', { mode: 'timestamp' })
    .notNull()
    .default(sql`(unixepoch())`),
  timestamp2: integer('timestamp2', { mode: 'timestamp_ms' })
    .notNull()
    .default(sql`(unixepoch() * 1000)`),
  timestamp3: integer('timestamp3', { mode: 'number' })
    .notNull()
    .default(sql`(unixepoch())`),
});
```

The `mode` option controls application-level handling: `timestamp` and `timestamp_ms` modes return Date objects (handling seconds and milliseconds respectively), while `number` mode returns the raw integer value.

### sql_toggle_value
Toggle boolean columns with update().set() and not() operator across PostgreSQL, MySQL, SQLite.

To toggle a boolean column value, use the `update().set()` method with the `not()` operator:

```tsx
import { eq, not } from 'drizzle-orm';

await db
  .update(table)
  .set({
    isActive: not(table.isActive),
  })
  .where(eq(table.id, 1));
```

This generates SQL: `update "table" set "is_active" = not "is_active" where "id" = 1;`

Supported on PostgreSQL, MySQL, and SQLite. Note that MySQL uses `tinyint(1)` for boolean values and SQLite uses integers 0 (false) and 1 (true).

### unique_and_case-insensitive_email_handling
Create unique case-insensitive email indexes using lower() function in uniqueIndex() for PostgreSQL/MySQL/SQLite; query with eq(lower(column), value.toLowerCase())

## Overview
Implement unique and case-insensitive email handling by creating a unique index on the lowercased email column. This ensures emails are unique regardless of case variations.

## PostgreSQL
Create a unique index using the `lower()` function on the email column:

```ts
import { SQL, sql } from 'drizzle-orm';
import { AnyPgColumn, pgTable, serial, text, uniqueIndex } from 'drizzle-orm/pg-core';

export const users = pgTable(
  'users',
  {
    id: serial('id').primaryKey(),
    name: text('name').notNull(),
    email: text('email').notNull(),
  },
  (table) => [
    uniqueIndex('emailUniqueIndex').on(lower(table.email)),
  ],
);

export function lower(email: AnyPgColumn): SQL {
  return sql`lower(${email})`;
}
```

Generated SQL:
```sql
CREATE UNIQUE INDEX IF NOT EXISTS "emailUniqueIndex" ON "users" USING btree (lower("email"));
```

Query users by email with case-insensitive matching:
```ts
import { eq } from 'drizzle-orm';
import { lower, users } from './schema';

const findUserByEmail = async (email: string) => {
  return await db
    .select()
    .from(users)
    .where(eq(lower(users.email), email.toLowerCase()));
};
```

## MySQL
MySQL's default collation is case-insensitive, but explicitly create a unique index on lowercased email for consistency:

```ts
import { SQL, sql } from 'drizzle-orm';
import { AnyMySqlColumn, mysqlTable, serial, uniqueIndex, varchar } from 'drizzle-orm/mysql-core';

export const users = mysqlTable(
  'users',
  {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 255 }).notNull(),
    email: varchar('email', { length: 255 }).notNull(),
  },
  (table) => [
    uniqueIndex('emailUniqueIndex').on(lower(table.email)),
  ]
);

export function lower(email: AnyMySqlColumn): SQL {
  return sql`(lower(${email}))`;
}
```

Generated SQL:
```sql
CREATE TABLE `users` (
  `id` serial AUTO_INCREMENT NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  CONSTRAINT `users_id` PRIMARY KEY(`id`),
  CONSTRAINT `emailUniqueIndex` UNIQUE((lower(`email`)))
);
```

**Note:** Functional indexes are supported in MySQL 8.0.13+. Expressions must be enclosed in parentheses: `(lower(column))`.

Query pattern is identical to PostgreSQL.

## SQLite
Create a unique index on the lowercased email column:

```ts
import { SQL, sql } from 'drizzle-orm';
import { AnySQLiteColumn, integer, sqliteTable, text, uniqueIndex } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable(
  'users',
  {
    id: integer('id').primaryKey(),
    name: text('name').notNull(),
    email: text('email').notNull(),
  },
  (table) => [
    uniqueIndex('emailUniqueIndex').on(lower(table.email)),
  ]
);

export function lower(email: AnySQLiteColumn): SQL {
  return sql`lower(${email})`;
}
```

Generated SQL:
```sql
CREATE UNIQUE INDEX `emailUniqueIndex` ON `users` (lower(`email`));
```

Query pattern is identical to PostgreSQL.

## Requirements
- drizzle-orm@0.31.0 and drizzle-kit@0.22.0 or higher
- Knowledge of indexes, insert/select statements, and sql operator

### update_many_with_different_values_for_each_row
Bulk update different values per row using SQL CASE statements with sql operator and inArray filter

Update multiple rows with different values in a single request using SQL CASE statements.

**Approach**: Use the `sql` operator with a CASE statement combined with `.update().set()` and `.where(inArray())` methods.

**Implementation**:
1. Build an array of input objects containing id and the new value for each row
2. Construct SQL chunks starting with `(case`
3. For each input, add a `when id = X then value` clause
4. Close with `end)`
5. Join all chunks and pass to `.set()`
6. Filter with `.where(inArray(ids))`

**Example**:
```ts
const inputs = [
  { id: 1, city: 'New York' },
  { id: 2, city: 'Los Angeles' },
  { id: 3, city: 'Chicago' },
];

if (inputs.length === 0) return;

const sqlChunks: SQL[] = [];
const ids: number[] = [];

sqlChunks.push(sql`(case`);
for (const input of inputs) {
  sqlChunks.push(sql`when ${users.id} = ${input.id} then ${input.city}`);
  ids.push(input.id);
}
sqlChunks.push(sql`end)`);

const finalSql: SQL = sql.join(sqlChunks, sql.raw(' '));
await db.update(users).set({ city: finalSql }).where(inArray(users.id, ids));
```

**Generated SQL**:
```sql
update users set "city" = 
  (case when id = 1 then 'New York' when id = 2 then 'Los Angeles' when id = 3 then 'Chicago' end)
where id in (1, 2, 3)
```

**Supported databases**: PostgreSQL, MySQL, SQLite

**Important**: Ensure the inputs array is not empty before executing the update.

### upsert_query
Upsert with `.onConflictDoUpdate()` (PostgreSQL/SQLite, use `excluded` for proposed values) or `.onDuplicateKeyUpdate()` (MySQL, use `values()` function); support composite keys, conditional updates via `setWhere`, and column exclusion.

## Upsert Query

Upsert operations insert a row or update it if a conflict occurs. Drizzle supports upsert across PostgreSQL, MySQL, and SQLite with different APIs.

### PostgreSQL and SQLite

Use `.onConflictDoUpdate()` method:

```ts
await db
  .insert(users)
  .values({ id: 1, name: 'John' })
  .onConflictDoUpdate({
    target: users.id,
    set: { name: 'Super John' },
  });
```

For multiple rows, use the `excluded` keyword to reference the proposed row:

```ts
await db
  .insert(users)
  .values([
    { id: 1, lastLogin: new Date() },
    { id: 2, lastLogin: new Date(Date.now() + 1000 * 60 * 60) },
  ])
  .onConflictDoUpdate({
    target: users.id,
    set: { lastLogin: sql.raw(`excluded.${users.lastLogin.name}`) },
  });
```

For composite primary keys, pass an array to `target`:

```ts
await db
  .insert(inventory)
  .values({ warehouseId: 1, productId: 1, quantity: 100 })
  .onConflictDoUpdate({
    target: [inventory.warehouseId, inventory.productId],
    set: { quantity: sql`${inventory.quantity} + 100` },
  });
```

Use `setWhere` to conditionally update only when certain conditions are met:

```ts
await db
  .insert(products)
  .values(data)
  .onConflictDoUpdate({
    target: products.id,
    set: { price: excludedPrice, stock: excludedStock },
    setWhere: or(
      sql`${products.stock} != ${excludedStock}`,
      sql`${products.price} != ${excludedPrice}`
    ),
  });
```

To exclude specific columns from update, reference the existing column value:

```ts
await db
  .insert(users)
  .values(data)
  .onConflictDoUpdate({
    target: users.id,
    set: { ...data, email: sql`${users.email}` }, // email stays unchanged
  });
```

Helper function for updating specific columns in bulk upserts:

```ts
const buildConflictUpdateColumns = <T extends PgTable | SQLiteTable, Q extends keyof T['_']['columns']>(
  table: T,
  columns: Q[],
) => {
  const cls = getTableColumns(table);
  return columns.reduce((acc, column) => {
    const colName = cls[column].name;
    acc[column] = sql.raw(`excluded.${colName}`);
    return acc;
  }, {} as Record<Q, SQL>);
};

await db
  .insert(users)
  .values(values)
  .onConflictDoUpdate({
    target: users.id,
    set: buildConflictUpdateColumns(users, ['lastLogin', 'active']),
  });
```

### MySQL

Use `.onDuplicateKeyUpdate()` method. MySQL automatically determines conflict targets from primary keys and unique indexes:

```ts
await db
  .insert(users)
  .values({ id: 1, name: 'John' })
  .onDuplicateKeyUpdate({ set: { name: 'Super John' } });
```

For multiple rows, use the `values()` function to reference the proposed column value:

```ts
await db
  .insert(users)
  .values([
    { id: 1, lastLogin: new Date() },
    { id: 2, lastLogin: new Date(Date.now() + 1000 * 60 * 60) },
  ])
  .onDuplicateKeyUpdate({
    set: { lastLogin: sql`values(${users.lastLogin})` },
  });
```

Helper function for updating specific columns:

```ts
const buildConflictUpdateColumns = <T extends MySqlTable, Q extends keyof T['_']['columns']>(
  table: T,
  columns: Q[],
) => {
  const cls = getTableColumns(table);
  return columns.reduce((acc, column) => {
    acc[column] = sql`values(${cls[column]})`;
    return acc;
  }, {} as Record<Q, SQL>);
};

await db
  .insert(users)
  .values(values)
  .onDuplicateKeyUpdate({
    set: buildConflictUpdateColumns(users, ['lastLogin', 'active']),
  });
```

To exclude specific columns from update:

```ts
await db
  .insert(users)
  .values(data)
  .onDuplicateKeyUpdate({
    set: { ...data, email: sql`${users.email}` }, // email stays unchanged
  });
```

### vector_similarity_search_with_pgvector
Implement semantic search in PostgreSQL using pgvector extension: create vector column with HNSW index, generate embeddings via OpenAI, query similar records with cosineDistance function.

## Vector Similarity Search with pgvector

Implement semantic search in PostgreSQL using the pgvector extension with Drizzle ORM to find similar content based on vector embeddings.

### Setup

1. Create the pgvector extension manually via a custom migration:
```bash
npx drizzle-kit generate --custom
```
```sql
CREATE EXTENSION vector;
```

2. Define a table with a vector column and HNSW or IVFFlat index:
```ts
import { index, pgTable, serial, text, vector } from 'drizzle-orm/pg-core';

export const guides = pgTable(
  'guides',
  {
    id: serial('id').primaryKey(),
    title: text('title').notNull(),
    description: text('description').notNull(),
    url: text('url').notNull(),
    embedding: vector('embedding', { dimensions: 1536 }),
  },
  (table) => [
    index('embeddingIndex').using('hnsw', table.embedding.op('vector_cosine_ops')),
  ]
);
```

The embedding column stores vector representations of text data, enabling mathematical operations to measure similarity between items.

### Generating Embeddings

Use OpenAI's embedding model to convert text to vectors:
```ts
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env['OPENAI_API_KEY'],
});

export const generateEmbedding = async (value: string): Promise<number[]> => {
  const input = value.replaceAll('\n', ' ');
  const { data } = await openai.embeddings.create({
    model: 'text-embedding-ada-002',
    input,
  });
  return data[0].embedding;
};
```

### Similarity Search Query

Use `cosineDistance` function with `gt` and `sql` operators to find similar records:
```ts
import { cosineDistance, desc, gt, sql } from 'drizzle-orm';
import { generateEmbedding } from './embedding';
import { guides } from './schema';

const db = drizzle(...);

const findSimilarGuides = async (description: string) => {
  const embedding = await generateEmbedding(description);
  const similarity = sql<number>`1 - (${cosineDistance(guides.embedding, embedding)})`;

  const similarGuides = await db
    .select({ name: guides.title, url: guides.url, similarity })
    .from(guides)
    .where(gt(similarity, 0.5))
    .orderBy((t) => desc(t.similarity))
    .limit(4);

  return similarGuides;
};

const description = 'Guides on using Drizzle ORM with different platforms';
const similarGuides = await findSimilarGuides(description);
// Returns: [{ name: 'Drizzle with Turso', url: '...', similarity: 0.864 }, ...]
```

### Requirements
- PostgreSQL with pgvector extension
- OpenAI package for generating embeddings
- drizzle-orm@0.31.0+ and drizzle-kit@0.22.0+

