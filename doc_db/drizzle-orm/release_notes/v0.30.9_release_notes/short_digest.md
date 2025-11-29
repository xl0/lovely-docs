**SQLite `.onConflictDoUpdate()`**: Split `where` into `targetWhere` (filters conflict check) and `setWhere` (filters update application).

```ts
.onConflictDoUpdate({
  target: employees.employeeId,
  targetWhere: sql`name <> 'John Doe'`,
  set: { name: sql`excluded.name` }
})
```

**Schema Access**: `db._.fullSchema` exposes schema information.

**Fixes**: AWS Data API migrator fixed.