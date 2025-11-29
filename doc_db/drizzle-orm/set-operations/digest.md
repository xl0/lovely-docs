## Set Operations

SQL set operations combine results from multiple query blocks into a single result. Drizzle-orm supports: UNION, INTERSECT, EXCEPT, and their ALL variants.

### UNION
Combines all results from two queries, removing duplicates.

```typescript
import { union } from 'drizzle-orm/pg-core'
const result = await union(
  db.select({ name: users.name }).from(users),
  db.select({ name: customers.name }).from(customers)
).limit(10);
```

Builder pattern alternative:
```typescript
const result = await db
  .select({ name: users.name })
  .from(users)
  .union(db.select({ name: customers.name }).from(customers))
  .limit(10);
```

### UNION ALL
Combines all results from two queries, keeping duplicates. Useful when you want to preserve all records without deduplication.

```typescript
import { unionAll } from 'drizzle-orm/pg-core'
const result = await unionAll(
  db.select({ transaction: onlineSales.transactionId }).from(onlineSales),
  db.select({ transaction: inStoreSales.transactionId }).from(inStoreSales)
);
```

Builder pattern:
```typescript
const result = await db
  .select({ transaction: onlineSales.transactionId })
  .from(onlineSales)
  .unionAll(db.select({ transaction: inStoreSales.transactionId }).from(inStoreSales));
```

Note: SingleStore has different ORDER BY behavior with UNION ALL compared to MySQL.

### INTERSECT
Returns only rows that appear in both query results, removing duplicates.

```typescript
import { intersect } from 'drizzle-orm/pg-core'
const result = await intersect(
  db.select({ courseName: depA.courseName }).from(depA),
  db.select({ courseName: depB.courseName }).from(depB)
);
```

Builder pattern:
```typescript
const result = await db
  .select({ courseName: depA.courseName })
  .from(depA)
  .intersect(db.select({ courseName: depB.courseName }).from(depB));
```

### INTERSECT ALL
Returns only rows that appear in both query results, keeping duplicates.

```typescript
import { intersectAll } from 'drizzle-orm/pg-core'
const result = await intersectAll(
  db.select({ productId: regularCustomerOrders.productId, quantityOrdered: regularCustomerOrders.quantityOrdered }).from(regularCustomerOrders),
  db.select({ productId: vipCustomerOrders.productId, quantityOrdered: vipCustomerOrders.quantityOrdered }).from(vipCustomerOrders)
);
```

Builder pattern:
```typescript
const result = await db
  .select({ productId: regularCustomerOrders.productId, quantityOrdered: regularCustomerOrders.quantityOrdered })
  .from(regularCustomerOrders)
  .intersectAll(
    db.select({ productId: vipCustomerOrders.productId, quantityOrdered: vipCustomerOrders.quantityOrdered }).from(vipCustomerOrders)
  );
```

Supported in PostgreSQL and MySQL only.

### EXCEPT
Returns all rows from the first query that are not in the second query, removing duplicates.

```typescript
import { except } from 'drizzle-orm/pg-core'
const result = await except(
  db.select({ courseName: depA.projectsName }).from(depA),
  db.select({ courseName: depB.projectsName }).from(depB)
);
```

Builder pattern:
```typescript
const result = await db
  .select({ courseName: depA.projectsName })
  .from(depA)
  .except(db.select({ courseName: depB.projectsName }).from(depB));
```

### EXCEPT ALL
Returns all rows from the first query that are not in the second query, keeping duplicates.

```typescript
import { exceptAll } from 'drizzle-orm/pg-core'
const result = await exceptAll(
  db.select({ productId: regularCustomerOrders.productId, quantityOrdered: regularCustomerOrders.quantityOrdered }).from(regularCustomerOrders),
  db.select({ productId: vipCustomerOrders.productId, quantityOrdered: vipCustomerOrders.quantityOrdered }).from(vipCustomerOrders)
);
```

Builder pattern:
```typescript
const result = await db
  .select({ productId: regularCustomerOrders.productId, quantityOrdered: regularCustomerOrders.quantityOrdered })
  .from(regularCustomerOrders)
  .exceptAll(
    db.select({ productId: vipCustomerOrders.productId, quantityOrdered: vipCustomerOrders.quantityOrdered }).from(vipCustomerOrders)
  );
```

Supported in PostgreSQL and MySQL only.

## Database Support

- **UNION, UNION ALL, INTERSECT, EXCEPT**: PostgreSQL, MySQL, SQLite, SingleStore
- **INTERSECT ALL, EXCEPT ALL**: PostgreSQL, MySQL only

## Import Paths

- PostgreSQL: `drizzle-orm/pg-core`
- MySQL: `drizzle-orm/mysql-core`
- SQLite: `drizzle-orm/sqlite-core`
- SingleStore: `drizzle-orm/singlestore-core`

Both import-pattern (function-based) and builder-pattern (method-based) syntaxes are supported for all operations.