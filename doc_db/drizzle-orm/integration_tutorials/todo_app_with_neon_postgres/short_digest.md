## Setup

Install: `drizzle-orm`, `drizzle-kit`, `@neondatabase/serverless`, `dotenv`.

Add `DATABASE_URL` to `.env.local` from Neon Connection Details.

## Database

`src/db/drizzle.ts`:
```tsx
import { drizzle } from 'drizzle-orm/neon-http';
export const db = drizzle(process.env.DATABASE_URL!);
```

`src/db/schema.ts`:
```tsx
import { integer, text, boolean, pgTable } from "drizzle-orm/pg-core";
export const todo = pgTable("todo", {
  id: integer("id").primaryKey(),
  text: text("text").notNull(),
  done: boolean("done").default(false).notNull(),
});
```

`drizzle.config.ts`:
```typescript
import { defineConfig } from "drizzle-kit";
export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./migrations",
  dialect: "postgresql",
  dbCredentials: { url: process.env.DATABASE_URL! },
});
```

Run: `npx drizzle-kit generate && npx drizzle-kit migrate` (or `npx drizzle-kit push` for prototyping).

## Server Actions

`src/actions/todoAction.ts`:
```tsx
"use server";
import { eq, not } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db/drizzle";
import { todo } from "@/db/schema";

export const getData = async () => db.select().from(todo);
export const addTodo = async (id: number, text: string) => 
  db.insert(todo).values({ id, text });
export const deleteTodo = async (id: number) => {
  await db.delete(todo).where(eq(todo.id, id));
  revalidatePath("/");
};
export const toggleTodo = async (id: number) => {
  await db.update(todo).set({ done: not(todo.done) }).where(eq(todo.id, id));
  revalidatePath("/");
};
export const editTodo = async (id: number, text: string) => {
  await db.update(todo).set({ text }).where(eq(todo.id, id));
  revalidatePath("/");
};
```

## Components

`src/types/todoType.ts`: `type todoType = { id: number; text: string; done: boolean; }`

`src/components/todo.tsx`: Single todo with checkbox, edit/delete buttons, inline editing.

`src/components/addTodo.tsx`: Input field + Add button.

`src/components/todos.tsx`: Main component managing state, maps todos to Todo components.

`src/app/page.tsx`: Fetches todos via `getData()`, renders Todos component.