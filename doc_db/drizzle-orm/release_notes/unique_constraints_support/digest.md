## UNIQUE Constraints Support

Added support for UNIQUE constraints across PostgreSQL, MySQL, and SQLite databases.

### PostgreSQL
- Single-column constraints: defined at column level with `.unique()` or `.unique('custom_name')`
- Multi-column constraints: defined in table config third parameter using `unique('name').on(columns)`
- Supports custom constraint names
- Supports `NULLS NOT DISTINCT` option to restrict multiple NULL values: `.unique('name', { nulls: 'not distinct' })` or `.nullsNotDistinct()`

Example:
```ts
// Single column
const table = pgTable('table', {
  id: serial('id').primaryKey(),
  name: text('name').notNull().unique(),
  state: char('state', { length: 2 }).unique('custom'),
  field: char('field', { length: 2 }).unique('custom_field', { nulls: 'not distinct' }),
});

// Multiple columns
const table = pgTable('table', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  state: char('state', { length: 2 }),
}, (t) => ({
  first: unique('custom_name').on(t.name, t.state).nullsNotDistinct(),
  second: unique('custom_name1').on(t.name, t.state),
}));
```

### MySQL
- Single-column constraints: `.unique()` or `.unique('custom_name')`
- Multi-column constraints: `unique('name').on(columns)` in table config
- Supports custom constraint names
- Does not support `NULLS NOT DISTINCT`

Example:
```ts
// Single column
const table = mysqlTable('table', {
  id: serial('id').primaryKey(),
  name: text('name').notNull().unique(),
  state: text('state').unique('custom'),
});

// Multiple columns
const table = mysqlTable('cities1', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  state: text('state'),
}, (t) => ({
  first: unique().on(t.name, t.state),
  second: unique('custom_name1').on(t.name, t.state),
}));
```

### SQLite
- Unique constraints are implemented as unique indexes internally
- Single-column constraints: `.unique()` or `.unique('custom_name')`
- Multi-column constraints: `unique('name').on(columns)` in table config
- Supports custom index names

Example:
```ts
// Single column
const table = sqliteTable('table', {
  id: int('id').primaryKey(),
  name: text('name').notNull().unique(),
  state: text('state').unique('custom'),
});

// Multiple columns
const table = sqliteTable('table', {
  id: int('id').primaryKey(),
  name: text('name').notNull(),
  state: text('state'),
}, (t) => ({
  first: unique().on(t.name, t.state),
  second: unique('custom').on(t.name, t.state),
}));
```