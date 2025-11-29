## Neon HTTP Batch Support

Added support for batching multiple queries with Neon HTTP driver. Use `db.batch()` to execute multiple operations (inserts, queries) in a single request:

```ts
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

const sql = neon(process.env.DRIZZLE_DATABASE_URL!);
const db = drizzle(sql);

const batchResponse = await db.batch([
	db.insert(usersTable).values({ id: 1, name: 'John' }).returning({ id: usersTable.id }),
	db.insert(usersTable).values({ id: 2, name: 'Dan' }),
	db.query.usersTable.findMany({}),
	db.query.usersTable.findFirst({}),
]);
```

The batch response is a tuple with types matching each operation in order.

## PlanetScale Client Instance Change

Updated PlanetScale integration to use `Client` instance instead of `connect()` function. The new recommended approach:

```ts
import { Client } from '@planetscale/database';
import { drizzle } from 'drizzle-orm/planetscale-serverless';

const client = new Client({
	host: process.env['DATABASE_HOST'],
	username: process.env['DATABASE_USERNAME'],
	password: process.env['DATABASE_PASSWORD'],
});

const db = drizzle(client);
```

Using `connect()` now shows a deprecation warning. Starting from version 0.30.0, passing anything other than a `Client` instance will throw an error. No breaking changes in v0.29.4, but migration is recommended.