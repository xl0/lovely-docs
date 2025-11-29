## Drizzle with Nile Database

Nile is PostgreSQL re-engineered for multi-tenant applications. Use any Drizzle PostgreSQL driver with Nile; examples use `node-postgres`.

### Installation
```
npm install drizzle-orm postgres
npm install -D drizzle-kit
```

### Basic Connection
```typescript
import { drizzle } from 'drizzle-orm/node-postgres'
const db = drizzle(process.env.NILEDB_URL);
const response = await db.select().from(...);
```

Or with explicit Pool:
```typescript
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle({ client: pool });
```

### Virtual Tenant Databases

Nile provides virtual tenant databases. When you set tenant context, queries automatically apply only to that tenant's data (e.g., `select * from table` returns only that tenant's records).

Set tenant context by wrapping queries in a transaction that sets `nile.tenant_id`:

```typescript
import { drizzle } from 'drizzle-orm/node-postgres';
import { todosTable } from "./db/schema";
import { sql } from 'drizzle-orm';

const db = drizzle(process.env.NILEDB_URL);

function tenantDB<T>(tenantId: string, cb: (tx: any) => T | Promise<T>): Promise<T> {
  return db.transaction(async (tx) => {
    if (tenantId) {
      await tx.execute(sql`set local nile.tenant_id = '${sql.raw(tenantId)}'`);
    }
    return cb(tx);
  }) as Promise<T>;
}

const tenantId = '01943e56-16df-754f-a7b6-6234c368b400'
const response = await tenantDB(tenantId, async (tx) => {
    return await tx.select().from(todosTable);
});
```

### AsyncLocalStorage Pattern

For web frameworks supporting it, use AsyncLocalStorage to store tenant ID in middleware:

```typescript
import { drizzle } from 'drizzle-orm/node-postgres';
import { sql } from "drizzle-orm";
import { AsyncLocalStorage } from "async_hooks";

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

Middleware setup:
```typescript
app.use("/api/tenants/:tenantId/*", async (c, next) => {
  const tenantId = c.req.param("tenantId");
  return tenantContext.run(tenantId, () => next());
});

app.get("/api/tenants/:tenantId/todos", async (c) => {
    const todos = await tenantDB(async (tx) => {
      return await tx.select().from(todoSchema);
    });
    return c.json(todos);
});
```