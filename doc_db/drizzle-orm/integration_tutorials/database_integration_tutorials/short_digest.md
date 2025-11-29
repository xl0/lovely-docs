## Database Integration Tutorials

Setup guides for Drizzle ORM with Neon, Nile (multi-tenant), Supabase, Turso, Vercel Postgres, and Xata.

**Common setup pattern:**
1. Install drizzle-orm, drizzle-kit, database driver
2. Configure connection string in `.env`
3. Define schema with `pgTable`/`sqliteTable` and type inference
4. Create `drizzle.config.ts` with dialect and credentials
5. Generate migrations: `npx drizzle-kit generate`
6. Run migrations: `npx drizzle-kit migrate` or `npx drizzle-kit push`

**CRUD operations:**
```typescript
// Insert
await db.insert(table).values(data);

// Select with joins/pagination
db.select({...getTableColumns(table), count: count(other.id)})
  .from(table)
  .leftJoin(other, eq(table.id, other.tableId))
  .groupBy(table.id)
  .limit(pageSize).offset((page-1)*pageSize);

// Update
await db.update(table).set(data).where(eq(table.id, id));

// Delete
await db.delete(table).where(eq(table.id, id));
```

**Special features:**
- Nile: Multi-tenant with AsyncLocalStorage automatic scoping
- Turso: SQLite-compatible with libSQL driver
- Xata: Branch-based development with zero-downtime migrations