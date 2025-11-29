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