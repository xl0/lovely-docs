## Setup

1. Authenticate: `turso auth signup/login`
2. Create DB: `turso db create drizzle-turso-db`
3. Generate token: `turso db tokens create drizzle-turso-db`
4. Set env vars: `TURSO_CONNECTION_URL` and `TURSO_AUTH_TOKEN`
5. Connect (src/db/index.ts):
```typescript
import { drizzle } from 'drizzle-orm/libsql';
export const db = drizzle({ connection: {
  url: process.env.TURSO_CONNECTION_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
}});
```

6. Define schema (src/db/schema.ts) with sqliteTable
7. Configure drizzle.config.ts with dialect: 'turso'
8. Generate migrations: `npx drizzle-kit generate`
9. Run migrations: `npx drizzle-kit migrate` or push with `npx drizzle-kit push`

## Queries

**Insert**: `db.insert(usersTable).values(data)`

**Select**: `db.select().from(usersTable).where(eq(usersTable.id, id))` with joins, grouping, pagination

**Update**: `db.update(postsTable).set(data).where(eq(postsTable.id, id))`

**Delete**: `db.delete(usersTable).where(eq(usersTable.id, id))`