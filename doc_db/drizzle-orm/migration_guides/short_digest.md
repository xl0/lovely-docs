## Migration from Prisma, Sequelize, TypeORM

Five-step process: install packages → create config → introspect database → setup connection → replace queries.

Key patterns:
- **Insert**: `db.insert(table).values([...])`
- **Select**: Relational `db.query.table.findFirst({ where, with })` or core queries with joins
- **Filtering/Pagination**: `db.query.table.findMany({ where, offset, limit })`
- **Aggregations**: Core queries only with `sql<Type>` templates and `groupBy()`
- **Update**: `db.update(table).set({...}).where(...)`
- **Transactions**: `db.transaction(async (tx) => { ... })`

Type-safe responses, string-based decimals, no entity classes.