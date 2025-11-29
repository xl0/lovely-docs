## New Features

**Enhanced `.onConflictDoUpdate()` for SQLite**: Replaced single `where` field with separate `setWhere` and `targetWhere` fields for more granular control over conflict resolution.

- `targetWhere`: Filters which rows are considered for the conflict check
- `setWhere`: Filters which rows receive the update

Example with `targetWhere`:
```ts
await db.insert(employees)
  .values({ employeeId: 123, name: 'John Doe' })
  .onConflictDoUpdate({
    target: employees.employeeId,
    targetWhere: sql`name <> 'John Doe'`,
    set: { name: sql`excluded.name` }
  });
```

Example with `setWhere`:
```ts
await db.insert(employees)
  .values({ employeeId: 123, name: 'John Doe' })
  .onConflictDoUpdate({
    target: employees.employeeId,
    set: { name: 'John Doe' },
    setWhere: sql`name <> 'John Doe'`
  });
```

**Schema Information Access**: Added `db._.fullSchema` to access schema information from Drizzle instances.

## Fixes

- Fixed migrator in AWS Data API