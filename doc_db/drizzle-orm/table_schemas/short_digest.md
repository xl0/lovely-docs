## Table Schemas

Declare SQL schemas using `pgSchema()`, `mysqlSchema()`, or `singlestoreSchema()`. Tables defined within a schema are automatically prefixed with the schema name in queries.

**PostgreSQL with enum:**
```ts
export const mySchema = pgSchema("my_schema");
export const colors = mySchema.enum('colors', ['red', 'green', 'blue']);
export const mySchemaUsers = mySchema.table('users', {
  id: serial('id').primaryKey(),
  name: text('name'),
  color: colors('color').default('red'),
});
```

**MySQL:**
```ts
export const mySchema = mysqlSchema("my_schema");
export const mySchemaUsers = mySchema.table("users", {
  id: int("id").primaryKey().autoincrement(),
  name: text("name"),
});
```

SQLite does not support schemas. SingleStore uses `singlestoreSchema()` with the same API as MySQL.