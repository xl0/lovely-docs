## Database Setup Guides

Setup instructions for 25+ database platforms with Drizzle ORM.

**PostgreSQL:** node-postgres, Supabase, Neon, Vercel Postgres, Xata, Nile, PGLite
**MySQL:** mysql2, PlanetScale, SingleStore, TiDB
**SQLite:** libsql, Turso, SQLite Cloud, Bun:SQLite, Expo SQLite, OP-SQLite
**Specialized:** Cloudflare D1, Durable Objects, Gel

**Common Pattern:**
1. Install driver + Drizzle
2. Set `DATABASE_URL` env var
3. Create `drizzle.config.ts` with dialect
4. Introspect existing DB (optional): `drizzle-kit pull`
5. Define schema in `src/db/schema.ts`
6. Connect: `const db = drizzle({ connection: ... })`
7. Migrate: `drizzle-kit push`
8. Query: `db.select().from(table)`, `db.insert()`, `db.update()`, `db.delete()`

**PostgreSQL Example:**
```typescript
const db = drizzle(new Pool({ connectionString: process.env.DATABASE_URL }));
await db.insert(users).values({ name: 'John', age: 30, email: 'john@example.com' });
```

**SQLite Example:**
```typescript
const db = drizzle({ connection: { url: process.env.DB_FILE_NAME! } });
await db.insert(users).values({ name: 'John', age: 30, email: 'john@example.com' });
```

**Cloudflare D1:**
```typescript
const db = drizzle(env.DB);
const result = await db.select().from(users).all();
```

**Expo SQLite:**
```typescript
const { success } = useMigrations(db, migrations);
if (success) await db.insert(users).values({ ... });
```