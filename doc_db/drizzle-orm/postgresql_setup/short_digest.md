## PostgreSQL Setup

Two drivers supported: `node-postgres` (pg) and `postgres.js`.

**node-postgres** - Install `drizzle-orm pg` and `drizzle-kit @types/pg`. Initialize:
```typescript
import { drizzle } from 'drizzle-orm/node-postgres';
const db = drizzle(process.env.DATABASE_URL);
// or with config: drizzle({ connection: { connectionString: URL, ssl: true } })
// or with Pool: drizzle({ client: new Pool({ connectionString: URL }) })
```

**postgres.js** - Install `drizzle-orm postgres` and `drizzle-kit`. Initialize:
```typescript
import { drizzle } from 'drizzle-orm/postgres-js';
const db = drizzle(process.env.DATABASE_URL);
// or with config: drizzle({ connection: { url: URL, ssl: true } })
// or with client: drizzle({ client: postgres(URL) })
```

Key differences: node-postgres supports per-query type parsers and optional pg-native (~10% boost); postgres.js uses prepared statements by default (may need disabling in AWS).