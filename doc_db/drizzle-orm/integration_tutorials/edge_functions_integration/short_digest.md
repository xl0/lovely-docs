## Edge Functions Integration

Drizzle ORM works with Netlify, Supabase, and Vercel edge functions using edge-compatible drivers.

**Netlify Edge Functions** (Neon/Supabase):
- Create `import_map.json` for ESM imports, configure `netlify.toml`
- Define schema, create `drizzle.config.ts`
- Connect in edge function: `drizzle({ client: neon(Netlify.env.get("DATABASE_URL")) })`
- Deploy: `netlify deploy --prod`

**Supabase Edge Functions**:
- `supabase init` → `supabase functions new <name>`
- Generate migrations: `npx drizzle-kit generate` → `supabase migration up`
- Connect: `drizzle({ client: postgres(Deno.env.get("SUPABASE_DB_URL"), { prepare: false }) })`
- Deploy: `supabase link` → `supabase db push` → `supabase secrets set DATABASE_URL=<URL>` → `supabase functions deploy`

**Vercel Edge Functions**:
- Choose edge-compatible driver: Neon, Vercel Postgres, PlanetScale, or Turso
- Create schema, `drizzle.config.ts`, generate migrations
- Create API route with `export const runtime = 'edge'`
- Deploy: `vercel` → `vercel env add POSTGRES_URL`