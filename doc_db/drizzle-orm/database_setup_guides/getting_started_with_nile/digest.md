## Getting Started with Nile

Complete setup guide for using Drizzle ORM with Nile, a PostgreSQL database re-engineered for multi-tenant applications.

### Prerequisites
- **dotenv** - for managing environment variables
- **tsx** - for running TypeScript files
- **Nile** - PostgreSQL re-engineered for multi-tenant apps

### Installation & Setup

**Step 1: Install postgres package**
```bash
npm install pg
npm install -D @types/pg
```

**Step 2: Setup connection variables**
Create a `.env` file with `NILEDB_URL` environment variable containing your Nile database connection string.

**Step 3: Connect Drizzle ORM to the database**
Use the `NILEDB_URL` environment variable to establish a connection to your Nile database.

**Step 4: Create a schema**
Define your tables in `src/db/schema.ts`. Nile is designed for multi-tenant apps, so schemas typically include tenant-aware tables with `tenant_id` columns:

```typescript
import { pgTable, uuid, text, timestamp, varchar, vector, boolean } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

export const tenantsTable = pgTable("tenants", {
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

**Step 5: Setup Drizzle config file**
Create a `drizzle.config.ts` file with PostgreSQL dialect and `NILEDB_URL` environment variable reference.

**Step 6: Apply changes to the database**
Run migrations to apply schema changes to your Nile database.

**Step 7: Seed and Query the database**
Populate and query your database using Drizzle ORM.

**Step 8: Run your application**
Execute your TypeScript files using tsx.