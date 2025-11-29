## Turso Database Integration

Install `drizzle-orm@beta` and `@tursodatabase/database`, then initialize:

```typescript
import { drizzle } from 'drizzle-orm/tursodatabase/database';
const db = drizzle('sqlite.db');
const result = await db.execute('select 1');
```

Or with an existing driver instance:
```typescript
import { Database } from '@tursodatabase/drivers';
const client = new Database('sqlite.db');
const db = drizzle({ client });
```