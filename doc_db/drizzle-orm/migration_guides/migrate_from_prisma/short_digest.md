## 5-Step Migration Process

1. Install: `npm install drizzle-orm pg -D drizzle-kit @types/pg`
2. Create `drizzle.config.ts` with DB credentials and schema path
3. Run `npx drizzle-kit introspect` to generate schema
4. Create DB connection with `drizzle()` and pg Client
5. Replace Prisma queries with Drizzle equivalents

## Query Replacements

**Insert**: `db.insert(table).values([...])`  
**Select**: `db.select().from().where().leftJoin()` or `db.query.table.findFirst({ where, with })`  
**Select Multiple**: `db.query.table.findMany({ where, columns, offset, limit })`  
**Aggregations**: Use `sql()` with `groupBy()` (core queries only)  
**Update**: `db.update(table).set({...}).where()`  
**Delete**: `db.transaction(async (tx) => { await tx.delete(...) })`

**Key Differences**:
- Decimal fields must be strings, not numbers
- Aggregations only work in core queries, not relational queries
- Use `ilike()` for case-insensitive text search instead of `{ contains: 'text', mode: 'insensitive' }`