## Setup

Install dependencies: `drizzle-orm`, `drizzle-kit`, `@neondatabase/serverless`, and `dotenv`.

Create a Neon project at console.neon.tech. Neon provides a ready-to-use `neondb` Postgres database. Get the connection string from Connection Details and add it as `DATABASE_URL` environment variable.

## Database Connection

Create `src/db.ts`:
```typescript
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { config } from "dotenv";

config({ path: ".env" });
const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle({ client: sql });
```

## Schema Definition

Create `src/schema.ts` with table definitions:
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

## Drizzle Config

Create `drizzle.config.ts`:
```typescript
import { config } from 'dotenv';
import { defineConfig } from "drizzle-kit";

config({ path: '.env' });

export default defineConfig({
  schema: "./src/schema.ts",
  out: "./migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
```

## Migrations

Generate migrations with `npx drizzle-kit generate` (stored in `migrations/` directory as SQL files). Run with `npx drizzle-kit migrate`. Alternatively, use `npx drizzle-kit push` for quick prototyping without managing migration files.

## Query Examples

**Insert:**
```typescript
import { db } from '../db';
import { InsertUser, usersTable } from '../schema';

export async function createUser(data: InsertUser) {
  await db.insert(usersTable).values(data);
}
```

**Select:**
```typescript
import { eq, count, getTableColumns, asc, between, sql } from 'drizzle-orm';
import { db } from '../db';
import { usersTable, postsTable } from '../schema';

export async function getUserById(id: number) {
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
    .select({ id: postsTable.id, title: postsTable.title })
    .from(postsTable)
    .where(between(postsTable.createdAt, sql`now() - interval '1 day'`, sql`now()`))
    .orderBy(asc(postsTable.title), asc(postsTable.id))
    .limit(pageSize)
    .offset((page - 1) * pageSize);
}
```

**Update:**
```typescript
import { eq } from 'drizzle-orm';
import { db } from '../db';
import { postsTable } from '../schema';

export async function updatePost(id: number, data: Partial<any>) {
  await db.update(postsTable).set(data).where(eq(postsTable.id, id));
}
```

**Delete:**
```typescript
import { eq } from 'drizzle-orm';
import { db } from '../db';
import { usersTable } from '../schema';

export async function deleteUser(id: number) {
  await db.delete(usersTable).where(eq(usersTable.id, id));
}
```