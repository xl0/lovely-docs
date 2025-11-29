## Fixes
- Fixed sqlite-proxy and SQL.js response from `.get()` when the result is empty

## New Features

### SQLite Simplified Query API
Added a simplified query API for SQLite databases.

### Column Builder Default Methods
Added `.$defaultFn()` and `.$default()` methods to column builders for specifying runtime default values. These methods accept a function that can implement any logic (e.g., `cuid()` for generating IDs). The default value is only used at runtime in drizzle-orm and does not affect drizzle-kit behavior.

Example:
```ts
import { varchar, mysqlTable } from "drizzle-orm/mysql-core";
import { createId } from '@paralleldrive/cuid2';

const table = mysqlTable('table', {
	id: varchar('id', { length: 128 }).$defaultFn(() => createId()),
});
```

Available for PostgreSQL, MySQL, and SQLite column types.

### Table Model Type Inference
Added `table.$inferSelect` / `table._.inferSelect` and `table.$inferInsert` / `table._.inferInsert` methods for convenient table model type inference. These replace the deprecated `InferModel` type.

Example:
```ts
import { InferSelectModel, InferInsertModel } from 'drizzle-orm'

const usersTable = pgTable('users', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  verified: boolean('verified').notNull().default(false),
  jsonb: jsonb('jsonb').$type<string[]>(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

type SelectUser = typeof usersTable.$inferSelect;
type InsertUser = typeof usersTable.$inferInsert;

type SelectUser2 = InferSelectModel<typeof usersTable>;
type InsertUser2 = InferInsertModel<typeof usersTable>;
```

### Other Changes
- Deprecated `InferModel` type in favor of `InferSelectModel` and `InferInsertModel`
- Disabled `.d.ts` files bundling