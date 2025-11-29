## Setup

Install `drizzle-orm`, `drizzle-kit`, `dotenv`, `postgres`. Create Xata database and add connection string to `.env`:
```
DATABASE_URL=postgresql://postgres:<password>@<branch-id>.<region>.xata.tech/<database>?sslmode=require
```

Connect in `src/db/index.ts`:
```typescript
import { config } from 'dotenv';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

config({ path: '.env' });
const client = postgres(process.env.DATABASE_URL!);
export const db = drizzle({ client });
```

Define schema in `src/db/schema.ts` with tables and type inference. Create `drizzle.config.ts` with schema path, migrations folder, and database credentials.

## Migrations

Run `npx drizzle-kit generate` to create migrations, then `npx drizzle-kit migrate` to apply. Use `npx drizzle-kit push` for rapid prototyping.

## Queries

**Insert**: `db.insert(usersTable).values(data)`

**Select**: `db.select().from(usersTable).where(eq(usersTable.id, id))` or with joins/aggregations: `db.select({...getTableColumns(usersTable), postsCount: count(postsTable.id)}).from(usersTable).leftJoin(postsTable, eq(usersTable.id, postsTable.userId)).groupBy(usersTable.id)`

**Update**: `db.update(postsTable).set(data).where(eq(postsTable.id, id))`

**Delete**: `db.delete(usersTable).where(eq(usersTable.id, id))`

Xata supports branch-based development for different environments.