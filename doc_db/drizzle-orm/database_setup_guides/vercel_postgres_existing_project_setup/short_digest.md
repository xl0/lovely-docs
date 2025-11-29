## Vercel Postgres Setup for Existing Projects

Install `@vercel/postgres`, set `POSTGRES_URL` env var, configure drizzle.config.ts with 'postgresql' dialect, introspect database, then use:

```typescript
import { drizzle } from 'drizzle-orm/vercel-postgres';
const db = drizzle();
await db.insert(usersTable).values(user);
await db.select().from(usersTable);
await db.update(usersTable).set({ age: 31 }).where(eq(usersTable.email, user.email));
await db.delete(usersTable).where(eq(usersTable.email, user.email));
```