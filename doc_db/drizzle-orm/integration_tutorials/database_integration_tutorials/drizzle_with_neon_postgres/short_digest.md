## Setup
Install `drizzle-orm`, `drizzle-kit`, `@neondatabase/serverless`, `dotenv`. Create Neon project, get connection string, set `DATABASE_URL` env var.

## Connection
```typescript
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle({ client: sql });
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

## Config & Migrations
Create `drizzle.config.ts` with schema path, output dir, dialect, and DB credentials. Run `npx drizzle-kit generate` then `npx drizzle-kit migrate`, or use `npx drizzle-kit push` for prototyping.

## Queries
Insert: `db.insert(usersTable).values(data)`
Select: `db.select().from(usersTable).where(eq(usersTable.id, id))`
Update: `db.update(postsTable).set(data).where(eq(postsTable.id, id))`
Delete: `db.delete(usersTable).where(eq(usersTable.id, id))`