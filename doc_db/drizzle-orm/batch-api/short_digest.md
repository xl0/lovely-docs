## Batch API

Execute multiple SQL statements in a single database call with implicit transaction handling (all succeed or all fail).

```ts
const batchResponse = await db.batch([
	db.insert(usersTable).values({ id: 1, name: 'John' }).returning({ id: usersTable.id }),
	db.update(usersTable).set({ name: 'Dan' }).where(eq(usersTable.id, 1)),
	db.query.usersTable.findMany({}),
]);
```

Supported for LibSQL, Neon, and D1. Response is a tuple of results matching each statement. All query builders (select, insert, update, delete, find operations) are supported.