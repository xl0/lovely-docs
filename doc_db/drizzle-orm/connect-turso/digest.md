## Turso Cloud Integration

Turso is a libSQL-powered edge SQLite database as a service. Drizzle ORM provides native support for the libSQL driver.

### Installation

Install required packages:
```
drizzle-orm @libsql/client
-D drizzle-kit
```

### Driver Initialization

Drizzle supports all `@libsql/client` driver variations. Initialize the driver by creating a client with your database URL and authentication token:

**Node.js environment:**
```typescript
import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';

const client = createClient({ 
  url: process.env.DATABASE_URL,
  authToken: process.env.DATABASE_AUTH_TOKEN
});

const db = drizzle({ client });
```

**Web environment:**
```typescript
import { drizzle } from 'drizzle-orm/libsql/web';
import { createClient } from '@libsql/client/web';

const client = createClient({ 
  url: process.env.DATABASE_URL,
  authToken: process.env.DATABASE_AUTH_TOKEN
});

const db = drizzle({ client });
```

Alternatively, pass connection config directly:
```typescript
import { drizzle } from 'drizzle-orm/libsql';
import * as s from 'drizzle-orm/sqlite-core';

const db = drizzle({ connection: {
  url: process.env.DATABASE_URL, 
  authToken: process.env.DATABASE_AUTH_TOKEN 
}});

const users = s.sqliteTable("users", {
  id: s.integer(),
  name: s.text(),
})

const result = await db.select().from(users);
```

Drizzle mirrors SQLite query methods: `all()`, `get()`, `values()`, and `run()`.