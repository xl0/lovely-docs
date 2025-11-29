## Select Parent Rows with Related Children

Two approaches:

**1. Inner Join (with child data):**
```ts
await db
  .select({ user: users, post: posts })
  .from(users)
  .innerJoin(posts, eq(users.id, posts.userId));
```
Returns parent rows repeated for each child.

**2. Subquery with exists() (parent only):**
```ts
const sq = db.select({ id: sql`1` }).from(posts).where(eq(posts.userId, users.id));
await db.select().from(users).where(exists(sq));
```
Returns each parent row once if it has children.

Supported: PostgreSQL, MySQL, SQLite