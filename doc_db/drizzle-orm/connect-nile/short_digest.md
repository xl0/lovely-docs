## Drizzle with Nile

Nile is PostgreSQL for multi-tenant apps. Install `drizzle-orm` and `postgres`, then connect:

```typescript
import { drizzle } from 'drizzle-orm/node-postgres'
const db = drizzle(process.env.NILEDB_URL);
```

For virtual tenant databases, wrap queries in transactions that set `nile.tenant_id`:

```typescript
function tenantDB<T>(tenantId: string, cb: (tx: any) => T | Promise<T>): Promise<T> {
  return db.transaction(async (tx) => {
    if (tenantId) {
      await tx.execute(sql`set local nile.tenant_id = '${sql.raw(tenantId)}'`);
    }
    return cb(tx);
  }) as Promise<T>;
}

await tenantDB(tenantId, async (tx) => tx.select().from(todosTable));
```

Use AsyncLocalStorage with middleware to automatically populate tenant context for all queries in a request.