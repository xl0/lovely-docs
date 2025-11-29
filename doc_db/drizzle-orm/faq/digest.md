## generate vs push

`generate` creates SQL migration files with metadata for drizzle-kit or other migration tools. The generated migrations are not automatically applied to the database—you must apply them separately.

`push` syncs your schema directly with the database schema without generating migration files. Use only for local development and local databases due to safety concerns.

## PostgreSQL indexes limitations

### For both push and generate:
When using indexes with expressions, you must manually specify a name:
```ts
index().on(table.id, table.email) // auto-named, works
index('my_name').on(table.id, table.email) // works
index().on(sql`lower(${table.email})`) // error - must name it
index('my_name').on(sql`lower(${table.email})`) // works
```

### For push only:
Push won't generate statements if these index properties change in an existing index:
- expressions inside `.on()` and `.using()`
- `.where()` statements
- operator classes `.op()` on columns

Workaround: comment out the index, push, uncomment and modify, then push again.

The `generate` command has no such limitations—it detects changes to any index property.