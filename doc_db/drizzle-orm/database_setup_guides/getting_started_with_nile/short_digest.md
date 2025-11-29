## Getting Started with Nile

Setup guide for Drizzle ORM with Nile (PostgreSQL for multi-tenant apps).

**Installation:**
```bash
npm install pg
npm install -D @types/pg
```

**Key steps:**
1. Set `NILEDB_URL` environment variable
2. Connect Drizzle to database using the URL
3. Define schema with tenant-aware tables:
```typescript
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
4. Setup `drizzle.config.ts` with PostgreSQL dialect
5. Apply migrations and run queries