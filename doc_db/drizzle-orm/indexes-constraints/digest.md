## Constraints

SQL constraints enforce rules on table columns to prevent invalid data and ensure data accuracy and reliability.

### Default
The `DEFAULT` clause specifies a default value for a column when no value is provided during INSERT. If no explicit DEFAULT is specified, the default is NULL. Default values can be constants or expressions.

Examples across databases:
- PostgreSQL: `.default(42)`, `.default(sql`'42'::integer`)`, `.defaultRandom()`, `.default(sql`gen_random_uuid()`)`
- MySQL: `.default(42)`, `.default(sql`cast("14:06:10" AS TIME)`)`
- SQLite: `.default(42)`, `.default(sql`(abs(42))`)`
- SingleStore: Same as MySQL

### Not Null
The `NOT NULL` constraint enforces that a column cannot accept NULL values. This ensures a field always contains a value, preventing inserts or updates without providing a value for that field.

Usage: `.notNull()` across all databases.

### Unique
The `UNIQUE` constraint ensures all values in a column are different. Both UNIQUE and PRIMARY KEY provide uniqueness guarantees. A PRIMARY KEY automatically has a UNIQUE constraint. You can have many UNIQUE constraints per table but only one PRIMARY KEY.

Single column: `.unique()` or `.unique('custom_name')`

Composite unique constraints:
```typescript
unique().on(t.id, t.name)
unique('custom_name').on(t.id, t.name)
```

PostgreSQL 15.0+ supports NULLS NOT DISTINCT:
```typescript
.unique("custom_name", { nulls: 'not distinct' })
unique().on(t.id).nullsNotDistinct()
```

### Check
The `CHECK` constraint limits the value range that can be placed in a column. Can be defined on a single column or on a table to limit values in certain columns based on values in other columns.

Example:
```typescript
check("age_check1", sql`${table.age} > 21`)
```

Supported in PostgreSQL, MySQL, SQLite. Not supported in SingleStore.

### Primary Key
The `PRIMARY KEY` constraint uniquely identifies each record in a table. Primary keys must contain UNIQUE values and cannot contain NULL values. A table can have only ONE primary key, which can consist of single or multiple columns.

Single column: `.primaryKey()`

Examples:
- PostgreSQL: `serial('id').primaryKey()`
- MySQL: `int("id").autoincrement().primaryKey()`
- SQLite: `integer("id").primaryKey()` or `integer("id").primaryKey({ autoIncrement: true })`

### Composite Primary Key
Composite primary keys uniquely identify records using multiple fields. Use the standalone `primaryKey` operator:

```typescript
primaryKey({ columns: [table.bookId, table.authorId] })
primaryKey({ name: 'custom_name', columns: [table.bookId, table.authorId] })
```

### Foreign Key
The `FOREIGN KEY` constraint prevents actions that would destroy links between tables. A foreign key is a field (or collection of fields) in one table that refers to the PRIMARY KEY in another table. The table with the foreign key is the child table; the table with the primary key is the parent table.

Single column foreign key (inline):
```typescript
authorId: integer("author_id").references(() => user.id)
```

Self-reference requires explicit return type or standalone operator:
```typescript
parentId: integer("parent_id").references((): AnyPgColumn => user.id)

// or
foreignKey({
  columns: [table.parentId],
  foreignColumns: [table.id],
  name: "custom_fk"
})
```

Multicolumn foreign keys use the standalone `foreignKey` operator:
```typescript
foreignKey({
  columns: [table.userFirstName, table.userLastName],
  foreignColumns: [user.firstName, user.lastName],
  name: "custom_fk"
})
```

Supported in PostgreSQL, MySQL, SQLite. Not supported in SingleStore.

## Indexes

Drizzle ORM provides API for both `index` and `uniqueIndex` declaration.

Basic usage:
```typescript
index("name_idx").on(table.name)
uniqueIndex("email_idx").on(table.email)
```

PostgreSQL (0.31.0+) supports advanced index parameters:
```typescript
index('name')
  .on(table.column1.asc(), table.column2.nullsFirst())
  .concurrently()
  .where(sql``)
  .with({ fillfactor: '70' })

index('name')
  .using('btree', table.column1.asc(), sql`lower(${table.column2})`, table.column1.op('text_ops'))
  .where(sql``)
  .with({ fillfactor: '70' })
```

MySQL supports:
```typescript
index("name")
  .on(table.name)
  .algorythm("default") // "default" | "copy" | "inplace"
  .using("btree") // "btree" | "hash"
  .lock("default") // "none" | "default" | "exclusive" | "shared"
```

SQLite supports:
```typescript
index("name")
  .on(table.name)
  .where(sql`...`)
```

Note: For drizzle-kit versions before 0.22.0 and drizzle-orm before 0.31.0, only `name` and `on()` parameters are supported. After these versions, all fields are supported.