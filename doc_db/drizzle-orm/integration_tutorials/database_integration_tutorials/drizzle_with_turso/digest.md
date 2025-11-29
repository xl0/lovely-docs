## Setup and Configuration

Turso is a SQLite-compatible database built on libSQL with support for replication and microsecond-latency access. Drizzle ORM natively supports the libSQL driver.

### Prerequisites
- drizzle-orm and drizzle-kit packages
- dotenv package for environment variables
- @libsql/client package
- Turso CLI

### Initial Setup Steps

1. **Authenticate with Turso**: Run `turso auth signup` or `turso auth login`

2. **Create database**: `turso db create drizzle-turso-db` and verify with `turso db show drizzle-turso-db`

3. **Generate auth token**: `turso db tokens create drizzle-turso-db`

4. **Environment variables** (.env or .env.local):
```
TURSO_CONNECTION_URL=
TURSO_AUTH_TOKEN=
```

5. **Database connection** (src/db/index.ts):
```typescript
import { config } from 'dotenv';
import { drizzle } from 'drizzle-orm/libsql';

config({ path: '.env' });

export const db = drizzle({ connection: {
  url: process.env.TURSO_CONNECTION_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
}});
```

6. **Schema definition** (src/db/schema.ts):
```typescript
import { sql } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const usersTable = sqliteTable('users', {
  id: integer('id').primaryKey(),
  name: text('name').notNull(),
  age: integer('age').notNull(),
  email: text('email').unique().notNull(),
});

export const postsTable = sqliteTable('posts', {
  id: integer('id').primaryKey(),
  title: text('title').notNull(),
  content: text('content').notNull(),
  userId: integer('user_id')
    .notNull()
    .references(() => usersTable.id, { onDelete: 'cascade' }),
  createdAt: text('created_at')
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).$onUpdate(() => new Date()),
});

export type InsertUser = typeof usersTable.$inferInsert;
export type SelectUser = typeof usersTable.$inferSelect;
export type InsertPost = typeof postsTable.$inferInsert;
export type SelectPost = typeof postsTable.$inferSelect;
```

7. **Drizzle config** (drizzle.config.ts):
```typescript
import { config } from 'dotenv';
import { defineConfig } from 'drizzle-kit';

config({ path: '.env' });

export default defineConfig({
  schema: './src/db/schema.ts',
  out: './migrations',
  dialect: 'turso',
  dbCredentials: {
    url: process.env.TURSO_CONNECTION_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN!,
  },
});
```

8. **Apply migrations**: Generate with `npx drizzle-kit generate` (creates SQL files in migrations directory), then run with `npx drizzle-kit migrate`. Alternatively use `npx drizzle-kit push` for rapid prototyping without migration files.

## Query Examples

### Insert
```typescript
import { db } from '../index';
import { InsertPost, InsertUser, postsTable, usersTable } from '../schema';

export async function createUser(data: InsertUser) {
  await db.insert(usersTable).values(data);
}

export async function createPost(data: InsertPost) {
  await db.insert(postsTable).values(data);
}
```

### Select
```typescript
import { asc, count, eq, getTableColumns, gt, sql } from 'drizzle-orm';
import { db } from '../index';
import { SelectUser, postsTable, usersTable } from '../schema';

export async function getUserById(id: SelectUser['id']) {
  return db.select().from(usersTable).where(eq(usersTable.id, id));
}

export async function getUsersWithPostsCount(page = 1, pageSize = 5) {
  return db
    .select({
      ...getTableColumns(usersTable),
      postsCount: count(postsTable.id),
    })
    .from(usersTable)
    .leftJoin(postsTable, eq(usersTable.id, postsTable.userId))
    .groupBy(usersTable.id)
    .orderBy(asc(usersTable.id))
    .limit(pageSize)
    .offset((page - 1) * pageSize);
}

export async function getPostsForLast24Hours(page = 1, pageSize = 5) {
  return db
    .select({
      id: postsTable.id,
      title: postsTable.title,
    })
    .from(postsTable)
    .where(gt(postsTable.createdAt, sql`(datetime('now','-24 hour'))`))
    .orderBy(asc(postsTable.title), asc(postsTable.id))
    .limit(pageSize)
    .offset((page - 1) * pageSize);
}
```

### Update
```typescript
import { eq } from 'drizzle-orm';
import { db } from '../index';
import { SelectPost, postsTable } from '../schema';

export async function updatePost(id: SelectPost['id'], data: Partial<Omit<SelectPost, 'id'>>) {
  await db.update(postsTable).set(data).where(eq(postsTable.id, id));
}
```

### Delete
```typescript
import { eq } from 'drizzle-orm';
import { db } from '../index';
import { SelectUser, usersTable } from '../schema';

export async function deleteUser(id: SelectUser['id']) {
  await db.delete(usersTable).where(eq(usersTable.id, id));
}
```

## Project Structure
```
📦 <project root>
 ├ 📂 src
 │   ├ 📂 db
 │   │  ├ 📜 index.ts
 │   │  └ 📜 schema.ts
 ├ 📂 migrations
 │  ├ 📂 meta
 │  │  ├ 📜 _journal.json
 │  │  └ 📜 0000_snapshot.json
 │  └ 📜 0000_watery_spencer_smythe.sql
 ├ 📜 .env
 ├ 📜 drizzle.config.ts
 ├ 📜 package.json
 └ 📜 tsconfig.json
```