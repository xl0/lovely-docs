## Count All Rows

```ts
await db.select({ count: count() }).from(products);
```

## Count Non-NULL Column Values

```ts
await db.select({ count: count(products.discount) }).from(products);
```

## Database-Specific Casting

PostgreSQL/MySQL require casting to integer:
```ts
const customCount = (column?: AnyColumn) => {
  if (column) {
    return sql<number>`cast(count(${column}) as integer)`;
  } else {
    return sql<number>`cast(count(*) as integer)`;
  }
};
```

SQLite returns integer natively:
```ts
await db.select({ count: sql<number>`count(*)` }).from(products);
```

## Count with Conditions

```ts
await db.select({ count: count() }).from(products).where(gt(products.price, 100));
```

## Count with Joins and Grouping

```ts
await db
  .select({ country: countries.name, citiesCount: count(cities.id) })
  .from(countries)
  .leftJoin(cities, eq(countries.id, cities.countryId))
  .groupBy(countries.id);
```