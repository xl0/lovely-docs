## Setup and Configuration

Install required packages: drizzle-orm, drizzle-kit, dotenv, node-postgres, and express.

Sign up to Nile, create a database, generate credentials, and add the connection string to `.env`:
```
NILEDB_URL=postgres://youruser:yourpassword@us-west-2.db.thenile.dev:5432:5432/your_db_name
```

Create `src/db/db.ts` to configure Drizzle with AsyncLocalStorage for tenant context management:
```typescript
import { drizzle } from 'drizzle-orm/node-postgres';
import dotenv from "dotenv/config";
import { sql } from "drizzle-orm";
import { AsyncLocalStorage } from "async_hooks";

export const db = drizzle(process.env.NILEDB_URL);
export const tenantContext = new AsyncLocalStorage<string | undefined>();

export function tenantDB<T>(cb: (tx: any) => T | Promise<T>): Promise<T> {
  return db.transaction(async (tx) => {
    const tenantId = tenantContext.getStore();
    console.log("executing query with tenant: " + tenantId);
    if (tenantId) {
      await tx.execute(sql`set local nile.tenant_id = '${sql.raw(tenantId)}'`);
    }
    return cb(tx);
  }) as Promise<T>;
}
```

Create `drizzle.config.ts`:
```typescript
import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';
export default defineConfig({
  out: './drizzle',
  schema: './src/db/schema.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.NILEDB_URL!,
  },
});
```

Run `npx drizzle-kit pull` to introspect the Nile database and generate schema files including the built-in `tenants` table.

## Schema Definition

Nile provides a built-in `tenants` table. Add custom tables to `src/db/schema.ts`:
```typescript
import { pgTable, uuid, text, timestamp, varchar, vector, boolean } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

export const tenants = pgTable("tenants", {
	id: uuid().default(sql`public.uuid_generate_v7()`).primaryKey().notNull(),
	name: text(),
	created: timestamp({ mode: 'string' }).default(sql`LOCALTIMESTAMP`).notNull(),
	updated: timestamp({ mode: 'string' }).default(sql`LOCALTIMESTAMP`).notNull(),
	deleted: timestamp({ mode: 'string' }),
});

export const todos = pgTable("todos", {
	id: uuid().defaultRandom(),
	tenantId: uuid("tenant_id"),
	title: varchar({ length: 256 }),
	estimate: varchar({ length: 256 }),
	embedding: vector({ dimensions: 3 }),
	complete: boolean(),
});
```

Apply migrations to the database.

## Multi-Tenant Web Application

Initialize Express app in `src/app.ts`:
```typescript
import express from "express";
import { tenantDB, tenantContext, db } from "./db/db";
import { tenants as tenantSchema, todos as todoSchema } from "./db/schema";
import { eq } from "drizzle-orm";

const PORT = process.env.PORT || 3001;
const app = express();
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
app.use(express.json());
```

Add middleware to extract tenant ID from URL path and store in AsyncLocalStorage:
```typescript
app.use('/api/tenants/:tenantId/*', (req, res, next) => {
  const tenantId = req.params.tenantId;
  console.log("setting context to tenant: " + tenantId);
  tenantContext.run(tenantId, next);
});
```

Tenant ID can alternatively be set from headers (e.g., `x-tenant-id`) or cookies.

## API Routes

Create tenant:
```typescript
app.post("/api/tenants", async (req, res) => {
  try {
    const name = req.body.name;
    const tenants = await tenantDB(async (tx) => {
      return await tx.insert(tenantSchema).values({ name }).returning();
    });
    res.json(tenants);
  } catch (error: any) {
    res.status(500).json({message: "Internal Server Error"});
  }
});
```

List all tenants:
```typescript
app.get("/api/tenants", async (req, res) => {
  try {
    const tenants = await tenantDB(async (tx) => {
      return await tx.select().from(tenantSchema);
    });
    res.json(tenants);
  } catch (error: any) {
    res.status(500).json({message: "Internal Server Error"});
  }
});
```

Create todo for tenant:
```typescript
app.post("/api/tenants/:tenantId/todos", async (req, res) => {
  try {
    const { title, complete } = req.body;
    if (!title) {
      res.status(400).json({message: "No task title provided"});
    }
    const tenantId = req.params.tenantId;
    const newTodo = await tenantDB(async (tx) => {
      return await tx.insert(todoSchema).values({ tenantId, title, complete }).returning();
    });
    res.json(newTodo);
  } catch (error: any) {
    res.status(500).json({message: "Internal Server Error"});
  }
});
```

Update todo for tenant:
```typescript
app.put("/api/tenants/:tenantId/todos", async (req, res) => {
  try {
    const { id, complete } = req.body;
    await tenantDB(async (tx) => {
      return await tx.update(todoSchema).set({ complete }).where(eq(todoSchema.id, id));
    });
    res.sendStatus(200);
  } catch (error: any) {
    res.status(500).json({message: "Internal Server Error"});
  }
});
```

List todos for tenant (no WHERE clause needed - tenant context automatically filters):
```typescript
app.get("/api/tenants/:tenantId/todos", async (req, res) => {
  try {
    const todos = await tenantDB(async (tx) => {
      return await tx.select({
        id: todoSchema.id,
        tenant_id: todoSchema.tenantId,
        title: todoSchema.title,
        estimate: todoSchema.estimate,
      }).from(todoSchema);
    });
    res.json(todos);
  } catch (error: any) {
    res.status(500).json({message: error.message});
  }
});
```

Run the app with `npx tsx src/app.ts` and test routes with curl.

## Project Structure

```
📦 <project root>
 ├ 📂 src
 │   ├ 📂 db
 │   │  ├ 📜 db.ts
 │   │  └ 📜 schema.ts
 │   └ 📜 app.ts
 ├ 📂 drizzle
 │   ├ 📂 meta
 │   │  ├ 📜 _journal.json
 │   │  └ 📜 0000_snapshot.json
 │   ├ 📜 relations.ts
 │   ├ 📜 schema.ts
 │   └ 📜 0000_watery_spencer_smythe.sql
 ├ 📜 .env
 ├ 📜 drizzle.config.ts
 └ 📜 package.json
```