## SQL Update

Basic update syntax with `.set()` and `.where()`:
```typescript
await db.update(users)
  .set({ name: 'Mr. Dan' })
  .where(eq(users.name, 'Dan'));
```

Object keys must match column names. `undefined` values are ignored; pass `null` to set a column to null. SQL expressions can be passed as values:
```typescript
await db.update(users)
  .set({ updatedAt: sql`NOW()` })
  .where(eq(users.name, 'Dan'));
```

### Limit
Supported in MySQL, SQLite, SingleStore (not PostgreSQL). Use `.limit()` to restrict the number of rows updated:
```typescript
await db.update(usersTable).set({ verified: true }).limit(2);
```

### Order By
Use `.orderBy()` to sort rows before updating. Supports single or multiple fields with `asc()` and `desc()`:
```typescript
import { asc, desc } from 'drizzle-orm';

await db.update(usersTable).set({ verified: true }).orderBy(usersTable.name);
await db.update(usersTable).set({ verified: true }).orderBy(desc(usersTable.name));
await db.update(usersTable).set({ verified: true }).orderBy(asc(usersTable.name), desc(usersTable.name2));
```

### Update with Returning
Supported in PostgreSQL and SQLite. Retrieve updated rows after the update:
```typescript
const updatedUserId: { updatedId: number }[] = await db.update(users)
  .set({ name: 'Mr. Dan' })
  .where(eq(users.name, 'Dan'))
  .returning({ updatedId: users.id });
```

### WITH Clause
Use common table expressions (CTEs) to simplify complex queries:
```typescript
const averagePrice = db.$with('average_price').as(
  db.select({ value: sql`avg(${products.price})`.as('value') }).from(products)
);

const result = await db.with(averagePrice)
  .update(products)
  .set({ cheap: true })
  .where(lt(products.price, sql`(select * from ${averagePrice})`))
  .returning({ id: products.id });
```

### Update ... FROM
Supported in PostgreSQL and SQLite (from drizzle-orm@0.36.3+). Join the target table against other tables to compute which rows to update and their new values:
```typescript
await db
  .update(users)
  .set({ cityId: cities.id })
  .from(cities)
  .where(and(eq(cities.name, 'Seattle'), eq(users.name, 'John')));
```

Table aliases are supported:
```typescript
const c = alias(cities, 'c');
await db
  .update(users)
  .set({ cityId: c.id })
  .from(c);
```

In PostgreSQL, you can return columns from joined tables:
```typescript
const updatedUsers = await db
  .update(users)
  .set({ cityId: cities.id })
  .from(cities)
  .returning({ id: users.id, cityName: cities.name });
```