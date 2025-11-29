## PlanetScale Existing Project Setup

Install `@planetscale/database`, configure `DATABASE_URL` environment variable, create drizzle config with MySQL dialect, introspect existing database to generate schema, then connect and query using:

```typescript
const db = drizzle({ connection: {
  host: process.env.DATABASE_HOST!,
  username: process.env.DATABASE_USERNAME!,
  password: process.env.DATABASE_PASSWORD!,
}});

// CRUD operations
await db.insert(usersTable).values(user);
const users = await db.select().from(usersTable);
await db.update(usersTable).set({ age: 31 }).where(eq(usersTable.email, user.email));
await db.delete(usersTable).where(eq(usersTable.email, user.email));
```

Optionally update schema and apply changes to database.