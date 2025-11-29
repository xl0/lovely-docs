## Setup

Install Drizzle ORM, Drizzle Kit, dotenv (optional for Node.js < v20.6.0), and optionally @netlify/edge-functions for types.

Create a Supabase project and get the connection string from the dashboard's Connect button, using the Transaction pooler URI. Add it to `.env` as `DATABASE_URL`.

## Project Structure

Create `netlify/edge-functions` directory for Edge Functions. Create `netlify/edge-functions/common/schema.ts` for table schemas.

## Configuration Files

**import_map.json** - Maps imports to ESM URLs for Deno:
```json
{
  "imports": {
    "drizzle-orm/": "https://esm.sh/drizzle-orm/",
    "postgres": "https://esm.sh/postgres"
  }
}
```

**netlify.toml** - Configures Edge Functions:
```toml
[functions]
  deno_import_map = "./import_map.json"

[[edge_functions]]
  path = "/user"
  function = "user"
```

**drizzle.config.ts** - Drizzle Kit configuration:
```typescript
import 'dotenv/config';
import type { Config } from "drizzle-kit";

export default {
  schema: './netlify/edge-functions/common/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
} satisfies Config;
```

## Schema Definition

Create table schema in `netlify/edge-functions/common/schema.ts`:
```typescript
import { pgTable, serial, text, integer } from "drizzle-orm/pg-core";

export const usersTable = pgTable('users_table', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  age: integer('age').notNull(),
  email: text('email').notNull().unique(),
})
```

## Database Migrations

Run `npx drizzle-kit push` to apply schema changes to the database. Alternatively use migrations workflow.

## Edge Function Implementation

Create `netlify/edge-functions/user.ts`:
```typescript
import type { Context } from "@netlify/edge-functions";
import { usersTable } from "./common/schema.ts";
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

export default async (request: Request, context: Context) => {
  const queryClient = postgres(Netlify.env.get("DATABASE_URL")!);
  const db = drizzle({ client: queryClient });

  const users = await db.select().from(usersTable);

  return new Response(JSON.stringify(users));
};
```

Access environment variables via `Netlify.env.get()`. Imports use ESM URLs from import_map.json. Request and Response types are global.

## Local Testing

Run `netlify dev` to start the dev server. VS Code may suggest configuring for Edge Functions - accept to create `.vscode/settings.json`. Navigate to `/user` route to test. Restart Deno Language Server if red underlines persist.

## Deployment

Run `netlify init` to initialize a new Netlify project. Run `netlify env:import .env` to import environment variables. Run `netlify deploy` for draft deployment or `netlify deploy --prod` for production. Access the deployed function via the site URL and route (e.g., `/user`).