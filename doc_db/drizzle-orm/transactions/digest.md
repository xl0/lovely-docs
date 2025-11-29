## Transactions

SQL transactions group one or more SQL statements into a single logical unit that either commits entirely or rolls back entirely.

### Basic Usage

Run statements in a transaction using `db.transaction()`:

```ts
await db.transaction(async (tx) => {
  await tx.update(accounts).set({ balance: sql`${accounts.balance} - 100.00` }).where(eq(users.name, 'Dan'));
  await tx.update(accounts).set({ balance: sql`${accounts.balance} + 100.00` }).where(eq(users.name, 'Andrew'));
});
```

### Nested Transactions with Savepoints

Drizzle supports savepoints via nested transactions:

```ts
await db.transaction(async (tx) => {
  await tx.update(accounts).set({ balance: sql`${accounts.balance} - 100.00` }).where(eq(users.name, 'Dan'));
  await tx.transaction(async (tx2) => {
    await tx2.update(users).set({ name: "Mr. Dan" }).where(eq(users.name, "Dan"));
  });
});
```

### Rollback on Condition

Call `tx.rollback()` to rollback the transaction based on business logic:

```ts
await db.transaction(async (tx) => {
  const [account] = await tx.select({ balance: accounts.balance }).from(accounts).where(eq(users.name, 'Dan'));
  if (account.balance < 100) {
    tx.rollback();
  }
  await tx.update(accounts).set({ balance: sql`${accounts.balance} - 100.00` }).where(eq(users.name, 'Dan'));
});
```

### Return Values

Transactions can return values:

```ts
const newBalance: number = await db.transaction(async (tx) => {
  await tx.update(accounts).set({ balance: sql`${accounts.balance} - 100.00` }).where(eq(users.name, 'Dan'));
  const [account] = await tx.select({ balance: accounts.balance }).from(accounts).where(eq(users.name, 'Dan'));
  return account.balance;
});
```

### Relational Queries in Transactions

Transactions work with relational query builder:

```ts
await db.transaction(async (tx) => {
  await tx.query.users.findMany({
    with: { accounts: true }
  });
});
```

### Dialect-Specific Configuration

**PostgreSQL** supports `isolationLevel` ("read uncommitted" | "read committed" | "repeatable read" | "serializable"), `accessMode` ("read only" | "read write"), and `deferrable`:

```ts
await db.transaction(async (tx) => {
  // statements
}, {
  isolationLevel: "read committed",
  accessMode: "read write",
  deferrable: true,
});
```

**MySQL** and **SingleStore** support `isolationLevel`, `accessMode`, and `withConsistentSnapshot`:

```ts
await db.transaction(async (tx) => {
  // statements
}, {
  isolationLevel: "read committed",
  accessMode: "read write",
  withConsistentSnapshot: true,
});
```

**SQLite** supports `behavior` ("deferred" | "immediate" | "exclusive"):

```ts
await db.transaction(async (tx) => {
  // statements
}, {
  behavior: "deferred",
});
```