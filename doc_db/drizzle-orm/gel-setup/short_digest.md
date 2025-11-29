## Gel Setup

Install `drizzle-orm`, `gel`, and `drizzle-kit`.

Initialize with connection string, connection options, or existing client:
```typescript
import { drizzle } from 'drizzle-orm/gel';
const db = drizzle(process.env.DATABASE_URL);
// or with options
const db = drizzle({ connection: { dsn: process.env.DATABASE_URL, tlsSecurity: "default" } });
// or with existing client
const db = drizzle({ client: gelClient });
```

Execute queries with `db.execute('select 1')`.