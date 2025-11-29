## Setup

Install Drizzle ORM, Drizzle Kit, dotenv, and @netlify/edge-functions. Create Supabase project and add connection string to `.env` as `DATABASE_URL`.

## Configuration

**import_map.json** maps Drizzle and postgres to ESM URLs. **netlify.toml** configures Edge Functions routing. **drizzle.config.ts** sets up Drizzle Kit with PostgreSQL dialect.

## Schema & Migration

Define tables in `netlify/edge-functions/common/schema.ts`. Run `npx drizzle-kit push` to apply changes.

## Edge Function

```typescript
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

export default async (request: Request, context: Context) => {
  const queryClient = postgres(Netlify.env.get("DATABASE_URL")!);
  const db = drizzle({ client: queryClient });
  const users = await db.select().from(usersTable);
  return new Response(JSON.stringify(users));
};
```

Access env vars via `Netlify.env.get()`. Imports use ESM URLs.

## Testing & Deployment

Run `netlify dev` locally. Deploy with `netlify init`, `netlify env:import .env`, and `netlify deploy --prod`.