## SQLite Cloud Setup in Existing Project

Install: `drizzle-orm@beta @sqlitecloud/drivers dotenv` + dev: `drizzle-kit@beta tsx`

Set `SQLITE_CLOUD_CONNECTION_STRING` in `.env`, configure `drizzle.config.ts` with sqlite dialect, introspect database to generate schema, then connect and query:

```typescript
import { drizzle } from 'drizzle-orm/sqlite-cloud';
const db = drizzle();
await db.insert(usersTable).values({ name: 'John', age: 30, email: 'john@example.com' });
const users = await db.select().from(usersTable);
await db.update(usersTable).set({ age: 31 }).where(eq(usersTable.email, 'john@example.com'));
await db.delete(usersTable).where(eq(usersTable.email, 'john@example.com'));
```

Optional: Update schema and apply changes to database.