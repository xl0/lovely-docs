## Migration from Prisma, Sequelize, and TypeORM

Five-step migration process for all ORMs:
1. Install Drizzle ORM & Drizzle Kit: `npm install drizzle-orm pg -D drizzle-kit @types/pg`
2. Create `drizzle.config.ts` with database credentials and schema path
3. Run `npx drizzle-kit introspect` to generate schema from existing database
4. Create `src/drizzle/db.ts` with database connection using `drizzle()` and pg Client
5. Replace ORM queries with Drizzle equivalents

### Schema Setup

Add relational definitions after introspection:
```typescript
export const suppliersRelations = relations(suppliers, ({ many }) => ({
  products: many(products),
}));
export const productsRelations = relations(products, ({ one, many }) => ({
  supplier: one(suppliers, { fields: [products.supplierId], references: [suppliers.id] }),
  orderDetails: many(orderDetails),
}));
```

### Query Patterns

**Insert**: `db.insert(table).values([...])`
```typescript
await db.insert(suppliers).values([
  { companyName: 'TestCompanyName1', city: 'TestCity1', country: 'TestCountry1' },
]);
```

**Select single with relations** (relational query):
```typescript
const response = await db.query.products.findFirst({
  where: (products, { eq }) => eq(products.id, id),
  with: { supplier: true },
});
```

**Select multiple with filtering and pagination**:
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
    .from(products).where(whereOptions),
]);
```

**Aggregations** (core queries only, not relational):
```typescript
const response = await db.select({
  id: orders.id,
  totalPrice: sql<number>`cast(sum(${orderDetails.quantity} * ${products.unitPrice}) as float)`,
  totalQuantity: sql<number>`cast(sum(${orderDetails.quantity}) as int)`,
})
  .from(orders).where(eq(orders.id, id)).groupBy(orders.id)
  .leftJoin(orderDetails, eq(orderDetails.orderId, orders.id))
  .leftJoin(products, eq(products.id, orderDetails.productId));
```

**Update**: `db.update(table).set({...}).where(...)`

**Delete with transaction**:
```typescript
await db.transaction(async (tx) => {
  await tx.delete(orderDetails).where(eq(orderDetails.orderId, id));
  await tx.delete(orders).where(eq(orders.id, id));
});
```

### Key Differences from Other ORMs

- Strict type safety: selected fields are reflected in response type
- Numeric fields (decimal) must use string type for precision
- Relational queries provide cleaner syntax but don't support aggregations
- Core queries support aggregations with `sql<Type>` templates
- No entity classes; schema defined once in schema.ts
- Transactions use `db.transaction()` callback pattern