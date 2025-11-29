## Turso Cloud Setup

Turso is a libSQL-powered edge SQLite database. Install `drizzle-orm` and `@libsql/client`, then initialize:

```typescript
import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';

const db = drizzle({ 
  client: createClient({ 
    url: process.env.DATABASE_URL,
    authToken: process.env.DATABASE_AUTH_TOKEN
  })
});

const result = await db.select().from(users).all();
```

Web environment uses `drizzle-orm/libsql/web` and `@libsql/client/web`. Alternatively pass connection config directly to `drizzle()`.