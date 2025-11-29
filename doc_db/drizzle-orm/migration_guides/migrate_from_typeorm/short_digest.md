## Setup
1. Install: `npm install drizzle-orm pg -D drizzle-kit @types/pg`
2. Create `drizzle.config.ts` with DB credentials and schema path
3. Run `npx drizzle-kit introspect` to generate schema.ts
4. Create `src/drizzle/db.ts` with `drizzle()` initialization
5. Add `relations()` definitions to schema for type-safe queries

## Query Examples

**Insert**: `db.insert(table).values([...])`  
**Select with relations**: `db.query.products.findFirst({ where: ..., with: { supplier: true } })`  
**Select with filtering/pagination**: `db.select({...}).from(table).where(...).offset(0).limit(10)`  
**Aggregations**: `db.select({ total: sql<number>\`sum(...)\` }).from(table).groupBy(...)`  
**Update**: `db.update(table).set({...}).where(...)`  
**Delete in transaction**: `db.transaction(async (tx) => { await tx.delete(...) })`

## Key Differences
- Strictly type-safe: response type matches selected fields
- Decimal fields use string type (not number)
- Relational queries don't support aggregations
- Transactions use callback pattern, no QueryRunner