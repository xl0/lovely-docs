## Neon Postgres Connection

Drizzle has native support for Neon connections using `neon-http` and `neon-websockets` drivers, which use the neon-serverless driver under the hood.

**HTTP vs WebSockets:**
- `neon-http`: Faster for single, non-interactive transactions, works over HTTP in serverless environments
- `neon-websockets`: Required for session or interactive transaction support
- For serverful environments, use PostgresJS driver as described in Neon's official Node.js docs

**Installation:**
```
npm install drizzle-orm @neondatabase/serverless
npm install -D drizzle-kit
```

**Neon HTTP:**
```typescript
import { drizzle } from 'drizzle-orm/neon-http';
const db = drizzle(process.env.DATABASE_URL);
const result = await db.execute('select 1');
```

Or with existing driver:
```typescript
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
const sql = neon(process.env.DATABASE_URL!);
const db = drizzle({ client: sql });
```

**Neon WebSockets:**
```typescript
import { drizzle } from 'drizzle-orm/neon-serverless';
const db = drizzle(process.env.DATABASE_URL);
const result = await db.execute('select 1');
```

For Node.js, install `ws` and `bufferutil` packages and configure:
```typescript
import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from 'ws';

neonConfig.webSocketConstructor = ws;
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle({ client: pool });
```

**Alternative drivers for Neon:**

node-postgres (for serverful environments):
```typescript
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle({ client: pool });
```

postgres.js (for serverful environments):
```typescript
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
const queryClient = postgres(process.env.DATABASE_URL);
const db = drizzle({ client: queryClient });
```

**Prerequisites:** Neon serverless database account, Neon serverless driver, understanding of database connection basics with Drizzle, familiarity with PostgreSQL drivers.