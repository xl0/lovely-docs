## Database Setup Guides

Comprehensive setup instructions for integrating Drizzle ORM with 25+ database platforms and drivers.

### Supported Databases

**PostgreSQL Variants:**
- PostgreSQL (node-postgres, postgres.js)
- Supabase (PostgreSQL)
- Neon (serverless PostgreSQL)
- Vercel Postgres
- Xata (PostgreSQL)
- Nile (multi-tenant PostgreSQL)
- PGLite (in-process PostgreSQL)

**MySQL Variants:**
- MySQL (mysql2)
- PlanetScale (MySQL via database-js HTTP driver)
- SingleStore (mysql2)
- TiDB (serverless via @tidbcloud/serverless HTTP driver)

**SQLite Variants:**
- SQLite (libsql, better-sqlite3)
- Turso (LibSQL cloud)
- SQLite Cloud (@sqlitecloud/drivers)
- Bun:SQLite (native Bun driver)
- Expo SQLite (React Native)
- OP-SQLite (React Native)

**Specialized:**
- Cloudflare D1 (serverless SQLite)
- Cloudflare Durable Objects (SQLite)
- Gel (PostgreSQL-compatible)

### Common Setup Pattern

1. Install driver package and Drizzle ORM
2. Configure `DATABASE_URL` or equivalent environment variable
3. Create `drizzle.config.ts` with appropriate dialect
4. For existing databases: run introspection (`drizzle-kit pull` or `drizzle-kit introspect:pg`)
5. Define or transfer schema to `src/db/schema.ts`
6. Connect Drizzle: `const db = drizzle({ connection: ... })`
7. Apply migrations: `drizzle-kit push` or `drizzle-kit migrate`
8. Execute queries: `db.select().from(table)`, `db.insert()`, `db.update()`, `db.delete()`

### Key Variations by Database Type

**HTTP-based drivers** (PlanetScale, TiDB, Neon HTTP, Vercel Postgres):
- Use HTTP connections for serverless environments
- Typically faster for single transactions
- Connection: `drizzle({ connection: { url, authToken } })`

**WebSocket drivers** (Neon WebSocket):
- Support interactive transactions and sessions
- Better for persistent connections

**Durable Objects** (Cloudflare):
- Use `ctx.blockConcurrencyWhile()` to ensure migrations complete before queries
- Bundle database interactions in single DO calls for performance

**React Native** (Expo SQLite, OP-SQLite):
- Use `useMigrations` hook to apply migrations
- Configure Metro bundler and Babel for `.sql` file support

**Bun Runtime:**
- Bun 1.2.0 has concurrent query execution issues (tracked in GitHub)
- Use `bun src/index.ts` to run

### Example: PostgreSQL Setup

```typescript
// .env
DATABASE_URL=postgresql://user:password@localhost:5432/dbname

// drizzle.config.ts
import { defineConfig } from 'drizzle-kit';
export default defineConfig({
  dialect: 'postgresql',
  schema: './src/db/schema.ts',
  dbCredentials: { url: process.env.DATABASE_URL! },
});

// src/db/schema.ts
import { pgTable, serial, text, integer } from 'drizzle-orm/pg-core';
export const users = pgTable('users', {
  id: serial().primaryKey(),
  name: text().notNull(),
  age: integer(),
  email: text().notNull().unique(),
});

// src/index.ts
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { users } from './db/schema';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle(pool);

await db.insert(users).values({ name: 'John', age: 30, email: 'john@example.com' });
const allUsers = await db.select().from(users);
```

### Example: SQLite Setup

```typescript
// .env
DB_FILE_NAME=file:local.db

// drizzle.config.ts
import { defineConfig } from 'drizzle-kit';
export default defineConfig({
  dialect: 'sqlite',
  schema: './src/db/schema.ts',
  dbCredentials: { url: process.env.DB_FILE_NAME! },
});

// src/index.ts
import { drizzle } from 'drizzle-orm/libsql';
import { users } from './db/schema';

const db = drizzle({ connection: { url: process.env.DB_FILE_NAME! } });
await db.insert(users).values({ name: 'John', age: 30, email: 'john@example.com' });
```

### Example: Cloudflare D1

```typescript
// wrangler.toml
[[d1_databases]]
binding = "DB"
database_name = "mydb"
database_id = "abc123"

// src/index.ts
import { drizzle } from 'drizzle-orm/d1';

export default {
  async fetch(request: Request, env: Env) {
    const db = drizzle(env.DB);
    const result = await db.select().from(users).all();
    return Response.json(result);
  },
};
```

### Example: Expo SQLite

```typescript
import * as SQLite from 'expo-sqlite';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator';
import migrations from './drizzle/migrations';

const expo = SQLite.openDatabaseSync('db.db');
const db = drizzle(expo);

export default function App() {
  const { success, error } = useMigrations(db, migrations);
  
  useEffect(() => {
    if (!success) return;
    (async () => {
      await db.insert(users).values({ name: 'John', age: 30, email: 'john@example.com' });
      const items = await db.select().from(users);
    })();
  }, [success]);
}
```