Step-by-step guide to integrate Drizzle ORM with Nile (PostgreSQL re-engineered for multi-tenant apps) in an existing project.

**Prerequisites**: dotenv, tsx, and Nile account.

**Installation**: Install `pg` package and `@types/pg` as dev dependency.

**Configuration**: Set `NILEDB_URL` environment variable and configure Drizzle with `dialect: 'postgresql'` pointing to this variable.

**Database Introspection**: Run `npx drizzle-kit pull` to generate `schema.ts`, migrations, and `relations.ts` files from existing database. Nile includes built-in tables like `tenants` that are automatically included in introspection.

**Example Generated Schema**:
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

**Connection**: Connect to Nile database using the generated schema.

**Schema Updates**: Modify `schema.ts` to add new columns (e.g., `deadline: timestamp({ mode: 'string' })`), then apply changes to database and re-run queries to see updated fields.

**Workflow**: Install packages → setup env variables → configure Drizzle → introspect database → transfer code to schema file → connect to database → query → optionally update schema and apply changes.