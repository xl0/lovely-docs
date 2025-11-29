## Database Connection

Initialize Drizzle with a driver-specific import and connection parameters:
```ts
import { drizzle } from "drizzle-orm/node-postgres"
const db = drizzle(process.env.DATABASE_URL);
```

Access underlying driver via `db.$client`. Drizzle supports PostgreSQL (node-postgres, Neon, Vercel Postgres, Supabase, Xata, PGLite), MySQL (MySQL, PlanetScale, TiDB), SQLite (SQLite, Turso, Cloudflare D1, Bun, SQLite Cloud), native SQLite (Expo, OP SQLite, React Native), and Drizzle Proxy. All are edge/serverless compatible.

Connection URL format: `postgresql://role:password@hostname/database`