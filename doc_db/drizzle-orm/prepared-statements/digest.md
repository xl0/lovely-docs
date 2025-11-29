## Query Performance with Prepared Statements

Drizzle ORM is a thin TypeScript layer on top of SQL with minimal overhead. To achieve near-zero overhead, use prepared statements.

### How Query Execution Works
When running a query, three steps occur:
1. Query builder configurations are concatenated into an SQL string
2. The string and parameters are sent to the database driver
3. The driver compiles the SQL to binary executable format and sends it to the database

### Prepared Statements
Prepared statements perform SQL concatenation once on the Drizzle side, allowing the database driver to reuse precompiled binary SQL instead of parsing the query repeatedly. This provides extreme performance benefits, especially for large SQL queries. Different database drivers support prepared statements differently.

**PostgreSQL:**
```typescript
const db = drizzle(...);
const prepared = db.select().from(customers).prepare("statement_name");
const res1 = await prepared.execute();
const res2 = await prepared.execute();
```

**MySQL:**
```typescript
const prepared = db.select().from(customers).prepare();
const res1 = await prepared.execute();
const res2 = await prepared.execute();
```

**SQLite:**
```typescript
const prepared = db.select().from(customers).prepare();
const res1 = prepared.all();
const res2 = prepared.all();
```

**SingleStore:**
```typescript
const prepared = db.select().from(customers).prepare();
const res1 = await prepared.execute();
const res2 = await prepared.execute();
```

### Placeholders for Dynamic Values
Use `sql.placeholder(...)` to embed dynamic runtime values in prepared statements.

**PostgreSQL/MySQL/SingleStore:**
```typescript
import { sql } from "drizzle-orm";

const p1 = db
  .select()
  .from(customers)
  .where(eq(customers.id, sql.placeholder('id')))
  .prepare("p1");

await p1.execute({ id: 10 }); // SELECT * FROM customers WHERE id = 10
await p1.execute({ id: 12 }); // SELECT * FROM customers WHERE id = 12

const p2 = db
  .select()
  .from(customers)
  .where(sql`lower(${customers.name}) like ${sql.placeholder('name')}`)
  .prepare("p2");

await p2.execute({ name: '%an%' }); // SELECT * FROM customers WHERE name ilike '%an%'
```

**SQLite:**
```typescript
const p1 = db
  .select()
  .from(customers)
  .where(eq(customers.id, sql.placeholder('id')))
  .prepare();

p1.get({ id: 10 }); // SELECT * FROM customers WHERE id = 10
p1.get({ id: 12 }); // SELECT * FROM customers WHERE id = 12

const p2 = db
  .select()
  .from(customers)
  .where(sql`lower(${customers.name}) like ${sql.placeholder('name')}`)
  .prepare();

p2.all({ name: '%an%' }); // SELECT * FROM customers WHERE name ilike '%an%'
```