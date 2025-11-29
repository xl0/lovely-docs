## Relational Queries

Typed API for querying nested relational data, generating single SQL statements with lateral joins.

**Setup:** Pass schema with tables and relations to `drizzle()` initialization.

**Query methods:** `findMany()` returns array, `findFirst()` returns single record with limit 1.

**Include relations:** Use `with` operator, can be nested for deeper relations.

**Partial fields:** `columns: { id: true, content: true }` or `columns: { content: false }` (performed at query level).

**Filtering:** Use operators from `drizzle-orm` or callback syntax with `where`.

**Limit/Offset:** `limit` and `offset` work on top-level and nested queries (offset only at top level).

**Order by:** Use core API `asc()`/`desc()` or callback syntax.

**Custom fields:** `extras` adds computed fields with `sql` expressions, must use `.as("<name>")`.

**Prepared statements:** Use `placeholder()` for dynamic values in where, limit, offset; call `.prepare()` then `.execute()` with parameters.

**Modes:** `mode: "default"` for MySQL, `mode: "planetscale"` for PlanetScale.