## Drizzle with Cloudflare Durable Objects SQLite

Drizzle ORM fully supports Cloudflare Durable Objects database and Cloudflare Workers environment, supporting SQLite-like query methods (`all`, `get`, `values`, `run`).

### Prerequisites
- Database connection basics with Drizzle
- Cloudflare SQLite Durable Objects - SQLite database embedded within a Durable Object

### Setup

**Install packages:**
```
drizzle-orm
-D drizzle-kit
```

**Configure wrangler.toml** with Durable Object bindings and migrations:
```toml
name = "sqlite-durable-objects"
main = "src/index.ts"
compatibility_date = "2024-11-12"
compatibility_flags = [ "nodejs_compat" ]

[[durable_objects.bindings]]
name = "MY_DURABLE_OBJECT"
class_name = "MyDurableObject"

[[migrations]]
tag = "v1"
new_sqlite_classes = ["MyDurableObject"]

[[rules]] 
type = "Text"
globs = ["**/*.sql"]
fallthrough = true
```

**Initialize driver and create Durable Object class:**
```typescript
import { drizzle, DrizzleSqliteDODatabase } from 'drizzle-orm/durable-sqlite';
import { DurableObject } from 'cloudflare:workers'
import { migrate } from 'drizzle-orm/durable-sqlite/migrator';
import migrations from '../drizzle/migrations';
import { usersTable } from './db/schema';

export class MyDurableObject extends DurableObject {
	storage: DurableObjectStorage;
	db: DrizzleSqliteDODatabase<any>;

	constructor(ctx: DurableObjectState, env: Env) {
		super(ctx, env);
		this.storage = ctx.storage;
		this.db = drizzle(this.storage, { logger: false });

		ctx.blockConcurrencyWhile(async () => {
			await this._migrate();
		});
	}

	async insertAndList(user: typeof usersTable.$inferInsert) {
		await this.insert(user);
		return this.select();
	}

	async insert(user: typeof usersTable.$inferInsert) {
		await this.db.insert(usersTable).values(user);
	}

	async select() {
		return this.db.select().from(usersTable);
	}

	async _migrate() {
		migrate(this.db, migrations);
	}
}
```

**Use in Worker fetch handler:**
```typescript
export default {
	async fetch(request: Request, env: Env): Promise<Response> {
		const id: DurableObjectId = env.MY_DURABLE_OBJECT.idFromName('durable-object');
		const stub = env.MY_DURABLE_OBJECT.get(id);

		// Option A - Maximum performance: bundle all database interactions in single DO call
		const usersAll = await stub.insertAndList({
			name: 'John',
			age: 30,
			email: 'john@example.com',
		});

		// Option B - Slower but useful for debugging: individual query calls
		await stub.insert({
			name: 'John',
			age: 30,
			email: 'john@example.com',
		});
		const users = await stub.select();

		return Response.json(users);
	}
}
```

**Key points:**
- Initialize database with `drizzle(this.storage, { logger: false })`
- Run migrations in constructor using `ctx.blockConcurrencyWhile()` to ensure they complete before accepting queries
- Bundle database interactions within single Durable Object call for maximum performance
- Each individual query call is a round-trip to the Durable Object instance