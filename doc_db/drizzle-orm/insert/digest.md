## Insert Operations

### Insert Single Row
```typescript
await db.insert(users).values({ name: 'Andrew' });
```

Type inference for insert values:
```typescript
type NewUser = typeof users.$inferInsert;
const insertUser = async (user: NewUser) => {
  return db.insert(users).values(user);
}
```

### Insert Multiple Rows
```typescript
await db.insert(users).values([{ name: 'Andrew' }, { name: 'Dan' }]);
```

### Insert Returning (PostgreSQL, SQLite)
```typescript
await db.insert(users).values({ name: "Dan" }).returning();
await db.insert(users).values({ name: "Partial Dan" }).returning({ insertedId: users.id });
```

### Insert $returningId (MySQL, SingleStore)
MySQL doesn't support RETURNING, but Drizzle provides `$returningId()` for autoincrement primary keys:
```typescript
const result = await db.insert(usersTable).values([{ name: 'John' }, { name: 'John1' }]).$returningId();
// Returns: { id: number }[]
```

Works with custom primary keys using `$defaultFn`:
```typescript
const usersTableDefFn = mysqlTable('users_default_fn', {
  customId: varchar('id', { length: 256 }).primaryKey().$defaultFn(createId),
  name: text('name').notNull(),
});
const result = await db.insert(usersTableDefFn).values([{ name: 'John' }, { name: 'John1' }]).$returningId();
// Returns: { customId: string }[]
```

If no primary keys exist, returns `{}[]`.

### On Conflict Do Nothing (PostgreSQL, SQLite)
```typescript
await db.insert(users).values({ id: 1, name: 'John' }).onConflictDoNothing();
await db.insert(users).values({ id: 1, name: 'John' }).onConflictDoNothing({ target: users.id });
```

### On Conflict Do Update (PostgreSQL, SQLite)
```typescript
await db.insert(users)
  .values({ id: 1, name: 'Dan' })
  .onConflictDoUpdate({ target: users.id, set: { name: 'John' } });
```

With `where` clauses using `targetWhere` (for partial indexes) and `setWhere` (for update condition):
```typescript
await db.insert(employees)
  .values({ employeeId: 123, name: 'John Doe' })
  .onConflictDoUpdate({
    target: employees.employeeId,
    targetWhere: sql`name <> 'John Doe'`,
    set: { name: sql`excluded.name` }
  });

await db.insert(employees)
  .values({ employeeId: 123, name: 'John Doe' })
  .onConflictDoUpdate({
    target: employees.employeeId,
    set: { name: 'John Doe' },
    setWhere: sql`name <> 'John Doe'`
  });
```

Composite indexes/primary keys:
```typescript
await db.insert(users)
  .values({ firstName: 'John', lastName: 'Doe' })
  .onConflictDoUpdate({
    target: [users.firstName, users.lastName],
    set: { firstName: 'John1' }
  });
```

### On Duplicate Key Update (MySQL, SingleStore)
MySQL uses `ON DUPLICATE KEY UPDATE` instead of `ON CONFLICT`:
```typescript
await db.insert(users)
  .values({ id: 1, name: 'John' })
  .onDuplicateKeyUpdate({ set: { name: 'John' } });
```

To simulate "do nothing", set a column to itself:
```typescript
await db.insert(users)
  .values({ id: 1, name: 'John' })
  .onDuplicateKeyUpdate({ set: { id: sql`id` } });
```

### WITH Clause (CTE)
```typescript
const userCount = db.$with('user_count').as(
  db.select({ value: sql`count(*)`.as('value') }).from(users)
);

const result = await db.with(userCount)
  .insert(users)
  .values([
    { username: 'user1', admin: sql`((select * from ${userCount}) = 0)` }
  ])
  .returning({
    admin: users.admin
  });
```

### Insert Into ... Select
Three approaches to insert from SELECT:

**Query Builder:**
```typescript
const insertedEmployees = await db
  .insert(employees)
  .select(
    db.select({ name: users.name }).from(users).where(eq(users.role, 'employee'))
  )
  .returning({
    id: employees.id,
    name: employees.name
  });
```

**Callback:**
```typescript
await db.insert(employees).select(
  () => db.select({ name: users.name }).from(users).where(eq(users.role, 'employee'))
);
```

**SQL Template Tag:**
```typescript
await db.insert(employees).select(
  sql`select "users"."name" as "name" from "users" where "users"."role" = 'employee'`
);
```

**Important:** When using upsert clauses with INSERT ... SELECT, the SELECT must contain a WHERE clause (even `WHERE true`) to avoid parsing ambiguity with JOIN constraints.