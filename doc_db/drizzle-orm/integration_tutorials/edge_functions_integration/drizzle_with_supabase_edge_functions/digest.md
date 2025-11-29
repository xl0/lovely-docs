## Setup and Prerequisites
- Install Supabase CLI, Drizzle ORM, Drizzle Kit, and Docker Desktop
- Reference: Edge Functions Quickstart documentation for basic setup

## Schema Definition
Create `src/schema.ts` with table schema:
```typescript
import { pgTable, serial, text, integer } from "drizzle-orm/pg-core";

export const usersTable = pgTable('users_table', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  age: integer('age').notNull()
})
```

## Drizzle Configuration
Create `drizzle.config.ts` in project root:
```typescript
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/schema.ts",
  out: "./supabase/migrations",
  dialect: "postgresql",
});
```

## Supabase Project Initialization
Run `supabase init` to create the `supabase` folder with `config.toml`. For VS Code, follow Supabase documentation to setup Deno settings.

## Migration Generation and Application
- Generate migrations: `npx drizzle-kit generate` (creates files in `supabase/migrations`)
- Start local stack: `supabase start` (requires Docker running)
- Apply migrations: `supabase migration up` or use `drizzle-kit migrate`

## Edge Function Creation
Run `supabase functions new drizzle-tutorial` to create function structure in `supabase/functions/drizzle-tutorial/` with `deno.json`, `.npmrc`, and `index.ts`.

## Dependencies Configuration
Add to `supabase/functions/drizzle-tutorial/deno.json`:
```json
{
  "imports": {
    "drizzle-orm/": "npm:/drizzle-orm/",
    "postgres": "npm:postgres"
  }
}
```
Note: Each function is an independent project; maintain separate configuration files in each function directory.

## Function Implementation
Copy schema to `supabase/functions/drizzle-tutorial/index.ts` and connect Drizzle ORM:
```typescript
import { integer, pgTable, serial, text } from "drizzle-orm/pg-core";
import { drizzle } from "drizzle-orm/postgres-js";
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import postgres from "postgres";

const usersTable = pgTable('users_table', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  age: integer('age').notNull()
})

Deno.serve(async () => {
  const connectionString = Deno.env.get("SUPABASE_DB_URL")!;
  const client = postgres(connectionString, { prepare: false });
  const db = drizzle({ client });

  await db.insert(usersTable).values({
    name: "Alice",
    age: 25
  })
  const data = await db.select().from(usersTable);

  return new Response(JSON.stringify(data))
})
```
Use `SUPABASE_DB_URL` environment variable for local development (default direct database connection).

## Local Testing
Run `supabase functions serve --no-verify-jwt` and navigate to function route (e.g., `/drizzle-tutorial`) to see results.

## Deployment
1. Create hosted Supabase project in dashboard or via database.new
2. Link local project: `supabase link --project-ref=<REFERENCE_ID>`
3. Push schema: `supabase db push`
4. Set environment variable for production: `supabase secrets set DATABASE_URL=<CONNECTION_STRING>` (use Transaction pooler URI from Connect details, replace password placeholder)
5. Deploy function: `supabase functions deploy drizzle-tutorial --no-verify-jwt`
6. Access deployed function via project URL and route