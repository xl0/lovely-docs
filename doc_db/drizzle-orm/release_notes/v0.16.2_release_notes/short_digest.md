## PostgreSQL Schemas
```ts
import { pgSchema } from "drizzle-orm-pg";
export const mySchema = pgSchema("my_schema");
export const users = mySchema("users", { id: serial("id").primaryKey(), name: text("name") });
```

## MySQL Databases/Schemas
```ts
import { mysqlSchema } from "drizzle-orm-mysql";
const mySchema = mysqlSchema("my_schema");
const users = mySchema("users", { id: serial("id").primaryKey(), name: text("name") });
```

## PostgreSQL Introspection
```shell
drizzle-kit introspect:pg --out=migrations/ --connectionString=postgresql://user:pass@host:port/db_name
```
Auto-generates schema.ts from existing database. Supports enums, indexes, foreign keys, cyclic references, and schemas.

## Postgres.js Driver
```ts
import { drizzle } from "drizzle-orm-pg/postgres.js";
import postgres from "postgres";
const client = postgres(connectionString);
const db = drizzle(client);
const allUsers = await db.select(users);
```

## Custom Types
```ts
const customText = customType<{ data: string }>({ dataType() { return "text"; } });
const usersTable = pgTable("users", { name: customText("name").notNull() });
```