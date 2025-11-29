## Counting All Rows

Use the `count()` function or `sql` operator to count all rows:

```ts
import { count, sql } from 'drizzle-orm';
import { products } from './schema';

await db.select({ count: count() }).from(products);
// or
await db.select({ count: sql`count(*)`.mapWith(Number) }).from(products);
```

Result type: `{ count: number }[]`

## Counting Non-NULL Values in a Column

Pass a column to `count()` to count only non-NULL values:

```ts
await db.select({ count: count(products.discount) }).from(products);
```

## Database-Specific Type Casting

PostgreSQL and MySQL return `count()` as bigint (interpreted as string by drivers), requiring explicit casting to integer:

```ts
import { AnyColumn, sql } from 'drizzle-orm';

const customCount = (column?: AnyColumn) => {
  if (column) {
    return sql<number>`cast(count(${column}) as integer)`;
  } else {
    return sql<number>`cast(count(*) as integer)`;
  }
};

await db.select({ count: customCount() }).from(products);
await db.select({ count: customCount(products.discount) }).from(products);
```

SQLite returns `count()` as integer natively:

```ts
await db.select({ count: sql<number>`count(*)` }).from(products);
await db.select({ count: sql<number>`count(${products.discount})` }).from(products);
```

## Type Generics Warning

When using `sql<number>`, you declare the expected type. Drizzle cannot perform runtime type casts based on the generic—if specified incorrectly, the runtime value won't match. Use `.mapWith()` for runtime transformations.

## Counting with Conditions

Use `.where()` to count rows matching a condition:

```ts
import { count, gt } from 'drizzle-orm';

await db
  .select({ count: count() })
  .from(products)
  .where(gt(products.price, 100));
```

## Counting with Joins and Aggregations

Combine `count()` with joins and grouping:

```ts
import { count, eq } from 'drizzle-orm';
import { countries, cities } from './schema';

await db
  .select({
    country: countries.name,
    citiesCount: count(cities.id),
  })
  .from(countries)
  .leftJoin(cities, eq(countries.id, cities.countryId))
  .groupBy(countries.id)
  .orderBy(countries.name);
```

## Supported Databases

PostgreSQL, MySQL, SQLite