Increment column values using `update().set()` with `sql` operator:

```ts
await db.update(table).set({
  counter: sql`${table.counter} + 1`,
}).where(eq(table.id, 1));
```

Or create a custom helper function that accepts a column and increment value.