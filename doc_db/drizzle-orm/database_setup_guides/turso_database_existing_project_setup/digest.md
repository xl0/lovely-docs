## Setup Drizzle ORM with Turso Database in an Existing Project

### Prerequisites
- dotenv package for environment variables
- tsx package for running TypeScript files
- Turso Database account and JavaScript driver

### Installation
Install `drizzle-orm@beta`, `@tursodatabase/database`, `dotenv`, and dev dependencies `drizzle-kit@beta`, `tsx`.

### Configuration Steps

1. **Environment Variables**: Set `DB_FILE_NAME` in `.env` file (e.g., `DB_FILE_NAME=mydb.sqlite`)

2. **Drizzle Config**: Create `drizzle.config.ts` with SQLite dialect and reference the `DB_FILE_NAME` environment variable

3. **Database Introspection**: Run introspection to generate schema from existing database

4. **Schema File**: Transfer introspected schema to `src/db/schema.ts`

5. **Database Connection**: Connect using `drizzle()` from `drizzle-orm/tursodatabase/database`

### Database Operations

```typescript
import 'dotenv/config';
import { eq } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/tursodatabase/database';
import { usersTable } from './db/schema';

async function main() {
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
}

main();
```

### Schema Updates
Optionally update table schema by adding new columns (e.g., `phone: varchar('phone')`), then run migrations to apply changes to the database.

### Running Code
Execute the index.ts file using tsx: `tsx src/index.ts`