## Upsert Query

**PostgreSQL/SQLite:** Use `.onConflictDoUpdate()` with `target` and `set` properties. Use `excluded` keyword to reference proposed values. Support composite keys via array target, conditional updates with `setWhere`, and exclude columns by referencing existing values.

**MySQL:** Use `.onDuplicateKeyUpdate()` with automatic conflict detection. Use `values()` function to reference proposed values.

Examples:
```ts
// PostgreSQL/SQLite single row
await db.insert(users).values({ id: 1, name: 'John' })
  .onConflictDoUpdate({ target: users.id, set: { name: 'Super John' } });

// PostgreSQL/SQLite multiple rows
await db.insert(users).values(values)
  .onConflictDoUpdate({ target: users.id, set: { lastLogin: sql.raw(`excluded.${users.lastLogin.name}`) } });

// PostgreSQL/SQLite composite key
await db.insert(inventory).values({ warehouseId: 1, productId: 1, quantity: 100 })
  .onConflictDoUpdate({ target: [inventory.warehouseId, inventory.productId], set: { quantity: sql`${inventory.quantity} + 100` } });

// MySQL
await db.insert(users).values({ id: 1, name: 'John' })
  .onDuplicateKeyUpdate({ set: { name: 'Super John' } });

// MySQL multiple rows
await db.insert(users).values(values)
  .onDuplicateKeyUpdate({ set: { lastLogin: sql`values(${users.lastLogin})` } });
```