## UNIQUE Constraints Support

Added UNIQUE constraint support for PostgreSQL, MySQL, and SQLite.

**PostgreSQL**: Single-column `.unique()` or `.unique('name')`, multi-column `unique('name').on(cols)`, supports `NULLS NOT DISTINCT` option.

**MySQL**: Single-column `.unique()` or `.unique('name')`, multi-column `unique('name').on(cols)`, no `NULLS NOT DISTINCT` support.

**SQLite**: Unique constraints as indexes, single-column `.unique()` or `.unique('name')`, multi-column `unique('name').on(cols)`.

Example (PostgreSQL):
```ts
const table = pgTable('table', {
  id: serial('id').primaryKey(),
  name: text('name').unique(),
  state: char('state').unique('custom', { nulls: 'not distinct' }),
}, (t) => ({
  multi: unique('name').on(t.name, t.state).nullsNotDistinct(),
}));
```