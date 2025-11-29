## MySQL `$returningId()` Function

MySQL lacks native `RETURNING` support for `INSERT`. Drizzle provides `$returningId()` to automatically retrieve inserted primary key IDs from autoincrement/serial columns:

```ts
const result = await db.insert(usersTable).values([{ name: 'John' }, { name: 'John1' }]).$returningId();
// Returns: { id: number }[]
```

Also works with custom primary keys generated via `$default` function:

```ts
const usersTableDefFn = mysqlTable('users_default_fn', {
  customId: varchar('id', { length: 256 }).primaryKey().$defaultFn(createId),
  name: text('name').notNull(),
});
const result = await db.insert(usersTableDefFn).values([{ name: 'John' }, { name: 'John1' }]).$returningId();
// Returns: { customId: string }[]
```

If no primary keys exist, returns `{}[]`.

## PostgreSQL Sequences

Define sequences with optional parameters in any schema:

```ts
import { pgSchema, pgSequence } from "drizzle-orm/pg-core";

export const customSequence = pgSequence("name");
export const customSequence = pgSequence("name", {
  startWith: 100,
  maxValue: 10000,
  minValue: 100,
  cycle: true,
  cache: 10,
  increment: 2
});

export const customSchema = pgSchema('custom_schema');
export const customSequence = customSchema.sequence("name");
```

## PostgreSQL Identity Columns

Replace deprecated `serial` type with identity columns (recommended approach):

```ts
import { pgTable, integer, text } from 'drizzle-orm/pg-core' 

export const ingredients = pgTable("ingredients", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity({ startWith: 1000 }),
  name: text("name").notNull(),
  description: text("description"),
});
```

Supports all sequence properties and custom sequence names.

## PostgreSQL Generated Columns

Create generated columns with expressions referencing other columns or static values:

```ts
import { SQL, sql } from "drizzle-orm";
import { customType, index, integer, pgTable, text } from "drizzle-orm/pg-core";

const tsVector = customType<{ data: string }>({
  dataType() { return "tsvector"; },
});

export const test = pgTable("test", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  content: text("content"),
  contentSearch: tsVector("content_search", { dimensions: 3 })
    .generatedAlwaysAs((): SQL => sql`to_tsvector('english', ${test.content})`),
}, (t) => ({
  idx: index("idx_content_search").using("gin", t.contentSearch),
}));

// Static expressions
export const users = pgTable("users", {
  id: integer("id"),
  name: text("name"),
  generatedName: text("gen_name").generatedAlwaysAs(sql`hello world!`),
  generatedName1: text("gen_name1").generatedAlwaysAs("hello world!"),
});
```

## MySQL Generated Columns

Specify `stored` or `virtual` generated columns:

```ts
export const users = mysqlTable("users", {
  id: int("id"),
  name: text("name"),
  generatedName: text("gen_name").generatedAlwaysAs(
    (): SQL => sql`${schema2.users.name} || 'hello'`,
    { mode: "stored" }
  ),
  generatedName1: text("gen_name1").generatedAlwaysAs(
    (): SQL => sql`${schema2.users.name} || 'hello'`,
    { mode: "virtual" }
  ),
});
```

Drizzle Kit `push` limitations: Cannot change generated expression or type; must drop and recreate columns. `generate` has no limitations.

## SQLite Generated Columns

Support for `stored` and `virtual` generated columns with limitations:

- Cannot change stored generated expressions in existing tables (requires table recreation)
- Cannot add stored expressions to existing columns (but can add virtual)
- Cannot change stored expressions (but can change virtual)
- Cannot change from virtual to stored (but can change from stored to virtual)

## Drizzle Kit Features

**Migrations support**: Full support for PostgreSQL sequences, identity columns, and generated columns across all dialects.

**`--force` flag for `push`**: Auto-accept all data-loss statements in CLI.

**Migration file prefix customization**:
```ts
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  migrations: {
    prefix: 'supabase'  // or 'timestamp', 'unix', 'none'
  }
});
```

- `index` (default): `0001_name.sql`
- `supabase`/`timestamp`: `20240627123900_name.sql`
- `unix`: `1719481298_name.sql`
- `none`: no prefix