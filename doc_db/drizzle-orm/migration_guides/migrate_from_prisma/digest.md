## Migration Overview

Migrating from Prisma to Drizzle ORM involves 5 steps:
1. Install Drizzle ORM & Drizzle Kit with `npm install drizzle-orm pg -D drizzle-kit @types/pg`
2. Create `drizzle.config.ts` with database credentials, schema path, and migration output folder
3. Run `npx drizzle-kit introspect` to generate schema from existing database
4. Create database connection in `src/drizzle/db.ts` using `drizzle()` with pg Client
5. Replace Prisma queries with Drizzle equivalents

## Schema Setup

After introspection, update the generated schema with relations using `relations()` function:
```typescript
export const suppliersRelations = relations(suppliers, ({ many }) => ({
  products: many(products),
}));
export const productsRelations = relations(products, ({ one, many }) => ({
  supplier: one(suppliers, { fields: [products.supplierId], references: [suppliers.id] }),
  orderDetails: many(orderDetails),
}));
```

## Query Migration Examples

**Insert**: Replace `prisma.table.createMany()` with `db.insert(table).values([...])`
```typescript
await db.insert(suppliers).values([
  { companyName: 'TestCompanyName1', city: 'TestCity1', country: 'TestCountry1' },
  { companyName: 'TestCompanyName2', city: 'TestCity2', country: 'TestCountry2' },
]);
```
Note: Decimal fields like `unitPrice` must be strings in Drizzle, not numbers.

**Select Single**: Replace `prisma.table.findUnique()` with either core queries using `db.select().from().where().leftJoin()` or relational queries using `db.query.table.findFirst({ where, with })`
```typescript
// Core query
const response = await db
  .select({ product: products, supplier: suppliers })
  .from(products)
  .where(eq(products.id, id))
  .leftJoin(suppliers, eq(suppliers.id, products.supplierId));

// Relational query
const response = await db.query.products.findFirst({
  where: (products, { eq }) => eq(products.id, id),
  with: { supplier: true },
});
```

**Select Multiple with Filtering & Pagination**: Replace `prisma.table.findMany()` with `db.select().from().where().offset().limit()` or relational `db.query.table.findMany()`
```typescript
const whereOptions = ilike(products.name, `%test%`);
const [response, count] = await Promise.all([
  db.query.products.findMany({
    where: whereOptions,
    columns: { id: true, name: true, unitPrice: true, unitsInStock: true },
    offset: 0,
    limit: 10,
  }),
  db.select({ count: sql<number>`cast(count(${products.id}) as integer)` })
    .from(products)
    .where(whereOptions),
]);
```

**Aggregations**: Use `sql()` for aggregate functions with `groupBy()`. Aggregations are not supported in relational queries, only core queries.
```typescript
const response = await db
  .select({
    id: orders.id,
    shipCountry: orders.shipCountry,
    orderDate: orders.orderDate,
    totalPrice: sql<number>`cast(sum(${orderDetails.quantity} * ${products.unitPrice}) as float)`,
    totalQuantity: sql<number>`cast(sum(${orderDetails.quantity}) as int)`,
    totalProducts: sql<number>`cast(count(${orderDetails.productId}) as int)`,
  })
  .from(orders)
  .where(eq(orders.id, id))
  .groupBy(orders.id)
  .leftJoin(orderDetails, eq(orderDetails.orderId, orders.id))
  .leftJoin(products, eq(products.id, orderDetails.productId));
```

**Update**: Replace `prisma.table.update()` with `db.update(table).set({...}).where()`
```typescript
await db
  .update(suppliers)
  .set({ city: 'TestCity1Updated', country: 'TestCountry1Updated' })
  .where(eq(suppliers.id, id));
```

**Delete with Transactions**: Replace `prisma.$transaction()` with `db.transaction()`
```typescript
await db.transaction(async (tx) => {
  await tx.delete(orderDetails).where(eq(orderDetails.orderId, id));
  await tx.delete(orders).where(eq(orders.id, id));
});
```

## Database Connection

Initialize database connection and run migrations on app startup:
```typescript
import { client, db } from './drizzle/db';
import { migrate } from 'drizzle-orm/node-postgres/migrator';

(async () => {
  await client.connect();
  await migrate(db, { migrationsFolder: resolve(__dirname, './drizzle') });
  // start application
})();
```