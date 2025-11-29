## Drizzle ORM + Turso Setup

Install `@libsql/client`. Set environment variables `TURSO_DATABASE_URL` and `TURSO_AUTH_TOKEN` in `.env`.

Connect with:
```typescript
import { drizzle } from 'drizzle-orm/libsql';
const db = drizzle({ 
  connection: { 
    url: process.env.TURSO_DATABASE_URL!, 
    authToken: process.env.TURSO_AUTH_TOKEN!
  }
});
```

Or provide existing client:
```typescript
import { createClient } from '@libsql/client';
const client = createClient({ url, authToken });
const db = drizzle({ client });
```

Create `drizzle.config.ts` with dialect `'turso'` and credentials. Then create tables, apply migrations, seed, and query.