## Setup Drizzle with Turso in existing project

Install `@libsql/client`. Create `.env` with `TURSO_DATABASE_URL` and `TURSO_AUTH_TOKEN`.

Create `drizzle.config.ts`:
```typescript
import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  out: './drizzle',
  schema: './src/db/schema.ts',
  dialect: 'turso',
  dbCredentials: {
    url: process.env.TURSO_DATABASE_URL,
    authToken: process.env.TURSO_AUTH_TOKEN,
  },
});
```

Introspect existing database, transfer schema to `src/db/schema.ts`.

Connect in `src/index.ts`:
```typescript
import 'dotenv/config';
import { drizzle } from 'drizzle-orm/libsql';

const db = drizzle({ 
  connection: { 
    url: process.env.TURSO_DATABASE_URL!, 
    authToken: process.env.TURSO_AUTH_TOKEN!
  }
});
```

Or with existing client:
```typescript
import { createClient } from '@libsql/client';
const client = createClient({ url: process.env.TURSO_DATABASE_URL!, authToken: process.env.TURSO_AUTH_TOKEN! });
const db = drizzle({ client });
```

Query database with `db` instance. Optionally update schema and apply migrations.