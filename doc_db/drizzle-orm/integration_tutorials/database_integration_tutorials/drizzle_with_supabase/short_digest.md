## Setup
Install `drizzle-orm`, `drizzle-kit`, `dotenv`, `postgres`. Create Supabase project, get connection string with pooling, store as `DATABASE_URL` in `.env`.

## Connection
```typescript
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
const client = postgres(process.env.DATABASE_URL!);
export const db = drizzle({ client });
```

## Schema
```typescript
export const usersTable = pgTable('users_table', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
});

export const postsTable = pgTable('posts_table', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  userId: integer('user_id').notNull().references(() => usersTable.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});
```

## Config
```typescript
export default defineConfig({
  schema: './src/db/schema.ts',
  out: './supabase/migrations',
  dialect: 'postgresql',
  dbCredentials: { url: process.env.DATABASE_URL! },
});
```

## Migrations
Generate: `npx drizzle-kit generate`. Run: `npx drizzle-kit migrate`. Or use `npx drizzle-kit push` for prototyping.

## Queries
Insert: `db.insert(usersTable).values(data)`. Select: `db.select().from(usersTable).where(eq(usersTable.id, id))`. Update: `db.update(postsTable).set(data).where(eq(postsTable.id, id))`. Delete: `db.delete(usersTable).where(eq(usersTable.id, id))`.