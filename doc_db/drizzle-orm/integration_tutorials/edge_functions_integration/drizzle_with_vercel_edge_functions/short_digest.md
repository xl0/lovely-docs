## Drizzle ORM with Vercel Edge Functions

Use edge-compatible drivers: Neon serverless, Vercel Postgres, PlanetScale, or Turso.

**Setup**: Install driver → Create schema → Configure drizzle.config.ts → Set environment variables → Generate/run migrations → Connect database → Create API route with `export const runtime = 'edge'` → Deploy with `vercel env add [DB_URL]`

**Example (Neon Postgres)**:
```typescript
// src/db/schema.ts
import { pgTable, serial, text } from "drizzle-orm/pg-core";
export const usersTable = pgTable('users_table', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
})

// src/db/index.ts
import { drizzle } from 'drizzle-orm/neon-serverless';
export const db = drizzle(process.env.POSTGRES_URL!)

// src/app/api/hello/route.ts
import { db } from "@/db";
import { usersTable } from "@/db/schema";
import { NextResponse } from "next/server";

export const runtime = 'edge'
export async function GET(request: Request) {
  const users = await db.select().from(usersTable)
  return NextResponse.json({ users });
}
```

**Other drivers**: Vercel Postgres uses `drizzle()` without URL; PlanetScale uses `mysqlTable` and `MYSQL_URL`; Turso uses `sqliteTable` and requires both `TURSO_CONNECTION_URL` and `TURSO_AUTH_TOKEN`.