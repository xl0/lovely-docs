## Setup Drizzle ORM with Vercel Postgres in an existing project

### Prerequisites
- dotenv package for environment variables
- tsx package for running TypeScript files
- Vercel Postgres database and driver

### Installation & Configuration
1. Install `@vercel/postgres` package
2. Set `POSTGRES_URL` environment variable from Vercel Postgres storage tab
3. Create drizzle.config.ts with dialect 'postgresql' and POSTGRES_URL reference

### Database Introspection & Schema
4. Introspect existing database to auto-generate schema
5. Transfer introspected code to schema file
6. Connect to database using `drizzle()` from 'drizzle-orm/vercel-postgres'

### Database Operations
Query example with insert, select, update, delete:
```typescript
import { drizzle } from 'drizzle-orm/vercel-postgres';
import { eq } from 'drizzle-orm';
import { usersTable } from './db/schema';

const db = drizzle();

// Insert
const user = { name: 'John', age: 30, email: 'john@example.com' };
await db.insert(usersTable).values(user);

// Select
const users = await db.select().from(usersTable);

// Update
await db.update(usersTable).set({ age: 31 }).where(eq(usersTable.email, user.email));

// Delete
await db.delete(usersTable).where(eq(usersTable.email, user.email));
```

### Schema Updates (Optional)
- Modify table schema to add new fields
- Run migrations to apply changes
- Query with new fields automatically typed