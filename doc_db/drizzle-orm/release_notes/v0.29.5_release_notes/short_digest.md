## WITH Clauses for DML

INSERT, UPDATE, DELETE now support WITH (CTE) statements:
```ts
const avg = db.$with('avg').as(db.select({ value: sql`avg(${orders.amount})` }).from(orders));
await db.with(avg).delete(orders).where(gt(orders.amount, sql`(select * from ${avg})`));
```

## Custom Migrations Config

- `migrationsTable: 'my_migrations'` - custom table name
- `migrationsSchema: 'custom'` - custom schema (PostgreSQL only)

## SQLite Proxy Batch & Relational Queries

- Relational queries (`.query.findFirst()`, `.query.findMany()`) now supported
- Batch requests via second callback parameter to `drizzle()`:
```ts
const db = drizzle(singleQueryFn, async (queries) => {
	return await axios.post('http://localhost:3000/batch', { queries });
});
```