## Setup and Configuration

Install Drizzle ORM, Drizzle Kit, dotenv, and optionally @netlify/edge-functions package.

Create `netlify/edge-functions` directory for Edge Functions. Create `netlify/edge-functions/user.ts`:

```typescript
import type { Context } from "@netlify/edge-functions";

export default async (request: Request, context: Context) => {
  return new Response("User data");
};
```

Create `import_map.json` in project root to import packages from ESM:

```json
{
  "imports": {
    "drizzle-orm/": "https://esm.sh/drizzle-orm/",
    "@neondatabase/serverless": "https://esm.sh/@neondatabase/serverless"
  }
}
```

Create `netlify.toml` configuration:

```toml
[functions]
  deno_import_map = "./import_map.json"

[[edge_functions]]
  path = "/user"
  function = "user"
```

## Database Setup

Log into Neon Console, select or create a project. Copy the database connection string from the Connect button and add it to `.env`:

```text
DATABASE_URL=postgres://username:password@ep-cool-darkness-123456.us-east-2.aws.neon.tech/neondb?sslmode=require
```

## Schema Definition

Create `netlify/edge-functions/common/schema.ts`:

```typescript
import { pgTable, serial, text, integer } from "drizzle-orm/pg-core";

export const usersTable = pgTable('users_table', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  age: integer('age').notNull(),
  email: text('email').notNull().unique(),
})
```

## Drizzle Configuration

Create `drizzle.config.ts` in project root:

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

Apply schema changes with `npx drizzle-kit push` or use migrations workflow.

## Database Connection in Edge Function

Update `netlify/edge-functions/user.ts` to connect and query:

```typescript
import type { Context } from "@netlify/edge-functions";
import { usersTable } from "./common/schema.ts";
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

export default async (request: Request, context: Context) => {
  const sql = neon(Netlify.env.get("DATABASE_URL")!);
  const db = drizzle({ client: sql });

  const users = await db.select().from(usersTable);

  return new Response(JSON.stringify(users));
};
```

## Local Testing and Deployment

Run `netlify dev` to start local dev server. Navigate to `/user` route to test. VS Code may show red underlines for imports despite correct execution; configure VS Code for Edge Functions when prompted.

Initialize Netlify project with `netlify init`, answering prompts to create and deploy site manually.

Import environment variables: `netlify env:import .env`

Deploy with `netlify deploy` for draft deployment or `netlify deploy --prod` for production.

Access the deployed edge function at the `/user` route of your deployed website URL.