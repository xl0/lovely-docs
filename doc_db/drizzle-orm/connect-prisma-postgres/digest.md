## Connecting to Prisma Postgres

Prisma Postgres is a serverless PostgreSQL database built on unikernels with a large free tier, operation-based pricing, and no cold starts.

### Supported Drivers

Connect using either `node-postgres` (pg) or `postgres.js` drivers.

### Installation

**For node-postgres (pg):**
```
npm install drizzle-orm pg
npm install -D drizzle-kit
```

**For postgres.js:**
```
npm install drizzle-orm postgres
npm install -D drizzle-kit
```

### Setup and Query

**Using node-postgres (pg):**
```typescript
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});
const db = drizzle({ client: pool });

const result = await db.execute('select 1');
```

**Using postgres.js:**
```typescript
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

const queryClient = postgres(process.env.DATABASE_URL);
const db = drizzle({ client: queryClient });

const result = await db.execute('select 1');
```

### Note

Prisma Postgres also offers a serverless driver that will be supported by Drizzle ORM in the future.