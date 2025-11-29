## Upsert Query

Upsert operations insert a row or update it if a conflict occurs. Drizzle supports upsert across PostgreSQL, MySQL, and SQLite with different APIs.

### PostgreSQL and SQLite

Use `.onConflictDoUpdate()` method:

```ts
await db
  .insert(users)
  .values({ id: 1, name: 'John' })
  .onConflictDoUpdate({
    target: users.id,
    set: { name: 'Super John' },
  });
```

For multiple rows, use the `excluded` keyword to reference the proposed row:

```ts
await db
  .insert(users)
  .values([
    { id: 1, lastLogin: new Date() },
    { id: 2, lastLogin: new Date(Date.now() + 1000 * 60 * 60) },
  ])
  .onConflictDoUpdate({
    target: users.id,
    set: { lastLogin: sql.raw(`excluded.${users.lastLogin.name}`) },
  });
```

For composite primary keys, pass an array to `target`:

```ts
await db
  .insert(inventory)
  .values({ warehouseId: 1, productId: 1, quantity: 100 })
  .onConflictDoUpdate({
    target: [inventory.warehouseId, inventory.productId],
    set: { quantity: sql`${inventory.quantity} + 100` },
  });
```

Use `setWhere` to conditionally update only when certain conditions are met:

```ts
await db
  .insert(products)
  .values(data)
  .onConflictDoUpdate({
    target: products.id,
    set: { price: excludedPrice, stock: excludedStock },
    setWhere: or(
      sql`${products.stock} != ${excludedStock}`,
      sql`${products.price} != ${excludedPrice}`
    ),
  });
```

To exclude specific columns from update, reference the existing column value:

```ts
await db
  .insert(users)
  .values(data)
  .onConflictDoUpdate({
    target: users.id,
    set: { ...data, email: sql`${users.email}` }, // email stays unchanged
  });
```

Helper function for updating specific columns in bulk upserts:

```ts
const buildConflictUpdateColumns = <T extends PgTable | SQLiteTable, Q extends keyof T['_']['columns']>(
  table: T,
  columns: Q[],
) => {
  const cls = getTableColumns(table);
  return columns.reduce((acc, column) => {
    const colName = cls[column].name;
    acc[column] = sql.raw(`excluded.${colName}`);
    return acc;
  }, {} as Record<Q, SQL>);
};

await db
  .insert(users)
  .values(values)
  .onConflictDoUpdate({
    target: users.id,
    set: buildConflictUpdateColumns(users, ['lastLogin', 'active']),
  });
```

### MySQL

Use `.onDuplicateKeyUpdate()` method. MySQL automatically determines conflict targets from primary keys and unique indexes:

```ts
await db
  .insert(users)
  .values({ id: 1, name: 'John' })
  .onDuplicateKeyUpdate({ set: { name: 'Super John' } });
```

For multiple rows, use the `values()` function to reference the proposed column value:

```ts
await db
  .insert(users)
  .values([
    { id: 1, lastLogin: new Date() },
    { id: 2, lastLogin: new Date(Date.now() + 1000 * 60 * 60) },
  ])
  .onDuplicateKeyUpdate({
    set: { lastLogin: sql`values(${users.lastLogin})` },
  });
```

Helper function for updating specific columns:

```ts
const buildConflictUpdateColumns = <T extends MySqlTable, Q extends keyof T['_']['columns']>(
  table: T,
  columns: Q[],
) => {
  const cls = getTableColumns(table);
  return columns.reduce((acc, column) => {
    acc[column] = sql`values(${cls[column]})`;
    return acc;
  }, {} as Record<Q, SQL>);
};

await db
  .insert(users)
  .values(values)
  .onDuplicateKeyUpdate({
    set: buildConflictUpdateColumns(users, ['lastLogin', 'active']),
  });
```

To exclude specific columns from update:

```ts
await db
  .insert(users)
  .values(data)
  .onDuplicateKeyUpdate({
    set: { ...data, email: sql`${users.email}` }, // email stays unchanged
  });
```