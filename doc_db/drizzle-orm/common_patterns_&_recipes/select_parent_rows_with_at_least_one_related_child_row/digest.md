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