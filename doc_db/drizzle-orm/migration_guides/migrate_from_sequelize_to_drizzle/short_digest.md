## Installation & Setup

```bash
npm install drizzle-orm pg
npm install -D drizzle-kit @types/pg
```

Create `drizzle.config.ts` with database credentials, then run `npx drizzle-kit introspect` to generate schema.

## Database Connection

```typescript
import { drizzle } from 'drizzle-orm/node-postgres';
import { Client } from 'pg';
import * as schema from './schema';

export const client = new Client({ /* credentials */ });
export const db = drizzle({ client, schema });
```

## Query Examples

**Insert:**
```typescript
await db.insert(suppliers).values([
  { companyName: 'TestCompanyName1', city: 'TestCity1', country: 'TestCountry1' },
]);
```

**Select with Join:**
```typescript
const response = await db
  .select({ product: products, supplier: suppliers })
  .from(products)
  .where(eq(products.id, id))
  .leftJoin(suppliers, eq(suppliers.id, products.supplierId));
```

**Select with Filtering & Pagination:**
```typescript
const [response, count] = await Promise.all([
  db.select({ id: products.id, name: products.name })
    .from(products)
    .where(ilike(products.name, `%test%`))
    .offset(0).limit(10),
  db.select({ count: sql<number>`cast(count(${products.id}) as integer)` })
    .from(products)
    .where(ilike(products.name, `%test%`)),
]);
```

**Select with Aggregations:**
```typescript
const response = await db
  .select({
    id: orders.id,
    totalPrice: sql<number>`cast(sum(${orderDetails.quantity} * ${products.unitPrice}) as float)`,
    totalQuantity: sql<number>`cast(sum(${orderDetails.quantity}) as int)`,
  })
  .from(orders)
  .where(eq(orders.id, id))
  .groupBy(orders.id)
  .leftJoin(orderDetails, eq(orderDetails.orderId, orders.id))
  .leftJoin(products, eq(products.id, orderDetails.productId));
```

**Update:**
```typescript
await db.update(suppliers)
  .set({ city: 'TestCity1Updated', country: 'TestCountry1Updated' })
  .where(eq(suppliers.id, id));
```

**Delete with Transaction:**
```typescript
await db.transaction(async (tx) => {
  await tx.delete(orderDetails).where(eq(orderDetails.orderId, id));
  await tx.delete(orders).where(eq(orders.id, id));
});
```

## Key Differences from Sequelize

- Strict type safety for selected fields
- Numeric fields are strings (arbitrary precision)
- Both core queries (SQL-like) and relational queries (ORM-like) supported
- Aggregations require core queries, not relational queries