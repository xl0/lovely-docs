## SQL Update

Basic syntax: `.update(table).set({...}).where(...)`. Pass `null` to set columns to null; `undefined` is ignored. SQL expressions can be used as values.

**Limit** (MySQL, SQLite, SingleStore): `.limit(n)` restricts updated rows.

**Order By**: `.orderBy(field)` or `.orderBy(asc(field), desc(field2))` for sorting.

**Returning** (PostgreSQL, SQLite): `.returning({...})` retrieves updated rows.

**WITH clause**: Use CTEs to simplify complex queries with `.with(cte).update(...)`

**Update ... FROM** (PostgreSQL, SQLite): Join tables in update with `.from(table).where(...)` and optionally `.returning(...)` in PostgreSQL.