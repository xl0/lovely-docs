## Connecting to Prisma Postgres

Serverless PostgreSQL database with no cold starts. Install `drizzle-orm` with either `pg` or `postgres` driver, then initialize with connection string:

**node-postgres:**
```typescript
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

const db = drizzle({ client: new Pool({ connectionString: process.env.DATABASE_URL }) });
```

**postgres.js:**
```typescript
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

const db = drizzle({ client: postgres(process.env.DATABASE_URL) });
```