## SQLite Cloud Connection

Install `drizzle-orm@beta` and `@sqlitecloud/drivers`. Connect via connection string or existing driver instance:

```typescript
import { drizzle } from 'drizzle-orm/sqlite-cloud';
const db = drizzle(process.env.SQLITE_CLOUD_CONNECTION_STRING);
```

Or with existing driver:
```typescript
import { Database } from '@sqlitecloud/drivers';
const client = new Database(process.env.SQLITE_CLOUD_CONNECTION_STRING!);
const db = drizzle({ client });
```