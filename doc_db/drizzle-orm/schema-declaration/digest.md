## Schema Declaration and Organization

Drizzle lets you define database schemas in TypeScript that serve as the source of truth for queries and migrations. All schema models must be exported so Drizzle-Kit can use them in migration generation.

### File Organization

**Single file approach** - Put all tables in one `schema.ts` file (or any name you prefer):
```
📦 src/db/schema.ts
```
Configure in `drizzle.config.ts`:
```ts
export default defineConfig({
  dialect: 'postgresql',
  schema: './src/db/schema.ts'
})
```

**Multiple files approach** - Spread tables across separate files and configure the schema folder:
```
📦 src/db/schema/
  ├ users.ts
  ├ posts.ts
  └ comments.ts
```
Configure in `drizzle.config.ts`:
```ts
export default defineConfig({
  dialect: 'postgresql',
  schema: './src/db/schema'
})
```
Drizzle recursively finds all files and extracts tables. You can also group files by domain (users.ts, messaging.ts, products.ts).

### Tables and Columns

Tables must be defined with at least 1 column using dialect-specific functions. TypeScript key names become database column names by default:

```ts
// PostgreSQL
import { pgTable, integer, varchar } from "drizzle-orm/pg-core"
export const users = pgTable('users', {
  id: integer(),
  first_name: varchar()
})

// MySQL
import { mysqlTable, int } from "drizzle-orm/mysql-core"
export const users = mysqlTable('users', {
  id: int()
})

// SQLite
import { sqliteTable, integer } from "drizzle-orm/sqlite-core"
export const users = sqliteTable('users', {
  id: integer()
})
```

### Column Aliases

Use different names in TypeScript vs database with column aliases:
```ts
export const users = pgTable('users', {
  id: integer(),
  firstName: varchar('first_name')  // TypeScript key: firstName, DB column: first_name
})
```

### Camel to Snake Case Mapping

Automatically map camelCase TypeScript names to snake_case database names using the `casing` option during DB initialization:
```ts
// schema.ts
export const users = pgTable('users', {
  id: integer(),
  firstName: varchar()  // No alias needed
})

// db.ts
const db = drizzle({ connection: process.env.DATABASE_URL, casing: 'snake_case' })

// Generates: SELECT "id", "first_name" from users
```

### Reusable Column Definitions

Define common columns once and spread them across tables:
```ts
// columns.helpers.ts
const timestamps = {
  updated_at: timestamp(),
  created_at: timestamp().defaultNow().notNull(),
  deleted_at: timestamp(),
}

// users.ts
export const users = pgTable('users', {
  id: integer(),
  ...timestamps
})

// posts.ts
export const posts = pgTable('posts', {
  id: integer(),
  ...timestamps
})
```

### PostgreSQL Schemas

PostgreSQL supports schemas (namespace containers). Define and use them:
```ts
import { pgSchema, integer } from "drizzle-orm/pg-core"

export const customSchema = pgSchema('custom')

export const users = customSchema.table('users', {
  id: integer()
})
```

### MySQL Schemas

MySQL schemas are equivalent to databases. They can be defined and used in queries but aren't detected by Drizzle-Kit for migrations:
```ts
import { mysqlSchema, int } from "drizzle-orm/mysql-core"

export const customSchema = mysqlSchema('custom')

export const users = customSchema.table('users', {
  id: int()
})
```

### SQLite

SQLite has no schema concept - tables exist within a single file context.

### Complete Example

PostgreSQL example with enums, primary keys, references, indexes, and constraints:
```ts
import { pgEnum, pgTable as table, integer, varchar, AnyPgColumn } from "drizzle-orm/pg-core"
import * as t from "drizzle-orm/pg-core"

export const rolesEnum = pgEnum("roles", ["guest", "user", "admin"])

export const users = table("users", {
  id: t.integer().primaryKey().generatedAlwaysAsIdentity(),
  firstName: t.varchar("first_name", { length: 256 }),
  lastName: t.varchar("last_name", { length: 256 }),
  email: t.varchar().notNull(),
  invitee: t.integer().references((): AnyPgColumn => users.id),
  role: rolesEnum().default("guest"),
}, (table) => [
  t.uniqueIndex("email_idx").on(table.email)
])

export const posts = table("posts", {
  id: t.integer().primaryKey().generatedAlwaysAsIdentity(),
  slug: t.varchar().$default(() => generateUniqueString(16)),
  title: t.varchar({ length: 256 }),
  ownerId: t.integer("owner_id").references(() => users.id),
}, (table) => [
  t.uniqueIndex("slug_idx").on(table.slug),
  t.index("title_idx").on(table.title),
])

export const comments = table("comments", {
  id: t.integer().primaryKey().generatedAlwaysAsIdentity(),
  text: t.varchar({ length: 256 }),
  postId: t.integer("post_id").references(() => posts.id),
  ownerId: t.integer("owner_id").references(() => users.id),
})
```

MySQL and SQLite have equivalent examples with dialect-specific functions (mysqlTable, sqliteTable, int vs integer, etc.).