## Constraints

**Default**: `.default(value)` or `.default(sql`...`)` sets default column values.

**Not Null**: `.notNull()` prevents NULL values.

**Unique**: `.unique()` or `.unique('name')` for single columns; `unique().on(col1, col2)` for composite. PostgreSQL 15+ supports `.nullsNotDistinct()`.

**Check**: `check('name', sql`condition`)` limits value ranges. Not supported in SingleStore.

**Primary Key**: `.primaryKey()` uniquely identifies records. Composite: `primaryKey({ columns: [col1, col2] })`.

**Foreign Key**: `.references(() => table.id)` for inline; `foreignKey({ columns: [...], foreignColumns: [...] })` for standalone/multicolumn. Not supported in SingleStore.

## Indexes

Basic: `index('name').on(table.column)` and `uniqueIndex('name').on(table.column)`.

PostgreSQL (0.31.0+): `.on(col.asc(), col.nullsFirst()).concurrently().where(sql``).with({...})` or `.using('btree', col.asc(), sql`...`, col.op('ops'))`.

MySQL: `.algorythm('default'|'copy'|'inplace').using('btree'|'hash').lock('none'|'default'|'exclusive'|'shared')`.

SQLite: `.where(sql`...`)`.

Before drizzle-kit 0.22.0 and drizzle-orm 0.31.0, only `name` and `on()` supported.