## Read Replicas

The `withReplicas()` function enables automatic routing of database operations between a primary instance and read replica instances. SELECT queries are distributed across replicas while CREATE, UPDATE, and DELETE operations are routed to the primary instance.

### Setup

Create separate database connections for the primary and each read replica, then pass them to `withReplicas()`:

**PostgreSQL:**
```ts
import { drizzle } from 'drizzle-orm/node-postgres';
import { withReplicas } from 'drizzle-orm/pg-core';

const primaryDb = drizzle("postgres://user:password@host:port/primary_db");
const read1 = drizzle("postgres://user:password@host:port/read_replica_1");
const read2 = drizzle("postgres://user:password@host:port/read_replica_2");

const db = withReplicas(primaryDb, [read1, read2]);
```

**MySQL:**
```ts
import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { withReplicas } from 'drizzle-orm/mysql-core';

const primaryClient = await mysql.createConnection({ host: "host", user: "user", database: "primary_db" });
const primaryDb = drizzle({ client: primaryClient });

const read1Client = await mysql.createConnection({ host: "host", user: "user", database: "read_1" });
const read1 = drizzle({ client: read1Client });

const read2Client = await mysql.createConnection({ host: "host", user: "user", database: "read_2" });
const read2 = drizzle({ client: read2Client });

const db = withReplicas(primaryDb, [read1, read2]);
```

**SQLite:**
```ts
import { drizzle } from 'drizzle-orm/libsql';
import { withReplicas } from 'drizzle-orm/sqlite-core';
import { createClient } from '@libsql/client';

const primaryDb = drizzle({ client: createClient({ url: 'DATABASE_URL', authToken: 'DATABASE_AUTH_TOKEN' }) });
const read1 = drizzle({ client: createClient({ url: 'DATABASE_URL', authToken: 'DATABASE_AUTH_TOKEN' }) });
const read2 = drizzle({ client: createClient({ url: 'DATABASE_URL', authToken: 'DATABASE_AUTH_TOKEN' }) });

const db = withReplicas(primaryDb, [read1, read2]);
```

**SingleStore:**
```ts
import { drizzle } from "drizzle-orm/singlestore";
import mysql from "mysql2/promise";
import { withReplicas } from 'drizzle-orm/singlestore-core';

const primaryClient = await mysql.createConnection({ host: "host", user: "user", database: "primary_db" });
const primaryDb = drizzle({ client: primaryClient });

const read1Client = await mysql.createConnection({ host: "host", user: "user", database: "read_1" });
const read1 = drizzle({ client: read1Client });

const read2Client = await mysql.createConnection({ host: "host", user: "user", database: "read_2" });
const read2 = drizzle({ client: read2Client });

const db = withReplicas(primaryDb, [read1, read2]);
```

### Usage

Use the `db` instance normally. Drizzle automatically routes SELECT queries to replicas and write operations (INSERT, UPDATE, DELETE) to the primary:

```ts
// Routed to a read replica
await db.select().from(usersTable);

// Routed to primary
await db.delete(usersTable).where(eq(usersTable.id, 1));
```

### Force Primary for Reads

Use the `$primary` property to force read operations against the primary instance:

```ts
await db.$primary.select().from(usersTable);
```

### Custom Replica Selection Logic

Pass a third argument to `withReplicas()` to implement custom replica selection. The function receives the replicas array and must return a selected replica:

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

await db.select().from(usersTable);
```

This example implements weighted random selection where the first replica has 70% probability and the second has 30%. Any custom selection method can be implemented.