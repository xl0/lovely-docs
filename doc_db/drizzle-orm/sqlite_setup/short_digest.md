## SQLite Drivers

**libsql** (fork of SQLite): supports local files and remote Turso databases, more ALTER statements, encryption at rest, broader extension support.

**better-sqlite3**: standard SQLite driver.

### libsql
```typescript
import { drizzle } from 'drizzle-orm/libsql';
const db = drizzle(process.env.DATABASE_URL);
// or with options: drizzle({ connection: { url: '', authToken: '' } })
// or with client: drizzle(createClient({ url, authToken }))
```

### better-sqlite3
```typescript
import { drizzle } from 'drizzle-orm/better-sqlite3';
const db = drizzle(process.env.DATABASE_URL);
// or with options: drizzle({ connection: { source: process.env.DATABASE_URL } })
// or with client: drizzle({ client: new Database('sqlite.db') })
```