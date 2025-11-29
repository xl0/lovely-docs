## Insert Operations

**Single/Multiple Rows:**
```typescript
await db.insert(users).values({ name: 'Andrew' });
await db.insert(users).values([{ name: 'Andrew' }, { name: 'Dan' }]);
```

**Type Inference:**
```typescript
type NewUser = typeof users.$inferInsert;
```

**Returning (PostgreSQL, SQLite):**
```typescript
await db.insert(users).values({ name: "Dan" }).returning();
await db.insert(users).values({ name: "Partial Dan" }).returning({ insertedId: users.id });
```

**$returningId (MySQL, SingleStore):**
```typescript
const result = await db.insert(usersTable).values([{ name: 'John' }]).$returningId();
// { id: number }[]
```

**On Conflict Do Nothing (PostgreSQL, SQLite):**
```typescript
await db.insert(users).values({ id: 1, name: 'John' }).onConflictDoNothing({ target: users.id });
```

**On Conflict Do Update (PostgreSQL, SQLite):**
```typescript
await db.insert(users)
  .values({ id: 1, name: 'Dan' })
  .onConflictDoUpdate({ target: users.id, set: { name: 'John' } });
```

With `targetWhere` and `setWhere` for conditional updates.

**On Duplicate Key Update (MySQL, SingleStore):**
```typescript
await db.insert(users).values({ id: 1, name: 'John' }).onDuplicateKeyUpdate({ set: { name: 'John' } });
```

**WITH Clause (CTE):**
```typescript
const userCount = db.$with('user_count').as(db.select({ value: sql`count(*)` }).from(users));
await db.with(userCount).insert(users).values([{ username: 'user1', admin: sql`...` }]).returning(...);
```

**Insert Into ... Select:**
```typescript
await db.insert(employees).select(
  db.select({ name: users.name }).from(users).where(eq(users.role, 'employee'))
);
```

Also supports callback and SQL template tag approaches.