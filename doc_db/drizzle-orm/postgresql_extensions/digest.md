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