Drizzle provides two complementary approaches for querying databases:

**SQL-like Syntax**: Mirrors standard SQL with minimal learning curve. Supports select, insert, update, delete, joins, aliases, WITH clauses, subqueries, and prepared statements. Examples:
- `db.select().from(posts).leftJoin(comments, eq(posts.id, comments.post_id)).where(eq(posts.id, 10))`
- `db.insert(users).values({ email: 'user@gmail.com' })`
- `db.update(users).set({ email: 'user@gmail.com' }).where(eq(users.id, 1))`
- `db.delete(users).where(eq(users.id, 1))`

**Relational Queries API**: Fetches nested relational data efficiently without manual joins or data mapping. Always generates exactly one SQL query, suitable for serverless databases. Example:
- `db.query.users.findMany({ with: { posts: true } })`

**Advanced Composition**: Queries support flexible composition patterns:
- Build WHERE filters independently: `const filters: SQL[] = []; if (name) filters.push(ilike(products.name, name)); db.select().from(products).where(and(...filters))`
- Separate subqueries into variables and reuse them in main queries
- Compose conditional statements and partitioned logic separately

Both approaches coexist - use SQL-like syntax for full SQL control or relational queries for convenience with nested data.