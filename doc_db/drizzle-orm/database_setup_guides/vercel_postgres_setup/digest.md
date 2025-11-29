## Setup Steps

1. Install `@vercel/postgres` package
2. Set `POSTGRES_URL` environment variable from Vercel Postgres storage tab's `.env.local`
3. Connect Drizzle ORM using `drizzle()` from `drizzle-orm/vercel-postgres`
4. Define database schema with tables
5. Create `drizzle.config.ts` with `dialect: 'postgresql'` and `POSTGRES_URL` reference
6. Run migrations with Drizzle CLI
7. Execute database operations

## Database Operations Example

```typescript
import 'dotenv/config';
import { eq } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/vercel-postgres';
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

## Prerequisites
- dotenv package for environment variables
- tsx package for running TypeScript files
- Vercel Postgres database and driver