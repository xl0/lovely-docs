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