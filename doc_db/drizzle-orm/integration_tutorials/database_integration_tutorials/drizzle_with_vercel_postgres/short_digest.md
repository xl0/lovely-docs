## Setup

Install `drizzle-orm`, `drizzle-kit`, `dotenv`, `@vercel/postgres`. Create Vercel Postgres database, copy `POSTGRES_URL` to `.env.local`.

Initialize connection in `src/db/index.ts`:
```typescript
import { drizzle } from 'drizzle-orm/vercel-postgres';
import { config } from 'dotenv';
config({ path: '.env.local' });
export const db = drizzle();
```

## Schema

Define tables in `src/db/schema.ts` with `pgTable`, including foreign keys and timestamps:
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

## Migrations

Create `drizzle.config.ts` with schema path and database credentials. Run `npx drizzle-kit generate` to create migrations, then `npx drizzle-kit migrate` to apply them. Use `npx drizzle-kit push` for quick prototyping.

## Queries

Insert: `db.insert(usersTable).values(data)`

Select: `db.select().from(usersTable).where(eq(usersTable.id, id))` with joins, grouping, pagination

Update: `db.update(postsTable).set(data).where(eq(postsTable.id, id))`

Delete: `db.delete(usersTable).where(eq(usersTable.id, id))`