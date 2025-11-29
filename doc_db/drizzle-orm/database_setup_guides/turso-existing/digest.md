## Setup Drizzle ORM with Turso Cloud in an existing project

### Prerequisites
- dotenv: environment variable management
- tsx: TypeScript file execution
- turso: SQLite for production
- libsql: SQLite fork optimized for low query latency

### Installation
Install the libsql client package:
```bash
npm install @libsql/client
```

### Environment Configuration
Create `.env` file with Turso credentials:
```plaintext
TURSO_DATABASE_URL=
TURSO_AUTH_TOKEN=
```
Obtain these values from the LibSQL Driver SDK tutorial at docs.turso.tech/sdk/ts/quickstart

### Drizzle Configuration
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

### Database Introspection
Run introspection to generate schema from existing database (details in IntrospectSqlite component).

### Schema Setup
Transfer introspected code to `src/db/schema.ts`.

### Database Connection
Create `src/index.ts` with connection initialization. Two approaches:

**Option 1 - Direct connection:**
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

**Option 2 - With existing driver:**
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

### Querying
Query the database using the initialized `db` instance (details in QueryTurso component).

### Running
Execute the file with tsx (details in RunFile component).

### Optional: Schema Updates
Update table schema in `src/db/schema.ts` and apply changes to database using Drizzle Kit migrations (details in UpdateSchema and ApplyChanges components).