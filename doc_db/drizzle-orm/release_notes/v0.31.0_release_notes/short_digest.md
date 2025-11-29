## Breaking Changes

PostgreSQL indexes API redesigned - ordering modifiers now per-column/expression, `.using()` for index type specification:

```ts
index('name').on(table.column1.asc(), table.column2.nullsFirst()).where(sql``).with({ fillfactor: '70' })
index('name').using('btree', table.column1.asc(), sql`lower(${table.column2})`, table.column1.op('text_ops'))
```

Requires `drizzle-kit@0.22.0+`.

## New Features

**pg_vector**: Vector type with distance metrics (L2, L1, inner product, cosine, hamming, jaccard) and helper functions:

```ts
vector('embedding', { dimensions: 3 })
index('l2_index').using('hnsw', table.embedding.op('vector_l2_ops'))
db.select().from(items).orderBy(l2Distance(items.embedding, [3,1,2])).limit(5)
```

**PostgreSQL geometric types**: `point` and `line` with tuple/xy and tuple/abc modes:

```ts
point('point'), point('point_xy', { mode: 'xy' })
line('line'), line('line_abc', { mode: 'abc' })
```

**PostGIS**: `geometry` type with configurable type and SRID:

```ts
geometry('geo', { type: 'point', mode: 'xy', srid: 4000 })
```

**Drizzle Kit v0.22.0**:
- `extensionsFilters: ["postgis"]` to skip extension tables
- Full SSL config support for PostgreSQL/MySQL
- SQLite/libsql URL normalization
- Fixed MySQL/SQLite index expression escaping
- Index name required for expressions; push won't regenerate on expression/where/operator changes (workaround: comment/push/uncomment/push)