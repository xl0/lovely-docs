## Edge Functions Integration

Deploy on Netlify, Supabase, or Vercel edge functions with edge-compatible drivers (Neon, Supabase, PlanetScale, Turso). Setup: schema → `drizzle.config.ts` → migrations → client → API route with `export const runtime = 'edge'`.

## Database Integrations

Setup and CRUD for Neon, Nile, Supabase, Turso, Vercel Postgres, Xata. Schema with type inference, insert/select with joins/pagination, update, delete patterns.

## Todo App Example

Next.js todo app with Neon: server actions for CRUD, client components for UI with inline editing, `revalidatePath()` for cache invalidation.