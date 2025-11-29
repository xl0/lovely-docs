## Drizzle ORM with Bun SQLite

Drizzle ORM natively supports the `bun:sqlite` module with both async and sync APIs. The library mirrors popular SQLite query methods: `all`, `get`, `values`, and `run`.

### Installation
Install `drizzle-orm` and `drizzle-kit` as dev dependency.

### Basic Setup

**Default initialization (uses Bun's default SQLite):**
```typescript
import { drizzle } from 'drizzle-orm/bun-sqlite';
const db = drizzle();
const result = await db.select().from(...);
```

**With existing driver:**
```typescript
import { drizzle } from 'drizzle-orm/bun-sqlite';
import { Database } from 'bun:sqlite';

const sqlite = new Database('sqlite.db');
const db = drizzle({ client: sqlite });
const result = await db.select().from(...);
```

### Sync APIs

For synchronous operations, use the same driver initialization but call sync methods directly:
```typescript
const result = db.select().from(users).all();
const result = db.select().from(users).get();
const result = db.select().from(users).values();
const result = db.select().from(users).run();
```

The sync API provides direct access to SQLite's synchronous query execution without async/await overhead.