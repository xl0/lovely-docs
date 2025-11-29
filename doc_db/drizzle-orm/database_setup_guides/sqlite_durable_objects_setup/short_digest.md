## Setup Drizzle with Cloudflare SQLite Durable Objects

**Install:** `npm install drizzle-orm dotenv` and `npm install -D drizzle-kit wrangler @cloudflare/workers-types`

**Configure wrangler.toml** with Durable Object binding and migrations.

**Connect to database:**
```typescript
import { drizzle } from 'drizzle-orm/durable-sqlite';
export class MyDurableObject extends DurableObject {
	db = drizzle(ctx.storage, { logger: false });
}
```

**Setup drizzle.config.ts:**
```typescript
export default defineConfig({
  schema: './src/db/schema.ts',
  dialect: 'sqlite',
  driver: 'durable-sqlite',
});
```

**Generate migrations:** `npx drizzle-kit generate`

**Apply migrations in constructor:**
```typescript
import { migrate } from 'drizzle-orm/durable-sqlite/migrator';
ctx.blockConcurrencyWhile(async () => {
	await migrate(this.db, migrations);
});
```

**Query database:**
```typescript
async insert(user) { await this.db.insert(usersTable).values(user); }
async select() { return this.db.select().from(usersTable); }
```

**Access from Worker:** Get Durable Object stub and call methods. Bundle DB interactions in single call for performance.