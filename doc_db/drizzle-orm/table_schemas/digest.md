## Table Schemas

Drizzle ORM provides an API for declaring SQL schemas in PostgreSQL, MySQL, and SingleStore dialects. When entities are declared within a schema, the query builder automatically prepends schema names in generated queries (e.g., `select * from "schema"."users"`).

### PostgreSQL

Use `pgSchema()` to create a schema. You can define enums and tables within it:

```ts
import { serial, text, pgSchema } from "drizzle-orm/pg-core";

export const mySchema = pgSchema("my_schema");
export const colors = mySchema.enum('colors', ['red', 'green', 'blue']);
export const mySchemaUsers = mySchema.table('users', {
  id: serial('id').primaryKey(),
  name: text('name'),
  color: colors('color').default('red'),
});
```

Generates:
```sql
CREATE SCHEMA "my_schema";
CREATE TYPE "my_schema"."colors" AS ENUM ('red', 'green', 'blue');
CREATE TABLE "my_schema"."users" (
  "id" serial PRIMARY KEY,
  "name" text,
  "color" "my_schema"."colors" DEFAULT 'red'
);
```

### MySQL

Use `mysqlSchema()` to create a schema and define tables:

```ts
import { int, text, mysqlSchema } from "drizzle-orm/mysql-core";

export const mySchema = mysqlSchema("my_schema");
export const mySchemaUsers = mySchema.table("users", {
  id: int("id").primaryKey().autoincrement(),
  name: text("name"),
});
```

### SQLite

SQLite does not support schemas.

### SingleStore

Use `singlestoreSchema()` similar to MySQL:

```ts
import { int, text, singlestoreSchema } from "drizzle-orm/singlestore-core";

export const mySchema = singlestoreSchema("my_schema");
export const mySchemaUsers = mySchema.table("users", {
  id: int("id").primaryKey().autoincrement(),
  name: text("name"),
});
```