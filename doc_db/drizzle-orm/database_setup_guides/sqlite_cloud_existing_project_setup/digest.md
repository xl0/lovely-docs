## Setup Drizzle ORM with SQLite Cloud in an existing project

### Prerequisites
- dotenv package for environment variables
- tsx package for running TypeScript files
- SQLite Cloud database and driver (sqlitecloud-js)

### Installation
Install packages: `drizzle-orm@beta @sqlitecloud/drivers dotenv` and dev dependencies `drizzle-kit@beta tsx`

### Configuration Steps

1. **Environment Variables**: Set `SQLITE_CLOUD_CONNECTION_STRING` in `.env` file with your SQLite Cloud connection string

2. **Drizzle Config**: Create `drizzle.config.ts` with dialect set to 'sqlite' and reference the connection string environment variable

3. **Database Introspection**: Run introspection to generate initial schema from existing SQLite Cloud database

4. **Schema File**: Transfer introspected code to `src/db/schema.ts`

5. **Database Connection**: Connect to SQLite Cloud using `drizzle()` from 'drizzle-orm/sqlite-cloud'

### Database Operations Example
```typescript
import 'dotenv/config';
import { eq } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/sqlite-cloud';
import { usersTable } from './db/schema';

async function main() {
  const db = drizzle();

  // Insert
  await db.insert(usersTable).values({
    name: 'John',
    age: 30,
    email: 'john@example.com',
  });

  // Select
  const users = await db.select().from(usersTable);

  // Update
  await db.update(usersTable).set({ age: 31 }).where(eq(usersTable.email, 'john@example.com'));

  // Delete
  await db.delete(usersTable).where(eq(usersTable.email, 'john@example.com'));
}

main();
```

### Schema Updates (Optional)
After updating table schema in `src/db/schema.ts`, apply changes to database and query with new fields. Example shows adding optional `phone` field to users table and querying it.