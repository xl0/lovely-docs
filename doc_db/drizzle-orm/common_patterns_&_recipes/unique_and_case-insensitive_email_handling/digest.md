## Overview
Implement unique and case-insensitive email handling by creating a unique index on the lowercased email column. This ensures emails are unique regardless of case variations.

## PostgreSQL
Create a unique index using the `lower()` function on the email column:

```ts
import { SQL, sql } from 'drizzle-orm';
import { AnyPgColumn, pgTable, serial, text, uniqueIndex } from 'drizzle-orm/pg-core';

export const users = pgTable(
  'users',
  {
    id: serial('id').primaryKey(),
    name: text('name').notNull(),
    email: text('email').notNull(),
  },
  (table) => [
    uniqueIndex('emailUniqueIndex').on(lower(table.email)),
  ],
);

export function lower(email: AnyPgColumn): SQL {
  return sql`lower(${email})`;
}
```

Generated SQL:
```sql
CREATE UNIQUE INDEX IF NOT EXISTS "emailUniqueIndex" ON "users" USING btree (lower("email"));
```

Query users by email with case-insensitive matching:
```ts
import { eq } from 'drizzle-orm';
import { lower, users } from './schema';

const findUserByEmail = async (email: string) => {
  return await db
    .select()
    .from(users)
    .where(eq(lower(users.email), email.toLowerCase()));
};
```

## MySQL
MySQL's default collation is case-insensitive, but explicitly create a unique index on lowercased email for consistency:

```ts
import { SQL, sql } from 'drizzle-orm';
import { AnyMySqlColumn, mysqlTable, serial, uniqueIndex, varchar } from 'drizzle-orm/mysql-core';

export const users = mysqlTable(
  'users',
  {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 255 }).notNull(),
    email: varchar('email', { length: 255 }).notNull(),
  },
  (table) => [
    uniqueIndex('emailUniqueIndex').on(lower(table.email)),
  ]
);

export function lower(email: AnyMySqlColumn): SQL {
  return sql`(lower(${email}))`;
}
```

Generated SQL:
```sql
CREATE TABLE `users` (
  `id` serial AUTO_INCREMENT NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  CONSTRAINT `users_id` PRIMARY KEY(`id`),
  CONSTRAINT `emailUniqueIndex` UNIQUE((lower(`email`)))
);
```

**Note:** Functional indexes are supported in MySQL 8.0.13+. Expressions must be enclosed in parentheses: `(lower(column))`.

Query pattern is identical to PostgreSQL.

## SQLite
Create a unique index on the lowercased email column:

```ts
import { SQL, sql } from 'drizzle-orm';
import { AnySQLiteColumn, integer, sqliteTable, text, uniqueIndex } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable(
  'users',
  {
    id: integer('id').primaryKey(),
    name: text('name').notNull(),
    email: text('email').notNull(),
  },
  (table) => [
    uniqueIndex('emailUniqueIndex').on(lower(table.email)),
  ]
);

export function lower(email: AnySQLiteColumn): SQL {
  return sql`lower(${email})`;
}
```

Generated SQL:
```sql
CREATE UNIQUE INDEX `emailUniqueIndex` ON `users` (lower(`email`));
```

Query pattern is identical to PostgreSQL.

## Requirements
- drizzle-orm@0.31.0 and drizzle-kit@0.22.0 or higher
- Knowledge of indexes, insert/select statements, and sql operator