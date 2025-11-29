## MySQL unsigned bigint
Specify `bigint unsigned` type with `bigint('id', { mode: 'number', unsigned: true })`.

## Improved query builder types
Query builders now enforce single invocation of most methods by default (e.g., `.where()` can only be called once) to match SQL semantics. Enable dynamic mode with `.$dynamic()` to remove this restriction for dynamic query building:

```ts
const query = db.select().from(users).$dynamic();
withPagination(query, 1); // ✅ OK
```

## Custom names for primary and foreign keys
Specify custom constraint names to avoid database truncation issues:

```ts
const table = pgTable('table', {
  id: integer('id'),
  name: text('name'),
}, (table) => ({
  cpk: primaryKey({ name: 'composite_key', columns: [table.id, table.name] }),
  cfk: foreignKey({
    name: 'fkName',
    columns: [table.id],
    foreignColumns: [table.name],
  }),
}));
```

## Read replicas support
Use `withReplicas()` to specify read replicas and primary database for writes:

```ts
const db = withReplicas(primaryDb, [read1, read2]);
db.$primary.select().from(usersTable); // read from primary
db.select().from(usersTable); // read from random replica
db.delete(usersTable).where(eq(usersTable.id, 1)); // write to primary
```

Implement custom replica selection logic:

```ts
const db = withReplicas(primaryDb, [read1, read2], (replicas) => {
  const weight = [0.7, 0.3];
  let cumulativeProbability = 0;
  const rand = Math.random();
  for (const [i, replica] of replicas.entries()) {
    cumulativeProbability += weight[i]!;
    if (rand < cumulativeProbability) return replica;
  }
  return replicas[0]!
});
```

## Set operators (UNION, UNION ALL, INTERSECT, INTERSECT ALL, EXCEPT, EXCEPT ALL)
Use import or builder approach:

```ts
// Import approach
import { union } from 'drizzle-orm/pg-core'
const result = await union(allUsersQuery, allCustomersQuery);

// Builder approach
const result = await db.select().from(users).union(db.select().from(customers));
```

## MySQL proxy driver
Create custom HTTP driver implementation for MySQL. Implement two endpoints: one for queries and one for migrations (optional). Example:

```ts
import { drizzle } from 'drizzle-orm/mysql-proxy';
import { migrate } from 'drizzle-orm/mysql-proxy/migrator';

const db = drizzle(async (sql, params, method) => {
  const rows = await axios.post(`${process.env.REMOTE_DRIVER}/query`, {
    sql,
    params,
    method,
  });
  return { rows: rows.data };
});

await migrate(db, async (queries) => {
  await axios.post(`${process.env.REMOTE_DRIVER}/migrate`, { queries });
}, { migrationsFolder: 'drizzle' });
```

## PostgreSQL proxy driver
Same as MySQL proxy driver but for PostgreSQL:

```ts
import { drizzle } from 'drizzle-orm/pg-proxy';
import { migrate } from 'drizzle-orm/pg-proxy/migrator';

const db = drizzle(async (sql, params, method) => {
  const rows = await axios.post(`${process.env.REMOTE_DRIVER}/query`, { sql, params, method });
  return { rows: rows.data };
});

await migrate(db, async (queries) => {
  await axios.post(`${process.env.REMOTE_DRIVER}/query`, { queries });
}, { migrationsFolder: 'drizzle' });
```

## D1 Batch API support
Execute multiple queries in a single batch with proper typing:

```ts
const batchResponse = await db.batch([
  db.insert(usersTable).values({ id: 1, name: 'John' }).returning({ id: usersTable.id }),
  db.update(usersTable).set({ name: 'Dan' }).where(eq(usersTable.id, 1)),
  db.query.usersTable.findMany({}),
  db.select().from(usersTable).where(eq(usersTable.id, 1)),
]);
```

Supported builders: `db.all()`, `db.get()`, `db.values()`, `db.run()`, `db.query.<table>.findMany()`, `db.query.<table>.findFirst()`, `db.select()...`, `db.update()...`, `db.delete()...`, `db.insert()...`

## Drizzle Kit 0.20.0
- New `defineConfig` function for drizzle.config
- Cloudflare D1 access in Drizzle Studio via wrangler.toml
- Drizzle Studio migrated to https://local.drizzle.studio/
- `bigint unsigned` support
- Custom names for `primaryKeys` and `foreignKeys`
- Automatic environment variable fetching
- Bug fixes and improvements

**Minimum version requirement:** Drizzle ORM v0.29.0 requires Drizzle Kit v0.20.0 and vice versa.