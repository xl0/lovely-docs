## Setup and Configuration

Install required packages: `drizzle-orm`, `drizzle-kit`, `dotenv`, and `@vercel/postgres`.

Create a Vercel Postgres database in the dashboard and copy the `POSTGRES_URL` connection string to `.env.local`.

Create `src/db/index.ts` to initialize the database connection:
```typescript
import { drizzle } from 'drizzle-orm/vercel-postgres';
import { config } from 'dotenv';

config({ path: '.env.local' });
export const db = drizzle();
```

## Schema Definition

Create `src/db/schema.ts` with table definitions using `pgTable`:
```typescript
import { integer, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

export const usersTable = pgTable('users_table', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  age: integer('age').notNull(),
  email: text('email').notNull().unique(),
});

export const postsTable = pgTable('posts_table', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  content: text('content').notNull(),
  userId: integer('user_id')
    .notNull()
    .references(() => usersTable.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at')
    .notNull()
    .$onUpdate(() => new Date()),
});

export type InsertUser = typeof usersTable.$inferInsert;
export type SelectUser = typeof usersTable.$inferSelect;
export type InsertPost = typeof postsTable.$inferInsert;
export type SelectPost = typeof postsTable.$inferSelect;
```

## Drizzle Kit Configuration

Create `drizzle.config.ts` in the project root:
```typescript
import { config } from 'dotenv';
import { defineConfig } from 'drizzle-kit';

config({ path: '.env.local' });

export default defineConfig({
  schema: './src/db/schema.ts',
  out: './migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.POSTGRES_URL!,
  },
});
```

Generate migrations with `npx drizzle-kit generate` (stored in `drizzle/migrations`), then run with `npx drizzle-kit migrate`. Alternatively, use `npx drizzle-kit push` for quick prototyping without managing migration files.

## Query Operations

**Insert**: Create `src/db/queries/insert.ts`:
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

**Select**: Create `src/db/queries/select.ts`:
```typescript
import { asc, between, count, eq, getTableColumns, sql } from 'drizzle-orm';
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
    .where(between(postsTable.createdAt, sql`now() - interval '1 day'`, sql`now()`))
    .orderBy(asc(postsTable.title), asc(postsTable.id))
    .limit(pageSize)
    .offset((page - 1) * pageSize);
}
```

**Update**: Create `src/db/queries/update.ts`:
```typescript
import { eq } from 'drizzle-orm';
import { db } from '../index';
import { SelectPost, postsTable } from '../schema';

export async function updatePost(id: SelectPost['id'], data: Partial<Omit<SelectPost, 'id'>>) {
  await db.update(postsTable).set(data).where(eq(postsTable.id, id));
}
```

**Delete**: Create `src/db/queries/delete.ts`:
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
 ├ 📂 src/db
 │   ├ 📜 index.ts (connection)
 │   └ 📜 schema.ts (table definitions)
 ├ 📂 migrations
 │   ├ 📂 meta
 │   └ 📜 *.sql (generated migrations)
 ├ 📜 .env.local
 ├ 📜 drizzle.config.ts
 ├ 📜 package.json
 └ 📜 tsconfig.json
```