## Relational Queries

Drizzle ORM's relational query API provides a typed layer for querying nested relational data from SQL databases, avoiding multiple joins and complex data mappings. It generates exactly one SQL statement per query using lateral joins of subqueries.

### Setup

Define schema with tables and relations, then pass to drizzle initialization:

```typescript
import * as schema from './schema';
import { drizzle } from 'drizzle-orm/...';

const db = drizzle({ schema });
```

For multiple schema files: `drizzle({ schema: { ...schema1, ...schema2 } })`

Relations are defined using the `relations()` function with `one()` and `many()` helpers:

```typescript
export const usersRelations = relations(users, ({ one, many }) => ({
  invitee: one(users, { fields: [users.invitedBy], references: [users.id] }),
  posts: many(posts),
}));
```

### Modes

- `mode: "default"` for regular MySQL
- `mode: "planetscale"` for PlanetScale (doesn't support lateral joins)

### Query Methods

**findMany()** - returns array of records:
```typescript
const users = await db.query.users.findMany();
```

**findFirst()** - returns single record with `limit 1`:
```typescript
const user = await db.query.users.findFirst();
```

### Include Relations

Use `with` operator to fetch related data:

```typescript
const posts = await db.query.posts.findMany({
  with: {
    comments: true,
  },
});
```

Nest `with` statements for deeper relations:
```typescript
const users = await db.query.users.findMany({
  with: {
    posts: {
      with: {
        comments: true,
      },
    },
  },
});
```

### Partial Field Selection

`columns` parameter includes/excludes specific fields (performed at query level, no extra data transferred):

```typescript
const posts = await db.query.posts.findMany({
  columns: {
    id: true,
    content: true,
  },
  with: {
    comments: true,
  }
});
```

Exclude fields with `false`:
```typescript
const posts = await db.query.posts.findMany({
  columns: {
    content: false,
  },
});
```

When both `true` and `false` are present, `false` options are ignored. Include only nested relations:
```typescript
const res = await db.query.users.findMany({
  columns: {},
  with: {
    posts: true
  }
});
```

Nested partial select:
```typescript
const posts = await db.query.posts.findMany({
  columns: {
    id: true,
    content: true,
  },
  with: {
    comments: {
      columns: {
        authorId: false
      }
    }
  }
});
```

### Filtering

Use operators from `drizzle-orm` or callback syntax:

```typescript
import { eq } from 'drizzle-orm';

const users = await db.query.users.findMany({
  where: eq(users.id, 1)
});

// or callback syntax
const users = await db.query.users.findMany({
  where: (users, { eq }) => eq(users.id, 1),
});
```

Filter nested relations:
```typescript
await db.query.posts.findMany({
  where: (posts, { eq }) => eq(posts.id, 1),
  with: {
    comments: {
      where: (comments, { lt }) => lt(comments.createdAt, new Date()),
    },
  },
});
```

### Limit & Offset

`limit` and `offset` work on top-level and nested queries:

```typescript
await db.query.posts.findMany({
  limit: 5,
  offset: 2,
  with: {
    comments: {
      limit: 3,
    },
  },
});
```

Note: `offset` is only available at top level, not in nested relations.

### Order By

Use core API or callback syntax:

```typescript
import { desc, asc } from 'drizzle-orm';

await db.query.posts.findMany({
  orderBy: [asc(posts.id)],
});

// or callback
await db.query.posts.findMany({
  orderBy: (posts, { asc }) => [asc(posts.id)],
  with: {
    comments: {
      orderBy: (comments, { desc }) => [desc(comments.id)],
    },
  },
});
```

### Custom Fields with extras

Add computed fields using `extras`:

```typescript
import { sql } from 'drizzle-orm';

await db.query.users.findMany({
  extras: {
    loweredName: sql`lower(${users.name})`.as('lowered_name'),
  },
});

// or callback syntax
await db.query.users.findMany({
  extras: {
    loweredName: (users, { sql }) => sql`lower(${users.name})`.as('lowered_name'),
  },
});
```

Must explicitly use `.as("<column_name>")`. Aggregations are not supported in `extras`; use core queries instead.

Example with concatenation and nested relations:
```typescript
const res = await db.query.users.findMany({
  extras: {
    fullName: sql<string>`concat(${users.name}, " ", ${users.name})`.as('full_name'),
  },
  with: {
    usersToGroups: {
      with: {
        group: true,
      },
    },
  },
});
```

Example with computed field on nested relations:
```typescript
const res = await db.query.posts.findMany({
  extras: (table, { sql }) => ({
    contentLength: sql<number>`length(${table.content})`.as('content_length'),
  }),
  with: {
    comments: {
      extras: {
        commentSize: sql<number>`length(${comments.content})`.as('comment_size'),
      },
    },
  },
});
```

### Prepared Statements

Prepared statements improve query performance. Use `placeholder()` for dynamic values:

**Placeholder in where:**
```typescript
const prepared = db.query.users.findMany({
  where: (users, { eq }) => eq(users.id, placeholder('id')),
  with: {
    posts: {
      where: (users, { eq }) => eq(users.id, placeholder('pid')),
    },
  },
}).prepare('query_name'); // PostgreSQL requires name

const usersWithPosts = await prepared.execute({ id: 1 });
```

**Placeholder in limit:**
```typescript
const prepared = db.query.users.findMany({
  with: {
    posts: {
      limit: placeholder('limit'),
    },
  },
}).prepare();

const usersWithPosts = await prepared.execute({ limit: 1 });
```

**Placeholder in offset:**
```typescript
const prepared = db.query.users.findMany({
  offset: placeholder('offset'),
  with: {
    posts: true,
  },
}).prepare();

const usersWithPosts = await prepared.execute({ offset: 1 });
```

**Multiple placeholders:**
```typescript
const prepared = db.query.users.findMany({
  limit: placeholder('uLimit'),
  offset: placeholder('uOffset'),
  where: (users, { eq, or }) => or(eq(users.id, placeholder('id')), eq(users.id, 3)),
  with: {
    posts: {
      where: (users, { eq }) => eq(users.id, placeholder('pid')),
      limit: placeholder('pLimit'),
    },
  },
}).prepare();

const usersWithPosts = await prepared.execute({ pLimit: 1, uLimit: 3, uOffset: 1, id: 2, pid: 6 });
```