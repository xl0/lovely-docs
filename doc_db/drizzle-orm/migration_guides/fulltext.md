

## Pages

### migrate_from_prisma
Step-by-step migration from Prisma to Drizzle: install packages, configure drizzle.config.ts, introspect database, setup connection, replace queries (insert/select/update/delete/transactions with type-safe equivalents).

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

### migrate_from_sequelize_to_drizzle
Step-by-step migration from Sequelize to Drizzle ORM with installation, config, introspection, connection setup, and query translation examples (insert, select with joins/filtering/aggregations, update, delete with transactions).

## Migration Overview

Five-step process to migrate from Sequelize to Drizzle ORM:
1. Install Drizzle ORM & Drizzle Kit
2. Setup Drizzle config file
3. Introspect your database
4. Connect Drizzle ORM to your database
5. Transition queries from Sequelize to Drizzle ORM

## Installation

```bash
npm install drizzle-orm pg
npm install -D drizzle-kit @types/pg
```

## Configuration

Create `drizzle.config.ts`:
```typescript
import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  dialect: 'postgresql',
  out: './src/drizzle',
  schema: './src/drizzle/schema.ts',
  dbCredentials: {
    host: process.env.DB_HOST!,
    port: Number(process.env.DB_PORT!),
    user: process.env.DB_USERNAME!,
    password: process.env.DB_PASSWORD!,
    database: process.env.DB_NAME!,
  },
  verbose: true,
  strict: true,
});
```

## Database Introspection

Run `npx drizzle-kit introspect` to generate schema.ts file with all tables, columns, relations, and indices. Add relational definitions for type-safe queries:

```typescript
export const suppliersRelations = relations(suppliers, ({ many }) => ({
  products: many(products),
}));

export const productsRelations = relations(products, ({ one, many }) => ({
  supplier: one(suppliers, { fields: [products.supplierId], references: [suppliers.id] }),
  orderDetails: many(orderDetails),
}));
```

## Database Connection

Create `src/drizzle/db.ts`:
```typescript
import { drizzle } from 'drizzle-orm/node-postgres';
import { Client } from 'pg';
import * as schema from './schema';

export const client = new Client({
  host: process.env.DB_HOST!,
  port: Number(process.env.DB_PORT!),
  user: process.env.DB_USERNAME!,
  password: process.env.DB_PASSWORD!,
  database: process.env.DB_NAME!,
});

export const db = drizzle({ client, schema });
```

In `src/index.ts`, run migrations on startup:
```typescript
import 'dotenv/config';
import { client, db } from './drizzle/db';
import { resolve } from 'node:path';
import { migrate } from 'drizzle-orm/node-postgres/migrator';

(async () => {
  await client.connect();
  await migrate(db, { migrationsFolder: resolve(__dirname, './drizzle') });
  // ... start application
})();
```

## Query Migration Examples

### Insert

Sequelize:
```typescript
const suppliers = await Supplier.bulkCreate([
  { companyName: 'TestCompanyName1', city: 'TestCity1', country: 'TestCountry1' },
  { companyName: 'TestCompanyName2', city: 'TestCity2', country: 'TestCountry2' },
]);
```

Drizzle:
```typescript
await db.insert(suppliers).values([
  { companyName: 'TestCompanyName1', city: 'TestCity1', country: 'TestCountry1' },
  { companyName: 'TestCompanyName2', city: 'TestCity2', country: 'TestCountry2' },
]);
```

### Select with Join

Sequelize:
```typescript
const response = await Product.findByPk(id, { include: Supplier });
```

Drizzle (core query):
```typescript
const response = await db
  .select({ product: products, supplier: suppliers })
  .from(products)
  .where(eq(products.id, id))
  .leftJoin(suppliers, eq(suppliers.id, products.supplierId));
```

Drizzle (relational query):
```typescript
const response = await db.query.products.findFirst({
  where: (products, { eq }) => eq(products.id, id),
  with: { supplier: true },
});
```

Response type is strictly typed based on selected fields.

### Select with Filtering and Pagination

Sequelize:
```typescript
const { rows, count } = await Product.findAndCountAll({
  limit: 10,
  offset: 0,
  attributes: ['id', 'name', 'unitPrice', 'unitsInStock'],
  where: { name: { [Op.iLike]: `%test%` } },
});
```

Drizzle (core query):
```typescript
const whereOptions = ilike(products.name, `%test%`);
const [response, count] = await Promise.all([
  db
    .select({
      id: products.id,
      name: products.name,
      unitPrice: products.unitPrice,
      unitsInStock: products.unitsInStock,
    })
    .from(products)
    .where(whereOptions)
    .offset(0)
    .limit(10),
  db
    .select({ count: sql<number>`cast(count(${products.id}) as integer)` })
    .from(products)
    .where(whereOptions),
]);
```

Drizzle (relational query):
```typescript
const [response, count] = await Promise.all([
  db.query.products.findMany({
    where: whereOptions,
    columns: { id: true, name: true, unitPrice: true, unitsInStock: true },
    offset: 0,
    limit: 10,
  }),
  db
    .select({ count: sql<number>`cast(count(${products.id}) as integer)` })
    .from(products)
    .where(whereOptions),
]);
```

### Select with Aggregations

Sequelize (raw query):
```typescript
const response = await sequelize.query(
  `SELECT orders.id, orders."orderDate", orders."shipCountry",
    SUM(products."unitPrice" * order_details.quantity)::float AS "totalPrice",
    SUM(order_details.quantity)::int AS "totalQuantity",
    COUNT(order_details."productId")::int AS "totalProducts"
   FROM orders
   LEFT JOIN order_details ON orders.id = order_details."orderId"
   LEFT JOIN products ON order_details."productId" = products.id
   WHERE orders.id = :orderId
   GROUP BY orders.id`,
  { replacements: { orderId: id }, type: QueryTypes.SELECT }
);
```

Drizzle:
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

Note: Aggregations are not supported in relational queries; use core queries instead.

### Update

Sequelize:
```typescript
const supplier = await Supplier.findByPk(1);
if (!supplier) throw new Error('Supplier not found');
supplier.set({ city: 'TestCity1Updated', country: 'TestCountry1Updated' });
await supplier.save();
```

Drizzle:
```typescript
await db
  .update(suppliers)
  .set({ city: 'TestCity1Updated', country: 'TestCountry1Updated' })
  .where(eq(suppliers.id, id));
```

### Delete with Transaction

Sequelize:
```typescript
const order = await Order.findByPk(id);
if (!order) throw new Error('Order not found');
await sequelize.transaction(async (t) => {
  await OrderDetail.destroy({ where: { orderId: id }, transaction: t });
  await order.destroy({ transaction: t });
});
```

Drizzle:
```typescript
await db.transaction(async (tx) => {
  await tx.delete(orderDetails).where(eq(orderDetails.orderId, id));
  await tx.delete(orders).where(eq(orders.id, id));
});
```

## Key Differences

- Drizzle provides strict type safety for selected fields; Sequelize does not
- Numeric fields like `unitPrice` are strings in Drizzle (supports arbitrary precision) vs numbers in Sequelize
- Drizzle supports both core queries (SQL-like) and relational queries (ORM-like)
- Aggregations require core queries in Drizzle, not relational queries
- Drizzle introspection generates schema from existing database; migrations are generated from schema changes

### migrate_from_typeorm
Step-by-step migration from TypeORM to Drizzle with introspection, schema setup, relational definitions, and query pattern replacements (insert/select/update/delete/transactions) with type-safety guarantees and aggregation support via sql templates.

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

