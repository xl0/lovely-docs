## Turso Database Setup with Existing Project

Install `drizzle-orm@beta`, `@tursodatabase/database`, `dotenv`, `drizzle-kit@beta`, `tsx`.

Set `DB_FILE_NAME` in `.env`, configure `drizzle.config.ts` with SQLite dialect, introspect existing database, and transfer schema to `src/db/schema.ts`.

Connect with `drizzle()` from `drizzle-orm/tursodatabase/database` and perform CRUD operations:

```typescript
const db = drizzle();
await db.insert(usersTable).values({ name: 'John', age: 30, email: 'john@example.com' });
const users = await db.select().from(usersTable);
await db.update(usersTable).set({ age: 31 }).where(eq(usersTable.email, 'john@example.com'));
await db.delete(usersTable).where(eq(usersTable.email, 'john@example.com'));
```

Run with `tsx src/index.ts`. Optionally update schema and apply migrations.