## $onUpdate Functionality

Adds dynamic update values to columns for PostgreSQL, MySQL, and SQLite. The `$onUpdate()` function is called when a row is updated, and its returned value is used as the column value if none is provided. If no `default` or `$defaultFn` is set, the function also runs on insert.

This is a runtime-only feature in drizzle-orm and does not affect drizzle-kit behavior.

Example with multiple use cases:
```ts
const usersOnUpdate = pgTable('users_on_update', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  updateCounter: integer('update_counter').default(sql`1`).$onUpdateFn(() => sql`update_counter + 1`),
  updatedAt: timestamp('updated_at', { mode: 'date', precision: 3 }).$onUpdate(() => new Date()),
  alwaysNull: text('always_null').$type<string | null>().$onUpdate(() => null),
});
```

The example shows: incrementing a counter on update, setting current timestamp on update, and setting a column to null on update.

## Fixes

- Insertions on columns with smallserial datatype are now correctly non-optional (issue #1848)