## PostgreSQL Driver Support

Drizzle ORM provides native support for PostgreSQL through two drivers: `node-postgres` (pg) and `postgres.js`.

### Driver Differences

- **node-postgres**: Can install `pg-native` for ~10% performance boost. Supports per-query type parsers without global patching.
- **postgres.js**: Uses prepared statements by default, which may need to be disabled in AWS environments.

### node-postgres Setup

Install packages:
```
drizzle-orm pg
drizzle-kit @types/pg (dev)
```

Initialize with connection string:
```typescript
import { drizzle } from 'drizzle-orm/node-postgres';
const db = drizzle(process.env.DATABASE_URL);
const result = await db.execute('select 1');
```

Initialize with config options:
```typescript
import { drizzle } from 'drizzle-orm/node-postgres';
const db = drizzle({ 
  connection: { 
    connectionString: process.env.DATABASE_URL,
    ssl: true
  }
});
const result = await db.execute('select 1');
```

Initialize with existing Pool:
```typescript
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle({ client: pool });
const result = await db.execute('select 1');
```

### postgres.js Setup

Install packages:
```
drizzle-orm postgres
drizzle-kit (dev)
```

Initialize with connection string:
```typescript
import { drizzle } from 'drizzle-orm/postgres-js';
const db = drizzle(process.env.DATABASE_URL);
const result = await db.execute('select 1');
```

Initialize with config options:
```typescript
import { drizzle } from 'drizzle-orm/postgres-js';
const db = drizzle({ 
  connection: { 
    url: process.env.DATABASE_URL, 
    ssl: true 
  }
});
const result = await db.execute('select 1');
```

Initialize with existing client:
```typescript
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
const queryClient = postgres(process.env.DATABASE_URL);
const db = drizzle({ client: queryClient });
const result = await db.execute('select 1');
```