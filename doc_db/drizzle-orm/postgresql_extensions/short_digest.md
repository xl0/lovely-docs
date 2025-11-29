## pg_vector

Vector similarity search with HNSW indexes and distance operators (L2, L1, inner product, cosine, Hamming, Jaccard).

```ts
const table = pgTable('items', {
    embedding: vector({ dimensions: 3 })
}, (table) => [
  index('l2_index').using('hnsw', table.embedding.op('vector_l2_ops'))
])

db.select().from(items).orderBy(l2Distance(items.embedding, [3,1,2])).limit(5)
```

Helper functions: `l2Distance`, `l1Distance`, `innerProduct`, `cosineDistance`, `hammingDistance`, `jaccardDistance`

## PostGIS

Geospatial data support with geometry column type and GIST indexes.

```ts
const items = pgTable('items', {
  geo: geometry('geo', { type: 'point', mode: 'xy' }),
})

const table = pgTable('table', {
  geo: geometry({ type: 'point' }),
}, (table) => [
  index('custom_idx').using('gist', table.geo)
])
```

Modes: `tuple` (array) or `xy` (object with x, y). Supports custom geometry types via string type parameter.