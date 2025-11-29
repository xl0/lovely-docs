

## Pages

### drizzle_with_neon_postgres
Complete setup guide for Drizzle ORM with Neon Postgres: environment config, database connection via neon-http driver, schema definition with type inference, drizzle-kit config, migration generation/execution, and CRUD query examples.

## Setup

Install dependencies: `drizzle-orm`, `drizzle-kit`, `@neondatabase/serverless`, and `dotenv`.

Create a Neon project at console.neon.tech. Neon provides a ready-to-use `neondb` Postgres database. Get the connection string from Connection Details and add it as `DATABASE_URL` environment variable.

## Database Connection

Create `src/db.ts`:
```typescript
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { config } from "dotenv";

config({ path: ".env" });
const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle({ client: sql });
```

## Schema Definition

Create `src/schema.ts` with table definitions:
```typescript
import { integer, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

export const usersTable = pgTable('users_table', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  age: integer('age').notNull(),
  email: text('email').notNull().unique(),
});

export const postsTable = pgTable('posts_table', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  content: text('content').notNull(),
  userId: integer('user_id')
    .notNull()
    .references(() => usersTable.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at')
    .notNull()
    .$onUpdate(() => new Date()),
});

export type InsertUser = typeof usersTable.$inferInsert;
export type SelectUser = typeof usersTable.$inferSelect;
export type InsertPost = typeof postsTable.$inferInsert;
export type SelectPost = typeof postsTable.$inferSelect;
```

## Drizzle Config

Create `drizzle.config.ts`:
```typescript
import { config } from 'dotenv';
import { defineConfig } from "drizzle-kit";

config({ path: '.env' });

export default defineConfig({
  schema: "./src/schema.ts",
  out: "./migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
```

## Migrations

Generate migrations with `npx drizzle-kit generate` (stored in `migrations/` directory as SQL files). Run with `npx drizzle-kit migrate`. Alternatively, use `npx drizzle-kit push` for quick prototyping without managing migration files.

## Query Examples

**Insert:**
```typescript
import { db } from '../db';
import { InsertUser, usersTable } from '../schema';

export async function createUser(data: InsertUser) {
  await db.insert(usersTable).values(data);
}
```

**Select:**
```typescript
import { eq, count, getTableColumns, asc, between, sql } from 'drizzle-orm';
import { db } from '../db';
import { usersTable, postsTable } from '../schema';

export async function getUserById(id: number) {
  return db.select().from(usersTable).where(eq(usersTable.id, id));
}

export async function getUsersWithPostsCount(page = 1, pageSize = 5) {
  return db
    .select({
      ...getTableColumns(usersTable),
      postsCount: count(postsTable.id),
    })
    .from(usersTable)
    .leftJoin(postsTable, eq(usersTable.id, postsTable.userId))
    .groupBy(usersTable.id)
    .orderBy(asc(usersTable.id))
    .limit(pageSize)
    .offset((page - 1) * pageSize);
}

export async function getPostsForLast24Hours(page = 1, pageSize = 5) {
  return db
    .select({ id: postsTable.id, title: postsTable.title })
    .from(postsTable)
    .where(between(postsTable.createdAt, sql`now() - interval '1 day'`, sql`now()`))
    .orderBy(asc(postsTable.title), asc(postsTable.id))
    .limit(pageSize)
    .offset((page - 1) * pageSize);
}
```

**Update:**
```typescript
import { eq } from 'drizzle-orm';
import { db } from '../db';
import { postsTable } from '../schema';

export async function updatePost(id: number, data: Partial<any>) {
  await db.update(postsTable).set(data).where(eq(postsTable.id, id));
}
```

**Delete:**
```typescript
import { eq } from 'drizzle-orm';
import { db } from '../db';
import { usersTable } from '../schema';

export async function deleteUser(id: number) {
  await db.delete(usersTable).where(eq(usersTable.id, id));
}
```

### drizzle_with_nile_database
Multi-tenant Express app with Drizzle ORM and Nile Database using AsyncLocalStorage to automatically scope queries to tenant context without explicit WHERE clauses.

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

### drizzle_with_supabase
Complete setup guide for Drizzle ORM with Supabase Postgres: connection pooling, schema definition with foreign keys, migrations via drizzle-kit or Supabase CLI, and CRUD query examples.

## Setup

Install dependencies: `drizzle-orm`, `drizzle-kit`, `dotenv`, and `postgres` package.

Create a Supabase project and get the connection string from Database Settings. Use connection pooling and replace the password placeholder. Store it in `.env` as `DATABASE_URL`.

## Database Connection

Create `src/db/index.ts`:
```typescript
import { config } from 'dotenv';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

config({ path: '.env' });
const client = postgres(process.env.DATABASE_URL!);
export const db = drizzle({ client });
```

## Schema Definition

Create `src/db/schema.ts` with table definitions:
```typescript
import { integer, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

export const usersTable = pgTable('users_table', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  age: integer('age').notNull(),
  email: text('email').notNull().unique(),
});

export const postsTable = pgTable('posts_table', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  content: text('content').notNull(),
  userId: integer('user_id')
    .notNull()
    .references(() => usersTable.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at')
    .notNull()
    .$onUpdate(() => new Date()),
});

export type InsertUser = typeof usersTable.$inferInsert;
export type SelectUser = typeof usersTable.$inferSelect;
export type InsertPost = typeof postsTable.$inferInsert;
export type SelectPost = typeof postsTable.$inferSelect;
```

## Drizzle Config

Create `drizzle.config.ts`:
```typescript
import { config } from 'dotenv';
import { defineConfig } from 'drizzle-kit';

config({ path: '.env' });

export default defineConfig({
  schema: './src/db/schema.ts',
  out: './supabase/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
```

## Migrations

Generate migrations: `npx drizzle-kit generate` (stored in `supabase/migrations`).

Run migrations: `npx drizzle-kit migrate`.

Alternatively, use `npx drizzle-kit push` for quick prototyping without migration files.

For Supabase CLI: run `supabase init`, then `supabase link`, then `supabase db push`.

## Query Examples

**Insert:**
```typescript
import { db } from '../index';
import { InsertUser, usersTable } from '../schema';

export async function createUser(data: InsertUser) {
  await db.insert(usersTable).values(data);
}
```

**Select:**
```typescript
import { eq, count, getTableColumns, asc, between, sql } from 'drizzle-orm';
import { db } from '../index';
import { usersTable, postsTable } from '../schema';

export async function getUserById(id: number) {
  return db.select().from(usersTable).where(eq(usersTable.id, id));
}

export async function getUsersWithPostsCount(page = 1, pageSize = 5) {
  return db
    .select({
      ...getTableColumns(usersTable),
      postsCount: count(postsTable.id),
    })
    .from(usersTable)
    .leftJoin(postsTable, eq(usersTable.id, postsTable.userId))
    .groupBy(usersTable.id)
    .orderBy(asc(usersTable.id))
    .limit(pageSize)
    .offset((page - 1) * pageSize);
}

export async function getPostsForLast24Hours(page = 1, pageSize = 5) {
  return db
    .select({
      id: postsTable.id,
      title: postsTable.title,
    })
    .from(postsTable)
    .where(between(postsTable.createdAt, sql`now() - interval '1 day'`, sql`now()`))
    .orderBy(asc(postsTable.title), asc(postsTable.id))
    .limit(pageSize)
    .offset((page - 1) * pageSize);
}
```

**Update:**
```typescript
import { eq } from 'drizzle-orm';
import { db } from '../index';
import { postsTable } from '../schema';

export async function updatePost(id: number, data: Partial<any>) {
  await db.update(postsTable).set(data).where(eq(postsTable.id, id));
}
```

**Delete:**
```typescript
import { eq } from 'drizzle-orm';
import { db } from '../index';
import { usersTable } from '../schema';

export async function deleteUser(id: number) {
  await db.delete(usersTable).where(eq(usersTable.id, id));
}
```

### drizzle_with_turso
Complete setup guide for Turso (SQLite-compatible database) with Drizzle: authentication, database creation, environment configuration, schema definition, migration setup, and CRUD query examples.

## Setup and Configuration

Turso is a SQLite-compatible database built on libSQL with support for replication and microsecond-latency access. Drizzle ORM natively supports the libSQL driver.

### Prerequisites
- drizzle-orm and drizzle-kit packages
- dotenv package for environment variables
- @libsql/client package
- Turso CLI

### Initial Setup Steps

1. **Authenticate with Turso**: Run `turso auth signup` or `turso auth login`

2. **Create database**: `turso db create drizzle-turso-db` and verify with `turso db show drizzle-turso-db`

3. **Generate auth token**: `turso db tokens create drizzle-turso-db`

4. **Environment variables** (.env or .env.local):
```
TURSO_CONNECTION_URL=
TURSO_AUTH_TOKEN=
```

5. **Database connection** (src/db/index.ts):
```typescript
import { config } from 'dotenv';
import { drizzle } from 'drizzle-orm/libsql';

config({ path: '.env' });

export const db = drizzle({ connection: {
  url: process.env.TURSO_CONNECTION_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
}});
```

6. **Schema definition** (src/db/schema.ts):
```typescript
import { sql } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const usersTable = sqliteTable('users', {
  id: integer('id').primaryKey(),
  name: text('name').notNull(),
  age: integer('age').notNull(),
  email: text('email').unique().notNull(),
});

export const postsTable = sqliteTable('posts', {
  id: integer('id').primaryKey(),
  title: text('title').notNull(),
  content: text('content').notNull(),
  userId: integer('user_id')
    .notNull()
    .references(() => usersTable.id, { onDelete: 'cascade' }),
  createdAt: text('created_at')
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).$onUpdate(() => new Date()),
});

export type InsertUser = typeof usersTable.$inferInsert;
export type SelectUser = typeof usersTable.$inferSelect;
export type InsertPost = typeof postsTable.$inferInsert;
export type SelectPost = typeof postsTable.$inferSelect;
```

7. **Drizzle config** (drizzle.config.ts):
```typescript
import { config } from 'dotenv';
import { defineConfig } from 'drizzle-kit';

config({ path: '.env' });

export default defineConfig({
  schema: './src/db/schema.ts',
  out: './migrations',
  dialect: 'turso',
  dbCredentials: {
    url: process.env.TURSO_CONNECTION_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN!,
  },
});
```

8. **Apply migrations**: Generate with `npx drizzle-kit generate` (creates SQL files in migrations directory), then run with `npx drizzle-kit migrate`. Alternatively use `npx drizzle-kit push` for rapid prototyping without migration files.

## Query Examples

### Insert
```typescript
import { db } from '../index';
import { InsertPost, InsertUser, postsTable, usersTable } from '../schema';

export async function createUser(data: InsertUser) {
  await db.insert(usersTable).values(data);
}

export async function createPost(data: InsertPost) {
  await db.insert(postsTable).values(data);
}
```

### Select
```typescript
import { asc, count, eq, getTableColumns, gt, sql } from 'drizzle-orm';
import { db } from '../index';
import { SelectUser, postsTable, usersTable } from '../schema';

export async function getUserById(id: SelectUser['id']) {
  return db.select().from(usersTable).where(eq(usersTable.id, id));
}

export async function getUsersWithPostsCount(page = 1, pageSize = 5) {
  return db
    .select({
      ...getTableColumns(usersTable),
      postsCount: count(postsTable.id),
    })
    .from(usersTable)
    .leftJoin(postsTable, eq(usersTable.id, postsTable.userId))
    .groupBy(usersTable.id)
    .orderBy(asc(usersTable.id))
    .limit(pageSize)
    .offset((page - 1) * pageSize);
}

export async function getPostsForLast24Hours(page = 1, pageSize = 5) {
  return db
    .select({
      id: postsTable.id,
      title: postsTable.title,
    })
    .from(postsTable)
    .where(gt(postsTable.createdAt, sql`(datetime('now','-24 hour'))`))
    .orderBy(asc(postsTable.title), asc(postsTable.id))
    .limit(pageSize)
    .offset((page - 1) * pageSize);
}
```

### Update
```typescript
import { eq } from 'drizzle-orm';
import { db } from '../index';
import { SelectPost, postsTable } from '../schema';

export async function updatePost(id: SelectPost['id'], data: Partial<Omit<SelectPost, 'id'>>) {
  await db.update(postsTable).set(data).where(eq(postsTable.id, id));
}
```

### Delete
```typescript
import { eq } from 'drizzle-orm';
import { db } from '../index';
import { SelectUser, usersTable } from '../schema';

export async function deleteUser(id: SelectUser['id']) {
  await db.delete(usersTable).where(eq(usersTable.id, id));
}
```

## Project Structure
```
📦 <project root>
 ├ 📂 src
 │   ├ 📂 db
 │   │  ├ 📜 index.ts
 │   │  └ 📜 schema.ts
 ├ 📂 migrations
 │  ├ 📂 meta
 │  │  ├ 📜 _journal.json
 │  │  └ 📜 0000_snapshot.json
 │  └ 📜 0000_watery_spencer_smythe.sql
 ├ 📜 .env
 ├ 📜 drizzle.config.ts
 ├ 📜 package.json
 └ 📜 tsconfig.json
```

### drizzle_with_vercel_postgres
Complete setup guide for Vercel Postgres: connection initialization, schema definition with foreign keys and timestamps, migration generation/execution, and CRUD query examples with joins and pagination.

## Setup and Configuration

Install required packages: `drizzle-orm`, `drizzle-kit`, `dotenv`, and `@vercel/postgres`.

Create a Vercel Postgres database in the dashboard and copy the `POSTGRES_URL` connection string to `.env.local`.

Create `src/db/index.ts` to initialize the database connection:
```typescript
import { drizzle } from 'drizzle-orm/vercel-postgres';
import { config } from 'dotenv';

config({ path: '.env.local' });
export const db = drizzle();
```

## Schema Definition

Create `src/db/schema.ts` with table definitions using `pgTable`:
```typescript
import { integer, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

export const usersTable = pgTable('users_table', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  age: integer('age').notNull(),
  email: text('email').notNull().unique(),
});

export const postsTable = pgTable('posts_table', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  content: text('content').notNull(),
  userId: integer('user_id')
    .notNull()
    .references(() => usersTable.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at')
    .notNull()
    .$onUpdate(() => new Date()),
});

export type InsertUser = typeof usersTable.$inferInsert;
export type SelectUser = typeof usersTable.$inferSelect;
export type InsertPost = typeof postsTable.$inferInsert;
export type SelectPost = typeof postsTable.$inferSelect;
```

## Drizzle Kit Configuration

Create `drizzle.config.ts` in the project root:
```typescript
import { config } from 'dotenv';
import { defineConfig } from 'drizzle-kit';

config({ path: '.env.local' });

export default defineConfig({
  schema: './src/db/schema.ts',
  out: './migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.POSTGRES_URL!,
  },
});
```

Generate migrations with `npx drizzle-kit generate` (stored in `drizzle/migrations`), then run with `npx drizzle-kit migrate`. Alternatively, use `npx drizzle-kit push` for quick prototyping without managing migration files.

## Query Operations

**Insert**: Create `src/db/queries/insert.ts`:
```typescript
import { db } from '../index';
import { InsertPost, InsertUser, postsTable, usersTable } from '../schema';

export async function createUser(data: InsertUser) {
  await db.insert(usersTable).values(data);
}

export async function createPost(data: InsertPost) {
  await db.insert(postsTable).values(data);
}
```

**Select**: Create `src/db/queries/select.ts`:
```typescript
import { asc, between, count, eq, getTableColumns, sql } from 'drizzle-orm';
import { db } from '../index';
import { SelectUser, postsTable, usersTable } from '../schema';

export async function getUserById(id: SelectUser['id']) {
  return db.select().from(usersTable).where(eq(usersTable.id, id));
}

export async function getUsersWithPostsCount(page = 1, pageSize = 5) {
  return db
    .select({
      ...getTableColumns(usersTable),
      postsCount: count(postsTable.id),
    })
    .from(usersTable)
    .leftJoin(postsTable, eq(usersTable.id, postsTable.userId))
    .groupBy(usersTable.id)
    .orderBy(asc(usersTable.id))
    .limit(pageSize)
    .offset((page - 1) * pageSize);
}

export async function getPostsForLast24Hours(page = 1, pageSize = 5) {
  return db
    .select({
      id: postsTable.id,
      title: postsTable.title,
    })
    .from(postsTable)
    .where(between(postsTable.createdAt, sql`now() - interval '1 day'`, sql`now()`))
    .orderBy(asc(postsTable.title), asc(postsTable.id))
    .limit(pageSize)
    .offset((page - 1) * pageSize);
}
```

**Update**: Create `src/db/queries/update.ts`:
```typescript
import { eq } from 'drizzle-orm';
import { db } from '../index';
import { SelectPost, postsTable } from '../schema';

export async function updatePost(id: SelectPost['id'], data: Partial<Omit<SelectPost, 'id'>>) {
  await db.update(postsTable).set(data).where(eq(postsTable.id, id));
}
```

**Delete**: Create `src/db/queries/delete.ts`:
```typescript
import { eq } from 'drizzle-orm';
import { db } from '../index';
import { SelectUser, usersTable } from '../schema';

export async function deleteUser(id: SelectUser['id']) {
  await db.delete(usersTable).where(eq(usersTable.id, id));
}
```

## Project Structure

```
📦 <project root>
 ├ 📂 src/db
 │   ├ 📜 index.ts (connection)
 │   └ 📜 schema.ts (table definitions)
 ├ 📂 migrations
 │   ├ 📂 meta
 │   └ 📜 *.sql (generated migrations)
 ├ 📜 .env.local
 ├ 📜 drizzle.config.ts
 ├ 📜 package.json
 └ 📜 tsconfig.json
```

### drizzle_with_xata
Setup Drizzle with Xata PostgreSQL: configure connection string, create schema with tables and type inference, generate/apply migrations, perform CRUD operations with examples for insert/select/update/delete queries.

## Setup and Configuration

Xata is a PostgreSQL database platform with instant copy-on-write branches, zero-downtime schema changes, data anonymization, and AI-powered performance monitoring.

**Prerequisites**: Install `drizzle-orm`, `drizzle-kit`, `dotenv`, and `postgres` packages. Create a Xata account and database.

**Connection Setup**:
1. Create a Xata database and copy the PostgreSQL connection string from the branch overview page
2. Add `DATABASE_URL` to `.env` file with format: `postgresql://postgres:<password>@<branch-id>.<region>.xata.tech/<database>?sslmode=require`
3. Create `src/db/index.ts` to connect Drizzle to the database:
```typescript
import { config } from 'dotenv';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

config({ path: '.env' });
const client = postgres(process.env.DATABASE_URL!);
export const db = drizzle({ client });
```

**Schema Definition** in `src/db/schema.ts`:
```typescript
import { integer, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

export const usersTable = pgTable('users_table', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  age: integer('age').notNull(),
  email: text('email').notNull().unique(),
});

export const postsTable = pgTable('posts_table', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  content: text('content').notNull(),
  userId: integer('user_id')
    .notNull()
    .references(() => usersTable.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at')
    .notNull()
    .$onUpdate(() => new Date()),
});

export type InsertUser = typeof usersTable.$inferInsert;
export type SelectUser = typeof usersTable.$inferSelect;
export type InsertPost = typeof postsTable.$inferInsert;
export type SelectPost = typeof postsTable.$inferSelect;
```

**Drizzle Config** in `drizzle.config.ts`:
```typescript
import { config } from 'dotenv';
import { defineConfig } from 'drizzle-kit';

config({ path: '.env' });

export default defineConfig({
  schema: './src/db/schema.ts',
  out: './migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
```

**Migrations**: Run `npx drizzle-kit generate` to create migration files in the `migrations` directory, then `npx drizzle-kit migrate` to apply them. Alternatively, use `npx drizzle-kit push` for rapid prototyping without managing migration files.

## Query Examples

**Insert**:
```typescript
import { db } from '../index';
import { InsertPost, InsertUser, postsTable, usersTable } from '../schema';

export async function createUser(data: InsertUser) {
  await db.insert(usersTable).values(data);
}

export async function createPost(data: InsertPost) {
  await db.insert(postsTable).values(data);
}
```

**Select**:
```typescript
import { asc, between, count, eq, getTableColumns, sql } from 'drizzle-orm';
import { db } from '../index';
import { SelectUser, postsTable, usersTable } from '../schema';

export async function getUserById(id: SelectUser['id']) {
  return db.select().from(usersTable).where(eq(usersTable.id, id));
}

export async function getUsersWithPostsCount(page = 1, pageSize = 5) {
  return db
    .select({
      ...getTableColumns(usersTable),
      postsCount: count(postsTable.id),
    })
    .from(usersTable)
    .leftJoin(postsTable, eq(usersTable.id, postsTable.userId))
    .groupBy(usersTable.id)
    .orderBy(asc(usersTable.id))
    .limit(pageSize)
    .offset((page - 1) * pageSize);
}

export async function getPostsForLast24Hours(page = 1, pageSize = 5) {
  return db
    .select({
      id: postsTable.id,
      title: postsTable.title,
    })
    .from(postsTable)
    .where(between(postsTable.createdAt, sql`now() - interval '1 day'`, sql`now()`))
    .orderBy(asc(postsTable.title), asc(postsTable.id))
    .limit(pageSize)
    .offset((page - 1) * pageSize);
}
```

**Update**:
```typescript
import { eq } from 'drizzle-orm';
import { db } from '../index';
import { SelectPost, postsTable } from '../schema';

export async function updatePost(id: SelectPost['id'], data: Partial<Omit<SelectPost, 'id'>>) {
  await db.update(postsTable).set(data).where(eq(postsTable.id, id));
}
```

**Delete**:
```typescript
import { eq } from 'drizzle-orm';
import { db } from '../index';
import { SelectUser, usersTable } from '../schema';

export async function deleteUser(id: SelectUser['id']) {
  await db.delete(usersTable).where(eq(usersTable.id, id));
}
```

## Key Features

- Xata provides branch-based development for isolated database branches across development, staging, and production environments
- Use different connection strings for different branches
- Push command is suitable for rapid prototyping; use migrations for production deployments

