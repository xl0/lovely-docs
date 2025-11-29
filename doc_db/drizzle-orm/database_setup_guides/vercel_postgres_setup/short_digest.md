## Setup
1. Install `@vercel/postgres`
2. Set `POSTGRES_URL` environment variable
3. Import `drizzle()` from `drizzle-orm/vercel-postgres`
4. Create schema and `drizzle.config.ts` with `dialect: 'postgresql'`
5. Run migrations

## Operations
```typescript
const db = drizzle();
await db.insert(usersTable).values(user);
await db.select().from(usersTable);
await db.update(usersTable).set({ age: 31 }).where(eq(usersTable.email, user.email));
await db.delete(usersTable).where(eq(usersTable.email, user.email));
```