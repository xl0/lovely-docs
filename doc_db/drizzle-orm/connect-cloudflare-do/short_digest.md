## Cloudflare Durable Objects SQLite Setup

Install `drizzle-orm` and `drizzle-kit`. Configure `wrangler.toml` with Durable Object bindings and migrations. Initialize database in Durable Object constructor:

```typescript
import { drizzle } from 'drizzle-orm/durable-sqlite';
import { migrate } from 'drizzle-orm/durable-sqlite/migrator';

export class MyDurableObject extends DurableObject {
	db: DrizzleSqliteDODatabase<any>;

	constructor(ctx: DurableObjectState, env: Env) {
		super(ctx, env);
		this.db = drizzle(ctx.storage, { logger: false });
		ctx.blockConcurrencyWhile(async () => {
			await migrate(this.db, migrations);
		});
	}

	async insert(user: typeof usersTable.$inferInsert) {
		await this.db.insert(usersTable).values(user);
	}

	async select() {
		return this.db.select().from(usersTable);
	}
}
```

Use from Worker by getting Durable Object stub and calling methods. Bundle database interactions in single DO call for performance.