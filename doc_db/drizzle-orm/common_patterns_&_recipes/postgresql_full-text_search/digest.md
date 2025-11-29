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