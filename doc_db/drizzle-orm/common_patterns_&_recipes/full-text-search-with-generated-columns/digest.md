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