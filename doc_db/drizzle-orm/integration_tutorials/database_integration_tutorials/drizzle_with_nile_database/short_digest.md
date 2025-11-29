## Setup

Install drizzle-orm, drizzle-kit, dotenv, node-postgres, express. Sign up to Nile, create database, add connection string to `.env`.

Create `src/db/db.ts` with AsyncLocalStorage for tenant context:
```typescript
export const db = drizzle(process.env.NILEDB_URL);
export const tenantContext = new AsyncLocalStorage<string | undefined>();

export function tenantDB<T>(cb: (tx: any) => T | Promise<T>): Promise<T> {
  return db.transaction(async (tx) => {
    const tenantId = tenantContext.getStore();
    if (tenantId) {
      await tx.execute(sql`set local nile.tenant_id = '${sql.raw(tenantId)}'`);
    }
    return cb(tx);
  }) as Promise<T>;
}
```

Create `drizzle.config.ts` with schema path and database credentials. Run `npx drizzle-kit pull` to introspect.

## Schema

Define tables in `src/db/schema.ts`. Nile provides built-in `tenants` table. Add custom tables like `todos` with `tenantId` foreign key.

## Express App

Initialize Express in `src/app.ts`. Add middleware to extract tenant ID from URL path and store in AsyncLocalStorage:
```typescript
app.use('/api/tenants/:tenantId/*', (req, res, next) => {
  tenantContext.run(req.params.tenantId, next);
});
```

## Routes

Wrap all database operations with `tenantDB()`. Queries automatically filter by tenant context - no WHERE clause needed:
```typescript
app.post("/api/tenants", async (req, res) => {
  const tenants = await tenantDB(async (tx) => {
    return await tx.insert(tenantSchema).values({ name: req.body.name }).returning();
  });
  res.json(tenants);
});

app.get("/api/tenants/:tenantId/todos", async (req, res) => {
  const todos = await tenantDB(async (tx) => {
    return await tx.select().from(todoSchema);
  });
  res.json(todos);
});
```

Run with `npx tsx src/app.ts`.