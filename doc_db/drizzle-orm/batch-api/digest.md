## Batch API

Execute multiple SQL statements in a single database call with implicit transaction handling.

### Overview

Batch APIs allow executing one or more SQL statements in order within an implicit transaction. The behavior differs by database:

- **LibSQL**: Transaction controlled by backend. All statements succeed and commit together, or all fail and rollback.
- **D1**: Statements execute sequentially and non-concurrently in auto-commit mode. If any statement fails, the entire sequence aborts/rolls back.
- **Neon**: Similar transactional guarantees to LibSQL.

### Usage

```ts
const batchResponse: BatchResponse = await db.batch([
	db.insert(usersTable).values({ id: 1, name: 'John' }).returning({ id: usersTable.id }),
	db.update(usersTable).set({ name: 'Dan' }).where(eq(usersTable.id, 1)),
	db.query.usersTable.findMany({}),
	db.select().from(usersTable).where(eq(usersTable.id, 1)),
	db.select({ id: usersTable.id, invitedBy: usersTable.invitedBy }).from(usersTable),
]);
```

The response is a tuple where each element corresponds to the result of each statement in order. Result types vary by database (ResultSet for libSQL, NeonHttpQueryResult for Neon, D1Result for D1).

### Supported Builders

All query builders can be used inside `db.batch()`:
- `db.all()`, `db.get()`, `db.values()`, `db.run()`, `db.execute()`
- `db.query.<table>.findMany()`, `db.query.<table>.findFirst()`
- `db.select()...`, `db.update()...`, `db.delete()...`, `db.insert()...`

### Performance Benefit

Batching reduces network latency by combining multiple statements into a single database call, providing significant performance improvements especially for D1.