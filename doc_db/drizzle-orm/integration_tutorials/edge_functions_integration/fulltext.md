

## Pages

### netlify_edge_functions_with_neon_postgres
Tutorial for using Drizzle ORM with Netlify Edge Functions and Neon Postgres: setup import maps and netlify.toml, define schema, configure drizzle.config.ts, connect via neon-http client in Edge Functions using Netlify.env.get("DATABASE_URL"), test locally with netlify dev, deploy with netlify deploy --prod.

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

### netlify_edge_functions_with_supabase
Using Drizzle ORM with Netlify Edge Functions and Supabase: configure import_map.json for ESM imports, define PostgreSQL schema, use postgres client with Netlify.env.get() for DATABASE_URL, deploy with netlify CLI.

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

### drizzle_with_supabase_edge_functions
Step-by-step integration of Drizzle ORM with Supabase Edge Functions: schema definition, migration generation, local function development with postgres-js driver using SUPABASE_DB_URL, and deployment with DATABASE_URL environment variable.

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

### drizzle_with_vercel_edge_functions
Configure Drizzle ORM with edge-compatible drivers (Neon, Vercel Postgres, PlanetScale, Turso) for Vercel Edge Functions; set schema, config, migrations, and API routes with `export const runtime = 'edge'`.

## Using Drizzle ORM with Vercel Edge Functions

This tutorial covers integrating Drizzle ORM with Vercel Functions running in Edge runtime. Edge runtime has limitations compared to Node.js runtime, so you must use edge-compatible database drivers.

### Prerequisites
- Vercel CLI installed
- Existing Next.js project (or create with `npx create-next-app@latest --typescript`)
- Drizzle ORM and Drizzle Kit installed (`npm install drizzle-orm -D drizzle-kit`)

### Edge-Compatible Drivers
Choose a driver based on your database:
- **Neon serverless driver** - for Neon Postgres (HTTP/WebSocket instead of TCP)
- **Vercel Postgres driver** - built on Neon serverless driver, for Vercel Postgres
- **PlanetScale serverless driver** - for MySQL over HTTP
- **libSQL client** - for Turso database

### Setup Pattern (applies to all databases)

1. **Install driver** - e.g., `npm install @neondatabase/serverless`

2. **Create schema** (`src/db/schema.ts`):
```typescript
import { pgTable, serial, text } from "drizzle-orm/pg-core";
export const usersTable = pgTable('users_table', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  age: text('age').notNull(),
  email: text('email').notNull().unique(),
})
```

3. **Setup Drizzle config** (`drizzle.config.ts`):
```typescript
import { defineConfig } from "drizzle-kit";
export default defineConfig({
  schema: "./src/db/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.POSTGRES_URL!,
  },
});
```

4. **Configure environment** (`.env`):
```
POSTGRES_URL="postgres://[user]:[password]@[host]-[region].aws.neon.tech:5432/[db-name]?sslmode=[ssl-mode]"
```

5. **Generate and run migrations**:
```bash
npx drizzle-kit generate
npx drizzle-kit migrate
# Or use push for rapid prototyping:
npx drizzle-kit push
```

6. **Connect to database** (`src/db/index.ts`):
```typescript
import { drizzle } from 'drizzle-orm/neon-serverless';
export const db = drizzle(process.env.POSTGRES_URL!)
```

7. **Create API route** (`src/app/api/hello/route.ts`):
```typescript
import { db } from "@/db";
import { usersTable } from "@/db/schema";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';
export const runtime = 'edge'

export async function GET(request: Request) {
  const users = await db.select().from(usersTable)
  return NextResponse.json({ users, message: 'success' });
}
```

8. **Test locally**: `npx next dev` then navigate to `/api/hello`

9. **Deploy**: 
```bash
vercel
vercel env add POSTGRES_URL
vercel
```

### Database-Specific Variations

**Neon Postgres**: Import from `drizzle-orm/neon-serverless`, initialize with `drizzle(process.env.POSTGRES_URL!)`

**Vercel Postgres**: Import from `drizzle-orm/vercel-postgres`, initialize with `drizzle()` (no URL needed, uses environment)

**PlanetScale MySQL**: 
- Use `mysqlTable` instead of `pgTable`
- Import from `drizzle-orm/planetscale-serverless`
- Initialize with `drizzle(process.env.MYSQL_URL!)`
- Environment: `MYSQL_URL="mysql://[user]:[password]@[host].[region].psdb.cloud/[db-name]?ssl={'rejectUnauthorized':[ssl-rejectUnauthorized]}"`

**Turso SQLite**:
- Use `sqliteTable` instead of `pgTable`
- Import from `drizzle-orm/libsql`
- Initialize with `drizzle({ connection: { url: process.env.TURSO_CONNECTION_URL!, authToken: process.env.TURSO_AUTH_TOKEN! }})`
- Environment: `TURSO_CONNECTION_URL="libsql://[db-name].turso.io"` and `TURSO_AUTH_TOKEN="[auth-token]"`
- Dialect in config: `"turso"`

