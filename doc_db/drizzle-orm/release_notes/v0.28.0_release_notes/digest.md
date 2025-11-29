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