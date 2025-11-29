Install Drizzle ORM, Drizzle Kit, and @netlify/edge-functions. Create `netlify/edge-functions/user.ts` Edge Function. Set up `import_map.json` with ESM imports and `netlify.toml` configuration routing `/user` to the function.

Create Neon database, copy connection string to `.env` as `DATABASE_URL`. Define schema in `netlify/edge-functions/common/schema.ts` and create `drizzle.config.ts` pointing to it. Run `npx drizzle-kit push` to apply schema.

Connect in Edge Function using `neon()` client and `drizzle()` ORM:

```typescript
const sql = neon(Netlify.env.get("DATABASE_URL")!);
const db = drizzle({ client: sql });
const users = await db.select().from(usersTable);
return new Response(JSON.stringify(users));
```

Test locally with `netlify dev`, then deploy with `netlify init`, `netlify env:import .env`, and `netlify deploy --prod`.