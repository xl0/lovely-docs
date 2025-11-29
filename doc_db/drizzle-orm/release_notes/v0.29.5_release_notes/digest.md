## WITH Clauses for DML Statements

WITH (CTE) support added for INSERT, UPDATE, and DELETE statements. Example with DELETE:

```ts
const averageAmount = db.$with('average_amount').as(
	db.select({ value: sql`avg(${orders.amount})`.as('value') }).from(orders),
);

const result = await db
	.with(averageAmount)
	.delete(orders)
	.where(gt(orders.amount, sql`(select * from ${averageAmount})`))
	.returning({ id: orders.id });
```

Generates: `with "average_amount" as (select avg("amount") as "value" from "orders") delete from "orders" where "orders"."amount" > (select * from "average_amount") returning "id";`

## Custom Migrations Configuration

**Custom migrations table name** - Use `migrationsTable` option to specify table name (default: `__drizzle_migrations`):
```ts
await migrate(db, {
	migrationsFolder: './drizzle',
	migrationsTable: 'my_migrations',
});
```

**Custom migrations schema** - PostgreSQL only, use `migrationsSchema` option (default: `drizzle` schema):
```ts
await migrate(db, {
	migrationsFolder: './drizzle',
	migrationsSchema: 'custom',
});
```

## SQLite Proxy Enhancements

- Relational queries support: `.query.findFirst()` and `.query.findMany()` now work with sqlite proxy driver
- Batch requests support: Pass a batch callback function as second parameter to `drizzle()` to handle multiple queries:

```ts
const db = drizzle(
	async (sql, params, method) => { /* single query */ },
	async (queries: { sql: string; params: any[]; method: 'all' | 'run' | 'get' | 'values' }[]) => {
		const result = await axios.post('http://localhost:3000/batch', { queries });
		return result; // array of raw values in same order as sent
	},
);

await db.batch([/* queries */]);
```