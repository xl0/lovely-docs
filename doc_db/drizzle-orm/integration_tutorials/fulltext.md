
## Directories

### edge_functions_integration
Integration guides for deploying Drizzle ORM with edge function platforms (Netlify, Supabase, Vercel) using edge-compatible database drivers.

## Edge Functions Integration

Drizzle ORM integrates with serverless edge function platforms using edge-compatible database drivers.

### Netlify Edge Functions

**With Neon Postgres:**
- Create `import_map.json` mapping ESM imports
- Configure `netlify.toml` with `deno_import_map` and edge function paths
- Define schema in `netlify/edge-functions/common/schema.ts`
- Create `drizzle.config.ts` pointing to schema
- In edge function, connect via `neon()` client and `drizzle({ client: sql })`
- Access `DATABASE_URL` via `Netlify.env.get("DATABASE_URL")`
- Deploy with `netlify deploy --prod`

**With Supabase:**
- Same setup as Neon but use `postgres` client instead of `neon`
- Connect via `postgres(Netlify.env.get("DATABASE_URL")!)` and `drizzle({ client: queryClient })`
- Use Transaction pooler URI from Supabase dashboard

### Supabase Edge Functions

- Initialize with `supabase init` and `supabase functions new <name>`
- Each function has independent `deno.json` with imports configuration
- Generate migrations: `npx drizzle-kit generate` → `supabase/migrations`
- Apply migrations: `supabase start` (requires Docker) → `supabase migration up`
- In function, use `SUPABASE_DB_URL` environment variable for local development
- Connect via `postgres(Deno.env.get("SUPABASE_DB_URL")!)` with `{ prepare: false }`
- Deploy: `supabase link --project-ref=<ID>` → `supabase db push` → `supabase secrets set DATABASE_URL=<URL>` → `supabase functions deploy <name>`

### Vercel Edge Functions

Edge runtime requires edge-compatible drivers:
- **Neon**: `drizzle-orm/neon-serverless`, initialize with `drizzle(process.env.POSTGRES_URL!)`
- **Vercel Postgres**: `drizzle-orm/vercel-postgres`, initialize with `drizzle()` (auto-configured)
- **PlanetScale MySQL**: `drizzle-orm/planetscale-serverless`, use `mysqlTable`, initialize with `drizzle(process.env.MYSQL_URL!)`
- **Turso SQLite**: `drizzle-orm/libsql`, use `sqliteTable`, initialize with `drizzle({ connection: { url, authToken } })`

Setup pattern:
1. Install driver and Drizzle
2. Create schema in `src/db/schema.ts`
3. Configure `drizzle.config.ts` with schema path and dialect
4. Generate migrations: `npx drizzle-kit generate` then `npx drizzle-kit migrate`
5. Create database client in `src/db/index.ts`
6. Create API route with `export const runtime = 'edge'` and `export const dynamic = 'force-dynamic'`
7. Deploy with `vercel` and set environment variables via `vercel env add`

### database_integration_tutorials
Setup and CRUD patterns for integrating Drizzle ORM with six different database platforms (Neon, Nile, Supabase, Turso, Vercel Postgres, Xata).

## Database Integrations with Drizzle ORM

Complete setup guides for integrating Drizzle ORM with various database platforms.

### Neon Postgres
- Install: `drizzle-orm`, `drizzle-kit`, `@neondatabase/serverless`, `dotenv`
- Connection via neon-http driver with environment variables
- Schema definition with type inference (`$inferInsert`, `$inferSelect`)
- Migrations: `npx drizzle-kit generate` then `npx drizzle-kit migrate`, or `npx drizzle-kit push` for prototyping
- CRUD examples: insert, select with joins/pagination, update, delete

### Nile Database (Multi-tenant)
- Multi-tenant Express app using AsyncLocalStorage for automatic tenant context scoping
- Queries automatically filtered by tenant without explicit WHERE clauses
- Tenant ID extracted from URL path, headers, or cookies
- Built-in `tenants` table; custom tables defined in schema
- API routes for tenant and todo CRUD operations

### Supabase Postgres
- Connection pooling via postgres-js driver
- Schema with foreign keys and cascading deletes
- Migrations via drizzle-kit or Supabase CLI
- Same CRUD patterns as Neon

### Turso (SQLite-compatible)
- libSQL driver with authentication token
- `turso auth signup`, `turso db create`, `turso db tokens create`
- SQLite schema definition with `sqliteTable`
- Migrations and CRUD operations similar to PostgreSQL variants

### Vercel Postgres
- Connection via `@vercel/postgres` package
- PostgreSQL schema and migrations
- CRUD operations with joins and pagination

### Xata PostgreSQL
- PostgreSQL with copy-on-write branches and zero-downtime schema changes
- Connection string format: `postgresql://postgres:<password>@<branch-id>.<region>.xata.tech/<database>?sslmode=require`
- Standard PostgreSQL schema and CRUD patterns
- Branch-based development for isolated environments

### Common Patterns Across All Platforms
```typescript
// Schema with type inference
export const usersTable = pgTable('users', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
});

export type InsertUser = typeof usersTable.$inferInsert;
export type SelectUser = typeof usersTable.$inferSelect;

// Insert
await db.insert(usersTable).values(data);

// Select with joins and pagination
db.select({
  ...getTableColumns(usersTable),
  postsCount: count(postsTable.id),
})
  .from(usersTable)
  .leftJoin(postsTable, eq(usersTable.id, postsTable.userId))
  .groupBy(usersTable.id)
  .limit(pageSize)
  .offset((page - 1) * pageSize);

// Update
await db.update(usersTable).set(data).where(eq(usersTable.id, id));

// Delete
await db.delete(usersTable).where(eq(usersTable.id, id));
```



## Pages

### todo_app_with_neon_postgres
Complete Next.js todo app with Drizzle ORM, Neon Postgres, server actions, and client components for CRUD operations with inline editing.

## Setup

Install dependencies: `drizzle-orm`, `drizzle-kit`, `@neondatabase/serverless`, `dotenv`.

Create Neon project and get connection string from Connection Details section. Add to `.env.local`:
```
DATABASE_URL=postgres://username:password@ep-cool-darkness-123456.us-east-2.aws.neon.tech/neondb
```

## Database Configuration

Create `src/db/drizzle.ts`:
```tsx
import { config } from "dotenv";
import { drizzle } from 'drizzle-orm/neon-http';

config({ path: ".env" });
export const db = drizzle(process.env.DATABASE_URL!);
```

Create `src/db/schema.ts`:
```tsx
import { integer, text, boolean, pgTable } from "drizzle-orm/pg-core";

export const todo = pgTable("todo", {
  id: integer("id").primaryKey(),
  text: text("text").notNull(),
  done: boolean("done").default(false).notNull(),
});
```

Create `drizzle.config.ts` in project root:
```typescript
import { config } from 'dotenv';
import { defineConfig } from "drizzle-kit";

config({ path: '.env' });

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
```

Generate and run migrations:
```bash
npx drizzle-kit generate
npx drizzle-kit migrate
```

Or use push for quick prototyping:
```bash
npx drizzle-kit push
```

## Server Actions

Create `src/actions/todoAction.ts` with "use server" directive:
```tsx
"use server";
import { eq, not } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db/drizzle";
import { todo } from "@/db/schema";

export const getData = async () => {
  const data = await db.select().from(todo);
  return data;
};

export const addTodo = async (id: number, text: string) => {
  await db.insert(todo).values({ id, text });
};

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

## Frontend Components

Create `src/types/todoType.ts`:
```ts
export type todoType = {
  id: number;
  text: string;
  done: boolean;
};
```

Create `src/components/todo.tsx` - single todo item with edit/delete/toggle functionality:
```tsx
"use client";
import { ChangeEvent, FC, useState } from "react";
import { todoType } from "@/types/todoType";

interface Props {
  todo: todoType;
  changeTodoText: (id: number, text: string) => void;
  toggleIsTodoDone: (id: number, done: boolean) => void;
  deleteTodoItem: (id: number) => void;
}

const Todo: FC<Props> = ({
  todo,
  changeTodoText,
  toggleIsTodoDone,
  deleteTodoItem,
}) => {
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(todo.text);
  const [isDone, setIsDone] = useState(todo.done);

  const handleTextChange = (e: ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  };

  const handleIsDone = async () => {
    toggleIsTodoDone(todo.id, !isDone);
    setIsDone((prev) => !prev);
  };

  const handleEdit = () => {
    setEditing(true);
  };

  const handleSave = async () => {
    changeTodoText(todo.id, text);
    setEditing(false);
  };

  const handleCancel = () => {
    setEditing(false);
    setText(todo.text);
  };

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this todo?")) {
      deleteTodoItem(todo.id);
    }
  };

  return (
    <div className="flex items-center gap-2 p-4 border-gray-200 border-solid border rounded-lg">
      <input
        type="checkbox"
        className="text-blue-200 rounded-sm h-4 w-4"
        checked={isDone}
        onChange={handleIsDone}
      />
      <input
        type="text"
        value={text}
        onChange={handleTextChange}
        readOnly={!editing}
        className={`${
          todo.done ? "line-through" : ""
        } outline-none read-only:border-transparent focus:border border-gray-200 rounded px-2 py-1 w-full`}
      />
      <div className="flex gap-1 ml-auto">
        {editing ? (
          <button
            onClick={handleSave}
            className="bg-green-600 text-green-50 rounded px-2 w-14 py-1"
          >
            Save
          </button>
        ) : (
          <button
            onClick={handleEdit}
            className="bg-blue-400 text-blue-50 rounded w-14 px-2 py-1"
          >
            Edit
          </button>
        )}
        {editing ? (
          <button
            onClick={handleCancel}
            className="bg-red-400 w-16 text-red-50 rounded px-2 py-1"
          >
            Close
          </button>
        ) : (
          <button
            onClick={handleDelete}
            className="bg-red-400 w-16 text-red-50 rounded px-2 py-1"
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
};

export default Todo;
```

Create `src/components/addTodo.tsx` - form for adding new todos:
```tsx
"use client";
import { ChangeEvent, FC, useState } from "react";

interface Props {
  createTodo: (value: string) => void;
}

const AddTodo: FC<Props> = ({ createTodo }) => {
  const [input, setInput] = useState("");

  const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleAdd = async () => {
    createTodo(input);
    setInput("");
  };

  return (
    <div className="w-full flex gap-1 mt-2">
      <input
        type="text"
        className="w-full px-2 py-1 border border-gray-200 rounded outline-none"
        onChange={handleInput}
        value={input}
      />
      <button
        className="flex items-center justify-center bg-green-600 text-green-50 rounded px-2 h-9 w-14 py-1"
        onClick={handleAdd}
      >
        Add
      </button>
    </div>
  );
};

export default AddTodo;
```

Create `src/components/todos.tsx` - main component managing todo list state:
```tsx
"use client";
import { FC, useState } from "react";
import { todoType } from "@/types/todoType";
import Todo from "./todo";
import AddTodo from "./addTodo";
import { addTodo, deleteTodo, editTodo, toggleTodo } from "@/actions/todoAction";

interface Props {
  todos: todoType[];
}

const Todos: FC<Props> = ({ todos }) => {
  const [todoItems, setTodoItems] = useState<todoType[]>(todos);

  const createTodo = (text: string) => {
    const id = (todoItems.at(-1)?.id || 0) + 1;
    addTodo(id, text);
    setTodoItems((prev) => [...prev, { id: id, text, done: false }]);
  };

  const changeTodoText = (id: number, text: string) => {
    setTodoItems((prev) =>
      prev.map((todo) => (todo.id === id ? { ...todo, text } : todo))
    );
    editTodo(id, text);
  };

  const toggleIsTodoDone = (id: number) => {
    setTodoItems((prev) =>
      prev.map((todo) => (todo.id === id ? { ...todo, done: !todo.done } : todo))
    );
    toggleTodo(id);
  };

  const deleteTodoItem = (id: number) => {
    setTodoItems((prev) => prev.filter((todo) => todo.id !== id));
    deleteTodo(id);
  };

  return (
    <main className="flex mx-auto max-w-xl w-full min-h-screen flex-col items-center p-16">
      <div className="text-5xl font-medium">To-do app</div>
      <div className="w-full flex flex-col mt-8 gap-2">
        {todoItems.map((todo) => (
          <Todo
            key={todo.id}
            todo={todo}
            changeTodoText={changeTodoText}
            toggleIsTodoDone={toggleIsTodoDone}
            deleteTodoItem={deleteTodoItem}
          />
        ))}
      </div>
      <AddTodo createTodo={createTodo} />
    </main>
  );
};

export default Todos;
```

Update `src/app/page.tsx`:
```tsx
import { getData } from "@/actions/todoAction";
import Todos from "@/components/todos";

export default async function Home() {
  const data = await getData();
  return <Todos todos={data} />;
}
```

