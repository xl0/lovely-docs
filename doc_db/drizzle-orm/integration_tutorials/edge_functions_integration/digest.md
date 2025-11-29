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