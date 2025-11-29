**LibSQL batch API**: Execute multiple queries in one call with `db.batch([...])` supporting all query builders.

**SQLite JSON mode**: `text('col', { mode: 'json' }).$type<Type>()` for JSON storage in text columns.

**Relational Query `.toSQL()`**: Convert queries to SQL with `db.query.table.findFirst().toSQL()`.

**PostgreSQL array operators**: `arrayContains()`, `arrayContained()`, `arrayOverlaps()` for array comparisons, supporting subqueries.

**Relational Query operators**: SQL operators like `inArray` now available as parameters in where callbacks: `where: (table, { inArray }) => inArray(...)`.

**Fixes**: MySQL datetime UTC mapping, SQLite on-conflict where clause, libsql type imports, RDS raw SQL mapping, smallserial generation.