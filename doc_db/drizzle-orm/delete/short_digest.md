## Delete Operations

Basic delete:
```typescript
await db.delete(users).where(eq(users.name, 'Dan'));
```

**Limit** (MySQL, SQLite, SingleStore):
```typescript
await db.delete(users).where(eq(users.name, 'Dan')).limit(2);
```

**Order By** (sort before deletion):
```typescript
await db.delete(users).where(eq(users.name, 'Dan')).orderBy(desc(users.name));
```

**Delete with Return** (PostgreSQL, SQLite):
```typescript
const deletedUser = await db.delete(users).where(eq(users.name, 'Dan')).returning();
const deletedIds = await db.delete(users).where(eq(users.name, 'Dan')).returning({ deletedId: users.id });
```

**WITH Clause** (CTEs for complex queries):
```typescript
const averageAmount = db.$with('average_amount').as(
  db.select({ value: sql`avg(${orders.amount})`.as('value') }).from(orders)
);
await db.with(averageAmount).delete(orders).where(gt(orders.amount, sql`(select * from ${averageAmount})`)).returning({ id: orders.id });
```