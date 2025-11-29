## Getting Started with Drizzle ORM and Turso Cloud

This guide walks through setting up Drizzle ORM with Turso (SQLite for Production) and LibSQL, a fork of SQLite optimized for low query latency.

### Prerequisites
- **dotenv** - for managing environment variables
- **tsx** - for running TypeScript files
- **turso** - SQLite for Production
- **libsql** - fork of SQLite optimized for low query latency

### Installation and Setup

**Step 1: Install packages**
```
npm install @libsql/client
```

**Step 2: Environment variables**
Create `.env` file with:
```
TURSO_DATABASE_URL=
TURSO_AUTH_TOKEN=
```
Get these values from the LibSQL Driver SDK tutorial at docs.turso.tech/sdk/ts/quickstart

**Step 3: Connect to database**
Create `src/index.ts`:
```typescript
import 'dotenv/config';
import { drizzle } from 'drizzle-orm/libsql';

const db = drizzle({ 
  connection: { 
    url: process.env.TURSO_DATABASE_URL!, 
    authToken: process.env.TURSO_AUTH_TOKEN!
  }
});
```

Or with existing driver:
```typescript
import 'dotenv/config';
import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';

const client = createClient({ 
  url: process.env.TURSO_DATABASE_URL!, 
  authToken: process.env.TURSO_AUTH_TOKEN!
});
const db = drizzle({ client });
```

**Step 4: Create a table** - covered in separate section

**Step 5: Setup Drizzle config**
Create `drizzle.config.ts`:
```typescript
import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  out: './drizzle',
  schema: './src/db/schema.ts',
  dialect: 'turso',
  dbCredentials: {
    url: process.env.TURSO_DATABASE_URL,
    authToken: process.env.TURSO_AUTH_TOKEN,
  },
});
```

**Step 6: Apply changes to database** - covered in separate section

**Step 7: Seed and query database** - covered in separate section

**Step 8: Run the file** - covered in separate section