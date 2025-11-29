**New:** Custom schema support for Postgres enums.

**Fixes:** D1 migrate() now uses batch API; Postgres .onConflictDoUpdate() split into `setWhere` and `targetWhere`; .onConflictDoNothing() where clause placement fixed; AWS Data API array handling fixed.

Example:
```ts
const mySchema = pgSchema('mySchema');
const colors = mySchema.enum('colors', ['red', 'green', 'blue']);

await db.insert(employees)
  .values({ employeeId: 123, name: 'John Doe' })
  .onConflictDoUpdate({
    target: employees.employeeId,
    targetWhere: sql`name <> 'John Doe'`,
    set: { name: sql`excluded.name` }
  });
```