## $onUpdate Functionality

Adds `$onUpdate()` to set dynamic column values on row updates for PostgreSQL, MySQL, and SQLite. Runs on insert if no default is provided.

```ts
updateCounter: integer('update_counter').default(sql`1`).$onUpdateFn(() => sql`update_counter + 1`),
updatedAt: timestamp('updated_at', { mode: 'date', precision: 3 }).$onUpdate(() => new Date()),
```

## Fixes

- Smallserial column insertions now correctly non-optional