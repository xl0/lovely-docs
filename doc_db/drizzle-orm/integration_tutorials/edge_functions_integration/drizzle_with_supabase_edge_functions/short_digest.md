## Setup
Install Supabase CLI, Drizzle ORM, Drizzle Kit, Docker. Run `supabase init`.

## Schema and Config
Create `src/schema.ts` with table definition and `drizzle.config.ts` pointing to schema and migrations output.

## Migrations
Generate with `npx drizzle-kit generate`, start local stack with `supabase start`, apply with `supabase migration up`.

## Edge Function
Create with `supabase functions new drizzle-tutorial`. Add imports to `deno.json`:
```json
{
  "imports": {
    "drizzle-orm/": "npm:/drizzle-orm/",
    "postgres": "npm:postgres"
  }
}
```

## Connect and Query
In `index.ts`, use `SUPABASE_DB_URL` environment variable for local development:
```typescript
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

const connectionString = Deno.env.get("SUPABASE_DB_URL")!;
const client = postgres(connectionString, { prepare: false });
const db = drizzle({ client });

await db.insert(usersTable).values({ name: "Alice", age: 25 })
const data = await db.select().from(usersTable);
```

## Deploy
Link project: `supabase link --project-ref=<ID>`, push schema: `supabase db push`, set `DATABASE_URL` secret, deploy: `supabase functions deploy drizzle-tutorial --no-verify-jwt`