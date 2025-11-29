## Edge Functions Integration

Deploy Drizzle ORM on serverless edge platforms using edge-compatible drivers.

**Netlify Edge Functions** (Neon/Supabase):
- Map ESM imports via `import_map.json`, configure `netlify.toml`
- Define schema in `netlify/edge-functions/common/schema.ts`
- Connect: `drizzle({ client: neon() })` or `drizzle({ client: postgres() })`
- Access env vars: `Netlify.env.get("DATABASE_URL")`

**Supabase Edge Functions**:
- Initialize: `supabase init` → `supabase functions new <name>`
- Generate migrations: `npx drizzle-kit generate` → `supabase/migrations`
- Apply: `supabase start` → `supabase migration up`
- Connect: `postgres(Deno.env.get("SUPABASE_DB_URL")!)` with `{ prepare: false }`
- Deploy: `supabase link` → `supabase db push` → `supabase secrets set` → `supabase functions deploy`

**Vercel Edge Functions**:
- Neon: `drizzle-orm/neon-serverless`, init with `drizzle(process.env.POSTGRES_URL!)`
- Vercel Postgres: `drizzle-orm/vercel-postgres`, init with `drizzle()`
- PlanetScale: `drizzle-orm/planetscale-serverless`, use `mysqlTable`
- Turso: `drizzle-orm/libsql`, use `sqliteTable`, init with `drizzle({ connection: { url, authToken } })`

Setup: Install driver → Create schema in `src/db/schema.ts` → Configure `drizzle.config.ts` → Generate migrations → Create client in `src/db/index.ts` → Create API route with `export const runtime = 'edge'` → Deploy with `vercel`

## Database Integration Tutorials

Setup and CRUD patterns for Neon, Nile, Supabase, Turso, Vercel Postgres, Xata.

**Common Setup**:
```typescript
// Schema with type inference
export const usersTable = pgTable('users', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
});

export type InsertUser = typeof usersTable.$inferInsert;
export type SelectUser = typeof usersTable.$inferSelect;
```

**CRUD Operations**:
```typescript
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

**Platform-Specific**:
- **Neon**: `@neondatabase/serverless` driver, migrations via `drizzle-kit generate/migrate` or `push`
- **Nile**: Multi-tenant with AsyncLocalStorage for automatic tenant context scoping
- **Supabase**: `postgres-js` driver with connection pooling
- **Turso**: `libSQL` driver with auth token, `sqliteTable` schema
- **Vercel Postgres**: `@vercel/postgres` package
- **Xata**: PostgreSQL with copy-on-write branches, connection: `postgresql://postgres:<password>@<branch-id>.<region>.xata.tech/<database>?sslmode=require`

## Todo App with Neon Postgres

Complete Next.js todo app with server actions and inline editing.

**Setup**:
```bash
npm install drizzle-orm drizzle-kit @neondatabase/serverless dotenv
```

**Database Config** (`src/db/drizzle.ts`):
```typescript
import { drizzle } from 'drizzle-orm/neon-http';
export const db = drizzle(process.env.DATABASE_URL!);
```

**Schema** (`src/db/schema.ts`):
```typescript
export const todo = pgTable("todo", {
  id: integer("id").primaryKey(),
  text: text("text").notNull(),
  done: boolean("done").default(false).notNull(),
});
```

**Drizzle Config** (`drizzle.config.ts`):
```typescript
export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./migrations",
  dialect: "postgresql",
  dbCredentials: { url: process.env.DATABASE_URL! },
});
```

**Migrations**: `npx drizzle-kit generate` → `npx drizzle-kit migrate` (or `push` for prototyping)

**Server Actions** (`src/actions/todoAction.ts`):
```typescript
"use server";
import { eq, not } from "drizzle-orm";
import { revalidatePath } from "next/cache";

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

**Client Components**: `Todo` component with edit/delete/toggle, `AddTodo` form, `Todos` list manager with state management, main page fetches data via server action.