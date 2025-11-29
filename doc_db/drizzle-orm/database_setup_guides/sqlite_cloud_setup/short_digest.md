## Setup
Install drizzle-orm@beta, @sqlitecloud/drivers, dotenv, drizzle-kit@beta, tsx. Set SQLITE_CLOUD_CONNECTION_STRING environment variable.

## Connection & Operations
```typescript
import { drizzle } from 'drizzle-orm/sqlite-cloud';
const db = drizzle();

// Insert
await db.insert(usersTable).values({name: 'John', age: 30, email: 'john@example.com'});

// Select
const users = await db.select().from(usersTable);

// Update
await db.update(usersTable).set({age: 31}).where(eq(usersTable.email, 'john@example.com'));

// Delete
await db.delete(usersTable).where(eq(usersTable.email, 'john@example.com'));
```

Configure drizzle.config.ts with sqlite dialect and run migrations with drizzle-kit.