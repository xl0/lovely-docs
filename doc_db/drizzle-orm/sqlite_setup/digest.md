## SQLite Driver Support

Drizzle ORM provides native support for SQLite through two drivers: `libsql` and `better-sqlite3`.

### libsql vs better-sqlite3

**libsql** is a fork of SQLite with additional features:
- Supports both local SQLite files and remote Turso databases
- More ALTER statements for schema management
- Native encryption at rest configuration
- Broader SQLite extension support

**better-sqlite3** is a standard SQLite driver with synchronous operations.

### libsql Setup

**Install:**
```
drizzle-orm @libsql/client
-D drizzle-kit
```

**Basic usage:**
```typescript
import { drizzle } from 'drizzle-orm/libsql';
const db = drizzle(process.env.DATABASE_URL);
const result = await db.execute('select 1');
```

**With connection options:**
```typescript
import { drizzle } from 'drizzle-orm/libsql';
const db = drizzle({ connection: { url: '', authToken: '' } });
const result = await db.execute('select 1');
```

**With explicit client:**
```typescript
import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
const client = createClient({ url: process.env.DATABASE_URL, authToken: process.env.DATABASE_AUTH_TOKEN });
const db = drizzle(client);
const result = await db.execute('select 1');
```

### better-sqlite3 Setup

**Install:**
```
drizzle-orm better-sqlite3
-D drizzle-kit @types/better-sqlite3
```

**Basic usage:**
```typescript
import { drizzle } from 'drizzle-orm/better-sqlite3';
const db = drizzle(process.env.DATABASE_URL);
const result = await db.execute('select 1');
```

**With connection options:**
```typescript
import { drizzle } from 'drizzle-orm/better-sqlite3';
const db = drizzle({ connection: { source: process.env.DATABASE_URL } });
const result = await db.execute('select 1');
```

**With existing driver instance:**
```typescript
import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
const sqlite = new Database('sqlite.db');
const db = drizzle({ client: sqlite });
const result = await db.execute('select 1');
```