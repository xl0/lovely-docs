## MySQL `$returningId()`
Retrieve inserted primary key IDs from autoincrement columns or custom `$default` functions:
```ts
const result = await db.insert(usersTable).values([{ name: 'John' }]).$returningId();
// { id: number }[]
```

## PostgreSQL Sequences
```ts
export const customSequence = pgSequence("name", {
  startWith: 100, maxValue: 10000, minValue: 100, cycle: true, cache: 10, increment: 2
});
```

## PostgreSQL Identity Columns
Replace deprecated `serial` with identity columns:
```ts
id: integer("id").primaryKey().generatedAlwaysAsIdentity({ startWith: 1000 })
```

## Generated Columns (PostgreSQL, MySQL, SQLite)
Create computed columns with expressions:
```ts
// PostgreSQL
contentSearch: tsVector("content_search").generatedAlwaysAs(
  (): SQL => sql`to_tsvector('english', ${test.content})`
)

// MySQL/SQLite with mode
generatedName: text("gen_name").generatedAlwaysAs(
  (): SQL => sql`${schema2.users.name} || 'hello'`,
  { mode: "stored" }
)
```

## Drizzle Kit Updates
- Full migrations support for sequences, identity columns, generated columns
- `--force` flag for `push` to auto-accept data-loss statements
- Migration prefix customization: `index` (default), `supabase`/`timestamp`, `unix`, `none`