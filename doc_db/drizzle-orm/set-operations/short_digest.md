## Set Operations

Combine results from multiple queries using UNION, INTERSECT, EXCEPT and their ALL variants.

**UNION** - combines results, removes duplicates:
```typescript
const result = await db.select({ name: users.name }).from(users)
  .union(db.select({ name: customers.name }).from(customers)).limit(10);
```

**UNION ALL** - combines results, keeps duplicates:
```typescript
const result = await db.select({ transaction: onlineSales.transactionId }).from(onlineSales)
  .unionAll(db.select({ transaction: inStoreSales.transactionId }).from(inStoreSales));
```

**INTERSECT** - returns common rows, removes duplicates:
```typescript
const result = await db.select({ courseName: depA.courseName }).from(depA)
  .intersect(db.select({ courseName: depB.courseName }).from(depB));
```

**INTERSECT ALL** - returns common rows, keeps duplicates (PostgreSQL, MySQL only):
```typescript
const result = await db.select({ productId: regularOrders.productId, quantityOrdered: regularOrders.quantityOrdered }).from(regularOrders)
  .intersectAll(db.select({ productId: vipOrders.productId, quantityOrdered: vipOrders.quantityOrdered }).from(vipOrders));
```

**EXCEPT** - returns rows from first query not in second, removes duplicates:
```typescript
const result = await db.select({ courseName: depA.projectsName }).from(depA)
  .except(db.select({ courseName: depB.projectsName }).from(depB));
```

**EXCEPT ALL** - returns rows from first query not in second, keeps duplicates (PostgreSQL, MySQL only):
```typescript
const result = await db.select({ productId: regularOrders.productId, quantityOrdered: regularOrders.quantityOrdered }).from(regularOrders)
  .exceptAll(db.select({ productId: vipOrders.productId, quantityOrdered: vipOrders.quantityOrdered }).from(vipOrders));
```

Both function-based and method-based (builder) syntax supported. Import from database-specific core modules (pg-core, mysql-core, sqlite-core, singlestore-core).