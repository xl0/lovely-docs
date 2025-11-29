## Full-Text Search with Generated Columns

Create a custom `tsvector` type and define a generated column that converts text to a searchable vector:

```ts
export const tsvector = customType<{ data: string }>({
  dataType() { return `tsvector`; },
});

export const posts = pgTable('posts', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  body: text('body').notNull(),
  bodySearch: tsvector('body_search')
    .notNull()
    .generatedAlwaysAs((): SQL => sql`to_tsvector('english', ${posts.body})`),
}, (t) => [index('idx_body_search').using('gin', t.bodySearch)]);
```

Query with the `@@` operator:

```ts
await db.select().from(posts)
  .where(sql`${posts.bodySearch} @@ to_tsquery('english', ${searchParam})`);
```

For weighted search across multiple columns, use `setweight()`:

```ts
search: tsvector('search')
  .notNull()
  .generatedAlwaysAs((): SQL =>
    sql`setweight(to_tsvector('english', ${posts.title}), 'A')
     || setweight(to_tsvector('english', ${posts.body}), 'B')`),
```

Use GIN indexes on tsvector columns for performance.