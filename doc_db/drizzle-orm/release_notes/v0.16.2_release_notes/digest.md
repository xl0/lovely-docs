## PostgreSQL Schemas
Declare PostgreSQL schemas and create tables within them using `pgSchema()`:
```ts
import { pgSchema } from "drizzle-orm-pg";
export const mySchema = pgSchema("my_schema");
export const users = mySchema("users", {
  id: serial("id").primaryKey(),
  name: text("name"),
  email: text("email"),
});
```
Generates: `CREATE SCHEMA "my_schema"; CREATE TABLE "my_schema"."users" (...)`
drizzle-kit auto-generates migrations: `drizzle-kit generate:pg --schema=src/schema.ts --out=migrations/`

## MySQL Databases/Schemas
Declare MySQL databases/schemas and tables using `mysqlSchema()`:
```ts
import { mysqlSchema } from "drizzle-orm-mysql";
const mySchema = mysqlSchema("my_schema");
const users = mySchema("users", {
  id: serial("id").primaryKey(),
  name: text("name"),
  email: text("email"),
});
```
Generates: `CREATE DATABASE \`my_schema\`; CREATE TABLE \`my_schema\`.\`users\` (...)`
drizzle-kit auto-generates migrations: `drizzle-kit generate:mysql --schema=src/schema.ts --out=migrations/`

## PostgreSQL Introspection
Pull existing PostgreSQL database schema using drizzle-kit:
```shell
drizzle-kit introspect:pg --out=migrations/ --connectionString=postgresql://user:pass@host:port/db_name
```
Supports: enums, tables with native/non-native columns, indexes, foreign keys (including self-references and cyclic), and schemas. Generates `schema.ts` with full type definitions for all columns and relationships.

## Postgres.js Driver Support
Full support for postgres.js driver (lightweight and fast):
```ts
import { drizzle, PostgresJsDatabase } from "drizzle-orm-pg/postgres.js";
import postgres from "postgres";
import { users } from "./schema";

const client = postgres(connectionString);
const db: PostgresJsDatabase = drizzle(client);
const allUsers = await db.select(users);
```

## Custom Types for PostgreSQL and MySQL
Create non-native types using `customType()`:
```ts
// PostgreSQL
const customText = customType<{ data: string }>({
  dataType() { return "text"; }
});
const usersTable = pgTable("users", {
  name: customText("name").notNull(),
});

// MySQL
const customText = customType<{ data: string }>({
  dataType() { return "text"; }
});
const usersTable = mysqlTable("users", {
  name: customText("name").notNull(),
});
```