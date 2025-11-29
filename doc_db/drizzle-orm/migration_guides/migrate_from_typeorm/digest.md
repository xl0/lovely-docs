## Migration Overview

Five-step process to migrate from TypeORM to Drizzle ORM:
1. Install Drizzle ORM & Drizzle Kit with `npm install drizzle-orm pg -D drizzle-kit @types/pg`
2. Create `drizzle.config.ts` with database credentials, schema path, and migration folder
3. Run `npx drizzle-kit introspect` to generate schema.ts from existing database
4. Create `src/drizzle/db.ts` to initialize database connection with `drizzle()` and Client
5. Replace TypeORM queries with Drizzle equivalents

## Schema Setup

After introspection, add relational definitions to schema.ts using `relations()` for type-safe queries:
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

**Insert**: Replace `repository.create()` and `repository.save()` with `db.insert(table).values([...])`. Note: numeric fields like `unitPrice` must be strings in Drizzle to handle precision beyond JavaScript number limits.

**Select single row with relations**:
```typescript
// TypeORM
const response = await repository.findOne({ where: { id }, relations: ['supplier'] });

// Drizzle - core query
const response = await db.select({ product: products, supplier: suppliers })
  .from(products).where(eq(products.id, id))
  .leftJoin(suppliers, eq(suppliers.id, products.supplierId));

// Drizzle - relational query (type-safe)
const response = await db.query.products.findFirst({
  where: (products, { eq }) => eq(products.id, id),
  with: { supplier: true },
});
```

**Select multiple with filtering and pagination**:
```typescript
// TypeORM
const [response, count] = await repository.findAndCount({
  skip: 0, take: 10,
  where: { name: ILike(`%test%`) },
  select: ['id', 'name', 'unitPrice', 'unitsInStock'],
});

// Drizzle
const whereOptions = ilike(products.name, `%test%`);
const [response, count] = await Promise.all([
  db.select({ id: products.id, name: products.name, unitPrice: products.unitPrice, unitsInStock: products.unitsInStock })
    .from(products).where(whereOptions).offset(0).limit(10),
  db.select({ count: sql<number>`cast(count(${products.id}) as integer)` })
    .from(products).where(whereOptions),
]);
```

**Select with aggregations and joins**:
```typescript
// TypeORM - requires queryBuilder
const response = await orderRepository.createQueryBuilder('order')
  .select(['order.id', 'order.orderDate', 'order.shipCountry',
    'SUM(product.unitPrice * detail.quantity)::float as "totalPrice"',
    'SUM(detail.quantity)::int as "totalQuantity"',
    'COUNT(detail.productId)::int as "totalProducts"'])
  .leftJoin('order.orderDetails', 'detail')
  .leftJoin('detail.product', 'product')
  .groupBy('order.id').where('order.id = :id', { id }).getRawOne();

// Drizzle - core query only (aggregations not supported in relational queries)
const response = await db.select({
  id: orders.id, shipCountry: orders.shipCountry, orderDate: orders.orderDate,
  totalPrice: sql<number>`cast(sum(${orderDetails.quantity} * ${products.unitPrice}) as float)`,
  totalQuantity: sql<number>`cast(sum(${orderDetails.quantity}) as int)`,
  totalProducts: sql<number>`cast(count(${orderDetails.productId}) as int)`,
})
  .from(orders).where(eq(orders.id, id)).groupBy(orders.id)
  .leftJoin(orderDetails, eq(orderDetails.orderId, orders.id))
  .leftJoin(products, eq(products.id, orderDetails.productId));
```

**Update**:
```typescript
// TypeORM
const supplier = await repository.findOneBy({ id });
supplier.city = 'TestCity1Updated';
await repository.save(supplier);

// Drizzle
await db.update(suppliers).set({ city: 'TestCity1Updated', country: 'TestCountry1Updated' })
  .where(eq(suppliers.id, id));
```

**Delete with transaction**:
```typescript
// TypeORM
const queryRunner = dataSource.createQueryRunner();
await queryRunner.connect();
await queryRunner.startTransaction();
try {
  await queryRunner.manager.delete(OrderDetail, { orderId: id });
  await queryRunner.manager.delete(Order, { id });
  await queryRunner.commitTransaction();
} catch (e) {
  await queryRunner.rollbackTransaction();
} finally {
  await queryRunner.release();
}

// Drizzle
try {
  await db.transaction(async (tx) => {
    await tx.delete(orderDetails).where(eq(orderDetails.orderId, id));
    await tx.delete(orders).where(eq(orders.id, id));
  });
} catch (e) {
  console.error(e);
}
```

## Key Differences

- Drizzle queries are strictly type-safe: selected fields are reflected in response type
- Numeric precision fields (decimal) must use string type in Drizzle
- Relational queries provide cleaner syntax but don't support aggregations
- Core queries support aggregations with `sql<Type>` template literals
- Transactions use `db.transaction()` callback instead of QueryRunner pattern
- No need for entity classes; schema is defined once in schema.ts