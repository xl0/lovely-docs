## Prepared Statements for Query Performance

Prepared statements reduce overhead by performing SQL concatenation once, allowing the database driver to reuse precompiled binary SQL.

**Basic usage (PostgreSQL requires statement name):**
```typescript
const prepared = db.select().from(customers).prepare("statement_name"); // PostgreSQL
const prepared = db.select().from(customers).prepare(); // MySQL/SQLite/SingleStore
await prepared.execute(); // PostgreSQL/MySQL/SingleStore
prepared.all(); // SQLite
```

**With dynamic placeholders:**
```typescript
const p1 = db.select().from(customers)
  .where(eq(customers.id, sql.placeholder('id')))
  .prepare();
await p1.execute({ id: 10 });

const p2 = db.select().from(customers)
  .where(sql`lower(${customers.name}) like ${sql.placeholder('name')}`)
  .prepare();
await p2.execute({ name: '%an%' });
```

SQLite uses `.get()` and `.all()` instead of `.execute()`.